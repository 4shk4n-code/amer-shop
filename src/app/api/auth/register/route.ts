import { NextRequest, NextResponse } from 'next/server'
import { getPool } from '@/lib/db'
import { hashPassword, generateToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const pool = getPool()
    const { email, password, firstName, lastName, phone } = await request.json()

    // Validate required fields
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'Email, password, first name, and last name are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const [existingUsers] = await pool.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    ) as any[]

    if (existingUsers && existingUsers.length > 0) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      )
    }

    // Hash password
    const passwordHash = hashPassword(password)

    // Insert new user
    const [result] = await pool.execute(
      `INSERT INTO users (email, password_hash, first_name, last_name, phone, role, is_active)
       VALUES (?, ?, ?, ?, ?, 'customer', 1)`,
      [email, passwordHash, firstName, lastName, phone || null]
    ) as any

    const userId = result.insertId

    // Generate token
    const token = generateToken({
      id: userId,
      email,
      role: 'customer',
    })

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: userId,
        email,
        firstName,
        lastName,
        phone,
        role: 'customer',
      },
    }, { status: 201 })
  } catch (error: any) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Registration failed', message: error.message },
      { status: 500 }
    )
  }
}

