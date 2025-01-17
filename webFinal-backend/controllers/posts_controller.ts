import postModel, { IPost } from "../models/posts_model";
import { Request, Response } from "express";
import BaseController from "./base_controller";
// const { GoogleGenerativeAI } = require("@google/generative-ai");

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);

// const generationConfig = {
//   temperature: 1,
//   topP: 0.95,
//   topK: 40,
//   maxOutputTokens: 8192,
//   responseMimeType: "text/plain",
// };

class PostsController extends BaseController<IPost> {
  constructor() {
    super(postModel);
  }

  async create(req: Request, res: Response) {
    const userId = req.params.userId;
    const post = {
      ...req.body,
      owner: userId,
    };
    req.body = post;
    super.create(req, res);
  }

  async likePost(req: Request, res: Response) {
    const postId = req.params.id;
    const userId = req.body.userId;

    try {
      const post = await postModel.findById(postId);
      if (!post) {
        res.status(400).send("post not found");
        return;
      }

      const likeIndex = post.likes.indexOf(userId);

      if (likeIndex === -1) {
        post.likes.push(userId);
      } else {
        post.likes.splice(likeIndex, 1);
      }

      await post.save();
      res.status(200).send({
        isLiked: likeIndex === -1,
      });
    } catch (error) {
      res.status(400).send(error);
    }
  }

  // async getAiGeneratedPosts() {
  //   const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  //   const prompt = "Give me 10 posts about the NBA today in a format of an array including a title and content.";

  //   const result = await model.generateContent(prompt);

  //   return JSON.parse(result.response.text());
  // }
}

export default new PostsController();
