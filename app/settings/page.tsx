"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Nav } from "@/components/nav"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"

export default function SettingsPage() {
  const { user, token } = useAuth()
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [subscriptionStatus, setSubscriptionStatus] = useState("Loading...")
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (!user || !token) {
      router.push("/login")
    } else {
      fetchUserDetails()
      fetchSubscriptionStatus()
    }
  }, [user, token, router])

  const fetchUserDetails = async () => {
    try {
      const response = await fetch("/api/user/details", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setUsername(data.username)
        setEmail(data.email)
      } else {
        setMessage("Failed to fetch user details")
      }
    } catch (error) {
      console.error("Error fetching user details:", error)
      setMessage("An error occurred while fetching user details")
    }
  }

  const fetchSubscriptionStatus = async () => {
    try {
      const response = await fetch("/api/user/subscription", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setSubscriptionStatus(data.status)
      } else {
        setSubscriptionStatus("Failed to fetch")
      }
    } catch (error) {
      console.error("Error fetching subscription status:", error)
      setSubscriptionStatus("Error")
    }
  }

  const handleUsernameChange = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/user/update-username", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username }),
      })
      if (response.ok) {
        setMessage("Username updated successfully")
      } else {
        const data = await response.json()
        setMessage(data.error || "Failed to update username")
      }
    } catch (error) {
      console.error("Error updating username:", error)
      setMessage("An error occurred while updating username")
    }
  }

  const handleEmailChange = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/user/update-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email }),
      })
      if (response.ok) {
        setMessage("Email updated successfully")
      } else {
        const data = await response.json()
        setMessage(data.error || "Failed to update email")
      }
    } catch (error) {
      console.error("Error updating email:", error)
      setMessage("An error occurred while updating email")
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      setMessage("New passwords do not match")
      return
    }
    try {
      const response = await fetch("/api/user/update-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      })
      if (response.ok) {
        setMessage("Password updated successfully")
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
      } else {
        const data = await response.json()
        setMessage(data.error || "Failed to update password")
      }
    } catch (error) {
      console.error("Error updating password:", error)
      setMessage("An error occurred while updating password")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main className="container mx-auto px-4 pt-24">
        <h1 className="text-3xl font-bold mb-8">Account Settings</h1>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Subscription Status</h2>
          <p className="text-lg">{subscriptionStatus}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Update Username</h2>
          <form onSubmit={handleUsernameChange} className="space-y-4">
            <div>
              <Label htmlFor="username">New Username</Label>
              <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>
            <Button type="submit">Update Username</Button>
          </form>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Update Email</h2>
          <form onSubmit={handleEmailChange} className="space-y-4">
            <div>
              <Label htmlFor="email">New Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <Button type="submit">Update Email</Button>
          </form>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Change Password</h2>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit">Change Password</Button>
          </form>
        </section>

        {message && <div className="mt-4 p-4 bg-primary text-primary-foreground rounded">{message}</div>}
      </main>
    </div>
  )
}

