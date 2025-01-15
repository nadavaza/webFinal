import { IPost } from "../../types/posts.types";

export interface IPostsContainer {
  posts: IPost[];
  isDeleteable?: boolean;
  onDeletePost?: (postId: string) => void;
}
