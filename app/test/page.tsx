export default function TestPage() {
  let channelId, hasChannelSecret, nodeEnv

  try {
    channelId = process.env.NEXT_PUBLIC_LINE_CHANNEL_ID
    hasChannelSecret = !!process.env.LINE_CHANNEL_SECRET
    nodeEnv = process.env.NODE_ENV
  } catch (error) {
    console.error("Error accessing environment variables:", error)
  }

  const isPreview = typeof window !== "undefined" && window.location.hostname.includes("vusercontent.net")

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4">Environment Test</h1>

        {isPreview && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-sm text-yellow-700">
              ⚠️ <strong>Preview Environment Detected</strong>
              <br />
              Environment variables are not available in preview. Download and run locally to test LINE login.
            </p>
          </div>
        )}

        <div className="space-y-2">
          <p>
            <strong>Public Channel ID:</strong> {channelId || "❌ Not found"}
          </p>
          <p>
            <strong>Channel Secret:</strong> {hasChannelSecret ? "✅ Found" : "❌ Not found"}
          </p>
          <p>
            <strong>Node ENV:</strong> {nodeEnv || "unknown"}
          </p>
          <p>
            <strong>Environment:</strong> {isPreview ? "Preview" : "Local/Production"}
          </p>
        </div>

        <div className="mt-4 p-3 bg-blue-50 rounded">
          <p className="text-sm text-blue-700">
            <strong>Setup Instructions:</strong>
            <br />
            1. Download this code
            <br />
            2. Create <code>.env.local</code> file
            <br />
            3. Add your LINE credentials
            <br />
            4. Run <code>npm run dev</code>
          </p>
        </div>
      </div>
    </div>
  )
}
