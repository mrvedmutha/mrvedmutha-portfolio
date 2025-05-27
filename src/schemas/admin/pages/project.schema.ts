import mongoose, { Schema } from "mongoose";

const ProjectSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, enum: ["code", "graphic"], required: true },
    githubLink: { type: String },
    behanceLink: { type: String },
    demoLink: { type: String },
    techstack: [
      {
        name: { type: String, required: true },
        svg: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

export default ProjectSchema;
