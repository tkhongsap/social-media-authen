import { OAuthProvider, OAuthConfig, OAuthTokenResponse, OAuthState, OAuthResult, UserProfile, OAuthSession } from './types'
import { OAuthException, OAuthErrorCodes, createOAuthError } from './errors'
import { getProvider, normalizeProfile, isValidProvider, type ProviderId } from './providers'
import { generateCodeVerifier, generateCodeChallenge, generateState } from './utils'

export class OAuthHandler {
  private provider: OAuthProvider
  private config: OAuthConfig

  constructor(providerId: string, config: OAuthConfig) {
    if (!isValidProvider(providerId)) {
      throw new OAuthException(
        OAuthErrorCodes.INVALID_PROVIDER,
        `Provider "${providerId}" is not supported`,
        providerId
      )
    }

    const provider = getProvider(providerId)
    if (!provider) {
      throw new OAuthException(
        OAuthErrorCodes.INVALID_PROVIDER,
        `Provider "${providerId}" configuration not found`,
        providerId
      )
    }

    this.provider = provider
    this.config = config
  }

  /**
   * Generate authorization URL for OAuth flow
   */
  generateAuthUrl(redirectTo?: string): { url: string; state: OAuthState } {
    const state: OAuthState = {
      provider: this.provider.id,
      redirectTo,
      timestamp: Date.now(),
      nonce: generateState()
    }

    const params = new URLSearchParams({
      response_type: this.provider.responseType,
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      scope: (this.config.scopes || this.provider.scopes).join(' '),
      state: Buffer.from(JSON.stringify(state)).toString('base64')
    })

    // Add PKCE if supported
    if (this.provider.pkceSupported) {
      const codeVerifier = generateCodeVerifier()
      const codeChallenge = generateCodeChallenge(codeVerifier)
      state.codeVerifier = codeVerifier
      
      params.append('code_challenge', codeChallenge)
      params.append('code_challenge_method', 'S256')
    }

    // Add custom provider parameters
    if (this.provider.customParams) {
      Object.entries(this.provider.customParams).forEach(([key, value]) => {
        params.append(key, value)
      })
    }

    // Add additional config parameters
    if (this.config.additionalParams) {
      Object.entries(this.config.additionalParams).forEach(([key, value]) => {
        params.append(key, value)
      })
    }

    return {
      url: `${this.provider.authUrl}?${params.toString()}`,
      state
    }
  }

  /**
   * Exchange authorization code for access token
   */
  async exchangeCodeForToken(
    code: string,
    state: OAuthState
  ): Promise<OAuthTokenResponse> {
    const params = new URLSearchParams({
      grant_type: this.provider.grantType,
      code,
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret,
      redirect_uri: this.config.redirectUri
    })

    // Add PKCE code verifier if supported
    if (this.provider.pkceSupported && state.codeVerifier) {
      params.append('code_verifier', state.codeVerifier)
    }

    try {
      const response = await fetch(this.provider.tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        },
        body: params.toString()
      })

      const data = await response.json()

      if (!response.ok) {
        throw new OAuthException(
          OAuthErrorCodes.TOKEN_EXCHANGE_FAILED,
          data.error_description || data.error || 'Token exchange failed',
          this.provider.id,
          data
        )
      }

      return data as OAuthTokenResponse
    } catch (error) {
      if (error instanceof OAuthException) {
        throw error
      }

      throw new OAuthException(
        OAuthErrorCodes.NETWORK_ERROR,
        'Network error during token exchange',
        this.provider.id,
        error
      )
    }
  }

  /**
   * Fetch user profile using access token
   */
  async fetchUserProfile(accessToken: string): Promise<any> {
    const headers: Record<string, string> = {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/json'
    }

    let url = this.provider.userInfoUrl

    // Add custom parameters for specific providers
    if (this.provider.customParams && this.provider.id === 'facebook') {
      const params = new URLSearchParams(this.provider.customParams)
      url = `${url}?${params.toString()}`
    }

    try {
      const response = await fetch(url, { headers })
      const data = await response.json()

      if (!response.ok) {
        throw new OAuthException(
          OAuthErrorCodes.PROFILE_FETCH_FAILED,
          data.error_description || data.error || 'Profile fetch failed',
          this.provider.id,
          data
        )
      }

      return data
    } catch (error) {
      if (error instanceof OAuthException) {
        throw error
      }

      throw new OAuthException(
        OAuthErrorCodes.NETWORK_ERROR,
        'Network error during profile fetch',
        this.provider.id,
        error
      )
    }
  }

  /**
   * Complete OAuth flow
   */
  async handleCallback(
    code: string,
    stateParam: string
  ): Promise<OAuthResult> {
    try {
      // Parse and validate state
      const state = this.parseState(stateParam)
      
      // Exchange code for token
      const tokenResponse = await this.exchangeCodeForToken(code, state)
      
      // Fetch user profile
      const rawProfile = await this.fetchUserProfile(tokenResponse.access_token)
      
      // Normalize profile
      const normalizedProfile = normalizeProfile(this.provider.id as ProviderId, rawProfile)
      
      // Create user profile
      const userProfile: UserProfile = {
        ...normalizedProfile,
        provider: this.provider.id,
        providerAccountId: normalizedProfile.id,
        raw: rawProfile
      }

      // Create session
      const session: OAuthSession = {
        user: userProfile,
        accessToken: tokenResponse.access_token,
        refreshToken: tokenResponse.refresh_token,
        expiresAt: tokenResponse.expires_in 
          ? Date.now() + (tokenResponse.expires_in * 1000)
          : undefined,
        provider: this.provider.id,
        createdAt: Date.now()
      }

      return {
        success: true,
        session
      }
    } catch (error) {
      const oauthError = error instanceof OAuthException 
        ? error.toOAuthError()
        : createOAuthError(
            'PROVIDER_ERROR',
            error.message || 'Unknown error occurred',
            this.provider.id,
            error
          )

      return {
        success: false,
        error: oauthError
      }
    }
  }

  /**
   * Complete OAuth flow with stored state (for PKCE)
   */
  async handleCallbackWithStoredState(
    code: string,
    stateParam: string,
    storedState: OAuthState
  ): Promise<OAuthResult> {
    try {
      // Parse and validate URL state (for security validation)
      const urlState = this.parseState(stateParam)
      
      // Validate that URL state matches stored state
      if (urlState.provider !== storedState.provider || 
          urlState.nonce !== storedState.nonce ||
          Math.abs(urlState.timestamp - storedState.timestamp) > 1000) {
        throw new OAuthException(
          'INVALID_STATE',
          'State mismatch between URL and stored state',
          this.provider.id
        )
      }
      
      // Use stored state for token exchange (this contains the code_verifier)
      const tokenResponse = await this.exchangeCodeForToken(code, storedState)
      
      // Fetch user profile
      const rawProfile = await this.fetchUserProfile(tokenResponse.access_token)
      
      // Normalize profile
      const normalizedProfile = normalizeProfile(this.provider.id as ProviderId, rawProfile)
      
      // Create user profile
      const userProfile: UserProfile = {
        ...normalizedProfile,
        provider: this.provider.id,
        providerAccountId: normalizedProfile.id,
        raw: rawProfile
      }

      // Create session
      const session: OAuthSession = {
        user: userProfile,
        accessToken: tokenResponse.access_token,
        refreshToken: tokenResponse.refresh_token,
        expiresAt: tokenResponse.expires_in 
          ? Date.now() + (tokenResponse.expires_in * 1000)
          : undefined,
        provider: this.provider.id,
        createdAt: Date.now()
      }

      return {
        success: true,
        session
      }
    } catch (error) {
      const oauthError = error instanceof OAuthException 
        ? error.toOAuthError()
        : createOAuthError(
            'PROVIDER_ERROR',
            error.message || 'Unknown error occurred',
            this.provider.id,
            error
          )

      return {
        success: false,
        error: oauthError
      }
    }
  }

  /**
   * Parse and validate state parameter
   */
  private parseState(stateParam: string): OAuthState {
    try {
      const decoded = Buffer.from(stateParam, 'base64').toString('utf-8')
      const state = JSON.parse(decoded) as OAuthState

      // Validate state structure
      if (!state.provider || !state.timestamp || !state.nonce) {
        throw new Error('Invalid state structure')
      }

      // Check if state is expired (5 minutes)
      const now = Date.now()
      const stateAge = now - state.timestamp
      if (stateAge > 5 * 60 * 1000) {
        throw new Error('State expired')
      }

      // Validate provider matches
      if (state.provider !== this.provider.id) {
        throw new Error('Provider mismatch')
      }

      return state
    } catch (error) {
      throw new OAuthException(
        OAuthErrorCodes.INVALID_STATE,
        'Invalid or expired state parameter',
        this.provider.id,
        error
      )
    }
  }
}