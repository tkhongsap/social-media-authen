# Social Media Authentication Library

A comprehensive multi-provider OAuth authentication system built with Next.js 15, TypeScript, and modern web standards. This library provides a reusable authentication solution supporting LINE, Google, Facebook, GitHub, Discord, and Twitter OAuth providers.

## Features

- 🔐 **Multi-Provider Support**: LINE, Google, Facebook, GitHub, Discord, Twitter
- 🚀 **Next.js 15 App Router**: Modern React Server Components
- 🛡️ **Security First**: PKCE, HTTP-only cookies, CSRF protection
- 📱 **Responsive UI**: Beautiful interface with Tailwind CSS and shadcn/ui
- 🔄 **Session Management**: Multi-provider session handling
- 🎨 **Customizable**: Easy to extend with new providers
- 📝 **TypeScript**: Fully typed with comprehensive interfaces
- 🔧 **Developer Experience**: Configuration validation and error handling

## Quick Start

### 1. Installation

```bash
git clone https://github.com/tkhongsap/social-media-authen.git
cd social-media-authen
npm install
```

### 2. Environment Configuration

Create a `.env.local` file with your OAuth provider credentials:

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

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Architecture

### OAuth Library Structure

```
lib/oauth/
├── types.ts              # TypeScript interfaces and types
├── errors.ts             # Error handling system
├── handler.ts            # OAuth flow management
├── session.ts            # Session management
├── utils.ts              # Utility functions
├── config.ts             # Environment configuration
├── normalizer.ts         # Profile normalization
├── index.ts              # Main exports
└── providers/
    ├── index.ts          # Provider registry
    ├── line.ts           # LINE OAuth configuration
    ├── google.ts         # Google OAuth configuration
    ├── facebook.ts       # Facebook OAuth configuration
    ├── github.ts         # GitHub OAuth configuration
    ├── discord.ts        # Discord OAuth configuration
    └── twitter.ts        # Twitter OAuth configuration
```

### API Routes

- `GET /api/auth/[provider]/login` - Initiate OAuth flow
- `GET /api/auth/[provider]/callback` - Handle OAuth callback
- `POST /api/auth/logout` - Logout (single or all providers)

### UI Components

- `components/multi-provider-login.tsx` - Multi-provider login interface
- `components/login-page.tsx` - Main login page wrapper
- `components/dashboard.tsx` - Authenticated user interface

## Usage Examples

### Basic OAuth Flow

```typescript
import { OAuthHandler } from '@/lib/oauth'

const handler = new OAuthHandler('google', {
  clientId: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  redirectUri: 'http://localhost:3000/api/auth/google/callback'
})

// Generate authorization URL
const { url, state } = handler.generateAuthUrl()

// Handle callback
const result = await handler.handleCallback(code, stateParam)
```

### Session Management

```typescript
import { SessionManager } from '@/lib/oauth'

// Get current session
const session = await SessionManager.getSession()

// Check authentication
const isAuthenticated = await SessionManager.isAuthenticated()

// Get user profile
const user = await SessionManager.getUser()

// Logout
await SessionManager.deleteSession()
```

### Configuration Validation

```typescript
import { validateOAuthConfig } from '@/lib/oauth/config'

const config = validateOAuthConfig()
console.log('Configured providers:', config.configuredProviders)
console.log('Missing configuration:', config.missingConfigurations)
```

## Adding New Providers

### 1. Create Provider Configuration

Create a new file `lib/oauth/providers/newprovider.ts`:

```typescript
import { OAuthProvider } from '../types'

export const newProviderConfig: OAuthProvider = {
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

export function normalizeNewProviderProfile(profile: any) {
  return {
    id: profile.id,
    email: profile.email,
    name: profile.name,
    displayName: profile.username,
    avatar: profile.avatar_url
  }
}
```

### 2. Register Provider

Add to `lib/oauth/providers/index.ts`:

```typescript
import { newProviderConfig, normalizeNewProviderProfile } from './newprovider'

export const providers = {
  // ... existing providers
  newprovider: newProviderConfig
}

export const profileNormalizers = {
  // ... existing normalizers
  newprovider: normalizeNewProviderProfile
}
```

### 3. Add Environment Variables

```bash
NEWPROVIDER_CLIENT_ID=your_client_id
NEWPROVIDER_CLIENT_SECRET=your_client_secret
```

The provider will automatically appear in the login interface!

## Supported Providers

### LINE
- OAuth 2.0 with PKCE support
- Scopes: `profile`, `openid`, `email`
- [Setup Instructions](https://developers.line.biz/en/docs/line-login/)

### Google
- OAuth 2.0 with refresh tokens
- Scopes: `openid`, `email`, `profile`
- [Setup Instructions](https://developers.google.com/identity/protocols/oauth2)

### Facebook
- Graph API OAuth
- Scopes: `email`, `public_profile`
- [Setup Instructions](https://developers.facebook.com/docs/facebook-login)

### GitHub
- OAuth 2.0 for developers
- Scopes: `user:email`
- [Setup Instructions](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps)

### Discord
- OAuth 2.0 for gaming communities
- Scopes: `identify`, `email`
- [Setup Instructions](https://discord.com/developers/docs/topics/oauth2)

### Twitter
- OAuth 2.0 v2 with PKCE
- Scopes: `tweet.read`, `users.read`
- [Setup Instructions](https://developer.twitter.com/en/docs/authentication/oauth-2-0)

## Security Features

- **PKCE (Proof Key for Code Exchange)**: Prevents authorization code interception
- **HTTP-only Cookies**: Secure session storage
- **State Parameter**: CSRF protection
- **Secure Defaults**: Production-ready security configuration
- **Error Handling**: Comprehensive error management

## Development

### Running Tests

```bash
npm run test
```

### Building for Production

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `LINE_CLIENT_ID` | LINE OAuth client ID | Optional |
| `LINE_CLIENT_SECRET` | LINE OAuth client secret | Optional |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | Optional |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | Optional |
| `FACEBOOK_CLIENT_ID` | Facebook OAuth client ID | Optional |
| `FACEBOOK_CLIENT_SECRET` | Facebook OAuth client secret | Optional |
| `GITHUB_CLIENT_ID` | GitHub OAuth client ID | Optional |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth client secret | Optional |
| `DISCORD_CLIENT_ID` | Discord OAuth client ID | Optional |
| `DISCORD_CLIENT_SECRET` | Discord OAuth client secret | Optional |
| `TWITTER_CLIENT_ID` | Twitter OAuth client ID | Optional |
| `TWITTER_CLIENT_SECRET` | Twitter OAuth client secret | Optional |

*Note: At least one provider must be configured for the application to work.*

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - UI component library
- [Radix UI](https://www.radix-ui.com/) - Low-level UI primitives
- [Lucide React](https://lucide.dev/) - Icon library

## Support

If you have any questions or need help, please:
1. Check the [documentation](./CLAUDE.md)
2. Open an [issue](https://github.com/tkhongsap/social-media-authen/issues)
3. Start a [discussion](https://github.com/tkhongsap/social-media-authen/discussions)

---

**Built with ❤️ by [Your Name](https://github.com/tkhongsap)**