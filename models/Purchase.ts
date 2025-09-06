import mongoose, { type Document, Schema } from "mongoose"

export interface IPurchaseItem {
  productId: mongoose.Types.ObjectId
  title: string
  price: number
  quantity: number
}

export interface IPurchase extends Document {
  userId: mongoose.Types.ObjectId
  products: IPurchaseItem[]
  totalAmount: number
  createdAt: Date
}

const PurchaseItemSchema: Schema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
})

const PurchaseSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  products: [PurchaseItemSchema],
  totalAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.models.Purchase || mongoose.model<IPurchase>("Purchase", PurchaseSchema)
