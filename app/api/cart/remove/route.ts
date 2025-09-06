import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Cart from "@/models/Cart"
import { getUserFromRequest } from "@/lib/auth"
import { z } from "zod"

const removeFromCartSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
})

// POST /api/cart/remove - Remove product from cart
export async function POST(request: NextRequest) {
  try {
    const userPayload = getUserFromRequest(request)
    if (!userPayload) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    await connectDB()

    const body = await request.json()
    const { productId } = removeFromCartSchema.parse(body)

    const cart = await Cart.findOne({ userId: userPayload.userId })
    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 })
    }

    // Remove product from cart
    cart.products = cart.products.filter((item: any) => item.productId.toString() !== productId)

    cart.updatedAt = new Date()
    await cart.save()

    return NextResponse.json({ message: "Product removed from cart successfully" })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }

    console.error("Remove from cart error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
