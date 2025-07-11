import { createHash, randomBytes } from 'crypto'

/**
 * Generate a cryptographically secure random string
 */
export function generateState(length: number = 32): string {
  return randomBytes(length).toString('base64url')
}

/**
 * Generate PKCE code verifier
 */
export function generateCodeVerifier(): string {
  return randomBytes(32).toString('base64url')
}

/**
 * Generate PKCE code challenge from verifier
 */
export function generateCodeChallenge(verifier: string): string {
  return createHash('sha256').update(verifier).digest('base64url')
}

/**
 * Validate environment configuration for a provider
 */
export function validateProviderConfig(
  providerId: string,
  config: {
    clientId?: string
    clientSecret?: string
    redirectUri?: string
  }
): { isValid: boolean; missingVars: string[] } {
  const requiredVars = ['clientId', 'clientSecret', 'redirectUri']
  const missingVars: string[] = []

  for (const varName of requiredVars) {
    if (!config[varName as keyof typeof config]) {
      missingVars.push(varName)
    }
  }

  return {
    isValid: missingVars.length === 0,
    missingVars
  }
}

/**
 * Get environment variable names for a provider
 */
export function getProviderEnvVars(providerId: string): {
  clientId: string
  clientSecret: string
  publicClientId?: string
} {
  const upperProviderId = providerId.toUpperCase()
  
  // Special handling for LINE provider to support both naming conventions
  if (providerId === 'line') {
    return {
      clientId: `LINE_CHANNEL_ID`,
      clientSecret: `LINE_CHANNEL_SECRET`,
      publicClientId: `NEXT_PUBLIC_LINE_CHANNEL_ID`
    }
  }
  
  return {
    clientId: `${upperProviderId}_CLIENT_ID`,
    clientSecret: `${upperProviderId}_CLIENT_SECRET`,
    publicClientId: `NEXT_PUBLIC_${upperProviderId}_CLIENT_ID`
  }
}

/**
 * Load provider configuration from environment
 */
export function loadProviderConfig(
  providerId: string,
  baseUrl: string
): {
  clientId: string
  clientSecret: string
  redirectUri: string
} {
  const envVars = getProviderEnvVars(providerId)
  
  let clientId = process.env[envVars.clientId]
  let clientSecret = process.env[envVars.clientSecret]
  
  // Fallback to generic naming if specific naming not found
  if (!clientId && providerId !== 'line') {
    clientId = process.env[`${providerId.toUpperCase()}_CLIENT_ID`]
  }
  if (!clientSecret && providerId !== 'line') {
    clientSecret = process.env[`${providerId.toUpperCase()}_CLIENT_SECRET`]
  }
  
  if (!clientId || !clientSecret) {
    throw new Error(
      `Missing environment variables for ${providerId}: ${envVars.clientId}, ${envVars.clientSecret}`
    )
  }

  return {
    clientId,
    clientSecret,
    redirectUri: `${baseUrl}/api/auth/${providerId}/callback`
  }
}

/**
 * Create session cookie value
 */
export function createSessionCookie(
  session: any,
  options: {
    maxAge?: number
    secure?: boolean
    httpOnly?: boolean
    sameSite?: 'strict' | 'lax' | 'none'
  } = {}
): string {
  const defaultOptions = {
    maxAge: 60 * 60 * 24 * 7, // 7 days
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax' as const
  }

  const cookieOptions = { ...defaultOptions, ...options }
  const sessionData = JSON.stringify(session)
  
  return sessionData
}

/**
 * Parse session cookie value
 */
export function parseSessionCookie(cookieValue: string): any {
  try {
    return JSON.parse(cookieValue)
  } catch (error) {
    return null
  }
}

/**
 * Generate nonce for OpenID Connect
 */
export function generateNonce(): string {
  return randomBytes(16).toString('base64url')
}

/**
 * Create redirect URL with error parameters
 */
export function createErrorRedirectUrl(
  baseUrl: string,
  error: string,
  details?: string
): string {
  const url = new URL(baseUrl)
  url.searchParams.set('error', error)
  if (details) {
    url.searchParams.set('details', details)
  }
  return url.toString()
}

/**
 * Create redirect URL with success parameters
 */
export function createSuccessRedirectUrl(
  baseUrl: string,
  redirectTo?: string
): string {
  if (redirectTo) {
    try {
      const url = new URL(redirectTo, baseUrl)
      return url.toString()
    } catch {
      // Invalid URL, fall back to default
    }
  }
  return `${baseUrl}/dashboard`
}