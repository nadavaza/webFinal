export interface IUser {
  _id: string;
  userName: string;
  email: string;
  password?: string;
  photo?: string;
  accessToken?: string;
}

export interface ILoginUser {
  userName: string;
  email: string;
  password?: string;
  photo?: File | null;
}

export interface IProfileUser {
  userName: string;
  photo?: File | null | string;
}
