import { OAuthProvider } from '../types'
import { lineProvider, normalizeLineProfile } from './line'
import { googleProvider, normalizeGoogleProfile } from './google'
import { facebookProvider, normalizeFacebookProfile } from './facebook'
import { githubProvider, normalizeGithubProfile } from './github'
import { discordProvider, normalizeDiscordProfile } from './discord'
import { twitterProvider, normalizeTwitterProfile } from './twitter'

export const providers = {
  line: lineProvider,
  google: googleProvider,
  facebook: facebookProvider,
  github: githubProvider,
  discord: discordProvider,
  twitter: twitterProvider
} as const

export const profileNormalizers = {
  line: normalizeLineProfile,
  google: normalizeGoogleProfile,
  facebook: normalizeFacebookProfile,
  github: normalizeGithubProfile,
  discord: normalizeDiscordProfile,
  twitter: normalizeTwitterProfile
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

export function normalizeProfile(providerId: ProviderId, profile: any) {
  const normalizer = profileNormalizers[providerId]
  return normalizer(profile)
}

export * from './line'
export * from './google'
export * from './facebook'
export * from './github'
export * from './discord'
export * from './twitter'