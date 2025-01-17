import { CredentialResponse } from "@react-oauth/google";
import { IUser } from "../types/users.types";
import { apiClient } from "./api-client";
import { getTokens } from "./token-service";

class UsersService {
  async login(user: IUser) {
    try {
      return (await apiClient.post<IUser>("/auth/login", user)).data;
    } catch (error: any) {
      throw error;
    }
  }
  async googleSignin(credentialResponse: CredentialResponse) {
    try {
      return (await apiClient.post<IUser>("/auth/googleSignin", credentialResponse)).data;
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
  async refresh(refreshToken: string) {
    try {
      return (await apiClient.post<IUser>("/auth/refresh", { refreshToken })).data;
    } catch (error: any) {
      throw error;
    }
  }
  async edituser(editedUser: IUser) {
    try {
      return (
        await apiClient.put<IUser>("/auth/edit", editedUser, {
          headers: { Authorization: `JWT ${getTokens().accessToken}` },
        })
      ).data;
    } catch (error: any) {
      throw error;
    }
  }
}

export default new UsersService();
