import { IPost } from "../types/posts.types";
import { apiClient } from "./api-client";
import { getTokens } from "./token-service";

class AiService {
  async getAiPosts(): Promise<IPost[]> {
    try {
      return (
        await apiClient.get<IPost[]>("/ai", {
          headers: { Authorization: `JWT ${getTokens().accessToken}` },
        })
      ).data;
    } catch (error: any) {
      throw error;
    }
  }
}

export default new AiService();
