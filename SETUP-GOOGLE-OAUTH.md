# Setting Up Google OAuth

This guide will walk you through setting up Google OAuth for your application. Google OAuth is already implemented in the codebase - you just need to configure it!

## Prerequisites

- A Google account
- Access to Google Cloud Console

## Step-by-Step Setup

### 1. Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Enter a project name (e.g., "Social Media Auth Demo")
4. Click "Create"

### 2. Enable Google+ API

1. In the Google Cloud Console, go to "APIs & Services" → "Library"
2. Search for "Google+ API"
3. Click on it and press "Enable"

### 3. Create OAuth 2.0 Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. If prompted, configure the OAuth consent screen first:
   - Choose "External" user type
   - Fill in required fields:
     - App name: "Social Media Auth Demo"
     - User support email: Your email
     - Developer contact: Your email
   - Add scopes: `email`, `profile`, `openid`
   - Add test users if in development

### 4. Configure OAuth Client

1. Application type: "Web application"
2. Name: "Social Media Auth Web Client"
3. Authorized JavaScript origins:
   - `http://localhost:3000` (for development)
   - Your production URL (when deploying)
4. Authorized redirect URIs:
   - `http://localhost:3000/api/auth/google/callback` (for development)
   - `https://yourdomain.com/api/auth/google/callback` (for production)
5. Click "Create"

### 5. Copy Credentials

After creation, you'll see:
- **Client ID**: Copy this value
- **Client Secret**: Copy this value

### 6. Configure Environment Variables

Add these to your `.env.local` file:

```bash
# Google OAuth
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
```

### 7. Restart Development Server

```bash
npm run dev
```

Google login will now appear in your login interface!

## How It Works

The Google provider implementation (`lib/oauth/providers/google.ts`) includes:

```typescript
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
    access_type: 'offline',    // Get refresh token
    prompt: 'consent'           // Always show consent screen
  }
}
```

Key features:
- **PKCE Support**: Enhanced security with Proof Key for Code Exchange
- **Offline Access**: Gets refresh token for long-term access
- **Profile Data**: Retrieves user's email, name, and profile picture

## Testing Your Setup

1. Go to http://localhost:3000
2. Click "Continue with Google"
3. Sign in with your Google account
4. Grant permissions when prompted
5. You'll be redirected to the dashboard with your Google profile

## Troubleshooting

### "Access blocked" error
- Make sure you've configured the OAuth consent screen
- Add your email as a test user if in development mode

### "Redirect URI mismatch" error
- Double-check the redirect URI in Google Console matches exactly:
  `http://localhost:3000/api/auth/google/callback`
- Ensure no trailing slashes

### Missing profile data
- Verify you've enabled the Google+ API
- Check that all required scopes are configured

### Environment variables not working
- Restart your development server after adding variables
- Ensure no spaces around the = sign in `.env.local`
- Variables should not be wrapped in quotes

## Production Deployment

When deploying to production:

1. Add your production domain to:
   - Authorized JavaScript origins
   - Authorized redirect URIs (with `/api/auth/google/callback`)
2. Update environment variables in your production environment
3. Consider moving from "External" to "Internal" user type if for organization use

## Security Notes

- Never commit your Client Secret to version control
- Use HTTPS in production for redirect URIs
- Regularly rotate your client secret
- Monitor usage in Google Cloud Console

## Next Steps

Now that Google OAuth is set up, you can:
- Enable other providers (Facebook, GitHub, Discord, etc.)
- Customize the user profile data you collect
- Implement role-based access control
- Add multi-account linking

The same modular pattern applies to all providers - just add credentials and restart!