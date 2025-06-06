import { Schema, Types } from "mongoose";
import { CategorySchema } from "@/schemas/admin/blogs/category.schema";
import { TagSchema } from "@/schemas/admin/blogs/tag.schema";
import { Blog } from "@/types/admin/blogs/blog.types";
import { AuthorSchema } from "@/schemas/admin/blogs/author.schema";

export const BlogSchema = new Schema<Blog>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: Schema.Types.Mixed, required: true }, // string or object (TipTap JSON)
    status: { type: String, required: true },
    author: { type: Types.ObjectId, ref: "Author" },
    allowComments: { type: Boolean, default: true },
    comments: [{ type: Types.ObjectId, ref: "Comment" }],
    categories: [{ type: CategorySchema }],
    tags: [{ type: TagSchema }],
    mainImage: { type: String, required: false },
    scheduledAt: { type: Date, required: false },
  },
  { timestamps: true }
);
