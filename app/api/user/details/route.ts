import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import { verify } from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret"

export async function GET(request: Request) {
  const authHeader = request.headers.get("Authorization")

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const token = authHeader.split(" ")[1]

  try {
    const decoded = verify(token, JWT_SECRET) as { userId: number }
    const users = (await query("SELECT username, email FROM users WHERE id = ?", [decoded.userId])) as any[]
    const user = users[0]

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ username: user.username, email: user.email })
  } catch (error) {
    console.error("Error fetching user details:", error)
    return NextResponse.json({ error: "An error occurred while fetching user details" }, { status: 500 })
  }
}

