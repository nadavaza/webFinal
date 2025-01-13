import { IPost } from "../types/posts.types";
import { IUser } from "../types/users.types";
import { apiClient } from "./api-client";
import { getTokens } from "./token-service";

class PostsService {
  async getPosts() {
    try {
      return (await apiClient.get<IPost[]>("/posts", { headers: { Authorization: `JWT ${getTokens().accessToken}` } }))
        .data;
    } catch (error: any) {
      throw error;
    }
  }
  async getPostsByOwner(owner: string) {
    try {
      return (
        await apiClient.get<IPost[]>("/posts", {
          headers: { Authorization: `JWT ${getTokens().accessToken}` },
          params: { owner },
        })
      ).data;
    } catch (error: any) {
      throw error;
    }
  }
}

export default new PostsService();
