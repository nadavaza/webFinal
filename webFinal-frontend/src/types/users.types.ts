export interface IUser {
  _id: string;
  userName: string;
  email: string;
  password?: string;
  photo?: string;
  refreshToken?: string;
  accessToken?: string;
}
