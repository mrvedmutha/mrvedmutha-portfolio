import { Schema } from "mongoose";

export const CategorySchema = new Schema({
  id: { type: String, required: true, unique: true }, // custom id
  name: { type: String, required: true },
  description: { type: String },
  parentId: { type: String, default: null }, // parent category id
});
