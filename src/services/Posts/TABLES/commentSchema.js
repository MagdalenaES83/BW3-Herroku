import mongoose from "mongoose";

const { Schema, model } = mongoose;

const commentSchema = new Schema(
  {
    comment: { type: String },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "profile",
    },
  },

  {
    timestamps: true,
  }
);

export default model("Comment", commentSchema);
