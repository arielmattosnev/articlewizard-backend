import mongoose from "mongoose";

import { UserModel } from "../interfaces";

const userSchema = new mongoose.Schema<UserModel>({
  username: { type: "string", required: true, minlength: 4, unique: true },
  password: { type: "string", required: true },
});

const User = mongoose.model("User", userSchema);

export default User;
