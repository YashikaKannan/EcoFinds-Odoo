import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import User from "@/models/User"
import { getUserFromRequest } from "@/lib/auth"
import { z } from "zod"

const updateProfileSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be less than 20 characters")
    .optional(),
  email: z.string().email("Invalid email address").optional(),
})

// PUT /api/auth/profile - Update user profile
export async function PUT(request: NextRequest) {
  try {
    const userPayload = getUserFromRequest(request)
    if (!userPayload) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    await connectDB()

    const body = await request.json()
    const updateData = updateProfileSchema.parse(body)

    // Check if username is already taken (if updating username)
    if (updateData.username) {
      const existingUser = await User.findOne({
        username: updateData.username,
        _id: { $ne: userPayload.userId },
      })

      if (existingUser) {
        return NextResponse.json({ error: "Username is already taken" }, { status: 400 })
      }
    }

    // Check if email is already taken (if updating email)
    if (updateData.email) {
      const existingUser = await User.findOne({
        email: updateData.email,
        _id: { $ne: userPayload.userId },
      })

      if (existingUser) {
        return NextResponse.json({ error: "Email is already taken" }, { status: 400 })
      }
    }

    const updatedUser = await User.findByIdAndUpdate(userPayload.userId, updateData, {
      new: true,
      runValidators: true,
    }).select("-passwordHash")

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id,
        email: updatedUser.email,
        username: updatedUser.username,
        createdAt: updatedUser.createdAt,
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }

    console.error("Update profile error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
