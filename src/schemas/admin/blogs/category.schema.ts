import { Schema } from "mongoose";
import { Category } from "@/types/admin/blogs/blog.types";

export const CategorySchema = new Schema<Category>({
  id: { type: Number, required: true, unique: true }, // custom id
  name: { type: String, required: true },
  description: { type: String },
  parentId: { type: Number, default: null }, // parent category id
});
