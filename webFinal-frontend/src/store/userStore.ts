import { create } from "zustand";
import { IUser } from "../types/users.types";

interface IUserState {
  user: IUser;
  setUser: (user: IUser) => void;
}

const useStore = create<IUserState>((set) => ({
  user: {
    _id: "",
    userName: "",
  },
  setUser: (userToSet: IUser) => set({ user: userToSet }),
}));
