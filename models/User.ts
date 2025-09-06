import mongoose, { type Document, Schema } from "mongoose"

export interface IUser extends Document {
  email: string
  username: string
  passwordHash: string
  createdAt: Date
}

const UserSchema: Schema = new Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
  },
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
    trim: true,
    minlength: [3, "Username must be at least 3 characters"],
    maxlength: [20, "Username must be less than 20 characters"],
  },
  passwordHash: {
    type: String,
    required: [true, "Password is required"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema)
