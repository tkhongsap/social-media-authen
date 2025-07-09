// Client-safe provider exports - no server-side dependencies
import { OAuthProvider } from './types'

// Import only provider configurations, not the full library
import { lineProvider } from './providers/line'
import { googleProvider } from './providers/google'
import { facebookProvider } from './providers/facebook'
import { githubProvider } from './providers/github'
import { discordProvider } from './providers/discord'
import { twitterProvider } from './providers/twitter'

export const providers = {
  line: lineProvider,
  google: googleProvider,
  facebook: facebookProvider,
  github: githubProvider,
  discord: discordProvider,
  twitter: twitterProvider
} as const

export type ProviderId = keyof typeof providers

export function getProvider(id: string): OAuthProvider | undefined {
  return providers[id as ProviderId]
}

export function getAllProviders(): OAuthProvider[] {
  return Object.values(providers)
}

export function getProviderIds(): ProviderId[] {
  return Object.keys(providers) as ProviderId[]
}

export function isValidProvider(id: string): id is ProviderId {
  return id in providers
}

// Client-safe error message function
export function getErrorMessage(error: { code: string; message: string; provider: string }): string {
  const errorMessages: Record<string, string> = {
    'invalid_provider': 'The selected authentication provider is not supported.',
    'missing_config': 'Authentication configuration is missing or invalid.',
    'invalid_state': 'Authentication state is invalid or expired.',
    'authorization_failed': 'Authorization with the provider failed.',
    'token_exchange_failed': 'Failed to exchange authorization code for access token.',
    'profile_fetch_failed': 'Failed to fetch user profile from the provider.',
    'invalid_token': 'The access token is invalid or expired.',
    'network_error': 'Network error occurred during authentication.',
    'provider_error': 'The authentication provider returned an error.',
    'session_expired': 'Your session has expired. Please log in again.',
    'invalid_scope': 'The requested permissions are invalid.'
  }

  return errorMessages[error.code] || error.message || 'An unknown error occurred during authentication.'
}