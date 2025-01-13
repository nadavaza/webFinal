import { IComment } from "./comments.types";
import { IUser } from "./users.types";

export interface IPost {
  title: string;
  content: string;
  owner: IUser;
  photo: string;
  _id: string;
  comments: IComment[];
}
