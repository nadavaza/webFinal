import { IUser } from "../types/users.types";
import { apiClient } from "./api-client";

class UsersService {
  async login(user: IUser) {
    try {
      return (await apiClient.post<IUser>("/auth/login", user)).data;
    } catch (error: any) {
      throw error;
    }
  }
  async register(user: IUser) {
    try {
      return (await apiClient.post<IUser>("/auth/register", user)).data;
    } catch (error: any) {
      throw error;
    }
  }
  async logout(refreshToken: string) {
    try {
      return (await apiClient.post("/auth/logout", { refreshToken })).data;
    } catch (error: any) {
      throw error;
    }
  }
}

export default new UsersService();
