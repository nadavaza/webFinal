export interface IUser {
  _id: string;
  userName: string;
  password?: string;
  refreshToken?: string;
  accessToken?: string;
}