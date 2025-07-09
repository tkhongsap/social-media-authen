import { NextRequest, NextResponse } from 'next/server'
import { 
  OAuthHandler, 
  SessionManager, 
  loadProviderConfig, 
  isValidProvider, 
  createErrorRedirectUrl, 
  createSuccessRedirectUrl 
} from '@/lib/oauth/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  try {
    const { provider } = await params
    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get('code')
    const stateParam = searchParams.get('state')
    const error = searchParams.get('error')

    console.log(`OAuth callback for provider ${provider}:`, {
      hasCode: !!code,
      hasState: !!stateParam,
      error,
      origin: request.nextUrl.origin
    })

    if (error) {
      console.error(`OAuth provider error for ${provider}:`, error)
      return NextResponse.redirect(
        createErrorRedirectUrl(
          request.nextUrl.origin,
          'provider_error',
          error
        )
      )
    }

    if (!isValidProvider(provider)) {
      return NextResponse.redirect(
        createErrorRedirectUrl(
          request.nextUrl.origin,
          'invalid_provider',
          `Provider "${provider}" is not supported`
        )
      )
    }

    if (!code || !stateParam) {
      console.error(`Missing required parameters for ${provider}`)
      return NextResponse.redirect(
        createErrorRedirectUrl(
          request.nextUrl.origin,
          'missing_params',
          'Missing required parameters'
        )
      )
    }

    // Retrieve stored state from cookie
    console.log(`Looking for cookie: oauth-state-${provider}`)
    console.log(`All cookies:`, request.cookies.getAll().map(c => ({ name: c.name, value: c.value?.substring(0, 50) + '...' })))
    
    const storedState = request.cookies.get(`oauth-state-${provider}`)
    if (!storedState) {
      console.error(`No stored state found for ${provider}`)
      console.error(`Available cookies:`, request.cookies.getAll().map(c => c.name))
      return NextResponse.redirect(
        createErrorRedirectUrl(
          request.nextUrl.origin,
          'invalid_state',
          'No stored state found'
        )
      )
    }

    let parsedStoredState
    try {
      parsedStoredState = JSON.parse(storedState.value)
      console.log(`Stored state for ${provider}:`, parsedStoredState)
    } catch (error) {
      console.error(`Failed to parse stored state for ${provider}:`, error)
      return NextResponse.redirect(
        createErrorRedirectUrl(
          request.nextUrl.origin,
          'invalid_state',
          'Invalid stored state'
        )
      )
    }

    const config = loadProviderConfig(provider, request.nextUrl.origin)
    const handler = new OAuthHandler(provider, config)
    
    // Validate URL state and use stored state for code_verifier
    const result = await handler.handleCallbackWithStoredState(code, stateParam, parsedStoredState)
    
    if (!result.success) {
      console.error(`OAuth callback failed for ${provider}:`, result.error)
      return NextResponse.redirect(
        createErrorRedirectUrl(
          request.nextUrl.origin,
          result.error.code,
          result.error.message
        )
      )
    }

    console.log(`Creating session for ${provider} user:`, result.session.user.displayName)

    // Create or update session
    await SessionManager.createSession(result.session)

    // Clear state cookie
    const response = NextResponse.redirect(
      createSuccessRedirectUrl(
        request.nextUrl.origin,
        JSON.parse(storedState.value).redirectTo
      )
    )
    
    response.cookies.delete(`oauth-state-${provider}`)
    
    return response
  } catch (error) {
    const { provider } = await params
    console.error(`Unexpected error in OAuth callback for ${provider}:`, error)
    
    return NextResponse.redirect(
      createErrorRedirectUrl(
        request.nextUrl.origin,
        'auth_failed',
        error instanceof Error ? error.message : 'Authentication failed'
      )
    )
  }
}