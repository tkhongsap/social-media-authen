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

Required environment variables in `.env.local`:
```
LINE_CHANNEL_ID=your_channel_id
LINE_CHANNEL_SECRET=your_channel_secret
NEXT_PUBLIC_LINE_CHANNEL_ID=your_channel_id
```

## Architecture Overview

This is a Next.js 15 application using the App Router with LINE OAuth authentication. The authentication flow uses HTTP-only cookies for session management.

### Key Components:
- **Authentication API Routes**: `/app/api/auth/callback/route.ts` handles OAuth callback and token exchange, `/app/api/auth/logout/route.ts` handles session cleanup
- **Session Management**: Uses HTTP-only cookies with 7-day expiration, stored as JSON with user profile and access token
- **UI Components**: Built with Radix UI primitives and Tailwind CSS using the shadcn/ui component system
- **State Management**: Client-side components handle authentication state through session cookies

### Authentication Flow:
1. User clicks login → `components/login-page.tsx` generates LINE OAuth URL
2. LINE redirects to `/api/auth/callback` with authorization code
3. Server exchanges code for access token and fetches user profile
4. Session cookie is created and user is redirected to `/dashboard`
5. Protected routes check for session cookie existence

### Component Structure:
- `components/login-page.tsx`: Handles LINE OAuth initiation with error handling
- `components/dashboard.tsx`: Main authenticated user interface
- `components/ui/`: Reusable UI components from shadcn/ui
- `lib/utils.ts`: Utility functions for CSS class merging

### Configuration:
- **TypeScript**: Strict mode enabled with path aliases (`@/*` → `./`)
- **Tailwind CSS**: Uses CSS variables and neutral base color
- **shadcn/ui**: Configured with New York style, RSC support, and Lucide icons
- **ESLint**: Uses Next.js core web vitals and TypeScript rules

## Development Notes

- The app uses Turbopack for faster development builds
- Session cookies are automatically secured in production
- Client-side components include preview environment detection
- All authentication errors are handled with user-friendly messages
- The codebase follows Next.js 15 App Router conventions with server and client components clearly separated