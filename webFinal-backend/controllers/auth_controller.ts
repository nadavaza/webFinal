import { NextFunction, Request, Response } from "express";
import userModel, { IUser } from "../models/users_model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

type Payload = {
  _id: string;
};

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateAccessToken = (userId: string): string => {
  if (!process.env.TOKEN_SECRET) throw new Error("TOKEN_SECRET is missing");

  const random = Math.random().toString();
  return jwt.sign(
    {
      _id: userId,
      random: random,
    },
    process.env.TOKEN_SECRET,
    { expiresIn: process.env.TOKEN_EXPIRES }
  );
};

const generateRefreshToken = (userId: string): string => {
  if (!process.env.TOKEN_SECRET) throw new Error("TOKEN_SECRET is missing");

  const random = Math.random().toString();

  return jwt.sign(
    {
      _id: userId,
      random: random,
    },
    process.env.TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRES }
  );
};

const register = async (req: Request, res: Response) => {
  const existingUser = await userModel.findOne({ email: req.body.email });
  if (existingUser) {
    res.status(400).send("User already exists");
    return;
  }

  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = await userModel.create({
      email: req.body.email,
      userName: req.body.userName,
      password: hashedPassword,
      photo: req.body.photo,
    });

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    if (!accessToken || !refreshToken) {
      res.status(500).send("Server Error");
      return;
    }

    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      _id: user._id,
      email: user.email,
      userName: user.userName,
      photo: user.photo,
      accessToken: accessToken,
    });
  } catch (err) {
    res.status(400).send(err);
  }
};

const login = async (req: Request, res: Response) => {
  const user = await userModel.findOne({ email: req.body.email });
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    res.status(400).send("wrong email or password");
    return;
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);
  if (!accessToken || !refreshToken) {
    res.status(500).send("Server Error");
    return;
  }

  user.refreshToken = refreshToken;
  await user.save();

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true, // Ensures that JavaScript cannot access this cookie
    secure: process.env.NODE_ENV === "production", // Only send over HTTPS in production
    sameSite: "strict", // Ensures the cookie is sent in a first-party context
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.status(200).json({
    _id: user._id,
    email: user.email,
    userName: user.userName,
    photo: user.photo,
    accessToken: accessToken,
  });
};

const googleSignin = async (req: Request, res: Response) => {
  const { credential } = req.body;

  if (!credential) {
    res.status(400).send("Missing credential in request body");
    return;
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      res.status(400).send("Invalid or missing token payload");
      return;
    }

    const email = payload.email;
    let user = await userModel.findOne({ email });

    if (!user) {
      user = await userModel.create({
        email,
        userName: payload.name,
        photo: payload.picture,
        password: "",
      });
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    if (!accessToken || !refreshToken) {
      res.status(500).send("Server Error");
      return;
    }

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true, // Ensures that JavaScript cannot access this cookie
      secure: process.env.NODE_ENV === "production", // Only send over HTTPS in production
      sameSite: "strict", // Ensures the cookie is sent in a first-party context
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).send({
      _id: user._id,
      email: user.email,
      userName: user.userName,
      photo: user.photo,
      accessToken: accessToken,
    });
  } catch (error) {
    res.status(400).send("Error verifying Google credential");
  }
};

const logout = async (req: Request, res: Response) => {
  res.clearCookie("refreshToken", { httpOnly: true, secure: true, sameSite: "strict" });
  res.status(200).send("success");
};

const editUser = async (req: Request, res: Response) => {
  const existingUser = await userModel.findOne({ email: req.body.email });
  if (!existingUser) {
    res.status(400).send("user not found");
    return;
  }

  existingUser.userName = req.body.userName;
  existingUser.photo = req.body.photo;
  await existingUser.save();

  res.status(200).send({
    _id: existingUser._id,
    email: existingUser.email,
    userName: existingUser.userName,
    photo: existingUser.photo,
  });
};

const refresh = async (req: Request, res: Response) => {
  try {
    console.log(req.cookies);

    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      res.status(400).send("fail");
      return;
    }

    if (!process.env.TOKEN_SECRET) {
      res.status(500).send("Server Error");
      return;
    }

    const payload = jwt.verify(refreshToken, process.env.TOKEN_SECRET) as { _id: string };
    const newAccessToken = generateAccessToken(payload._id);
    const user = await userModel.findById(payload._id);

    if (!user) {
      res.status(400).send("fail");
      return;
    }

    res.status(200).send({
      _id: user._id,
      email: user.email,
      userName: user.userName,
      photo: user.photo,
      accessToken: newAccessToken,
    });
  } catch (err) {
    res.status(400).send("fail");
  }
};

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).send("Access Denied");
    return;
  }
  /* istanbul ignore next */
  if (!process.env.TOKEN_SECRET) {
    res.status(500).send("Server Error");
    return;
  }

  jwt.verify(token, process.env.TOKEN_SECRET, (err, payload) => {
    if (err) {
      res.status(401).send("Access Denied");
      return;
    }
    req.params.userId = (payload as Payload)._id;
    next();
  });
};

export default {
  register,
  login,
  refresh,
  logout,
  editUser,
  googleSignin,
};
