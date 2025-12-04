# Commands to Run on VPS - Step by Step

## STEP 1: Check MySQL
Run this command:
```bash
mysql --version
```

**If you see a version number** → MySQL is installed ✅
**If you see "command not found"** → We need to install MySQL

---

## STEP 2: Check if MySQL is Running
Run this command:
```bash
sudo systemctl status mysql
```

**If you see "active (running)"** → MySQL is running ✅
**If you see "inactive"** → We need to start it

---

## STEP 3: Check Node.js
Run this command:
```bash
node --version
```

**If you see a version number** → Node.js is installed ✅
**If you see "command not found"** → We need to install Node.js

---

## STEP 4: Check Current Directory
Run this command:
```bash
pwd
```

This shows where you are. We'll create the project here or in /var/www

---

## What to Tell Me:
After running the commands above, tell me:
1. What did `mysql --version` show?
2. What did `node --version` show?
3. What directory are you in? (`pwd` output)

Then I'll tell you exactly what to do next!

