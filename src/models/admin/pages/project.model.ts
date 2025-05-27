import mongoose from "mongoose";
import ProjectSchema from "@/schemas/admin/pages/project.schema";

export const Project =
  mongoose.models.Project || mongoose.model("Project", ProjectSchema);
