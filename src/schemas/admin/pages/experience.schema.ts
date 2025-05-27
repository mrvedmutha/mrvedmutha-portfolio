import mongoose, { Schema } from "mongoose";

const ExperienceSchema = new Schema(
  {
    jobTitle: { type: String, required: true },
    companyName: { type: String, required: true },
    fromDate: { type: String, required: true },
    toDate: { type: String },
    currentlyWorking: { type: Boolean, required: true },
    tags: { type: [String], default: [] },
    aboutCompany: { type: String },
    responsibilities: { type: String },
  },
  { timestamps: true }
);

export default ExperienceSchema;
