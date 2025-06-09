import mongoose from "mongoose";
import SectionsSchema, {
  ISectionsDoc,
} from "@/schemas/admin/pages/sections.schema";

const Sections =
  mongoose.models.Sections ||
  mongoose.model<ISectionsDoc>("Sections", SectionsSchema);

export default Sections;
