import mongoose from "mongoose";
import ExperienceSchema from "@/schemas/admin/pages/experience.schema";

export const Experience =
  mongoose.models.Experience || mongoose.model("Experience", ExperienceSchema);
