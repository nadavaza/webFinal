import { ILoginUser, IUser } from "../types/users.types";
import { apiClient } from "./api-client";

class UsersService {
  async login(user: IUser) {
    try {
      return (await apiClient.post<ILoginUser>("/auth/login", user)).data;
    } catch (error: any) {
      throw error;
    }
  }
  async register(user: IUser) {
    try {
      return (await apiClient.post<ILoginUser>("/auth/register", user)).data;
    } catch (error: any) {
      throw error;
    }
  }
}

export default new UsersService();
