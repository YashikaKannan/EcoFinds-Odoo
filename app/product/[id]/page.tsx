"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { useAuth } from "@/hooks/use-auth"
import { useCart } from "@/hooks/use-cart"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { formatPrice, formatDate } from "@/lib/utils"
import { ShoppingCart, User, Calendar } from "lucide-react"
import { toast } from "sonner"

interface Product {
  _id: string
  title: string
  description: string
  category: string
  price: number
  imageUrl: string
  userId: {
    _id: string
    username: string
  }
  createdAt: string
}

export default function ProductDetailPage() {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [addingToCart, setAddingToCart] = useState(false)
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const { addToCart } = useCart()

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${params.id}`)
        const data = await response.json()

        if (response.ok) {
          setProduct(data.product)
        } else {
          toast.error("Product not found")
          router.push("/marketplace")
        }
      } catch (error) {
        console.error("Error fetching product:", error)
        toast.error("Failed to load product")
        router.push("/marketplace")
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchProduct()
    }
  }, [params.id, router])

  const handleAddToCart = async () => {
    if (!user) {
      toast.error("Please login to add items to cart")
      router.push("/login")
      return
    }

    if (!product) return

    setAddingToCart(true)
    const success = await addToCart(product._id)
    if (success) {
      toast.success("Added to cart!")
    }
    setAddingToCart(false)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gray-200 aspect-square rounded-lg"></div>
            <div className="space-y-4">
              <div className="bg-gray-200 h-8 rounded"></div>
              <div className="bg-gray-200 h-4 rounded"></div>
              <div className="bg-gray-200 h-6 rounded w-32"></div>
              <div className="bg-gray-200 h-32 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-gray-500">Product not found</p>
      </div>
    )
  }

  const isOwner = user && user.id === product.userId._id

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden rounded-lg">
          <Image src={product.imageUrl || "/placeholder.svg"} alt={product.title} fill className="object-cover" />
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <Badge className="mb-2">{product.category}</Badge>
            <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
            <p className="text-4xl font-bold text-green-600 mb-4">{formatPrice(product.price)}</p>
          </div>

          <Separator />

          <div>
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-gray-600">
              <User className="h-4 w-4" />
              <span>Sold by {product.userId.username}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>Listed on {formatDate(product.createdAt)}</span>
            </div>
          </div>

          <Separator />

          {/* Actions */}
          <div className="space-y-3">
            {isOwner ? (
              <div className="space-y-2">
                <p className="text-sm text-gray-500">This is your listing</p>
                <Button variant="outline" className="w-full bg-transparent" onClick={() => router.push("/my-listings")}>
                  Manage Listings
                </Button>
              </div>
            ) : (
              <Button onClick={handleAddToCart} disabled={addingToCart} className="w-full" size="lg">
                <ShoppingCart className="h-5 w-5 mr-2" />
                {addingToCart ? "Adding to Cart..." : "Add to Cart"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
