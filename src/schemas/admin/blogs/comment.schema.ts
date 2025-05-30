import { Schema } from "mongoose";

const CommentUserSchema = new Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    avatarUrl: { type: String },
  },
  { _id: false }
);

export const CommentSchema = new Schema({
  user: { type: CommentUserSchema, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
