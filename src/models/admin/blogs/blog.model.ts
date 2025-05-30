import mongoose from "mongoose";
import { BlogSchema } from "@/schemas/admin/blogs/blog.schema";

export const Blog = mongoose.models.Blog || mongoose.model("Blog", BlogSchema);
