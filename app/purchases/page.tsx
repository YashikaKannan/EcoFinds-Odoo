"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { formatPrice, formatDate } from "@/lib/utils"
import { Package, ShoppingBag, Calendar } from "lucide-react"

interface PurchaseItem {
  productId: {
    _id: string
    title: string
    imageUrl: string
    userId: {
      username: string
    }
  } | null
  title: string
  price: number
  quantity: number
}

interface Purchase {
  _id: string
  products: PurchaseItem[]
  totalAmount: number
  createdAt: string
}

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const response = await fetch("/api/purchases")
        const data = await response.json()

        if (response.ok) {
          setPurchases(data.purchases)
        } else {
          console.error("Failed to load purchases:", data.error)
        }
      } catch (error) {
        console.error("Error fetching purchases:", error)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchPurchases()
    }
  }, [user])

  if (!user) {
    router.push("/login")
    return null
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="bg-gray-200 h-8 rounded w-48"></div>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-gray-200 h-64 rounded-lg"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Package className="h-8 w-8 text-green-600" />
        <h1 className="text-3xl font-bold">Purchase History</h1>
      </div>

      {purchases.length > 0 ? (
        <div className="space-y-6">
          {purchases.map((purchase) => (
            <Card key={purchase._id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">Order #{purchase._id.slice(-8).toUpperCase()}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                      <Calendar className="h-4 w-4" />
                      <span>Purchased on {formatDate(purchase.createdAt)}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary" className="mb-2">
                      Completed
                    </Badge>
                    <p className="text-lg font-semibold">{formatPrice(purchase.totalAmount)}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {purchase.products.map((item, index) => (
                    <div key={index} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="relative w-16 h-16 flex-shrink-0">
                        <Image
                          src={item.productId?.imageUrl || "/placeholder.svg"}
                          alt={item.title}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium line-clamp-1">{item.title}</h3>
                            {item.productId && (
                              <p className="text-sm text-gray-500">by {item.productId.userId.username}</p>
                            )}
                            <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                            <p className="text-sm text-gray-500">{formatPrice(item.price)} each</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    {purchase.products.length} item{purchase.products.length !== 1 ? "s" : ""}
                  </div>
                  <div className="text-lg font-semibold">Total: {formatPrice(purchase.totalAmount)}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-600 mb-2">No purchases yet</h2>
          <p className="text-gray-500 mb-6">Start shopping to see your purchase history here</p>
          <Button asChild size="lg">
            <Link href="/marketplace">Browse Marketplace</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
