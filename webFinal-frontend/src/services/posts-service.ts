import { IPost } from "../types/posts.types";
import { apiClient } from "./api-client";
import { getTokens } from "./token-service";

class PostsService {
  async getPosts(): Promise<IPost[]> {
    try {
      return (
        await apiClient.get<IPost[]>("/posts", {
          headers: { Authorization: `JWT ${getTokens().accessToken}` },
        })
      ).data;
    } catch (error: any) {
      throw error;
    }
  }
  async getPostsByOwner(owner: string): Promise<IPost[]> {
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
  async getPostById(postId: string): Promise<IPost> {
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
  async addPost(newPost: IPost, userId: string): Promise<IPost> {
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
  async updatePost(updatePost: IPost): Promise<IPost> {
    try {
      return (
        await apiClient.post<IPost>("/posts", updatePost, {
          headers: { Authorization: `JWT ${getTokens().accessToken}` },
          params: { id: updatePost._id },
        })
      ).data;
    } catch (error: any) {
      throw error;
    }
  }
  async deletePost(postId: string): Promise<IPost> {
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
  async likePost(postId: string, userId: string): Promise<any> {
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
