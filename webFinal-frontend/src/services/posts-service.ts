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
  async getPostById(postId: string) {
    try {
      return (
        await apiClient.get<IPost>(`/posts/${postId}`, {
          headers: { Authorization: `JWT ${getTokens().accessToken}` },
        })
      ).data;
    } catch (error: any) {
      throw error;
    }
  }
  async addPost(newPost: IPost, userId: string) {
    try {
      return (
        await apiClient.post<IPost>("/posts", newPost, {
          headers: { Authorization: `JWT ${getTokens().accessToken}` },
          params: { userId },
        })
      ).data;
    } catch (error: any) {
      throw error;
    }
  }
  async deletePost(postId: string) {
    try {
      return (
        await apiClient.delete(`/posts/${postId}`, {
          headers: { Authorization: `JWT ${getTokens().accessToken}` },
        })
      ).data;
    } catch (error: any) {
      throw error;
    }
  }
  async likePost(postId: string, userId: string) {
    try {
      return (
        await apiClient.post<any>(
          `/posts/likePost/${postId}`,
          { userId },
          {
            headers: { Authorization: `JWT ${getTokens().accessToken}` },
          }
        )
      ).data;
    } catch (error: any) {
      throw error;
    }
  }
}

export default new PostsService();
