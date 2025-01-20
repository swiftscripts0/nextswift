"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Film, Tv, TrendingUp, Search, Menu, X, User, LogOut, Settings } from "lucide-react"
import { usePathname } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { LoginModal } from "./login-modal"
import { SignupModal } from "./signup-modal"
import { useAuth } from "./auth-provider"

interface NavProps {
  className?: string
}

export function Nav({ className = "" }: NavProps) {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false)
  const profileDropdownRef = useRef<HTMLDivElement>(null)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setIsMenuOpen(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      logout()
      router.refresh()
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const NavItems = () => (
    <>
      <Link
        href="/movies"
        className={`flex items-center gap-2 transition-transform hover:scale-105 active:scale-95 ${
          pathname === "/movies" ? "text-primary" : "hover:text-primary"
        }`}
        onClick={() => setIsMenuOpen(false)}
      >
        <Film className="h-4 w-4" />
        Movies
      </Link>
      <Link
        href="/tv"
        className={`flex items-center gap-2 transition-transform hover:scale-105 active:scale-95 ${
          pathname === "/tv" ? "text-primary" : "hover:text-primary"
        }`}
        onClick={() => setIsMenuOpen(false)}
      >
        <Tv className="h-4 w-4" />
        TV Shows
      </Link>
      <Link
        href="/trending"
        className={`flex items-center gap-2 transition-transform hover:scale-105 active:scale-95 ${
          pathname === "/trending" ? "text-primary" : "hover:text-primary"
        }`}
        onClick={() => setIsMenuOpen(false)}
      >
        <TrendingUp className="h-4 w-4" />
        Trending
      </Link>
    </>
  )

  return (
    <nav
      className={`fixed top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ${className}`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="text-xl font-bold transition-transform hover:scale-105 active:scale-95">
            StigStream
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <NavItems />
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-40 focus:w-64 transition-all duration-300 ease-in-out"
              />
            </form>
            <div className="relative" ref={profileDropdownRef}>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              >
                <Avatar>
                  <AvatarFallback>{user ? user[0].toUpperCase() : <User className="h-5 w-5" />}</AvatarFallback>
                </Avatar>
              </Button>
              {isProfileDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-background border border-border"
                  onMouseLeave={() => setIsProfileDropdownOpen(false)}
                >
                  <div className="py-1">
                    {user ? (
                      <>
                        <span className="block px-4 py-2 text-sm font-semibold">{user}</span>
                        <button
                          onClick={() => {
                            router.push("/settings")
                            setIsProfileDropdownOpen(false)
                          }}
                          className="block w-full text-left px-4 py-2 text-sm hover:bg-accent"
                        >
                          <Settings className="inline-block w-4 h-4 mr-2" />
                          Settings
                        </button>
                        <button
                          onClick={() => {
                            handleLogout()
                            setIsProfileDropdownOpen(false)
                          }}
                          className="block w-full text-left px-4 py-2 text-sm hover:bg-accent"
                        >
                          <LogOut className="inline-block w-4 h-4 mr-2" />
                          Sign Out
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setIsLoginModalOpen(true)
                            setIsProfileDropdownOpen(false)
                          }}
                          className="block w-full text-left px-4 py-2 text-sm hover:bg-accent"
                        >
                          Log in
                        </button>
                        <button
                          onClick={() => {
                            setIsSignupModalOpen(true)
                            setIsProfileDropdownOpen(false)
                          }}
                          className="block w-full text-left px-4 py-2 text-sm hover:bg-accent"
                        >
                          Sign up
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4 md:hidden">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-40"
              />
            </form>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="transition-transform hover:scale-105 active:scale-95"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden transition-all duration-300 ease-in-out">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-semibold">Menu</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar>
                      <AvatarFallback>{user ? user[0].toUpperCase() : <User className="h-5 w-5" />}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {user ? (
                    <>
                      <DropdownMenuItem disabled>{user}</DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={() => {
                          router.push("/settings")
                        }}
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                      </DropdownMenuItem>
                    </>
                  ) : (
                    (
                      <>
                      <DropdownMenuItem onSelect={() => setIsLoginModalOpen(true)}>
                        Log in
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelectHere's the continuation from the cut-off point:

in
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => setIsSignupModalOpen(true)}>
                        Sign up
                      </DropdownMenuItem>
                    </>
                    )
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <NavItems />
          </div>
        </div>
      )}
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
      <SignupModal isOpen={isSignupModalOpen} onClose={() => setIsSignupModalOpen(false)} />
    </nav>
  )
}

