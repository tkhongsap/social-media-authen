import { NextPage } from 'next'

const TestLinePage: NextPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">LINE OAuth Test</h1>
        
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h2 className="font-semibold text-blue-800 mb-2">Environment Variables</h2>
            <div className="text-sm text-blue-700 space-y-1">
              <div>LINE_CHANNEL_ID: {process.env.LINE_CHANNEL_ID ? '✅ Set' : '❌ Missing'}</div>
              <div>LINE_CHANNEL_SECRET: {process.env.LINE_CHANNEL_SECRET ? '✅ Set' : '❌ Missing'}</div>
            </div>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg">
            <h2 className="font-semibold text-green-800 mb-2">Configuration</h2>
            <div className="text-sm text-green-700 space-y-1">
              <div>Client ID: {process.env.LINE_CHANNEL_ID?.substring(0, 4)}...</div>
              <div>Redirect URI: http://localhost:3000/api/auth/line/callback</div>
            </div>
          </div>
          
          <div className="p-4 bg-yellow-50 rounded-lg">
            <h2 className="font-semibold text-yellow-800 mb-2">Next Steps</h2>
            <div className="text-sm text-yellow-700 space-y-1">
              <div>1. Configure LINE Developer Console</div>
              <div>2. Add the redirect URI above</div>
              <div>3. Enable LINE Login for web app</div>
              <div>4. Test the login flow</div>
            </div>
          </div>
          
          <div className="text-center mt-6">
            <a 
              href="/" 
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Back to Login
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TestLinePage