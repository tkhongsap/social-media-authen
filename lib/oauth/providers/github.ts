import { OAuthProvider } from '../types'

export const githubProvider: OAuthProvider = {
  id: 'github',
  name: 'github',
  displayName: 'GitHub',
  color: '#333333',
  icon: 'github',
  authUrl: 'https://github.com/login/oauth/authorize',
  tokenUrl: 'https://github.com/login/oauth/access_token',
  userInfoUrl: 'https://api.github.com/user',
  scopes: ['user:email'],
  responseType: 'code',
  grantType: 'authorization_code',
  pkceSupported: false,
  stateRequired: true
}

export function normalizeGithubProfile(profile: any): {
  id: string
  email?: string
  name: string
  displayName: string
  firstName?: string
  lastName?: string
  avatar?: string
} {
  const fullName = profile.name || profile.login
  const nameParts = fullName.split(' ')
  
  return {
    id: profile.id.toString(),
    email: profile.email,
    name: fullName,
    displayName: profile.login,
    firstName: nameParts[0],
    lastName: nameParts.slice(1).join(' ') || undefined,
    avatar: profile.avatar_url
  }
}