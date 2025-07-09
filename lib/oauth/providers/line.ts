import { OAuthProvider } from '../types'

export const lineProvider: OAuthProvider = {
  id: 'line',
  name: 'line',
  displayName: 'LINE',
  color: '#06C755',
  icon: 'line',
  authUrl: 'https://access.line.me/oauth2/v2.1/authorize',
  tokenUrl: 'https://api.line.me/oauth2/v2.1/token',
  userInfoUrl: 'https://api.line.me/v2/profile',
  scopes: ['profile', 'openid'],
  responseType: 'code',
  grantType: 'authorization_code',
  pkceSupported: true,
  stateRequired: true
}

export function normalizeLineProfile(profile: any): {
  id: string
  email?: string
  name: string
  displayName: string
  firstName?: string
  lastName?: string
  avatar?: string
} {
  return {
    id: profile.userId,
    name: profile.displayName,
    displayName: profile.displayName,
    avatar: profile.pictureUrl,
    email: profile.email // Only available with email scope
  }
}