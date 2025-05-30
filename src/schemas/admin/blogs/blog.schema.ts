import { Schema, Types } from "mongoose";
import { AuthorSchema } from "./author.schema";
import { CategorySchema } from "./category.schema";
import { TagSchema } from "./tag.schema";
import { CommentSchema } from "./comment.schema";

export const BlogSchema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: Schema.Types.Mixed, required: true }, // string or object (TipTap JSON)
  status: { type: String, required: true },
  author: { type: Types.ObjectId, ref: "Author", required: true },
  allowComments: { type: Boolean, default: true },
  comments: [{ type: CommentSchema }],
  categories: [
    {
      id: String,
      name: String,
      description: String,
      parentId: { type: String, default: null },
    },
  ],
  tags: [{ id: String, name: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
