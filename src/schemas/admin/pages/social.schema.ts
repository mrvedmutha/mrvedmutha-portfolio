import { Schema } from "mongoose";
import type { ISocial } from "@/types/admin/pages/social.types";

export const socialSchema = new Schema<ISocial>(
  {
    name: { type: String, required: true },
    network: { type: String, required: true },
    url: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);
