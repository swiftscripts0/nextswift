import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import bcrypt from "bcrypt"
import { sign } from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret"

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    const users = (await query("SELECT * FROM users WHERE username = ?", [username])) as any[]
    const user = users[0]

    if (!user) {
      return NextResponse.json({ error: "Invalid username or password" }, { status: 401 })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid username or password" }, { status: 401 })
    }

    // Create a session token
    const token = sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: "1d" })

    // Store session information
    await query(
      "INSERT INTO sessions (session_id, username) VALUES (?, ?) ON DUPLICATE KEY UPDATE last_activity = CURRENT_TIMESTAMP",
      [token, user.username],
    )

    return NextResponse.json({ success: true, username: user.username, token })
  } catch (error) {
    console.error("Login Error:", error)
    return NextResponse.json({ error: "An error occurred during login" }, { status: 500 })
  }
}

