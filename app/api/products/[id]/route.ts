import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Product from "@/models/Product"
import { getUserFromRequest } from "@/lib/auth"
import { z } from "zod"

const updateProductSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be less than 100 characters").optional(),
  description: z
    .string()
    .min(1, "Description is required")
    .max(1000, "Description must be less than 1000 characters")
    .optional(),
  category: z.enum(["Electronics", "Clothing", "Books", "Home & Garden", "Sports", "Toys", "Other"]).optional(),
  price: z.number().min(0, "Price must be positive").optional(),
  imageUrl: z.string().optional(),
})

// GET /api/products/[id] - Get a single product
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const product = await Product.findById(params.id).populate("userId", "username")
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({ product })
  } catch (error) {
    console.error("Get product error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PUT /api/products/[id] - Update a product
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userPayload = getUserFromRequest(request)
    if (!userPayload) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    await connectDB()

    const product = await Product.findById(params.id)
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Check if user owns the product
    if (product.userId.toString() !== userPayload.userId) {
      return NextResponse.json({ error: "Not authorized to update this product" }, { status: 403 })
    }

    const body = await request.json()
    const updateData = updateProductSchema.parse(body)

    const updatedProduct = await Product.findByIdAndUpdate(params.id, updateData, {
      new: true,
      runValidators: true,
    }).populate("userId", "username")

    return NextResponse.json({ product: updatedProduct })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }

    console.error("Update product error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE /api/products/[id] - Delete a product
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userPayload = getUserFromRequest(request)
    if (!userPayload) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    await connectDB()

    const product = await Product.findById(params.id)
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Check if user owns the product
    if (product.userId.toString() !== userPayload.userId) {
      return NextResponse.json({ error: "Not authorized to delete this product" }, { status: 403 })
    }

    await Product.findByIdAndDelete(params.id)

    return NextResponse.json({ message: "Product deleted successfully" })
  } catch (error) {
    console.error("Delete product error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
