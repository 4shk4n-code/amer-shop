// Fix Prisma 7 client structure - create default.js that @prisma/client expects
const fs = require('fs');
const path = require('path');

const prismaClientPath = path.join(__dirname, '../.prisma/client');
const defaultJsPath = path.join(prismaClientPath, 'default.js');

// Check if .prisma/client directory exists
if (!fs.existsSync(prismaClientPath)) {
  console.log('⚠️  Prisma Client directory not found at', prismaClientPath);
  console.log('   This is normal if Prisma hasn\'t generated yet. Skipping fix.');
  process.exit(0); // Don't fail, just skip
}

// List all files in the directory to see what Prisma generated
const files = fs.readdirSync(prismaClientPath);
console.log('📁 Files in .prisma/client:', files.join(', '));

// Find the main entry point (could be index.js, index.mjs, or something else)
let mainFile = null;
if (fs.existsSync(path.join(prismaClientPath, 'index.js'))) {
  mainFile = 'index.js';
} else if (fs.existsSync(path.join(prismaClientPath, 'index.mjs'))) {
  mainFile = 'index.mjs';
} else {
  // Try to find any .js or .mjs file
  const jsFiles = files.filter(f => f.endsWith('.js') || f.endsWith('.mjs'));
  if (jsFiles.length > 0) {
    mainFile = jsFiles[0];
  }
}

if (mainFile) {
  // Create default.js that re-exports from the main file
  const content = `module.exports = require('./${mainFile}');\n`;
  fs.writeFileSync(defaultJsPath, content);
  console.log(`✅ Created .prisma/client/default.js (exports from ${mainFile})`);
} else {
  console.log('⚠️  Could not find Prisma Client entry file');
  console.log('   Available files:', files.join(', '));
  // Still try to create default.js that might work
  if (files.length > 0) {
    const firstFile = files.find(f => !f.endsWith('.d.ts'));
    if (firstFile) {
      fs.writeFileSync(defaultJsPath, `module.exports = require('./${firstFile}');\n`);
      console.log(`✅ Created .prisma/client/default.js (exports from ${firstFile})`);
    }
  }
}

