import mongoose from "mongoose";

const { Schema, model } = mongoose;
export const experiencesSchema = new Schema(
  {
    role: { type: String, required: true },
    company: { type: String, required: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    description: { type: String, required: true },
    area: { type: String, required: true },
    username: { type: String, required: true },
    image: { type: String, required: true }, //server generated on upload, set a default here
  },
  {
    timestamps: true,
  }
);
export default model("experience", experiencesSchema);
