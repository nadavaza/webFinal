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
      setIsloading: (loadingStatus: boolean) => {
        if (!loadingStatus) {
          setTimeout(function () {
            set({ isLoading: loadingStatus });
          }, 500);
        } else {
          set({ isLoading: loadingStatus });
        }
      },
    }),
    { name: "loaderStore" }
  )
);
