import { OAuthProvider } from '../types'

export const facebookProvider: OAuthProvider = {
  id: 'facebook',
  name: 'facebook',
  displayName: 'Facebook',
  color: '#1877F2',
  icon: 'facebook',
  authUrl: 'https://www.facebook.com/v18.0/dialog/oauth',
  tokenUrl: 'https://graph.facebook.com/v18.0/oauth/access_token',
  userInfoUrl: 'https://graph.facebook.com/v18.0/me',
  scopes: ['email', 'public_profile'],
  responseType: 'code',
  grantType: 'authorization_code',
  pkceSupported: true,
  stateRequired: true,
  customParams: {
    fields: 'id,name,email,picture,first_name,last_name'
  }
}

export function normalizeFacebookProfile(profile: any): {
  id: string
  email?: string
  name: string
  displayName: string
  firstName?: string
  lastName?: string
  avatar?: string
} {
  return {
    id: profile.id,
    email: profile.email,
    name: profile.name,
    displayName: profile.name,
    firstName: profile.first_name,
    lastName: profile.last_name,
    avatar: profile.picture?.data?.url
  }
}