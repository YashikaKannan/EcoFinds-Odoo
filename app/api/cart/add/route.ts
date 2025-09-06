import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Cart from "@/models/Cart"
import Product from "@/models/Product"
import { getUserFromRequest } from "@/lib/auth"
import { z } from "zod"

const addToCartSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  quantity: z.number().min(1, "Quantity must be at least 1").optional().default(1),
})

// POST /api/cart/add - Add product to cart
export async function POST(request: NextRequest) {
  try {
    const userPayload = getUserFromRequest(request)
    if (!userPayload) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    await connectDB()

    const body = await request.json()
    const { productId, quantity } = addToCartSchema.parse(body)

    // Check if product exists
    const product = await Product.findById(productId)
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Check if user is trying to add their own product
    if (product.userId.toString() === userPayload.userId) {
      return NextResponse.json({ error: "You cannot add your own product to cart" }, { status: 400 })
    }

    // Find or create cart
    let cart = await Cart.findOne({ userId: userPayload.userId })
    if (!cart) {
      cart = new Cart({ userId: userPayload.userId, products: [] })
    }

    // Check if product is already in cart
    const existingItemIndex = cart.products.findIndex((item: any) => item.productId.toString() === productId)

    if (existingItemIndex > -1) {
      // Update quantity
      cart.products[existingItemIndex].quantity += quantity
    } else {
      // Add new item
      cart.products.push({ productId, quantity })
    }

    cart.updatedAt = new Date()
    await cart.save()

    return NextResponse.json({ message: "Product added to cart successfully" })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }

    console.error("Add to cart error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
