import mongoose from "mongoose";

export const connectDB = async () => {
  const dbUrl = process.env.DB_URL || "";

  if (dbUrl === "") throw new Error("Something is wrong with your database");

  console.log("Database connected");

  return await mongoose.connect(dbUrl);
};
