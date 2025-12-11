# Google OAuth Setup for Vercel Deployment

This guide will help you set up Google OAuth authentication for your AMERSHOP! application on Vercel.

## Step 1: Get Your Vercel Domain

1. Go to your Vercel project: https://vercel.com/mohammadhossein-tajiks-projects/amer-shop
2. Check your deployment URL (e.g., `https://amer-shop.vercel.app` or your custom domain)
3. Note this URL - you'll need it for Google OAuth configuration

## Step 2: Create Google OAuth Credentials

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Sign in with your Google account

2. **Create or Select a Project**
   - Click the project dropdown at the top
   - Click "New Project" or select an existing project
   - Give it a name (e.g., "AMERSHOP")

3. **Enable Google+ API**
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API" or "Google Identity"
   - Click on it and click "Enable"

4. **Configure OAuth Consent Screen**
   - Go to "APIs & Services" → "OAuth consent screen"
   - Choose "External" (unless you have Google Workspace)
   - Click "Create"
   - Fill in the required fields:
     - **App name**: AMERSHOP!
     - **User support email**: Your email
     - **Developer contact information**: Your email
   - Click "Save and Continue"
   - On "Scopes" page, click "Save and Continue"
   - On "Test users" page, add your email if needed, then click "Save and Continue"
   - Review and go back to dashboard

5. **Create OAuth 2.0 Client ID**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - Choose "Web application" as the application type
   - Give it a name (e.g., "AMERSHOP Web Client")

6. **Configure Authorized URLs**

   **Authorized JavaScript origins:**
   ```
   https://amer-shop.vercel.app
   https://your-custom-domain.com (if you have one)
   http://localhost:3000 (for local development)
   ```

   **Authorized redirect URIs:**
   ```
   https://amer-shop.vercel.app/api/auth/callback/google
   https://your-custom-domain.com/api/auth/callback/google (if you have one)
   http://localhost:3000/api/auth/callback/google (for local development)
   ```

   ⚠️ **Important**: Replace `amer-shop.vercel.app` with your actual Vercel domain!

7. **Copy Credentials**
   - After creating, you'll see a popup with:
     - **Client ID** (looks like: `123456789-abcdefg.apps.googleusercontent.com`)
     - **Client Secret** (looks like: `GOCSPX-abcdefghijklmnop`)
   - Copy both - you'll need them in the next step

## Step 3: Add Environment Variables to Vercel

1. **Go to Vercel Project Settings**
   - Visit: https://vercel.com/mohammadhossein-tajiks-projects/amer-shop
   - Click on "Settings" tab
   - Click on "Environment Variables" in the sidebar

2. **Add Required Variables**

   Add these environment variables:

   ```
   GOOGLE_CLIENT_ID=your-client-id-from-step-2
   GOOGLE_CLIENT_SECRET=your-client-secret-from-step-2
   NEXTAUTH_URL=https://amer-shop.vercel.app
   ```

   ⚠️ **Important**: 
   - Replace `your-client-id-from-step-2` with your actual Google Client ID
   - Replace `your-client-secret-from-step-2` with your actual Google Client Secret
   - Replace `amer-shop.vercel.app` with your actual Vercel domain

3. **Set Environment for All Environments**
   - Make sure to select "Production", "Preview", and "Development" for each variable
   - Click "Save" after adding each variable

## Step 4: Redeploy Your Application

1. **Trigger a New Deployment**
   - Go to "Deployments" tab in Vercel
   - Click the "..." menu on the latest deployment
   - Click "Redeploy"
   - Or push a new commit to trigger automatic deployment

2. **Wait for Deployment**
   - Wait for the deployment to complete (usually 1-2 minutes)

## Step 5: Test Google OAuth

1. **Visit Your Site**
   - Go to: `https://amer-shop.vercel.app/signin`
   - You should see a "Continue with Google" button

2. **Test Sign In**
   - Click "Continue with Google"
   - You should be redirected to Google's sign-in page
   - Sign in with your Google account
   - You should be redirected back to your site and be signed in

3. **Check User in Database**
   - The user should be automatically created in your database
   - You can verify this by checking your database or admin panel

## Troubleshooting

### Issue: "redirect_uri_mismatch" Error

**Solution**: 
- Make sure the redirect URI in Google Console exactly matches: `https://your-domain.vercel.app/api/auth/callback/google`
- Check for typos, trailing slashes, or http vs https

### Issue: "Error 400: redirect_uri_mismatch"

**Solution**:
- Go back to Google Cloud Console
- Check that your Vercel domain is added to "Authorized redirect URIs"
- Make sure you're using `https://` not `http://`
- Wait a few minutes for changes to propagate

### Issue: Google Sign In Button Doesn't Appear

**Solution**:
- Check that `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set in Vercel
- Make sure you redeployed after adding the environment variables
- Check Vercel deployment logs for any errors

### Issue: "Could not fetch session" Errors

**Solution**:
- These are harmless warnings from Vercel's feedback widget
- They don't affect Google OAuth functionality
- Already suppressed in the codebase

### Issue: User Not Created After Sign In

**Solution**:
- Check that your database is properly connected
- Verify `DATABASE_URL` is set correctly in Vercel
- Check Vercel deployment logs for database connection errors

## Additional Notes

- **Local Development**: Make sure to add `http://localhost:3000` to Google OAuth authorized URLs if you want to test locally
- **Custom Domain**: If you have a custom domain, add it to both Google OAuth settings and Vercel environment variables
- **Security**: Never commit your `GOOGLE_CLIENT_SECRET` to Git - always use environment variables
- **Multiple Environments**: You can use the same Google OAuth credentials for production, preview, and development by adding all URLs to Google Console

## Quick Checklist

- [ ] Created Google Cloud project
- [ ] Enabled Google+ API
- [ ] Configured OAuth consent screen
- [ ] Created OAuth 2.0 Client ID
- [ ] Added Vercel domain to authorized JavaScript origins
- [ ] Added callback URL to authorized redirect URIs
- [ ] Added `GOOGLE_CLIENT_ID` to Vercel environment variables
- [ ] Added `GOOGLE_CLIENT_SECRET` to Vercel environment variables
- [ ] Added `NEXTAUTH_URL` to Vercel environment variables
- [ ] Redeployed application
- [ ] Tested Google sign-in

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check Google Cloud Console for any error messages
3. Verify all environment variables are set correctly
4. Make sure your Vercel domain matches exactly in Google Console

