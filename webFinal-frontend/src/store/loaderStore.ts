import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface ILoaderState {
  isLoading: boolean;
  setIsloading: (loadingStatus: boolean) => void;
}

export const useLoaderStore = create<ILoaderState>()(
  devtools(
    (set) => ({
      isLoading: false,
      setIsloading: (loadingStatus: boolean) => set({ isLoading: loadingStatus }),
    }),
    { name: "loaderStore" }
  )
);
