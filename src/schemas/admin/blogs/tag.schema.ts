import { Schema } from "mongoose";

export const TagSchema = new Schema({
  id: { type: Number, required: true }, // custom id
  name: { type: String, required: true },
  slug: { type: String, required: true },
});
