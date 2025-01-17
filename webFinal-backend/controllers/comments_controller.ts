import commentsModel, { IComments } from "../models/comments_model";
import { Request, Response } from "express";
import BaseController from "./base_controller";
import postModel from "../models/posts_model";

class commentsController extends BaseController<IComments> {
  constructor() {
    super(commentsModel);
  }
}

export default new commentsController();
