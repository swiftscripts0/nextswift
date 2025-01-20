import { NextResponse } from "next/server"

export async function POST() {
  // With localStorage, we don't need to do anything server-side for logout
  return NextResponse.json({ success: true })
}

