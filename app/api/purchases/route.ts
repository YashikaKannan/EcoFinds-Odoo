import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Purchase from "@/models/Purchase"
import Cart from "@/models/Cart"
import { getUserFromRequest } from "@/lib/auth"

// GET /api/purchases - Get user's purchase history
export async function GET(request: NextRequest) {
  try {
    const userPayload = getUserFromRequest(request)
    if (!userPayload) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    await connectDB()

    const purchases = await Purchase.find({ userId: userPayload.userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "products.productId",
        populate: {
          path: "userId",
          select: "username",
        },
      })

    return NextResponse.json({ purchases })
  } catch (error) {
    console.error("Get purchases error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST /api/purchases - Create a new purchase (checkout)
export async function POST(request: NextRequest) {
  try {
    const userPayload = getUserFromRequest(request)
    if (!userPayload) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    await connectDB()

    // Get user's cart
    const cart = await Cart.findOne({ userId: userPayload.userId }).populate("products.productId")

    if (!cart || cart.products.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 })
    }

    // Filter out products that no longer exist
    const validProducts = cart.products.filter((item: any) => item.productId)

    if (validProducts.length === 0) {
      return NextResponse.json({ error: "No valid products in cart" }, { status: 400 })
    }

    // Calculate total amount and prepare purchase items
    let totalAmount = 0
    const purchaseItems = validProducts.map((item: any) => {
      const itemTotal = item.productId.price * item.quantity
      totalAmount += itemTotal

      return {
        productId: item.productId._id,
        title: item.productId.title,
        price: item.productId.price,
        quantity: item.quantity,
      }
    })

    // Create purchase record
    const purchase = await Purchase.create({
      userId: userPayload.userId,
      products: purchaseItems,
      totalAmount,
    })

    // Clear user's cart
    await Cart.findOneAndUpdate({ userId: userPayload.userId }, { $set: { products: [] } })

    // Populate the purchase for response
    const populatedPurchase = await Purchase.findById(purchase._id).populate({
      path: "products.productId",
      populate: {
        path: "userId",
        select: "username",
      },
    })

    return NextResponse.json(
      {
        message: "Purchase completed successfully",
        purchase: populatedPurchase,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Create purchase error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
