// Fix Prisma 7 client structure - create .prisma/client from node_modules/.prisma/client
const fs = require('fs');
const path = require('path');

const sourcePath = path.join(__dirname, '../node_modules/.prisma/client');
const targetPath = path.join(__dirname, '../.prisma/client');

// Create .prisma directory if it doesn't exist
const prismaDir = path.join(__dirname, '../.prisma');
if (!fs.existsSync(prismaDir)) {
  fs.mkdirSync(prismaDir, { recursive: true });
}

// Copy the generated client to .prisma/client
if (fs.existsSync(sourcePath)) {
  if (fs.existsSync(targetPath)) {
    fs.rmSync(targetPath, { recursive: true, force: true });
  }
  fs.cpSync(sourcePath, targetPath, { recursive: true });
  console.log('✅ Fixed Prisma Client structure');
} else {
  console.log('⚠️  Prisma Client not found at', sourcePath);
}

