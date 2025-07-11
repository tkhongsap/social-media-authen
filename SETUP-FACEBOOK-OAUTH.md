# Setting Up Facebook OAuth

This guide walks you through setting up Facebook OAuth for your application. Facebook OAuth is already implemented in the codebase - you just need to configure it!

## Why Facebook OAuth?

- **Massive User Base**: 3+ billion active users worldwide
- **Rich Profile Data**: Access to profile photos, basic info, and email
- **Social Features**: Can integrate with Facebook's social graph
- **Trusted Brand**: Users are familiar with Facebook login

## Prerequisites

- A Facebook account
- 5-10 minutes for setup
- Basic understanding of OAuth redirect URIs

## Step-by-Step Setup

### 1. Create Facebook Developer Account

1. Go to [Facebook for Developers](https://developers.facebook.com/)
2. Click "Get Started" if you don't have a developer account
3. Complete the developer account setup process
4. Verify your account via email/phone if prompted

### 2. Create a New Facebook App

1. In the Facebook Developer Console, click "My Apps"
2. Click "Create App"
3. Choose app type: **"Consumer"** (for general web applications)
4. Fill in the app details:

   **App Name**  
   `Social Media Auth Demo` (or your app name)

   **App Contact Email**  
   Your email address

   **App Purpose** (optional)  
   `Authentication for web application`

5. Click "Create App"

### 3. Add Facebook Login Product

1. In your app dashboard, you'll see "Add a Product"
2. Find "Facebook Login" and click "Set Up"
3. Choose "Web" as your platform
4. Skip the quickstart guide (we'll configure manually)

### 4. Configure Facebook Login Settings

1. In the left sidebar, go to "Facebook Login" → "Settings"
2. Configure the following settings:

   **Valid OAuth Redirect URIs** ⚠️ IMPORTANT  
   Add these URLs (one per line):
   ```
   http://localhost:3000/api/auth/facebook/callback
   ```
   
   For production, also add:
   ```
   https://yourdomain.com/api/auth/facebook/callback
   ```

   **Valid OAuth Redirect URIs for Web Games** (leave empty)

   **Deauthorize Callback URL** (optional)  
   `http://localhost:3000/api/auth/logout`

3. Click "Save Changes"

### 5. Get Your App Credentials

1. In the left sidebar, go to "Settings" → "Basic"
2. You'll see your app credentials:

   **App ID** (this is your `FACEBOOK_CLIENT_ID`)  
   Copy this value (looks like: `123456789012345`)

   **App Secret** (this is your `FACEBOOK_CLIENT_SECRET`)  
   Click "Show" to reveal it, then copy  
   (looks like: `a1b2c3d4e5f6789012345678901234567890abcd`)

### 6. Configure Environment Variables

Add these to your `.env.local` file:

```bash
# Facebook OAuth
FACEBOOK_CLIENT_ID=123456789012345
FACEBOOK_CLIENT_SECRET=a1b2c3d4e5f6789012345678901234567890abcd
```

Replace with your actual App ID and App Secret.

### 7. Restart Development Server

```bash
npm run dev
```

Facebook login will now appear in your login interface!

## How It Works

The Facebook provider implementation (`lib/oauth/providers/facebook.ts`) is configured as:

```typescript
export const facebookProvider: OAuthProvider = {
  id: 'facebook',
  name: 'facebook',
  displayName: 'Facebook',
  color: '#1877F2',
  icon: 'facebook',
  authUrl: 'https://www.facebook.com/v18.0/dialog/oauth',
  tokenUrl: 'https://graph.facebook.com/v18.0/oauth/access_token',
  userInfoUrl: 'https://graph.facebook.com/v18.0/me',
  scopes: ['email', 'public_profile'],
  responseType: 'code',
  grantType: 'authorization_code',
  pkceSupported: false,     // Facebook doesn't support PKCE
  stateRequired: true,      // CSRF protection
  customParams: {
    fields: 'id,name,email,picture.width(200).height(200),first_name,last_name'
  }
}
```

### Data Retrieved

The app will get:
- User ID
- Full name
- Email (if shared by user)
- Profile picture (200x200px)
- First and last name

## Testing Your Setup

1. Navigate to http://localhost:3000
2. Click "Continue with Facebook"
3. You'll be redirected to Facebook's login page
4. Log in and authorize the app
5. You'll be redirected back to your app's dashboard

## Development vs Production

### Development Mode
- Only you (the app creator) can log in
- App is in "Development" mode by default
- No app review required for basic permissions

### Production Mode
- Any Facebook user can log in
- Requires app review for certain permissions
- Must complete Facebook's app review process

## App Review Process (For Production)

### Basic Permissions (No Review Needed)
- `public_profile` - Basic profile information
- `email` - Email address (if user grants permission)

### Permissions Requiring Review
- Most other permissions require Facebook's app review
- Submit detailed use cases and privacy policy
- Process can take 1-2 weeks

### Going Live
1. Complete your app's privacy policy
2. Submit for app review (if needed)
3. Switch app from "Development" to "Live" mode
4. Update redirect URIs to production URLs

## Troubleshooting

### "Invalid OAuth Redirect URI" Error
- Ensure callback URL is exactly: `http://localhost:3000/api/auth/facebook/callback`
- No trailing slashes
- Check for http vs https
- Must include port number for localhost

### "App Not Setup" Error
- Make sure Facebook Login product is added to your app
- Verify redirect URIs are configured correctly
- Check that app is in correct mode (Development/Live)

### Can't Log In (Not App Creator)
- App is in Development mode - only you can log in
- Add test users in "Roles" → "Test Users"
- Or switch to Live mode (requires app review)

### Missing Email Permission
- User declined to share email
- Email permission is optional in Facebook OAuth
- Handle missing email gracefully in your app

### "Invalid App ID" Error
- Double-check your App ID in `.env.local`
- Ensure no extra spaces or quotes
- Restart dev server after changing environment variables

## Facebook-Specific Considerations

### Privacy Settings
- Users can choose not to share their email
- Profile photos may not be available for all users
- Respect user privacy choices in your app

### App Review Requirements
- For production apps, Facebook requires review
- Prepare detailed privacy policy
- Document how you use Facebook data
- Provide test instructions for reviewers

### Rate Limits
- Facebook has rate limits for API calls
- Login requests are generally not rate-limited
- Monitor usage in Facebook Developer Console

## Security Best Practices

1. **Never commit App Secret**: Keep `.env.local` in `.gitignore`
2. **Use different apps**: Separate apps for development/production
3. **Minimal permissions**: Only request permissions you need
4. **Secure redirect URIs**: Use HTTPS in production
5. **Monitor usage**: Check Facebook Developer Console regularly

## Advanced Configuration

### Custom Permissions
To request additional permissions, modify the provider scopes:

```typescript
scopes: ['email', 'public_profile', 'user_friends']
```

Common permissions:
- `email` - User's email address
- `public_profile` - Basic profile info
- `user_friends` - Friends using your app
- `user_photos` - User's photos
- `user_posts` - User's posts

### Custom Fields
Modify the `customParams` to get additional profile fields:

```typescript
customParams: {
  fields: 'id,name,email,picture.width(400).height(400),birthday,location'
}
```

## Production Deployment

When deploying to production:

1. **Create production Facebook app** (or use same app)
2. **Update redirect URIs**:
   - Add: `https://yourdomain.com/api/auth/facebook/callback`
   - Remove: `http://localhost:3000/api/auth/facebook/callback`
3. **Complete app review** if using permissions beyond basic
4. **Switch to Live mode** in Facebook Developer Console
5. **Add production environment variables**

## Quick Reference

```bash
# Environment variables needed:
FACEBOOK_CLIENT_ID=123456789012345
FACEBOOK_CLIENT_SECRET=a1b2c3d4e5f6789012345678901234567890abcd

# Callback URL:
http://localhost:3000/api/auth/facebook/callback

# Facebook Developer Console:
https://developers.facebook.com/
```

## Next Steps

Now that Facebook OAuth is configured:

1. **Test the authentication flow** thoroughly
2. **Handle missing email** gracefully in your app
3. **Add other providers** (Google, GitHub, etc.)
4. **Plan for app review** if going to production
5. **Implement role-based access** using Facebook groups

Facebook OAuth is now fully configured and ready to use!

## Common Facebook OAuth Scopes

| Scope | Description | Review Required |
|-------|-------------|-----------------|
| `public_profile` | Basic profile information | No |
| `email` | Email address | No |
| `user_friends` | Friends using your app | Yes |
| `user_photos` | User's photos | Yes |
| `user_posts` | User's posts | Yes |
| `user_birthday` | User's birthday | Yes |
| `user_location` | User's location | Yes |

*Note: Scopes marked "Yes" require Facebook app review for production use.*