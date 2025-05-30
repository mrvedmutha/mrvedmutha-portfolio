import mongoose from "mongoose";
import { TagSchema } from "@/schemas/admin/blogs/tag.schema";

export const Tag = mongoose.models.Tag || mongoose.model("Tag", TagSchema);
