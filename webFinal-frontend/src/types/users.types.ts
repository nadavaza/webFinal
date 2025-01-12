export interface IUser {
  userName: string;
  password: string;
  _id?: string;
  refreshToken?: string;
}

export interface ILoginUser {
  refreshToken: string;
  accessToken: string;
  _id: string;
}
