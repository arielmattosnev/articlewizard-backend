import { Request, Response } from "express";

import jwt, { JwtPayload } from "jsonwebtoken";

import Post from "../models/Post";

import fs from "fs";

import { FilterQuery } from "mongoose";

import { PostModel } from "../interfaces";

import { StatusCodes } from "http-status-codes";

export const CreatePost = async (req: Request | any, res: Response) => {
  const { originalname, path } = req.file;
  const parts = originalname.split(".");
  const ext = parts[parts.length - 1];

  const newPath = `${path}.${ext}`;

  fs.renameSync(path, newPath);

  const { title, summary, content } = req.body;

  const { token } = req.cookies;
  const secret = "ahshhdjdjdjd";

  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;

    if (info === undefined) throw new Error();

    const authorId: string = (info as JwtPayload).id;

    await Post.create({
      title,
      summary,
      content,
      image: newPath,
      author: authorId,
    });

    res.json(info);
  });
};

export const GetPosts = async (_: Request, res: Response) => {
  const posts = await Post.find()
    .populate("author")
    .sort({ createdAt: -1 })
    .limit(20);

  res.json(posts);
};

export const GetPostsById = async (req: Request, res: Response) => {
  const { id }: FilterQuery<PostModel> = req.params;

  const postDoc = await Post.findById(id).populate("author", ["username"]);

  res.json(postDoc);
};

export const updatePostById = async (req: Request, res: Response) => {
  let newPath = "";
  if (req.file) {
    const { originalname, path } = req.file;
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];

    newPath = `${path}.${ext}`;

    fs.renameSync(path, newPath);
  }

  const { id, title, summary, content } = req.body;

  const { token } = req.cookies;
  const secret = "ahshhdjdjdjd";

  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;

    if (info === undefined) throw new Error();

    const postDoc = await Post.findById(id);
    if (postDoc === null) throw new Error();

    const authorId: string = (info as JwtPayload).id;
    const isAuthor = postDoc.author.toString() === authorId;

    if (!isAuthor)
      res.status(StatusCodes.BAD_REQUEST).json("Você não é o autor do post");

    await postDoc.updateOne({
      title,
      summary,
      content,
      image: newPath ? newPath : postDoc.image,
    });

    res.json(info);
  });
};
