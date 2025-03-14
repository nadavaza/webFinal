import { apiClient } from "./api-client";
import { getTokens } from "./token-service";

class FilesService {
  async uploadFile(file: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append("file", file);
      return (
        await apiClient.post(`files?file=${file.name}`, formData, {
          headers: {
            Authorization: `JWT ${getTokens().accessToken}`,
            "Content-Type": `${file.type}`,
          },
        })
      ).data.url;
    } catch (error: any) {
      throw error;
    }
  }
}

export default new FilesService();
