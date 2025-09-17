import mongoose, { Schema, Document } from "mongoose";

export interface IContactMessageDoc extends Document {
  name: string;
  email: string;
  phone: string;
  interestedIn: string;
  budgetRange: string;
  currency: "USD" | "INR";
  country: string;
  message: string;
  createdAt: Date;
}

const ContactMessageSchema = new Schema<IContactMessageDoc>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  interestedIn: { type: String, required: true },
  budgetRange: { type: String, required: true },
  currency: { type: String, enum: ["USD", "INR"], required: true },
  country: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default ContactMessageSchema;
