import { NextRequest, NextResponse } from 'next/server'
import { SessionManager } from '@/lib/oauth/server'

export async function POST(request: NextRequest) {
  try {
    const { provider } = await request.json().catch(() => ({}))
    
    if (provider) {
      // Logout from specific provider
      await SessionManager.removeProviderFromSession(provider)
      console.log(`Logged out from provider: ${provider}`)
    } else {
      // Logout from all providers
      await SessionManager.deleteSession()
      console.log('Logged out from all providers')
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { success: false, error: 'Logout failed' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    await SessionManager.deleteSession()
    console.log('Logged out via GET request')
    
    const redirectTo = request.nextUrl.searchParams.get('redirect_to') || '/'
    return NextResponse.redirect(new URL(redirectTo, request.nextUrl.origin))
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.redirect(new URL('/', request.nextUrl.origin))
  }
}