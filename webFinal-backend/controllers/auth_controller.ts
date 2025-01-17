import { NextFunction, Request, Response } from "express";
import userModel, { IUser } from "../models/users_model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Document } from "mongoose";
import { OAuth2Client } from "google-auth-library";

type tTokens = {
  accessToken: string;
  refreshToken: string;
};

type tUser = Document<unknown, {}, IUser> &
  IUser &
  Required<{
    _id: string;
  }> & {
    __v: number;
  };

type Payload = {
  _id: string;
};

const register = async (req: Request, res: Response) => {
  const existingUser = await userModel.findOne({ email: req.body.email });
  if (existingUser) {
    res.status(400).send("user already exists");
    return;
  }
  try {
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await userModel.create({
      email: req.body.email,
      userName: req.body.userName,
      password: hashedPassword,
    });
    /* istanbul ignore next */
    if (!process.env.TOKEN_SECRET) {
      res.status(500).send("Server Error");
      return;
    }

    const tokens = generateToken(user._id);
    if (!tokens) {
      res.status(500).send("Server Error");
      return;
    }
    if (!user.refreshToken) {
      user.refreshToken = [];
    }
    user.refreshToken.push(tokens.refreshToken);
    await user.save();
    res.status(200).send({
      _id: user._id,
      email: user.email,
      userName: user.userName,
      photo: user.photo,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  } catch (err) {
    res.status(400).send(err);
  }
};

const generateToken = (userId: string): tTokens | null => {
  /* istanbul ignore next */
  if (!process.env.TOKEN_SECRET) {
    return null;
  }

  const random = Math.random().toString();
  const accessToken = jwt.sign(
    {
      _id: userId,
      random: random,
    },
    process.env.TOKEN_SECRET,
    { expiresIn: process.env.TOKEN_EXPIRES }
  );

  const refreshToken = jwt.sign(
    {
      _id: userId,
      random: random,
    },
    process.env.TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRES }
  );
  return {
    accessToken: accessToken,
    refreshToken: refreshToken,
  };
};

const login = async (req: Request, res: Response) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      res.status(400).send("wrong email or password");
      return;
    }
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
      res.status(400).send("wrong email or password");
      return;
    }
    /* istanbul ignore next */
    if (!process.env.TOKEN_SECRET) {
      res.status(500).send("Server Error");
      return;
    }

    const tokens = generateToken(user._id);
    if (!tokens) {
      res.status(500).send("Server Error");
      return;
    }
    if (!user.refreshToken) {
      user.refreshToken = [];
    }
    user.refreshToken.push(tokens.refreshToken);
    await user.save();
    res.status(200).send({
      _id: user._id,
      email: user.email,
      userName: user.userName,
      photo: user.photo,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  } catch (err) {
    res.status(400).send(err);
  }
};

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleSignin = async (req: Request, res: Response) => {
  const credential = req.body.credential;

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

    const email = payload?.email;
    let user = await userModel.findOne({ email });

    if (!user) {
      user = await userModel.create({
        email,
        userName: payload?.name,
        photo: payload?.picture,
        password: "google-signin",
      });
    }

    const tokens = generateToken(user._id);
    if (!tokens) {
      res.status(500).send("Server Error");
      return;
    }
    if (!user.refreshToken) {
      user.refreshToken = [];
    }
    user.refreshToken.push(tokens.refreshToken);

    await user.save();

    res.status(200).send({
      _id: user._id,
      email: user.email,
      userName: user.userName,
      photo: user.photo,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  } catch (error) {
    res.status(400).send("Error verifying Google credential");
  }
};

/* istanbul ignore next */
const verifyRefreshToken = (refreshToken: string | undefined) => {
  return new Promise<tUser>((resolve, reject) => {
    if (!refreshToken) {
      reject("fail");
      return;
    }

    if (!process.env.TOKEN_SECRET) {
      reject("fail");
      return;
    }
    jwt.verify(refreshToken, process.env.TOKEN_SECRET, async (err: any, payload: any) => {
      if (err) {
        reject("fail");
        return;
      }

      const userId = payload._id;
      try {
        const user = await userModel.findById(userId);
        if (!user) {
          reject("fail");
          return;
        }
        if (!user.refreshToken || !user.refreshToken.includes(refreshToken)) {
          user.refreshToken = [];
          await user.save();
          reject("fail");
          return;
        }
        const tokens = user.refreshToken!.filter((token) => token !== refreshToken);
        user.refreshToken = tokens;

        resolve(user);
      } catch (err) {
        reject("fail");
        return;
      }
    });
  });
};

const logout = async (req: Request, res: Response) => {
  try {
    const user = await verifyRefreshToken(req.body.refreshToken);
    await user.save();
    res.status(200).send("success");
  } catch (err) {
    res.status(400).send("fail");
  }
};

const editUserDetails = async (req: Request, res: Response) => {
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
    const user = await verifyRefreshToken(req.body.refreshToken);
    if (!user) {
      res.status(400).send("fail");
      return;
    }
    const tokens = generateToken(user._id);

    if (!tokens) {
      res.status(500).send("Server Error");
      return;
    }
    if (!user.refreshToken) {
      user.refreshToken = [];
    }
    user.refreshToken.push(tokens.refreshToken);
    await user.save();
    res.status(200).send({
      _id: user._id,
      email: user.email,
      userName: user.userName,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  } catch (err) {
    res.status(400).send("fail");
  }
};

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.header("authorization");
  const token = authorization && authorization.split(" ")[1];

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
  editUserDetails,
  googleSignin,
};
