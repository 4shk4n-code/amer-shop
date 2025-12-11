// Fix Prisma 7 client structure - create default.js that @prisma/client expects
const fs = require('fs');
const path = require('path');

const prismaClientPath = path.join(__dirname, '../.prisma/client');
const defaultJsPath = path.join(prismaClientPath, 'default.js');
const indexJsPath = path.join(prismaClientPath, 'index.js');

// Always ensure default.js exists
if (fs.existsSync(indexJsPath)) {
  if (!fs.existsSync(defaultJsPath)) {
    // Create default.js that re-exports from index.js
    fs.writeFileSync(defaultJsPath, `module.exports = require('./index.js');\n`);
    console.log('✅ Created .prisma/client/default.js');
  } else {
    // Update it to make sure it's correct
    fs.writeFileSync(defaultJsPath, `module.exports = require('./index.js');\n`);
    console.log('✅ Updated .prisma/client/default.js');
  }
} else {
  console.log('⚠️  Prisma Client index.js not found at', indexJsPath);
  process.exit(1);
}

