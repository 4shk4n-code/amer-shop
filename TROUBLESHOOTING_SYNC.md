# Troubleshooting Repository Sync - 403 Permission Denied Error

## Quick Fix Checklist

If you're getting a **403 Permission Denied** error, follow these steps in order:

### ✅ Step 1: Verify Your Personal Access Token Has `repo` Scope

1. Go to: https://github.com/settings/tokens
2. Find your token (or create a new one)
3. **CRITICAL**: Make sure it has **`repo`** scope checked
   - This gives "Full control of private repositories"
   - Without this, the token cannot push to repositories
4. If your token doesn't have `repo` scope:
   - Create a **NEW** token with `repo` permission
   - Copy it immediately (you won't see it again)

### ✅ Step 2: Update the DESTINATION_TOKEN Secret

1. Go to your source repository: `https://github.com/4shk4n-code/amer-shop`
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Find `DESTINATION_TOKEN` secret
4. Click **Update** (or delete and recreate)
5. Paste your token that has `repo` scope
6. **Important**: 
   - No spaces before or after the token
   - Copy the entire token (starts with `ghp_`)
   - Make sure you're using a token with `repo` scope

### ✅ Step 3: Verify Destination Repository Exists

1. Check if this repository exists: `https://github.com/KaZeML0L/ecommerece`
2. If it doesn't exist:
   - Create it on GitHub (empty, no README)
   - Make sure the username `KaZeML0L` is correct
3. If the repository is private:
   - Make sure the token owner has access to it
   - Or make the repository public for testing

### ✅ Step 4: Verify All Secrets Are Set

In your repository → Settings → Secrets → Actions, you should have:

- ✅ `DESTINATION_TOKEN` - Your GitHub Personal Access Token (with `repo` scope)
- ✅ `DESTINATION_USERNAME` - Should be: `KaZeML0L`
- ✅ `DESTINATION_REPO` - Should be: `ecommerece`

### ✅ Step 5: Test the Token Manually

You can test if your token works by running this locally:

```bash
# Replace YOUR_TOKEN with your actual token
git remote add test https://YOUR_TOKEN@github.com/KaZeML0L/ecommerece.git
git push test main --force
```

If this fails, your token doesn't have the right permissions.

## Common Issues

### Issue: "Permission denied to github-actions[bot]"

**Cause**: The token isn't being used, or it doesn't have `repo` scope.

**Fix**: 
1. Create a new token with `repo` scope
2. Update the `DESTINATION_TOKEN` secret
3. Re-run the workflow

### Issue: "Repository not found"

**Cause**: The destination repository doesn't exist or the path is wrong.

**Fix**:
1. Verify the repository exists: `https://github.com/KaZeML0L/ecommerece`
2. Check `DESTINATION_USERNAME` and `DESTINATION_REPO` secrets are correct
3. Make sure there are no typos

### Issue: Token works locally but not in GitHub Actions

**Cause**: The secret might have extra spaces or be incorrectly formatted.

**Fix**:
1. Delete the `DESTINATION_TOKEN` secret
2. Create a new one
3. Copy the token carefully (no spaces)
4. Make sure it starts with `ghp_`

## How to Create a Token with Correct Permissions

1. Go to: https://github.com/settings/tokens/new
2. **Name**: `Repo Sync Token`
3. **Expiration**: Choose your preference (90 days, 1 year, or no expiration)
4. **Select scopes**: 
   - ✅ **`repo`** (Full control of private repositories)
     - This includes: `repo:status`, `repo_deployment`, `public_repo`, `repo:invite`, `security_events`
5. Click **Generate token**
6. **Copy the token immediately** - it starts with `ghp_`
7. Update your `DESTINATION_TOKEN` secret with this new token

## Still Not Working?

1. Check the workflow logs in the **Actions** tab
2. Look for the exact error message
3. Verify all three secrets are set correctly
4. Make sure the destination repository exists and is accessible
5. Try creating a fresh token with only `repo` scope

