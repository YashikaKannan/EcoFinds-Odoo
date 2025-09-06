"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { formatPrice, formatDate } from "@/lib/utils"
import { Edit, Trash2, Plus } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"

interface Product {
  _id: string
  title: string
  description: string
  category: string
  price: number
  imageUrl: string
  createdAt: string
}

export default function MyListingsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const fetchMyProducts = async () => {
      try {
        const response = await fetch("/api/products/user")
        const data = await response.json()

        if (response.ok) {
          setProducts(data.products)
        } else {
          toast.error("Failed to load your listings")
        }
      } catch (error) {
        console.error("Error fetching products:", error)
        toast.error("Failed to load your listings")
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchMyProducts()
    }
  }, [user])

  const handleDelete = async (productId: string) => {
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setProducts(products.filter((p) => p._id !== productId))
        toast.success("Product deleted successfully")
      } else {
        const data = await response.json()
        toast.error(data.error || "Failed to delete product")
      }
    } catch (error) {
      console.error("Error deleting product:", error)
      toast.error("Failed to delete product")
    }
  }

  if (!user) {
    router.push("/login")
    return null
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="bg-gray-200 h-8 rounded w-48"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-gray-200 h-64 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Listings</h1>
        <Button asChild>
          <Link href="/add-product">
            <Plus className="h-4 w-4 mr-2" />
            Add New Item
          </Link>
        </Button>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product._id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="relative aspect-square">
                  <Image
                    src={product.imageUrl || "/placeholder.svg"}
                    alt={product.title}
                    fill
                    className="object-cover"
                  />
                  <Badge className="absolute top-2 left-2 bg-white/90 text-gray-800">{product.category}</Badge>
                </div>
              </CardContent>
              <CardFooter className="p-4">
                <div className="w-full space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg line-clamp-1">{product.title}</h3>
                    <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-green-600">{formatPrice(product.price)}</span>
                    <span className="text-sm text-gray-500">{formatDate(product.createdAt)}</span>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent" asChild>
                      <Link href={`/product/${product._id}`}>
                        <Edit className="h-4 w-4 mr-1" />
                        View
                      </Link>
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm" className="flex-1">
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Product</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{product.title}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(product._id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">You haven't listed any items yet</p>
          <Button asChild>
            <Link href="/add-product">
              <Plus className="h-4 w-4 mr-2" />
              List Your First Item
            </Link>
          </Button>
        </div>
      )}
    </div>
  )
}
