import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Product from "@/models/Product"
import { getUserFromRequest } from "@/lib/auth"

// GET /api/products/user - Get current user's products
export async function GET(request: NextRequest) {
  try {
    const userPayload = getUserFromRequest(request)
    if (!userPayload) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    await connectDB()

    const products = await Product.find({ userId: userPayload.userId })
      .populate("userId", "username")
      .sort({ createdAt: -1 })

    return NextResponse.json({ products })
  } catch (error) {
    console.error("Get user products error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
