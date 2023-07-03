import { Schema } from "mongoose";

export interface UserModel {
  username: string;
  password: string;
}

export interface PostModel {
  title: string;
  summary: string;
  content: string;
  image: string;
  author: Schema.Types.ObjectId;
}
