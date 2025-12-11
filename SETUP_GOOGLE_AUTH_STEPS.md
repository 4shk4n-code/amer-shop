# Step-by-Step Google OAuth Setup for amertrading.shop

Follow these steps exactly to enable Google sign-in on your Vercel deployment.

## Your Domain
**Production URL**: https://amertrading.shop

---

## Step 1: Create Google OAuth Credentials

### 1.1 Go to Google Cloud Console
1. Visit: https://console.cloud.google.com/
2. Sign in with your Google account

### 1.2 Create or Select a Project
1. Click the project dropdown at the top (next to "Google Cloud")
2. Click "New Project"
3. Project name: `AMERSHOP` (or any name you prefer)
4. Click "Create"
5. Wait for project creation, then select it from the dropdown

### 1.3 Enable Google+ API
1. In the left sidebar, click "APIs & Services" → "Library"
2. Search for: `Google+ API` or `Google Identity`
3. Click on "Google+ API" (or "Identity Toolkit API")
4. Click the blue "Enable" button
5. Wait for it to enable

### 1.4 Configure OAuth Consent Screen
1. Go to "APIs & Services" → "OAuth consent screen" (in left sidebar)
2. Select "External" (unless you have Google Workspace)
3. Click "Create"

**Fill in the form:**
- **App name**: `AMERSHOP` or `AMERTRADING`
- **User support email**: Your email address
- **App logo**: (Optional - skip for now)
- **Application home page**: `https://amertrading.shop`
- **Application privacy policy link**: `https://amertrading.shop` (or leave blank)
- **Application terms of service link**: (Leave blank)
- **Authorized domains**: (Leave blank for now)
- **Developer contact information**: Your email address

4. Click "Save and Continue"

**Scopes Page:**
1. Click "Save and Continue" (no changes needed)

**Test Users Page:**
1. Click "Add Users"
2. Add your email address (and any other emails you want to test with)
3. Click "Add"
4. Click "Save and Continue"

**Summary Page:**
1. Review everything
2. Click "Back to Dashboard"

### 1.5 Create OAuth 2.0 Client ID
1. Go to "APIs & Services" → "Credentials" (in left sidebar)
2. Click the blue "+ CREATE CREDENTIALS" button at the top
3. Select "OAuth client ID"

**If prompted to configure consent screen:**
- Click "Configure Consent Screen" and complete it (see Step 1.4 above)
- Then come back to "Credentials" → "Create Credentials" → "OAuth client ID"

**Create OAuth client ID:**
1. **Application type**: Select "Web application"
2. **Name**: `AMERSHOP Web Client` (or any name)

3. **Authorized JavaScript origins** - Click "ADD URI" and add:
   ```
   https://amertrading.shop
   http://localhost:3000
   ```

4. **Authorized redirect URIs** - Click "ADD URI" and add:
   ```
   https://amertrading.shop/api/auth/callback/google
   http://localhost:3000/api/auth/callback/google
   ```

5. Click "CREATE"

### 1.6 Copy Your Credentials
After clicking "CREATE", a popup will appear with:
- **Your Client ID**: (looks like: `123456789-abcdefghijklmnop.apps.googleusercontent.com`)
- **Your Client Secret**: (looks like: `GOCSPX-abcdefghijklmnopqrstuvwxyz`)

**IMPORTANT**: Copy both of these - you'll need them in the next step!

---

## Step 2: Add Environment Variables to Vercel

### 2.1 Go to Vercel Project
1. Visit: https://vercel.com/mohammadhossein-tajiks-projects/amer-shop
2. Or go to: https://vercel.com → Your Project → Settings

### 2.2 Add Environment Variables
1. Click on "Settings" tab
2. Click on "Environment Variables" in the left sidebar
3. You'll see a form to add variables

**Add these 3 variables one by one:**

#### Variable 1: GOOGLE_CLIENT_ID
- **Key**: `GOOGLE_CLIENT_ID`
- **Value**: Paste your Client ID from Step 1.6
- **Environment**: Select all three: ☑ Production ☑ Preview ☑ Development
- Click "Save"

#### Variable 2: GOOGLE_CLIENT_SECRET
- **Key**: `GOOGLE_CLIENT_SECRET`
- **Value**: Paste your Client Secret from Step 1.6
- **Environment**: Select all three: ☑ Production ☑ Preview ☑ Development
- Click "Save"

#### Variable 3: NEXTAUTH_URL (if not already set)
- **Key**: `NEXTAUTH_URL`
- **Value**: `https://amertrading.shop`
- **Environment**: Select all three: ☑ Production ☑ Preview ☑ Development
- Click "Save"

### 2.3 Verify Variables
You should now see these 3 variables in your list:
- ✅ `GOOGLE_CLIENT_ID`
- ✅ `GOOGLE_CLIENT_SECRET`
- ✅ `NEXTAUTH_URL`

---

## Step 3: Redeploy Your Application

### 3.1 Trigger Redeployment
1. Go to "Deployments" tab in Vercel
2. Find your latest deployment
3. Click the "..." (three dots) menu
4. Click "Redeploy"
5. Confirm by clicking "Redeploy" again

**OR** simply push a new commit:
```bash
git commit --allow-empty -m "Trigger redeploy for Google OAuth"
git push origin main
```

### 3.2 Wait for Deployment
- Wait 1-2 minutes for deployment to complete
- You'll see a green checkmark when it's done

---

## Step 4: Test Google Sign-In

### 4.1 Test Sign-In Page
1. Visit: https://amertrading.shop/signin
2. You should see a "Continue with Google" button

### 4.2 Test Google Sign-In
1. Click "Continue with Google"
2. You should be redirected to Google's sign-in page
3. Sign in with your Google account
4. You should be redirected back to https://amertrading.shop
5. You should be signed in (check the header for your profile)

### 4.3 Test Sign-Up Page
1. Visit: https://amertrading.shop/signup
2. Click "Continue with Google"
3. It should work the same way (Google handles both sign-in and sign-up)

---

## Troubleshooting

### Issue: "redirect_uri_mismatch" Error

**What it means**: The redirect URI in Google Console doesn't match what NextAuth is sending.

**Fix**:
1. Go back to Google Cloud Console → Credentials
2. Click on your OAuth 2.0 Client ID
3. Check "Authorized redirect URIs"
4. Make sure this EXACT URL is there:
   ```
   https://amertrading.shop/api/auth/callback/google
   ```
5. Make sure there's NO trailing slash
6. Make sure it's `https://` not `http://`
7. Click "Save"
8. Wait 2-3 minutes for changes to propagate
9. Try again

### Issue: "Error 400: invalid_client"

**What it means**: The Client ID or Client Secret is wrong.

**Fix**:
1. Double-check your environment variables in Vercel
2. Make sure there are no extra spaces
3. Make sure you copied the full Client ID and Client Secret
4. Redeploy after fixing

### Issue: Google Sign-In Button Doesn't Work

**Fix**:
1. Check Vercel deployment logs for errors
2. Verify all 3 environment variables are set
3. Make sure you redeployed after adding variables
4. Check browser console for errors (F12 → Console tab)

### Issue: User Not Created After Sign-In

**Fix**:
1. Check that `DATABASE_URL` is set in Vercel
2. Check Vercel deployment logs for database errors
3. Make sure your database is connected and working

---

## Quick Checklist

Before testing, make sure:

- [ ] Created Google Cloud project
- [ ] Enabled Google+ API
- [ ] Configured OAuth consent screen
- [ ] Created OAuth 2.0 Client ID
- [ ] Added `https://amertrading.shop` to Authorized JavaScript origins
- [ ] Added `https://amertrading.shop/api/auth/callback/google` to Authorized redirect URIs
- [ ] Copied Client ID and Client Secret
- [ ] Added `GOOGLE_CLIENT_ID` to Vercel environment variables
- [ ] Added `GOOGLE_CLIENT_SECRET` to Vercel environment variables
- [ ] Added `NEXTAUTH_URL=https://amertrading.shop` to Vercel
- [ ] Redeployed application
- [ ] Tested sign-in at https://amertrading.shop/signin

---

## Need Help?

If you're stuck:
1. Check Vercel deployment logs (Deployments → Click deployment → View logs)
2. Check browser console (F12 → Console tab)
3. Verify all environment variables are set correctly
4. Make sure redirect URI matches exactly in Google Console

