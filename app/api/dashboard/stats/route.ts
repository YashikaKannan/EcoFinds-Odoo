import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Product from "@/models/Product"
import Purchase from "@/models/Purchase"
import { getUserFromRequest } from "@/lib/auth"

// GET /api/dashboard/stats - Get user dashboard statistics
export async function GET(request: NextRequest) {
  try {
    const userPayload = getUserFromRequest(request)
    if (!userPayload) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    await connectDB()

    // Get user's product listings count
    const listingsCount = await Product.countDocuments({ userId: userPayload.userId })

    // Get user's purchases count and total spent
    const purchases = await Purchase.find({ userId: userPayload.userId })
    const purchasesCount = purchases.length
    const totalSpent = purchases.reduce((sum, purchase) => sum + purchase.totalAmount, 0)

    // Get recent listings (last 5)
    const recentListings = await Product.find({ userId: userPayload.userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("title price createdAt")

    // Get recent purchases (last 5)
    const recentPurchases = await Purchase.find({ userId: userPayload.userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("totalAmount createdAt products")

    return NextResponse.json({
      stats: {
        listingsCount,
        purchasesCount,
        totalSpent,
      },
      recentListings,
      recentPurchases,
    })
  } catch (error) {
    console.error("Get dashboard stats error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
