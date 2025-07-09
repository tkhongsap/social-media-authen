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

### Usage Examples:

#### Adding a New Provider:
1. Create provider configuration in `lib/oauth/providers/`
2. Add environment variables
3. Provider appears automatically in login interface

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