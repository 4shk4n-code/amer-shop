// Fix Prisma 7 client structure
const fs = require('fs');
const path = require('path');

const prismaClientPath = path.join(__dirname, '../node_modules/.prisma/client');
const defaultPath = path.join(__dirname, '../.prisma/client');

// Create .prisma/client directory if it doesn't exist
if (!fs.existsSync(path.join(__dirname, '../.prisma'))) {
  fs.mkdirSync(path.join(__dirname, '../.prisma'), { recursive: true });
}

// Copy or symlink the generated client
if (fs.existsSync(prismaClientPath)) {
  if (fs.existsSync(defaultPath)) {
    fs.rmSync(defaultPath, { recursive: true, force: true });
  }
  // Copy the entire directory
  fs.cpSync(prismaClientPath, defaultPath, { recursive: true });
  console.log('✅ Fixed Prisma Client structure');
} else {
  console.log('⚠️  Prisma Client not found, skipping fix');
}

