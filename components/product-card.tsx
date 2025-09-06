import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/utils"

interface Product {
  _id: string
  title: string
  description: string
  category: string
  price: number
  imageUrl: string
  userId: {
    username: string
  }
  createdAt: string
}

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/product/${product._id}`}>
      <Card className="group cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
        <CardContent className="p-0">
          <div className="relative aspect-square overflow-hidden rounded-t-lg">
            <Image
              src={product.imageUrl || "/placeholder.svg"}
              alt={product.title}
              fill
              className="object-cover transition-transform duration-200 group-hover:scale-105"
            />
            <Badge className="absolute top-2 left-2 bg-white/90 text-gray-800">{product.category}</Badge>
          </div>
        </CardContent>
        <CardFooter className="p-4">
          <div className="w-full">
            <h3 className="font-semibold text-lg mb-1 line-clamp-1">{product.title}</h3>
            <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold text-green-600">{formatPrice(product.price)}</span>
              <span className="text-sm text-gray-500">by {product.userId.username}</span>
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}
