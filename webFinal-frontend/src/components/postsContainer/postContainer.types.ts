import { IPost } from "../../types/posts.types";

export interface IPostsContainer {
  posts: IPost[];
  isProfile?: boolean;
  onDeletePost?: (postId: string) => void;
}
