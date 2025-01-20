import { NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { cookies } from 'next/headers'
import { verify } from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET!

export async function GET() {
  const token = cookies().get('auth_token')?.value

  if (!token) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  try {
    const decoded = verify(token, JWT_SECRET) as { userId: number }
    const subscriptions = await query('SELECT status FROM subscriptions WHERE user_id = ?', [decoded.userId]) as any[]
    const subscription = subscriptions[0]

    if (!subscription) {
      return NextResponse.json({ status: 'No active subscription' })
    }

    return NextResponse.json({ status: subscription.status })
  } catch (error) {
    console.error('Error fetching subscription status:', error)
    return NextResponse.json({ error: 'An error occurred while fetching subscription status' }, { status: 500 })
  }
}

