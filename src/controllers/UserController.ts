import { Request, Response } from "express";

import { StatusCodes } from "http-status-codes";

import bcrypt from "bcrypt";

import User from "../models/User";

import jwt from "jsonwebtoken";

export const UserRegistration = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  try {
    const userDoc = await User.create({
      username,
      password: hashedPassword,
    });
    res.status(StatusCodes.CREATED).json(userDoc);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
};

export const UserLogin = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const userDoc = await User.findOne({ username });

  if (userDoc === null) throw new Error("User is possible null");
  const checkingPassword = bcrypt.compareSync(password, userDoc.password);

  if (!checkingPassword)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Wrong password");

  const secret = "ahshhdjdjdjd";

  jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
    if (err) throw err;

    res.cookie("token", token).json({
      id: userDoc._id,
      username,
    });
  });
};

export const UserCheckProfile = (req: Request, res: Response) => {
  const { token } = req.cookies;

  const secret = "ahshhdjdjdjd";

  jwt.verify(token, secret, {}, (err, info) => {
    if (err) throw err;

    res.json(info);
  });
};

export const UserLogout = (_: Request, res: Response) => {
  res.cookie("token", "").json("ok");
};
