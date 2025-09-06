import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Cart from "@/models/Cart"
import { getUserFromRequest } from "@/lib/auth"

// GET /api/cart - Get user's cart
export async function GET(request: NextRequest) {
  try {
    const userPayload = getUserFromRequest(request)
    if (!userPayload) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    await connectDB()

    const cart = await Cart.findOne({ userId: userPayload.userId }).populate({
      path: "products.productId",
      populate: {
        path: "userId",
        select: "username",
      },
    })

    if (!cart) {
      return NextResponse.json({ cart: { products: [], totalAmount: 0 } })
    }

    // Filter out products that no longer exist
    const validProducts = cart.products.filter((item: any) => item.productId)

    // Calculate total amount
    const totalAmount = validProducts.reduce((total: number, item: any) => {
      return total + item.productId.price * item.quantity
    }, 0)

    return NextResponse.json({
      cart: {
        products: validProducts,
        totalAmount,
      },
    })
  } catch (error) {
    console.error("Get cart error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
