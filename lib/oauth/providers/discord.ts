import { OAuthProvider } from '../types'

export const discordProvider: OAuthProvider = {
  id: 'discord',
  name: 'discord',
  displayName: 'Discord',
  color: '#5865F2',
  icon: 'discord',
  authUrl: 'https://discord.com/api/oauth2/authorize',
  tokenUrl: 'https://discord.com/api/oauth2/token',
  userInfoUrl: 'https://discord.com/api/users/@me',
  scopes: ['identify', 'email'],
  responseType: 'code',
  grantType: 'authorization_code',
  pkceSupported: true,
  stateRequired: true
}

export function normalizeDiscordProfile(profile: any): {
  id: string
  email?: string
  name: string
  displayName: string
  firstName?: string
  lastName?: string
  avatar?: string
} {
  const avatarUrl = profile.avatar 
    ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`
    : undefined

  return {
    id: profile.id,
    email: profile.email,
    name: profile.global_name || profile.username,
    displayName: profile.username,
    avatar: avatarUrl
  }
}