import postModel, { IPost } from "../models/posts_model";
import { Request, Response } from "express";
import BaseController from "./base_controller";

class PostsController extends BaseController<IPost> {
  constructor() {
    super(postModel);
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
}

export default new PostsController();
