import mongoose from "mongoose";
import ServiceSchema from "@/schemas/admin/pages/service.schema";

export const Service =
  mongoose.models.Service || mongoose.model("Service", ServiceSchema);