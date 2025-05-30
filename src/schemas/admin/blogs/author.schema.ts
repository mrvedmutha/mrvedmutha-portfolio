import { Schema, Types } from "mongoose";

export const AuthorSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  avatarUrl: { type: String },
});
