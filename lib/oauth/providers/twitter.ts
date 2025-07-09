import { OAuthProvider } from '../types'

export const twitterProvider: OAuthProvider = {
  id: 'twitter',
  name: 'twitter',
  displayName: 'Twitter',
  color: '#1DA1F2',
  icon: 'twitter',
  authUrl: 'https://twitter.com/i/oauth2/authorize',
  tokenUrl: 'https://api.twitter.com/2/oauth2/token',
  userInfoUrl: 'https://api.twitter.com/2/users/me',
  scopes: ['tweet.read', 'users.read'],
  responseType: 'code',
  grantType: 'authorization_code',
  pkceSupported: true,
  stateRequired: true,
  customParams: {
    user_fields: 'id,name,username,profile_image_url'
  }
}

export function normalizeTwitterProfile(profile: any): {
  id: string
  email?: string
  name: string
  displayName: string
  firstName?: string
  lastName?: string
  avatar?: string
} {
  const userData = profile.data || profile
  
  return {
    id: userData.id,
    name: userData.name,
    displayName: userData.username,
    avatar: userData.profile_image_url
  }
}