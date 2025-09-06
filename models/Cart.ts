import mongoose, { type Document, Schema } from "mongoose"

export interface ICartItem {
  productId: mongoose.Types.ObjectId
  quantity: number
}

export interface ICart extends Document {
  userId: mongoose.Types.ObjectId
  products: ICartItem[]
  updatedAt: Date
}

const CartItemSchema: Schema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, "Quantity must be at least 1"],
    default: 1,
  },
})

const CartSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  products: [CartItemSchema],
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.models.Cart || mongoose.model<ICart>("Cart", CartSchema)
