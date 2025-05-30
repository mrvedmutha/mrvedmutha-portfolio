import mongoose from "mongoose";
import { CommentSchema } from "@/schemas/admin/blogs/comment.schema";

export const Comment =
  mongoose.models.Comment || mongoose.model("Comment", CommentSchema);
