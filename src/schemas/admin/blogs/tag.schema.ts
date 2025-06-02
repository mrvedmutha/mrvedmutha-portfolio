import { Schema } from "mongoose";

export const TagSchema = new Schema({
  id: { type: Number, required: true, unique: true }, // custom id
  name: { type: String, required: true },
});
