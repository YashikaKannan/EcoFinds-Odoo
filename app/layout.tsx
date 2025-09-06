import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "sonner"
import { Suspense } from "react"
import { AuthProvider } from "@/hooks/use-auth"
import { CartProvider } from "@/hooks/use-cart"
import { Navbar } from "@/components/navbar"
import "./globals.css"

export const metadata: Metadata = {
  title: "EcoFinds - Sustainable Second-Hand Marketplace",
  description: "Discover and sell sustainable second-hand items in our eco-friendly marketplace",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <Suspense fallback={null}>
              {children}
              <Toaster position="top-center" />
            </Suspense>
          </CartProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
