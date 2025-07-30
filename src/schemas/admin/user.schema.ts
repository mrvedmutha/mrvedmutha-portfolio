import { Schema } from "mongoose";
import type { IUser } from "@/types/models/user.types";
import { UserRole } from "@/enums/user.enum";

export const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    name: {
      type: String,
      required: false,
      default: "Admin",
      trim: true,
    },
    role: {
      type: String,
      enum: {
        values: Object.values(UserRole),
        message: "Invalid user role",
      },
      default: UserRole.ADMIN,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
