# Authentication Setup Guide

This project uses NextAuth.js (Auth.js) for authentication with Google OAuth support.

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# NextAuth.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Google OAuth Credentials
# Get these from https://console.cloud.google.com/apis/credentials
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## Generating NEXTAUTH_SECRET

You can generate a secure secret key using:

```bash
openssl rand -base64 32
```

Or use any secure random string generator.

## Setting up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth client ID"
5. Configure the OAuth consent screen:
   - User Type: External (for testing) or Internal (for Google Workspace)
   - App name, user support email, developer contact
6. Create OAuth 2.0 Client ID:
   - Application type: Web application
   - Authorized JavaScript origins: `http://localhost:3000` (for development)
   - Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
7. Copy the Client ID and Client Secret to your `.env.local` file

## For Production

When deploying to production:

1. Update `NEXTAUTH_URL` to your production domain
2. Add your production domain to Google OAuth authorized origins and redirect URIs
3. Ensure all environment variables are set in your hosting platform

## Features

- ✅ Sign in with Google
- ✅ Sign up with Google (same flow)
- ✅ Email/password forms (requires backend implementation)
- ✅ User session management
- ✅ Protected routes support
- ✅ Sign out functionality

## Usage

- Visit `/signin` to sign in
- Visit `/signup` to create an account
- Both pages support Google OAuth authentication
- User profile appears in the header when signed in

