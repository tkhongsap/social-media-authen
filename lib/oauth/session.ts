import { cookies } from 'next/headers'
import { OAuthSession, UserProfile } from './types'
import { createSessionCookie, parseSessionCookie } from './utils'

const SESSION_COOKIE_NAME = 'oauth-session'

export class SessionManager {
  /**
   * Create a new session
   */
  static async createSession(
    session: OAuthSession,
    options: {
      maxAge?: number
      secure?: boolean
      httpOnly?: boolean
      sameSite?: 'strict' | 'lax' | 'none'
    } = {}
  ): Promise<void> {
    const cookieStore = await cookies()
    const sessionData = createSessionCookie(session, options)
    
    cookieStore.set(SESSION_COOKIE_NAME, sessionData, {
      maxAge: options.maxAge || 60 * 60 * 24 * 7, // 7 days
      secure: options.secure ?? process.env.NODE_ENV === 'production',
      httpOnly: options.httpOnly ?? true,
      sameSite: options.sameSite || 'lax',
      path: '/'
    })
  }

  /**
   * Get current session
   */
  static async getSession(): Promise<OAuthSession | null> {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)
    
    if (!sessionCookie) {
      return null
    }

    const session = parseSessionCookie(sessionCookie.value)
    if (!session) {
      return null
    }

    // Check if session is expired
    if (session.expiresAt && Date.now() > session.expiresAt) {
      await this.deleteSession()
      return null
    }

    return session
  }

  /**
   * Update existing session
   */
  static async updateSession(
    updates: Partial<OAuthSession>
  ): Promise<void> {
    const currentSession = await this.getSession()
    if (!currentSession) {
      throw new Error('No active session to update')
    }

    const updatedSession = { ...currentSession, ...updates }
    await this.createSession(updatedSession)
  }

  /**
   * Delete session
   */
  static async deleteSession(): Promise<void> {
    const cookieStore = await cookies()
    cookieStore.delete(SESSION_COOKIE_NAME)
  }

  /**
   * Get user from session
   */
  static async getUser(): Promise<UserProfile | null> {
    const session = await this.getSession()
    return session?.user || null
  }

  /**
   * Check if user is authenticated
   */
  static async isAuthenticated(): Promise<boolean> {
    const session = await this.getSession()
    return session !== null
  }

  /**
   * Get access token from session
   */
  static async getAccessToken(): Promise<string | null> {
    const session = await this.getSession()
    return session?.accessToken || null
  }

  /**
   * Add provider to existing session (for multi-provider support)
   */
  static async addProviderToSession(
    newSession: OAuthSession
  ): Promise<void> {
    const currentSession = await this.getSession()
    
    if (!currentSession) {
      // No existing session, create new one
      await this.createSession(newSession)
      return
    }

    // Create multi-provider session structure
    const multiProviderSession = {
      ...currentSession,
      providers: {
        ...currentSession.providers,
        [newSession.provider]: {
          accessToken: newSession.accessToken,
          refreshToken: newSession.refreshToken,
          expiresAt: newSession.expiresAt,
          user: newSession.user
        }
      }
    }

    await this.createSession(multiProviderSession)
  }

  /**
   * Remove provider from session
   */
  static async removeProviderFromSession(
    providerId: string
  ): Promise<void> {
    const currentSession = await this.getSession()
    
    if (!currentSession || !currentSession.providers) {
      return
    }

    const updatedProviders = { ...currentSession.providers }
    delete updatedProviders[providerId]

    // If no providers left, delete session
    if (Object.keys(updatedProviders).length === 0) {
      await this.deleteSession()
      return
    }

    await this.updateSession({
      providers: updatedProviders
    })
  }

  /**
   * Get provider-specific data from session
   */
  static async getProviderData(
    providerId: string
  ): Promise<{
    accessToken: string
    refreshToken?: string
    expiresAt?: number
    user: UserProfile
  } | null> {
    const session = await this.getSession()
    
    if (!session) {
      return null
    }

    // Check if it's a single-provider session
    if (session.provider === providerId) {
      return {
        accessToken: session.accessToken,
        refreshToken: session.refreshToken,
        expiresAt: session.expiresAt,
        user: session.user
      }
    }

    // Check multi-provider session
    if (session.providers && session.providers[providerId]) {
      return session.providers[providerId]
    }

    return null
  }

  /**
   * Refresh access token for a provider
   */
  static async refreshAccessToken(
    providerId: string,
    refreshToken: string
  ): Promise<boolean> {
    // This would implement token refresh logic
    // For now, return false as not all providers support refresh tokens
    return false
  }
}