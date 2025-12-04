# Quick Deploy Guide

## 🚀 One-Command Deploy (Easiest)

### Windows PowerShell:
```powershell
.\deploy.ps1
```

### Windows CMD:
```cmd
deploy-simple.bat
```

The script will:
1. ✅ Build your project locally
2. ✅ Upload files to VPS
3. ✅ Install dependencies on VPS
4. ✅ Build on VPS
5. ✅ Restart PM2

**Note:** You'll be prompted for your VPS password during upload.

---

## 📦 Manual Deploy (If script doesn't work)

### Step 1: Build Locally
```bash
npm run build
```

### Step 2: Upload Files
Use **WinSCP** or **FileZilla**:
- **Host:** `72.61.143.56`
- **User:** `root`
- **Path:** `/var/www/amer-shop`

Upload these:
- `src/` folder
- `public/` folder  
- `database/` folder
- `scripts/` folder
- `package.json`
- `package-lock.json`
- `ecosystem.config.js`
- `next.config.js`
- `postcss.config.js`
- `tailwind.config.ts`
- `tsconfig.json`

### Step 3: Deploy on VPS
SSH to your VPS and run:
```bash
ssh root@72.61.143.56
cd /var/www/amer-shop
npm install
npm run build
pm2 restart amer-shop
```

---

## 🔑 Setup SSH Key (Optional - No Password Needed)

To avoid entering password every time:

### On Windows:
```powershell
# Generate SSH key (if you don't have one)
ssh-keygen -t rsa -b 4096

# Copy key to VPS
type $env:USERPROFILE\.ssh\id_rsa.pub | ssh root@72.61.143.56 "cat >> ~/.ssh/authorized_keys"
```

After this, `deploy.ps1` will work without asking for password!

---

## ✅ Verify Deployment

After deployment, check:
- Website: http://72.61.143.56:3001
- Admin Panel: http://72.61.143.56:3001/admin
- PM2 Status: `pm2 status` (on VPS)

---

## 🐛 Troubleshooting

**Build fails:**
- Fix TypeScript/ESLint errors
- Run `npm run build` locally first

**Upload fails:**
- Check VPS connection: `ping 72.61.143.56`
- Verify SSH access: `ssh root@72.61.143.56`
- Use WinSCP for manual upload

**PM2 not restarting:**
- Check PM2: `pm2 list`
- Check logs: `pm2 logs amer-shop`
- Restart manually: `pm2 restart amer-shop`

