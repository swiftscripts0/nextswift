import { NextResponse } from 'next/server'
import { query } from '@/lib/db'
import bcrypt from 'bcrypt'

export async function POST(request: Request) {
  try {
    const { username, email, password } = await request.json()

    if (!username || !email || !password) {
      return NextResponse.json({ error: 'Please fill out all fields.' }, { status: 400 })
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email.' }, { status: 400 })
    }

    const existingUsers = await query('SELECT * FROM users WHERE username = ? OR email = ?', [username, email])

    if (existingUsers.length > 0) {
      return NextResponse.json({ error: 'Username or email already exists.' }, { status: 409 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword])

    return NextResponse.json({ success: true, message: 'Registration successful! You can now log in.' })
  } catch (error) {
    console.error('Signup Error:', error)
    return NextResponse.json({ error: 'An error occurred during signup' }, { status: 500 })
  }
}

