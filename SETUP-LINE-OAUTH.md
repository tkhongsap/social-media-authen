# LINE OAuth Setup Guide

## Issue: 400 Bad Request Error

If you're getting a 400 error when trying to login with LINE, it's likely due to configuration issues in the LINE Developer Console.

## Solution: Configure LINE Developer Console

### Step 1: Access LINE Developer Console
1. Go to [LINE Developer Console](https://developers.line.biz/console/)
2. Login with your LINE account
3. Select your channel (or create a new one if you don't have one)

### Step 2: Configure Channel Settings
1. In your channel settings, go to **LINE Login** tab
2. Make sure **LINE Login** is enabled
3. In the **App settings** section, set the **Channel type** to **Web application**

### Step 3: Set Redirect URI
1. In the **LINE Login** settings, find **Callback URL**
2. Add the following redirect URI:
   ```
   http://localhost:3000/api/auth/line/callback
   ```
3. Click **Save**

### Step 4: Get Channel Credentials
1. In the **Channel settings**, find:
   - **Channel ID** (use this for `LINE_CHANNEL_ID`)
   - **Channel secret** (use this for `LINE_CHANNEL_SECRET`)

### Step 5: Update Environment Variables
Make sure your `.env.local` file has:
```bash
LINE_CHANNEL_ID=your_channel_id_here
LINE_CHANNEL_SECRET=your_channel_secret_here
NEXT_PUBLIC_LINE_CHANNEL_ID=your_channel_id_here
```

### Step 6: Channel Type Configuration
1. In the **Channel settings**, under **App settings**:
   - Set **Application type** to **Web application**
   - Set **Channel type** to **Web application**

### Step 7: Scopes Configuration
1. In the **LINE Login** settings, ensure these scopes are enabled:
   - **profile** (required)
   - **openid** (required)
   - **email** (optional, if you want email access)

## Common Issues and Solutions

### Issue 1: "redirect_uri_mismatch"
**Problem**: The redirect URI in your app doesn't match what's configured in LINE Developer Console.

**Solution**: 
- Make sure the redirect URI in LINE Developer Console is exactly: `http://localhost:3000/api/auth/line/callback`
- No trailing slash
- Use `http://` for localhost development

### Issue 2: "invalid_client"
**Problem**: The channel ID or secret is incorrect.

**Solution**: 
- Double-check your `LINE_CHANNEL_ID` and `LINE_CHANNEL_SECRET` in `.env.local`
- Make sure there are no extra spaces or characters

### Issue 3: "unauthorized_client"
**Problem**: The channel is not configured for web login.

**Solution**: 
- Enable LINE Login in your channel settings
- Set the channel type to "Web application"

### Issue 4: "invalid_scope"
**Problem**: The requested scopes are not enabled.

**Solution**: 
- Enable `profile` and `openid` scopes in LINE Login settings
- Save the settings and try again

## Testing the Configuration

1. Restart your development server: `npm run dev`
2. Go to `http://localhost:3000`
3. Click "Continue with LINE"
4. You should be redirected to LINE's login page instead of getting a 400 error

## Production Deployment

For production, you'll need to:
1. Use HTTPS domain (required by LINE)
2. Update the redirect URI to your production domain:
   ```
   https://yourdomain.com/api/auth/line/callback
   ```
3. Update environment variables for production

## Need Help?

If you're still getting errors:
1. Check the browser console for debug information
2. Verify all settings in LINE Developer Console
3. Make sure your channel is published (not in draft mode)
4. Check LINE's official documentation: https://developers.line.biz/en/docs/line-login/

## Debug Information

When you click "Continue with LINE", check the browser console for debug information that shows:
- OAuth configuration
- Generated OAuth URL
- Any error messages

This will help identify the specific issue.