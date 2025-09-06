"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { formatPrice, formatDate } from "@/lib/utils"
import { User, Package, ShoppingBag, Calendar, DollarSign, Edit } from "lucide-react"
import { toast } from "sonner"

interface DashboardStats {
  listingsCount: number
  purchasesCount: number
  totalSpent: number
}

interface RecentListing {
  _id: string
  title: string
  price: number
  createdAt: string
}

interface RecentPurchase {
  _id: string
  totalAmount: number
  createdAt: string
  products: Array<{ title: string }>
}

export default function DashboardPage() {
  const { user, refreshUser } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentListings, setRecentListings] = useState<RecentListing[]>([])
  const [recentPurchases, setRecentPurchases] = useState<RecentPurchase[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
  })

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username,
        email: user.email,
      })
    }
  }, [user])

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch("/api/dashboard/stats")
        const data = await response.json()

        if (response.ok) {
          setStats(data.stats)
          setRecentListings(data.recentListings)
          setRecentPurchases(data.recentPurchases)
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchDashboardData()
    }
  }, [user])

  if (!user) {
    router.push("/login")
    return null
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setUpdating(true)

    try {
      const response = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success("Profile updated successfully!")
        await refreshUser()
        setEditing(false)
      } else {
        toast.error(data.error || "Failed to update profile")
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error("Failed to update profile")
    } finally {
      setUpdating(false)
    }
  }

  const handleCancelEdit = () => {
    setFormData({
      username: user.username,
      email: user.email,
    })
    setEditing(false)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="bg-gray-200 h-8 rounded w-48"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-gray-200 h-32 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <User className="h-8 w-8 text-green-600" />
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Section */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Profile</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setEditing(!editing)}>
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-6">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="text-xl">{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{user.username}</h3>
                  <p className="text-gray-500">{user.email}</p>
                  <p className="text-sm text-gray-400">Member since {formatDate(user.createdAt || "")}</p>
                </div>
              </div>

              {editing ? (
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div>
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" size="sm" disabled={updating}>
                      {updating ? "Saving..." : "Save"}
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={handleCancelEdit}>
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-3">
                  <Button asChild className="w-full">
                    <Link href="/add-product">
                      <Package className="h-4 w-4 mr-2" />
                      List New Item
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full bg-transparent">
                    <Link href="/marketplace">
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      Browse Marketplace
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          {stats && (
            <div className="grid grid-cols-1 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Package className="h-8 w-8 text-blue-600" />
                    <div>
                      <p className="text-2xl font-bold">{stats.listingsCount}</p>
                      <p className="text-sm text-gray-500">Active Listings</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <ShoppingBag className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="text-2xl font-bold">{stats.purchasesCount}</p>
                      <p className="text-sm text-gray-500">Purchases Made</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-8 w-8 text-purple-600" />
                    <div>
                      <p className="text-2xl font-bold">{formatPrice(stats.totalSpent)}</p>
                      <p className="text-sm text-gray-500">Total Spent</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Activity Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Listings */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Listings</CardTitle>
                  <CardDescription>Your latest items for sale</CardDescription>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link href="/my-listings">View All</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {recentListings.length > 0 ? (
                <div className="space-y-3">
                  {recentListings.map((listing) => (
                    <div key={listing._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium line-clamp-1">{listing.title}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(listing.createdAt)}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">{formatPrice(listing.price)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Package className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>No listings yet</p>
                  <Button asChild size="sm" className="mt-2">
                    <Link href="/add-product">Create Your First Listing</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Purchases */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Purchases</CardTitle>
                  <CardDescription>Your latest orders</CardDescription>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link href="/purchases">View All</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {recentPurchases.length > 0 ? (
                <div className="space-y-3">
                  {recentPurchases.map((purchase) => (
                    <div key={purchase._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">Order #{purchase._id.slice(-8).toUpperCase()}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(purchase.createdAt)}</span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {purchase.products.length} item{purchase.products.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{formatPrice(purchase.totalAmount)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <ShoppingBag className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>No purchases yet</p>
                  <Button asChild size="sm" className="mt-2">
                    <Link href="/marketplace">Start Shopping</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
