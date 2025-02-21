import { IUser } from "./users.types";

export interface IComment {
  _id: string;
  content: string;
  owner: IUser;
  date: string;
  postId: string;
}

export interface INewComment {
  content: string;
  owner: string;
  postId?: string;
}
