import { IComment } from "./comments.types";
import { IUser } from "./users.types";

export interface IPost {
  _id: string;
  title: string;
  content?: string;
  owner: IUser;
  photo?: string;
  date: string;
  comments: IComment[];
  likes: IUser[];
  isAi: boolean;
}

export interface INewPost {
  title: string;
  content?: string;
  photo?: File;
}
