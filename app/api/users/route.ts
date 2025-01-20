import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET() {
  try {
    const users = await query('SELECT * FROM users')
    return NextResponse.json(users)
  } catch (error) {
    console.error('Database Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { name, email } = await request.json()
    const result = await query('INSERT INTO users (name, email) VALUES (?, ?)', [name, email])
    return NextResponse.json({ id: result.insertId, name, email }, { status: 201 })
  } catch (error) {
    console.error('Database Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

