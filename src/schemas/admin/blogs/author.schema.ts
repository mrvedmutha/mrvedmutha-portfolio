import { Schema } from "mongoose";

export const AuthorSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  avatarUrl: { type: String },
});
