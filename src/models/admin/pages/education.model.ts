import mongoose from "mongoose";
import EducationSchema, {
  IEducationDoc,
} from "@/schemas/admin/pages/education.schema";

const Education =
  mongoose.models.Education ||
  mongoose.model<IEducationDoc>("Education", EducationSchema);

export default Education;
