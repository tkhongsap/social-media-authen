import { OAuthError } from './types'

export class OAuthException extends Error {
  public readonly code: string
  public readonly provider: string
  public readonly originalError?: any

  constructor(
    code: string,
    message: string,
    provider: string,
    originalError?: any
  ) {
    super(message)
    this.name = 'OAuthException'
    this.code = code
    this.provider = provider
    this.originalError = originalError
  }

  toOAuthError(): OAuthError {
    return {
      code: this.code,
      message: this.message,
      provider: this.provider,
      originalError: this.originalError
    }
  }
}

export const OAuthErrorCodes = {
  INVALID_PROVIDER: 'invalid_provider',
  MISSING_CONFIG: 'missing_config',
  INVALID_STATE: 'invalid_state',
  AUTHORIZATION_FAILED: 'authorization_failed',
  TOKEN_EXCHANGE_FAILED: 'token_exchange_failed',
  PROFILE_FETCH_FAILED: 'profile_fetch_failed',
  INVALID_TOKEN: 'invalid_token',
  NETWORK_ERROR: 'network_error',
  PROVIDER_ERROR: 'provider_error',
  SESSION_EXPIRED: 'session_expired',
  INVALID_SCOPE: 'invalid_scope'
} as const

export function createOAuthError(
  code: keyof typeof OAuthErrorCodes,
  message: string,
  provider: string,
  originalError?: any
): OAuthError {
  return {
    code: OAuthErrorCodes[code],
    message,
    provider,
    originalError
  }
}

export function getErrorMessage(error: OAuthError): string {
  const errorMessages: Record<string, string> = {
    [OAuthErrorCodes.INVALID_PROVIDER]: 'The selected authentication provider is not supported.',
    [OAuthErrorCodes.MISSING_CONFIG]: 'Authentication configuration is missing or invalid.',
    [OAuthErrorCodes.INVALID_STATE]: 'Authentication state is invalid or expired.',
    [OAuthErrorCodes.AUTHORIZATION_FAILED]: 'Authorization with the provider failed.',
    [OAuthErrorCodes.TOKEN_EXCHANGE_FAILED]: 'Failed to exchange authorization code for access token.',
    [OAuthErrorCodes.PROFILE_FETCH_FAILED]: 'Failed to fetch user profile from the provider.',
    [OAuthErrorCodes.INVALID_TOKEN]: 'The access token is invalid or expired.',
    [OAuthErrorCodes.NETWORK_ERROR]: 'Network error occurred during authentication.',
    [OAuthErrorCodes.PROVIDER_ERROR]: 'The authentication provider returned an error.',
    [OAuthErrorCodes.SESSION_EXPIRED]: 'Your session has expired. Please log in again.',
    [OAuthErrorCodes.INVALID_SCOPE]: 'The requested permissions are invalid.'
  }

  return errorMessages[error.code] || error.message || 'An unknown error occurred during authentication.'
}