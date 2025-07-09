import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get("code")
    const state = searchParams.get("state")
    const error = searchParams.get("error")

    console.log("Callback received:", {
      hasCode: !!code,
      hasState: !!state,
      error,
      origin: request.nextUrl.origin,
    })

    if (error) {
      console.error("LINE OAuth error:", error)
      return NextResponse.redirect(new URL(`/?error=line_error&details=${error}`, request.url))
    }

    if (!code || !state) {
      console.error("Missing required parameters")
      return NextResponse.redirect(new URL("/?error=missing_params", request.url))
    }

    const channelId = process.env.LINE_CHANNEL_ID
    const channelSecret = process.env.LINE_CHANNEL_SECRET

    if (!channelId || !channelSecret) {
      console.error("Missing LINE credentials in environment")
      return NextResponse.redirect(new URL("/?error=missing_credentials", request.url))
    }

    console.log("Exchanging code for token with Channel ID:", channelId.substring(0, 4) + "...")

    // Rest of the function remains the same...
    const tokenResponse = await fetch("https://api.line.me/oauth2/v2.1/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: `${request.nextUrl.origin}/api/auth/callback`,
        client_id: channelId,
        client_secret: channelSecret,
      }),
    })

    const tokenData = await tokenResponse.json()
    console.log("Token response status:", tokenResponse.status)

    if (!tokenResponse.ok) {
      console.error("Token exchange failed:", tokenData)
      return NextResponse.redirect(
        new URL(`/?error=token_exchange_failed&details=${tokenData.error || "unknown"}`, request.url),
      )
    }

    console.log("Getting user profile...")

    const profileResponse = await fetch("https://api.line.me/v2/profile", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    })

    const profile = await profileResponse.json()
    console.log("Profile response status:", profileResponse.status)

    if (!profileResponse.ok) {
      console.error("Profile fetch failed:", profile)
      return NextResponse.redirect(
        new URL(`/?error=profile_fetch_failed&details=${profile.error || "unknown"}`, request.url),
      )
    }

    console.log("Creating session for user:", profile.displayName)

    const cookieStore = await cookies()
    cookieStore.set(
      "line-session",
      JSON.stringify({
        userId: profile.userId,
        displayName: profile.displayName,
        pictureUrl: profile.pictureUrl,
        accessToken: tokenData.access_token,
      }),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      },
    )

    return NextResponse.redirect(new URL("/dashboard", request.url))
  } catch (error) {
    console.error("Unexpected error in LINE OAuth callback:", error)
    return NextResponse.redirect(
      new URL(`/?error=auth_failed&details=${encodeURIComponent(error.message)}`, request.url),
    )
  }
}
