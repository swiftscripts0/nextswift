import { NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { cookies } from 'next/headers'
import { verify } from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const JWT_SECRET = process.env.JWT_SECRET!

export async function POST(request: Request) {
  const token = cookies().get('auth_token')?.value

  if (!token) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  try {
    const { currentPassword, newPassword } = await request.json()
    const decoded = verify(token, JWT_SECRET) as { userId: number }

    const users = await query('SELECT password FROM users WHERE id = ?', [decoded.userId]) as any[]
    const user = users[0]

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password)

    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 })
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10)
    await query('UPDATE users SET password = ? WHERE id = ?', [hashedNewPassword, decoded.userId])

    return NextResponse.json({ message: 'Password updated successfully' })
  } catch (error) {
    console.error('Error updating password:', error)
    return NextResponse.json({ error: 'An error occurred while updating password' }, { status: 500 })
  }
}

