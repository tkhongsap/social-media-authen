export interface OAuthProvider {
  id: string
  name: string
  displayName: string
  color: string
  icon: string
  authUrl: string
  tokenUrl: string
  userInfoUrl: string
  scopes: string[]
  responseType: 'code' | 'token'
  grantType: 'authorization_code' | 'client_credentials'
  pkceSupported: boolean
  stateRequired: boolean
  customParams?: Record<string, string>
}

export interface OAuthConfig {
  clientId: string
  clientSecret: string
  redirectUri: string
  scopes?: string[]
  additionalParams?: Record<string, string>
}

export interface OAuthTokenResponse {
  access_token: string
  token_type: string
  expires_in?: number
  refresh_token?: string
  scope?: string
  id_token?: string
}

export interface UserProfile {
  id: string
  email?: string
  name: string
  displayName: string
  firstName?: string
  lastName?: string
  avatar?: string
  provider: string
  providerAccountId: string
  raw: Record<string, any>
}

export interface OAuthSession {
  user: UserProfile
  accessToken: string
  refreshToken?: string
  expiresAt?: number
  provider: string
  createdAt: number
}

export interface OAuthError {
  code: string
  message: string
  description?: string
  provider: string
  originalError?: any
}

export interface OAuthState {
  provider: string
  redirectTo?: string
  codeVerifier?: string
  nonce?: string
  timestamp: number
}

export type OAuthResult = {
  success: true
  session: OAuthSession
} | {
  success: false
  error: OAuthError
}