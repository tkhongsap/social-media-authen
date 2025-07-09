import { NextRequest, NextResponse } from 'next/server'
import { OAuthHandler, loadProviderConfig, isValidProvider, createErrorRedirectUrl } from '@/lib/oauth/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  try {
    const { provider } = await params
    
    if (!isValidProvider(provider)) {
      return NextResponse.redirect(
        createErrorRedirectUrl(
          request.nextUrl.origin,
          'invalid_provider',
          `Provider "${provider}" is not supported`
        )
      )
    }

    const config = loadProviderConfig(provider, request.nextUrl.origin)
    console.log(`OAuth config for ${provider}:`, {
      clientId: config.clientId ? config.clientId.substring(0, 4) + '...' : 'missing',
      redirectUri: config.redirectUri,
      hasClientSecret: !!config.clientSecret
    })
    
    const handler = new OAuthHandler(provider, config)
    
    const redirectTo = request.nextUrl.searchParams.get('redirect_to') || undefined
    const { url, state } = handler.generateAuthUrl(redirectTo)
    
    console.log(`Generated OAuth URL for ${provider}:`, url)
    console.log(`OAuth state for ${provider}:`, state)
    
    // Store state in a secure way (you might want to use a database for production)
    const response = NextResponse.redirect(url)
    response.cookies.set(`oauth-state-${provider}`, JSON.stringify(state), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 5 * 60, // 5 minutes
      sameSite: 'lax'
    })
    
    return response
  } catch (error) {
    const { provider } = await params
    console.error(`OAuth login error for provider ${provider}:`, error)
    
    return NextResponse.redirect(
      createErrorRedirectUrl(
        request.nextUrl.origin,
        'configuration_error',
        error instanceof Error ? error.message : 'Configuration error'
      )
    )
  }
}