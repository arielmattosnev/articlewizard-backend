import mongoose, { Schema, model } from "mongoose";

import { PostModel } from "../interfaces";

const PostSchema = new Schema<PostModel>(
  {
    title: String,
    content: String,
    image: String,
    summary: String,
    author: {type: Schema.Types.ObjectId, ref: "User", required: true},
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model("Post", PostSchema);

export default Post;
