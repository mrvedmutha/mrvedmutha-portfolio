import mongoose, { Schema } from "mongoose";

const ServiceSchema = new Schema(
  {
    name: { type: String, required: true },
    icon: {
      name: { type: String, required: true },
      lucideName: { type: String, required: true }
    },
    description: { type: String, required: true },
    tags: [{
      name: { type: String, required: true }
    }],
  },
  { timestamps: true }
);

export default ServiceSchema;