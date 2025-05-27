import mongoose, { Schema, Document } from "mongoose";
import { EducationType } from "@/enums/admin/pages/education.enum";

export interface IEducationDoc extends Document {
  educationName: string;
  instituteName: string;
  educationType: EducationType;
  description?: string;
  fromYear: string;
  toYear: string;
  tags: string[];
}

const EducationSchema = new Schema<IEducationDoc>({
  educationName: { type: String, required: true },
  instituteName: { type: String, required: true },
  educationType: {
    type: String,
    enum: Object.values(EducationType),
    required: true,
  },
  description: { type: String },
  fromYear: { type: String, required: true },
  toYear: { type: String, required: true },
  tags: { type: [String], default: [] },
});

export default EducationSchema;
