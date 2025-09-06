import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Product from "@/models/Product"
import { getUserFromRequest } from "@/lib/auth"
import { z } from "zod"

const createProductSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be less than 100 characters"),
  description: z.string().min(1, "Description is required").max(1000, "Description must be less than 1000 characters"),
  category: z.enum(["Electronics", "Clothing", "Books", "Home & Garden", "Sports", "Toys", "Other"]),
  price: z.number().min(0, "Price must be positive"),
  imageUrl: z.string().optional(),
})

// GET /api/products - Get all products with optional search and category filter
export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || ""
    const category = searchParams.get("category") || ""
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "12")

    // Build query
    const query: any = {}

    if (search) {
      query.$or = [{ title: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }]
    }

    if (category && category !== "All") {
      query.category = category
    }

    // Get products with pagination
    const skip = (page - 1) * limit
    const products = await Product.find(query)
      .populate("userId", "username")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const total = await Product.countDocuments(query)

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Get products error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST /api/products - Create a new product
export async function POST(request: NextRequest) {
  try {
    const userPayload = getUserFromRequest(request)
    if (!userPayload) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    await connectDB()

    const body = await request.json()
    const { title, description, category, price, imageUrl } = createProductSchema.parse(body)

    const product = await Product.create({
      title,
      description,
      category,
      price,
      imageUrl: imageUrl || "/placeholder.svg?height=300&width=300",
      userId: userPayload.userId,
    })

    const populatedProduct = await Product.findById(product._id).populate("userId", "username")

    return NextResponse.json({ product: populatedProduct }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }

    console.error("Create product error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
