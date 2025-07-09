# social-media-authen

A Next.js 15 application with LINE login authentication system.

## Features

- LINE OAuth 2.0 authentication
- User session management with HTTP-only cookies
- Protected dashboard routes
- Modern UI with Tailwind CSS and Radix UI components
- TypeScript support
- Responsive design

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/tkhongsap/social-media-authen.git
cd social-media-authen
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file with your LINE Channel credentials:
```
LINE_CHANNEL_ID=your_channel_id
LINE_CHANNEL_SECRET=your_channel_secret
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser.

## Project Structure

- `/app` - Next.js 15 app directory with pages and API routes
- `/components` - Reusable React components
- `/lib` - Utility functions
- `/public` - Static assets

## Authentication Flow

1. User clicks login button
2. Redirects to LINE OAuth authorization
3. LINE redirects back to `/api/auth/callback` with authorization code
4. Server exchanges code for access token
5. Server fetches user profile from LINE API
6. Server creates session cookie and redirects to dashboard

## Tech Stack

- Next.js 15 with Turbopack
- TypeScript
- Tailwind CSS
- Radix UI
- LINE Login API

## License

This project is licensed under the MIT License.
