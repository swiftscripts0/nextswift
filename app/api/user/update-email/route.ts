import { NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { cookies } from 'next/headers'
import { verify } from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET!

export async function POST(request: Request) {
  const token = cookies().get('auth_token')?.value

  if (!token) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  try {
    const { email } = await request.json()
    const decoded = verify(token, JWT_SECRET) as { userId: number }

    await query('UPDATE users SET email = ? WHERE id = ?', [email, decoded.userId])

    return NextResponse.json({ message: 'Email updated successfully' })
  } catch (error) {
    console.error('Error updating email:', error)
    return NextResponse.json({ error: 'An error occurred while updating email' }, { status: 500 })
  }
}

