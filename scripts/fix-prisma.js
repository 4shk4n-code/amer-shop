// Fix Prisma 7 client structure - create default.js that @prisma/client expects
const fs = require('fs');
const path = require('path');

const prismaClientPath = path.join(__dirname, '../.prisma/client');
const defaultJsPath = path.join(prismaClientPath, 'default.js');
const indexJsPath = path.join(prismaClientPath, 'index.js');

if (fs.existsSync(indexJsPath) && !fs.existsSync(defaultJsPath)) {
  // Create default.js that re-exports from index.js
  fs.writeFileSync(defaultJsPath, `module.exports = require('./index.js');\n`);
  console.log('✅ Created .prisma/client/default.js');
} else if (fs.existsSync(prismaClientPath)) {
  console.log('✅ Prisma Client structure is correct');
} else {
  console.log('⚠️  Prisma Client not found at', prismaClientPath);
}

