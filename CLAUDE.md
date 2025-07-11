# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Install dependencies
npm install

# Start development server with Turbopack (recommended)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## Development Workflow

### OAuth Provider Setup
1. **Add credentials to `.env.local`** (follow provider-specific setup guides)
2. **Always restart the development server** after adding/changing environment variables
3. **Test the OAuth flow** by accessing the login interface
4. **Use provider-specific callback URLs**:
   - Development: `http://localhost:3000/api/auth/[provider]/callback`
   - Production: `https://yourdomain.com/api/auth/[provider]/callback`

### Configuration Validation
```bash
# Check which providers are configured
node -e "console.log(require('./lib/oauth/config').validateOAuthConfig())"
```

### Debugging Tips
- Check browser console for authentication errors
- Verify callback URLs match exactly in provider settings
- Ensure environment variables are properly formatted
- Restart server after any configuration changes

### Key Development Rules
- Always restart server after making changes to test functionality
- Look for existing code patterns before creating new implementations
- Keep files under 200-300 lines, refactor when necessary
- Focus on code areas relevant to the current task
- Avoid touching unrelated code during feature development

## Environment Setup

This application supports multiple OAuth providers. Configure the providers you want to use in `.env.local`:

```bash
# LINE OAuth
LINE_CLIENT_ID=your_line_client_id
LINE_CLIENT_SECRET=your_line_client_secret

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Facebook OAuth
FACEBOOK_CLIENT_ID=your_facebook_client_id
FACEBOOK_CLIENT_SECRET=your_facebook_client_secret

# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Discord OAuth
DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_CLIENT_SECRET=your_discord_client_secret

# Twitter OAuth
TWITTER_CLIENT_ID=your_twitter_client_id
TWITTER_CLIENT_SECRET=your_twitter_client_secret
```

## Architecture Overview

This is a Next.js 15 application using the App Router with a comprehensive multi-provider OAuth authentication system. The authentication flow uses HTTP-only cookies for session management.

### Multi-Provider OAuth Library (`lib/oauth/`)

The core OAuth library provides:
- **Provider Configuration**: Support for LINE, Google, Facebook, GitHub, Discord, and Twitter
- **OAuth Handler**: Manages authorization code flow with PKCE support
- **Session Management**: Multi-provider session handling with HTTP-only cookies
- **Profile Normalization**: Consistent user profile format across providers
- **Error Handling**: Unified error system with user-friendly messages

### Architecture Deep Dive

#### Provider Registry Pattern
The system uses a registry pattern (`lib/oauth/providers/index.ts`) that enables automatic provider discovery:
- Providers are registered in a central `providers` object
- Profile normalizers are mapped in `profileNormalizers` object
- Configuration validation automatically detects available providers
- UI components dynamically render only configured providers

#### Session Architecture
- **HTTP-only cookies**: Secure, server-side session storage
- **Multi-provider support**: Single session can contain multiple OAuth providers
- **Automatic expiration**: Sessions include timestamp and expiration handling
- **Profile normalization**: Consistent `UserProfile` interface across all providers

#### Profile Normalization System
Each provider implements a normalizer function that:
- Converts provider-specific profile data to standard format
- Preserves original data in `raw` field for provider-specific features
- Handles missing fields gracefully (email, name parsing, etc.)
- Ensures consistent user experience across all providers

### Key Components:

#### OAuth Library Structure:
- `lib/oauth/types.ts`: TypeScript interfaces and types
- `lib/oauth/providers/`: Provider-specific configurations
- `lib/oauth/handler.ts`: OAuth flow management
- `lib/oauth/session.ts`: Session management
- `lib/oauth/errors.ts`: Error handling system
- `lib/oauth/utils.ts`: Utility functions
- `lib/oauth/config.ts`: Environment configuration validation

#### API Routes:
- `/app/api/auth/[provider]/login/route.ts`: Initiate OAuth flow for any provider
- `/app/api/auth/[provider]/callback/route.ts`: Handle OAuth callback for any provider
- `/app/api/auth/logout/route.ts`: Handle logout (single or all providers)

#### UI Components:
- `components/multi-provider-login.tsx`: Multi-provider login interface
- `components/login-page.tsx`: Main login page wrapper
- `components/dashboard.tsx`: Authenticated user interface
- `components/ui/`: Reusable UI components from shadcn/ui

### Authentication Flow:

1. User selects provider → `components/multi-provider-login.tsx` redirects to `/api/auth/[provider]/login`
2. Server generates OAuth URL and redirects user to provider
3. Provider redirects back to `/api/auth/[provider]/callback` with authorization code
4. Server exchanges code for access token and fetches user profile
5. Session cookie is created and user is redirected to `/dashboard`
6. Protected routes check for session cookie existence

### Supported Providers:

1. **LINE**: OAuth 2.0 with PKCE support
2. **Google**: OAuth 2.0 with refresh tokens
3. **Facebook**: Graph API OAuth
4. **GitHub**: OAuth 2.0 for developers
5. **Discord**: OAuth 2.0 for gaming communities
6. **Twitter**: OAuth 2.0 v2 with PKCE

### Provider Configuration:

Each provider requires specific environment variables:
- `{PROVIDER}_CLIENT_ID`: OAuth client ID
- `{PROVIDER}_CLIENT_SECRET`: OAuth client secret

Use the configuration validation system to check setup:

```typescript
import { validateOAuthConfig } from '@/lib/oauth/config'

const config = validateOAuthConfig()
console.log(config.configuredProviders) // List of ready providers
```

### Session Management:

Sessions support:
- **Single Provider**: Traditional one-provider authentication
- **Multi-Provider**: Connect multiple social accounts
- **Session Validation**: Automatic expiration handling
- **Provider-Specific Data**: Access tokens per provider

### Error Handling:

The system provides comprehensive error handling:
- **Provider Errors**: OAuth provider-specific errors
- **Network Errors**: Connection and timeout handling
- **Configuration Errors**: Missing credentials detection
- **User-Friendly Messages**: Translated error messages

### Provider Extension Pattern

#### Adding a New Provider (Complete Steps):
1. **Create provider configuration** in `lib/oauth/providers/newprovider.ts`:
   ```typescript
   export const newproviderProvider: OAuthProvider = {
     id: 'newprovider',
     name: 'newprovider',
     displayName: 'New Provider',
     color: '#FF6B6B',
     icon: 'newprovider',
     authUrl: 'https://provider.com/oauth/authorize',
     tokenUrl: 'https://provider.com/oauth/token',
     userInfoUrl: 'https://provider.com/api/user',
     scopes: ['profile', 'email'],
     responseType: 'code',
     grantType: 'authorization_code',
     pkceSupported: true,
     stateRequired: true
   }
   
   export function normalizeNewproviderProfile(profile: any) {
     return {
       id: profile.id,
       email: profile.email,
       name: profile.name,
       displayName: profile.username,
       avatar: profile.avatar_url
     }
   }
   ```

2. **Register provider** in `lib/oauth/providers/index.ts`:
   ```typescript
   import { newproviderProvider, normalizeNewproviderProfile } from './newprovider'
   
   export const providers = {
     // ... existing providers
     newprovider: newproviderProvider
   }
   
   export const profileNormalizers = {
     // ... existing normalizers
     newprovider: normalizeNewproviderProfile
   }
   ```

3. **Add environment variables**:
   ```bash
   NEWPROVIDER_CLIENT_ID=your_client_id
   NEWPROVIDER_CLIENT_SECRET=your_client_secret
   ```

4. **Restart server** - Provider appears automatically in login interface!

#### Why This Pattern Works
- **Zero core changes**: No modifications to routes, UI, or session management
- **Auto-discovery**: Configuration validation detects new providers
- **Type safety**: TypeScript ensures correct implementation
- **Consistent UX**: All providers work identically for users
- **Easy testing**: Each provider is isolated and testable

### Usage Examples:

#### Custom OAuth Flow:
```typescript
import { OAuthHandler } from '@/lib/oauth'

const handler = new OAuthHandler('google', {
  clientId: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  redirectUri: 'http://localhost:3000/api/auth/google/callback'
})

const { url } = handler.generateAuthUrl()
```

#### Session Management:
```typescript
import { SessionManager } from '@/lib/oauth'

// Get current session
const session = await SessionManager.getSession()

// Check authentication
const isAuth = await SessionManager.isAuthenticated()

// Get user profile
const user = await SessionManager.getUser()
```

### Configuration:
- **TypeScript**: Strict mode enabled with path aliases (`@/*` → `./`)
- **Tailwind CSS**: Uses CSS variables and neutral base color
- **shadcn/ui**: Configured with New York style, RSC support, and Lucide icons
- **ESLint**: Uses Next.js core web vitals and TypeScript rules

## Development Notes

- The app uses Turbopack for faster development builds
- Session cookies are automatically secured in production
- Provider icons and colors are configured per provider
- All authentication errors are handled with user-friendly messages
- The codebase follows Next.js 15 App Router conventions with server and client components clearly separated
- OAuth library is designed to be reusable across different Next.js projects

### Build Configuration
- ESLint and TypeScript errors are temporarily ignored during builds (see `next.config.ts`)
- This allows for faster development iteration but should be addressed before production

### Provider-Specific Callback URLs
Each provider requires exact callback URL configuration:
- **LINE**: `http://localhost:3000/api/auth/line/callback`
- **Google**: `http://localhost:3000/api/auth/google/callback`
- **Facebook**: `http://localhost:3000/api/auth/facebook/callback`
- **GitHub**: `http://localhost:3000/api/auth/github/callback`
- **Discord**: `http://localhost:3000/api/auth/discord/callback`
- **Twitter**: `http://localhost:3000/api/auth/twitter/callback`

### Environment Variable Format
```bash
# Standard format for all providers
{PROVIDER}_CLIENT_ID=your_client_id
{PROVIDER}_CLIENT_SECRET=your_client_secret

# Exception: LINE uses channel terminology
LINE_CLIENT_ID=your_channel_id
LINE_CLIENT_SECRET=your_channel_secret
```

## Testing OAuth Providers

To test different providers:
1. Configure environment variables for desired providers
2. Restart development server
3. Providers with valid configuration will appear on login page
4. Use provider-specific test accounts for development

## Security Considerations

- All OAuth flows use PKCE where supported
- Session cookies are HTTP-only and secure in production
- State parameters prevent CSRF attacks
- Provider credentials are never exposed to client-side code
- Access tokens are securely stored in server-side sessions