import mongoose, { type Document, Schema } from "mongoose"

export interface IProduct extends Document {
  title: string
  description: string
  category: string
  price: number
  imageUrl: string
  userId: mongoose.Types.ObjectId
  createdAt: Date
}

const ProductSchema: Schema = new Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
    maxlength: [100, "Title must be less than 100 characters"],
  },
  description: {
    type: String,
    required: [true, "Description is required"],
    trim: true,
    maxlength: [1000, "Description must be less than 1000 characters"],
  },
  category: {
    type: String,
    required: [true, "Category is required"],
    enum: ["Electronics", "Clothing", "Books", "Home & Garden", "Sports", "Toys", "Other"],
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
    min: [0, "Price must be positive"],
  },
  imageUrl: {
    type: String,
    default: "/diverse-products-still-life.png",
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema)
