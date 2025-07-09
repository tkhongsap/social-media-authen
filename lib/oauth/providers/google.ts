import { OAuthProvider } from '../types'

export const googleProvider: OAuthProvider = {
  id: 'google',
  name: 'google',
  displayName: 'Google',
  color: '#4285F4',
  icon: 'google',
  authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenUrl: 'https://oauth2.googleapis.com/token',
  userInfoUrl: 'https://www.googleapis.com/oauth2/v2/userinfo',
  scopes: ['openid', 'email', 'profile'],
  responseType: 'code',
  grantType: 'authorization_code',
  pkceSupported: true,
  stateRequired: true,
  customParams: {
    access_type: 'offline',
    prompt: 'consent'
  }
}

export function normalizeGoogleProfile(profile: any): {
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
    firstName: profile.given_name,
    lastName: profile.family_name,
    avatar: profile.picture
  }
}