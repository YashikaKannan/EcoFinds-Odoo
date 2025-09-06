import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Cart from "@/models/Cart"
import { getUserFromRequest } from "@/lib/auth"
import { z } from "zod"

const updateCartSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
})

// POST /api/cart/update - Update product quantity in cart
export async function POST(request: NextRequest) {
  try {
    const userPayload = getUserFromRequest(request)
    if (!userPayload) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    await connectDB()

    const body = await request.json()
    const { productId, quantity } = updateCartSchema.parse(body)

    const cart = await Cart.findOne({ userId: userPayload.userId })
    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 })
    }

    // Find and update product quantity
    const itemIndex = cart.products.findIndex((item: any) => item.productId.toString() === productId)

    if (itemIndex === -1) {
      return NextResponse.json({ error: "Product not found in cart" }, { status: 404 })
    }

    cart.products[itemIndex].quantity = quantity
    cart.updatedAt = new Date()
    await cart.save()

    return NextResponse.json({ message: "Cart updated successfully" })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }

    console.error("Update cart error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
