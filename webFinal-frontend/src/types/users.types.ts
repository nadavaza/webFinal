export interface IUser {
  _id: string;
  userName: string;
  password?: string;
  photo: string;
  refreshToken?: string;
  accessToken?: string;
}
