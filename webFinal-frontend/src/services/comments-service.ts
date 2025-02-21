import { IComment, INewComment } from "../types/comments.types";
import { apiClient } from "./api-client";
import { getTokens } from "./token-service";

class CommentsService {
  async addComment(comment: INewComment): Promise<IComment> {
    try {
      return (
        await apiClient.post<IComment>("/comments", comment, {
          headers: { Authorization: `JWT ${getTokens().accessToken}` },
        })
      ).data;
    } catch (error: any) {
      throw error;
    }
  }
}

export default new CommentsService();
