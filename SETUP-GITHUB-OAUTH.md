# Setting Up GitHub OAuth

This guide walks you through setting up GitHub OAuth for your application. GitHub OAuth is already implemented in the codebase - you just need to configure it!

## Why GitHub OAuth?

- **Developer-Friendly**: Most developers already have GitHub accounts
- **Simple Setup**: One of the easiest OAuth providers to configure
- **Rich Profile Data**: Access to user's repositories, organizations, and more
- **No API Limits**: Generous rate limits for authentication

## Prerequisites

- A GitHub account
- 2 minutes of your time

## Step-by-Step Setup

### 1. Navigate to GitHub Developer Settings

1. Go to [GitHub Settings](https://github.com/settings/profile)
2. Scroll down to "Developer settings" in the left sidebar
3. Click on "OAuth Apps"

Or directly visit: https://github.com/settings/developers

### 2. Create a New OAuth App

1. Click the "New OAuth App" button
2. Fill in the application details:

   **Application name**  
   `Social Media Auth Demo` (or your app name)

   **Homepage URL**  
   `http://localhost:3000` (for development)

   **Application description** (optional)  
   `Multi-provider authentication demo app`

   **Authorization callback URL** ⚠️ IMPORTANT  
   `http://localhost:3000/api/auth/github/callback`

   > Note: The callback URL must match EXACTLY. No trailing slashes!

3. Click "Register application"

### 3. Get Your Credentials

After registration, you'll see your OAuth App page:

1. **Client ID**: This is displayed at the top (looks like `Ov23liXXXXXXXXXXXXXX`)
2. **Client Secret**: 
   - Click "Generate a new client secret"
   - Copy the secret immediately (you won't see it again!)
   - It looks like: `1234567890abcdef1234567890abcdef12345678`

### 4. Configure Environment Variables

Add these to your `.env.local` file:

```bash
# GitHub OAuth
GITHUB_CLIENT_ID=Ov23liYourActualClientId
GITHUB_CLIENT_SECRET=your40characterclientsecretgoeshere1234
```

Example with actual format:
```bash
GITHUB_CLIENT_ID=Ov23liABCDEF123456
GITHUB_CLIENT_SECRET=1234567890abcdef1234567890abcdef12345678
```

### 5. Restart Development Server

```bash
npm run dev
```

GitHub login will now appear in your login interface!

## Testing Your Setup

1. Navigate to http://localhost:3000
2. Click "Continue with GitHub"
3. You'll be redirected to GitHub's authorization page
4. Click "Authorize [YourAppName]"
5. You'll be redirected back to your app's dashboard

### What You'll See

Your app will receive:
- GitHub user ID
- Username (login)
- Display name
- Email (if public)
- Avatar URL
- Profile URL

## How It Works

The GitHub provider implementation (`lib/oauth/providers/github.ts`) is configured as:

```typescript
export const githubProvider: OAuthProvider = {
  id: 'github',
  name: 'github',
  displayName: 'GitHub',
  color: '#333333',
  icon: 'github',
  authUrl: 'https://github.com/login/oauth/authorize',
  tokenUrl: 'https://github.com/login/oauth/access_token',
  userInfoUrl: 'https://api.github.com/user',
  scopes: ['user:email'],
  responseType: 'code',
  grantType: 'authorization_code',
  pkceSupported: false,      // GitHub doesn't support PKCE
  stateRequired: true         // CSRF protection
}
```

The profile normalizer extracts:
- User ID
- Username (as displayName)
- Full name (parsed into first/last)
- Email
- Avatar URL

## Troubleshooting

### "The redirect_uri MUST match the registered callback URL"
- Ensure callback URL is exactly: `http://localhost:3000/api/auth/github/callback`
- No trailing slashes
- Check for http vs https
- Must include the port number for localhost

### "Bad credentials" error
- Double-check your Client ID and Secret
- Ensure no extra spaces or quotes in `.env.local`
- Restart dev server after changing environment variables

### Can't see email
- User's email might be private
- The app requests `user:email` scope but respects privacy settings

### Session not persisting
- Check browser console for cookie warnings
- Ensure you're accessing via http://localhost:3000 (not 127.0.0.1)

## Production Deployment

When deploying to production:

1. Create a new OAuth App for production (don't reuse development)
2. Update URLs:
   - Homepage URL: `https://yourdomain.com`
   - Callback URL: `https://yourdomain.com/api/auth/github/callback`
3. Add production credentials to your hosting provider's environment variables
4. Use HTTPS for all production URLs

## Advanced Configuration

### Request Additional Scopes

To access more GitHub data, modify the scopes in the provider config:

```typescript
scopes: ['user:email', 'read:user', 'repo']
```

Common scopes:
- `user:email` - Access private email
- `read:user` - Read all user profile data  
- `repo` - Access user's repositories
- `read:org` - Read organization membership

### Rate Limits

GitHub OAuth has generous rate limits:
- Authenticated requests: 5,000 per hour
- Unauthenticated requests: 60 per hour

Your OAuth app will use authenticated requests.

## Security Best Practices

1. **Never commit secrets**: Keep `.env.local` in `.gitignore`
2. **Use different apps**: Separate OAuth apps for dev/staging/prod
3. **Minimal scopes**: Only request the permissions you need
4. **Rotate secrets**: Regenerate client secret if exposed
5. **Monitor usage**: Check your OAuth app's usage in GitHub settings

## Next Steps

Now that GitHub OAuth is working:

1. **Test the flow**: Try logging in and out
2. **Check the session**: Inspect the user data in your dashboard
3. **Add more providers**: Google, Facebook, Discord, etc.
4. **Customize profile data**: Modify the normalizer for your needs
5. **Add role-based access**: Use GitHub organizations for authorization

## Quick Reference

```bash
# Environment variables needed:
GITHUB_CLIENT_ID=Ov23liXXXXXXXXXXXXXX
GITHUB_CLIENT_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Callback URL:
http://localhost:3000/api/auth/github/callback

# GitHub OAuth Apps page:
https://github.com/settings/developers
```

That's it! GitHub login is now fully configured and ready to use.