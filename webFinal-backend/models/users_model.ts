import mongoose from "mongoose";

export interface IUser {
  userName: string;
  email: string;
  password: string;
  _id?: string;
  photo: string;
}

const userSchema = new mongoose.Schema<IUser>({
  userName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
  },
});

const userModel = mongoose.model<IUser>("Users", userSchema);

export default userModel;
