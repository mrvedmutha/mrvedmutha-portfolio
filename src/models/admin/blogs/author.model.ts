import mongoose from "mongoose";
import { AuthorSchema } from "@/schemas/admin/blogs/author.schema";

export const Author =
  mongoose.models.Author || mongoose.model("Author", AuthorSchema);
