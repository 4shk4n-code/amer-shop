// Create Admin User on VPS
// Run: node scripts/create-admin-vps.js
// Make sure .env.local exists with database credentials

require('dotenv').config({ path: '.env.local' })
const mysql = require('mysql2/promise')
const bcrypt = require('bcryptjs')

async function createAdmin() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'amer_shop',
  })

  const email = 'admin@amershop.com'
  const password = 'admin123'
  const passwordHash = bcrypt.hashSync(password, 10)

  try {
    // Check if admin exists
    const [existing] = await connection.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    )

    if (existing.length > 0) {
      // Update existing admin
      await connection.execute(
        'UPDATE users SET password_hash = ?, role = ?, is_active = 1 WHERE email = ?',
        [passwordHash, 'admin', email]
      )
      console.log('✅ Admin user updated successfully!')
    } else {
      // Create new admin
      await connection.execute(
        `INSERT INTO users (email, password_hash, first_name, last_name, role)
         VALUES (?, ?, ?, ?, ?)`,
        [email, passwordHash, 'Admin', 'User', 'admin']
      )
      console.log('✅ Admin user created successfully!')
    }

    console.log('\n📧 Login Credentials:')
    console.log('Email:', email)
    console.log('Password:', password)
    console.log('\n⚠️  IMPORTANT: Change the password after first login!')
  } catch (error) {
    console.error('❌ Error:', error.message)
    console.log('\nMake sure:')
    console.log('1. MySQL is running')
    console.log('2. Database exists')
    console.log('3. .env.local has correct credentials')
  } finally {
    await connection.end()
  }
}

createAdmin()

