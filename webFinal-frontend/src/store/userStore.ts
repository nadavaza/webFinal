import { create } from "zustand";
import { IUser } from "../types/users.types";
import { devtools } from "zustand/middleware";

interface IUserState {
  user: IUser;
  setUser: (user: IUser) => void;
}

export const useUserStore = create<IUserState>()(
  devtools(
    (set) => ({
      user: { id: "", userName: "" },
      setUser: (userToSet: IUser) => set({ user: userToSet }),
    }),
    { name: "userStore" }
  )
);
