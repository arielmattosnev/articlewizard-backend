import express, { Request, Response } from "express";

import cors from "cors";

import dotenv from "dotenv";

import { connectDB } from "./db/connectionDB";

import cookieParser from "cookie-parser";

import { PostController, UserController } from "./controllers";

import multer from "multer";

const uploadMiddleware = multer({ dest: "./uploads/" });

import path from "path";

dotenv.config();

const app = express();
const port = process.env.PORT || 3030;

const uploadsPath = path.join(__dirname, "../uploads");

app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(uploadsPath));

connectDB();

app.post("/register", UserController.UserRegistration);

app.post("/login", UserController.UserLogin);

app.get("/profile", UserController.UserCheckProfile);

app.post("/logout", UserController.UserLogout);

app.post("/post", uploadMiddleware.single("file"), PostController.CreatePost);

app.get("/post", PostController.GetPosts);

app.put("/post",uploadMiddleware.single("file"),PostController.updatePostById);

app.get("/post/:id", PostController.GetPostsById);

app.listen(port, () => {
  console.log(`Server rodando na porta ${port}`);
});
