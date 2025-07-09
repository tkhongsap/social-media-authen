"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface LoginPageProps {
  error?: string
  details?: string
}

export default function LoginPage({ error, details }: LoginPageProps) {
  const handleLineLogin = () => {
    try {
      // Check if we're in a browser environment
      if (typeof window === "undefined") {
        console.error("Not in browser environment")
        return
      }

      // Get environment variables with fallbacks
      const clientId = process.env.NEXT_PUBLIC_LINE_CHANNEL_ID || "2007715339"

      // Validate client ID
      if (!clientId || clientId === "YOUR_CHANNEL_ID_HERE") {
        alert("LINE Channel ID not configured. Please set NEXT_PUBLIC_LINE_CHANNEL_ID in your environment variables.")
        return
      }

      const baseUrl = window.location.origin
      const redirectUri = encodeURIComponent(`${baseUrl}/api/auth/callback`)
      const state = Math.random().toString(36).substring(7)

      console.log("LINE Login Debug Info:", {
        clientId: clientId.substring(0, 4) + "...",
        redirectUri,
        baseUrl,
        hasSessionStorage: typeof sessionStorage !== "undefined",
      })

      // Store state for verification (with error handling)
      try {
        if (typeof sessionStorage !== "undefined") {
          sessionStorage.setItem("line-auth-state", state)
        }
      } catch (storageError) {
        console.warn("Could not access sessionStorage:", storageError)
      }

      const lineAuthUrl = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&scope=profile%20openid`

      console.log("Generated LINE Auth URL:", lineAuthUrl)

      // For preview environment, show the URL instead of redirecting
      if (window.location.hostname.includes("vusercontent.net")) {
        alert(
          `Preview Environment Detected!\n\nIn a real deployment, you would be redirected to:\n${lineAuthUrl}\n\nPlease download and run this code locally with your environment variables to test the full flow.`,
        )
        return
      }

      window.location.href = lineAuthUrl
    } catch (error) {
      console.error("LINE login error:", error)
      alert(`Error initiating LINE login: ${error.message}\n\nPlease check the console for more details.`)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">Welcome</CardTitle>
          <CardDescription className="text-gray-600">Sign in with your LINE account to continue</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600 font-medium">Login Error</p>
              <p className="text-xs text-red-500 mt-1">
                {error === "missing_credentials" && "LINE credentials not configured"}
                {error === "missing_params" && "Missing required parameters"}
                {error === "auth_failed" && "Authentication failed"}
                {error === "line_error" && `LINE error: ${details}`}
                {error === "token_exchange_failed" && "Failed to exchange code for token"}
                {error === "profile_fetch_failed" && "Failed to fetch user profile"}
              </p>
              {details && <p className="text-xs text-red-400 mt-1">Details: {details}</p>}
            </div>
          )}

          <Button
            onClick={handleLineLogin}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.628-.629.628M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
            </svg>
            Continue with LINE
          </Button>

          <div className="text-xs text-gray-500 space-y-1">
            <p className="text-center">By continuing, you agree to our Terms of Service and Privacy Policy</p>
            {process.env.NODE_ENV === "development" && (
              <p className="text-center text-orange-600">Development Mode - Check console for debug info</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
