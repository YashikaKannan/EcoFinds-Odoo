"use client"

import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { useCart } from "@/hooks/use-cart"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { formatPrice } from "@/lib/utils"
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react"
import { useState } from "react"

export default function CartPage() {
  const { user } = useAuth()
  const { items, totalAmount, loading, removeFromCart, updateQuantity } = useCart()
  const router = useRouter()
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set())

  if (!user) {
    router.push("/login")
    return null
  }

  const handleQuantityChange = async (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return

    setUpdatingItems((prev) => new Set(prev).add(productId))
    await updateQuantity(productId, newQuantity)
    setUpdatingItems((prev) => {
      const next = new Set(prev)
      next.delete(productId)
      return next
    })
  }

  const handleRemoveItem = async (productId: string) => {
    setUpdatingItems((prev) => new Set(prev).add(productId))
    await removeFromCart(productId)
    setUpdatingItems((prev) => {
      const next = new Set(prev)
      next.delete(productId)
      return next
    })
  }

  const handleCheckout = () => {
    router.push("/checkout")
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="bg-gray-200 h-8 rounded w-32"></div>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-gray-200 h-32 rounded-lg"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      {items.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.productId._id}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="relative w-24 h-24 flex-shrink-0">
                      <Image
                        src={item.productId.imageUrl || "/placeholder.svg"}
                        alt={item.productId.title}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <Link
                            href={`/product/${item.productId._id}`}
                            className="font-semibold text-lg hover:text-green-600 transition-colors line-clamp-1"
                          >
                            {item.productId.title}
                          </Link>
                          <p className="text-sm text-gray-500">by {item.productId.userId.username}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveItem(item.productId._id)}
                          disabled={updatingItems.has(item.productId._id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 bg-transparent"
                            onClick={() => handleQuantityChange(item.productId._id, item.quantity - 1)}
                            disabled={item.quantity <= 1 || updatingItems.has(item.productId._id)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => {
                              const newQuantity = Number.parseInt(e.target.value) || 1
                              handleQuantityChange(item.productId._id, newQuantity)
                            }}
                            className="w-16 text-center"
                            disabled={updatingItems.has(item.productId._id)}
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 bg-transparent"
                            onClick={() => handleQuantityChange(item.productId._id, item.quantity + 1)}
                            disabled={updatingItems.has(item.productId._id)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>

                        <div className="text-right">
                          <p className="text-lg font-semibold">{formatPrice(item.productId.price * item.quantity)}</p>
                          <p className="text-sm text-gray-500">{formatPrice(item.productId.price)} each</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span>Items ({items.reduce((sum, item) => sum + item.quantity, 0)})</span>
                    <span>{formatPrice(totalAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="flex justify-between text-lg font-semibold mb-6">
                  <span>Total</span>
                  <span>{formatPrice(totalAmount)}</span>
                </div>

                <Button onClick={handleCheckout} className="w-full" size="lg">
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  Proceed to Checkout
                </Button>

                <p className="text-xs text-gray-500 text-center mt-4">Secure checkout powered by EcoFinds</p>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-600 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Discover amazing second-hand items in our marketplace</p>
          <Button asChild size="lg">
            <Link href="/marketplace">Start Shopping</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
