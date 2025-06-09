import mongoose, { Schema, Document } from "mongoose";

export interface ISectionsDoc extends Document {
  name: string;
  currentCity: string;
  country: string;
  degree: string;
  dob: string;
  about: string;
}

const SectionsSchema = new Schema<ISectionsDoc>(
  {
    name: { type: String, required: true },
    currentCity: { type: String, required: true },
    country: { type: String, required: true },
    degree: { type: String, required: true },
    dob: { type: String, required: true },
    about: { type: String, required: true },
  },
  { timestamps: true }
);

export default SectionsSchema;
