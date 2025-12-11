# How to Set Up Automatic Repository Sync

This guide will help you set up automatic syncing from one GitHub repository to another.

## What You Need

1. **Source Repository** (the one you push to)
2. **Destination Repository** (the one that gets synced automatically)
3. A GitHub Personal Access Token with repo permissions

---

## Step 1: Create a Personal Access Token

1. Go to: https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Give it a name: `Repo Sync Token`
4. Select scopes:
   - ☑ `repo` (Full control of private repositories)
5. Click "Generate token"
6. **IMPORTANT**: Copy the token immediately - you won't see it again!
   - It looks like: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

---

## Step 2: Add Secrets to Source Repository

1. Go to your **source repository** on GitHub
2. Click "Settings" tab
3. Click "Secrets and variables" → "Actions" in the left sidebar
4. Click "New repository secret"

**Add these 3 secrets:**

### Secret 1: DESTINATION_TOKEN
- **Name**: `DESTINATION_TOKEN`
- **Value**: Paste your Personal Access Token from Step 1
- Click "Add secret"

### Secret 2: DESTINATION_USERNAME
- **Name**: `DESTINATION_USERNAME`
- **Value**: The GitHub username that owns the destination repository
- Click "Add secret"

### Secret 3: DESTINATION_REPO
- **Name**: `DESTINATION_REPO`
- **Value**: The name of the destination repository (just the name, not the full URL)
- Click "Add secret"

---

## Step 3: Update the Workflow File

1. In your source repository, open `.github/workflows/sync.yml`
2. The file is already created, but make sure the branch name matches:
   - If your main branch is called `main`, it's already correct
   - If it's called `master`, change `main` to `master` in the file

---

## Step 4: Create the Destination Repository

1. Go to GitHub and create a **new empty repository**
2. Don't initialize it with README, .gitignore, or license
3. Note the repository name and username

---

## Step 5: Push the Workflow

1. Commit and push the workflow file:
   ```bash
   git add .github/workflows/sync.yml
   git commit -m "Add automatic sync workflow"
   git push origin main
   ```

2. After pushing, go to your source repository on GitHub
3. Click the "Actions" tab
4. You should see the workflow run automatically
5. Check if it succeeds (green checkmark)

---

## How It Works

- **Every time you push to the source repository**, it automatically syncs to the destination repository
- The sync happens within 1-2 minutes of your push
- You can also manually trigger it from the "Actions" tab → "Sync to Another Repository" → "Run workflow"

---

## Troubleshooting

### Issue: Workflow fails with "Permission denied"

**Fix**: 
- Make sure your Personal Access Token has `repo` permissions
- Make sure the token is correctly added as `DESTINATION_TOKEN` secret

### Issue: "Repository not found"

**Fix**:
- Check that `DESTINATION_USERNAME` and `DESTINATION_REPO` secrets are correct
- Make sure the destination repository exists
- Make sure the token has access to the destination repository

### Issue: Sync doesn't happen automatically

**Fix**:
- Check the "Actions" tab to see if the workflow is running
- Make sure you're pushing to the `main` branch (or whatever branch you configured)
- Check workflow logs for errors

---

## Manual Sync (Alternative)

If you don't want automatic syncing, you can manually sync with:

```bash
# Add destination as remote
git remote add destination https://github.com/DESTINATION_USERNAME/DESTINATION_REPO.git

# Push to destination
git push destination main --force

# Remove remote (optional)
git remote remove destination
```

---

## Need Help?

If you're stuck:
1. Check the "Actions" tab in your source repository for error messages
2. Verify all secrets are set correctly
3. Make sure the destination repository exists and is accessible

