"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"

export function Navbar() {
  const { user, logout } = useAuth()

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center space-x-2">
              <Image
                src="/favicon.png"
                alt="EverAgain Logo"
                width={40}
                height={40}
                unoptimized
                className="rounded-full aspect-square object"
              />
              <span className="font-bold text-xl text-green-600">
                Connect, Share, Sustain
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/marketplace"
              className="text-foreground/80 hover:text-foreground transition-colors"
            >
              Marketplace
            </Link>
            {user && (
              <Link
                href="/add-product"
                className="text-foreground/80 hover:text-foreground transition-colors"
              >
                Sell Item
              </Link>
            )}
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-2">
            {!user ? (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </>
            ) : (
              <Button variant="destructive" onClick={logout}>
                Logout
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
