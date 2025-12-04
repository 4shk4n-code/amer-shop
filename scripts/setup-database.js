// Interactive Database Setup Script
// Run: node scripts/setup-database.js

const mysql = require('mysql2/promise')
const readline = require('readline')
const fs = require('fs')
const path = require('path')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function question(query) {
  return new Promise(resolve => rl.question(query, resolve))
}

async function setupDatabase() {
  console.log('🚀 AMER SHOP Database Setup\n')
  console.log('This script will help you set up your MySQL database.\n')

  // Get MySQL credentials
  const host = await question('MySQL Host (default: localhost): ') || 'localhost'
  const user = await question('MySQL User (default: root): ') || 'root'
  const password = await question('MySQL Password: ')
  const database = await question('Database Name (default: amer_shop): ') || 'amer_shop'

  console.log('\n📦 Connecting to MySQL...')

  try {
    // Connect to MySQL (without database first)
    const connection = await mysql.createConnection({
      host,
      user,
      password,
      multipleStatements: true
    })

    console.log('✅ Connected to MySQL!\n')

    // Read schema file
    const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql')
    let schema = fs.readFileSync(schemaPath, 'utf8')

    // Replace database name in schema
    schema = schema.replace(/CREATE DATABASE IF NOT EXISTS \w+/gi, `CREATE DATABASE IF NOT EXISTS ${database}`)
    schema = schema.replace(/USE \w+;/gi, `USE ${database};`)

    console.log('📝 Creating database and tables...')
    await connection.query(schema)
    console.log('✅ Database and tables created!\n')

    // Create admin user
    const bcrypt = require('bcryptjs')
    const adminEmail = 'admin@amershop.com'
    const adminPassword = 'admin123'
    const passwordHash = bcrypt.hashSync(adminPassword, 10)

    console.log('👤 Creating admin user...')
    
    // Check if admin exists
    await connection.query(`USE ${database}`)
    const [existing] = await connection.query(
      'SELECT id FROM users WHERE email = ?',
      [adminEmail]
    )

    if (existing.length > 0) {
      await connection.query(
        'UPDATE users SET password_hash = ?, role = ?, is_active = 1 WHERE email = ?',
        [passwordHash, 'admin', adminEmail]
      )
      console.log('✅ Admin user updated!')
    } else {
      await connection.query(
        `INSERT INTO users (email, password_hash, first_name, last_name, role)
         VALUES (?, ?, ?, ?, ?)`,
        [adminEmail, passwordHash, 'Admin', 'User', 'admin']
      )
      console.log('✅ Admin user created!')
    }

    await connection.end()

    // Create .env.local file
    console.log('\n📝 Creating .env.local file...')
    const envContent = `# Database Configuration
DB_HOST=${host}
DB_USER=${user}
DB_PASSWORD=${password}
DB_NAME=${database}

# JWT Secret
JWT_SECRET=amer-shop-super-secret-jwt-key-change-in-production-2024

# Next.js
NEXT_PUBLIC_SITE_URL=http://localhost:3000
`

    const envPath = path.join(__dirname, '..', '.env.local')
    fs.writeFileSync(envPath, envContent)
    console.log('✅ .env.local file created!\n')

    console.log('🎉 Setup Complete!\n')
    console.log('📧 Admin Login Credentials:')
    console.log('   Email: admin@amershop.com')
    console.log('   Password: admin123\n')
    console.log('⚠️  IMPORTANT: Change the admin password after first login!\n')
    console.log('🚀 Next steps:')
    console.log('   1. Restart your dev server: npm run dev')
    console.log('   2. Go to: http://localhost:3000/admin')
    console.log('   3. Login with the credentials above\n')

  } catch (error) {
    console.error('\n❌ Error:', error.message)
    console.log('\nTroubleshooting:')
    console.log('1. Make sure MySQL is running')
    console.log('2. Check your MySQL credentials')
    console.log('3. Make sure MySQL user has CREATE DATABASE privileges')
  }

  rl.close()
}

setupDatabase()

