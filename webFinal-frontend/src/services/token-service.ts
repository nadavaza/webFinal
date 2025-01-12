import Cookies from "js-cookie";

export const setTokens = (accessToken: string, refreshToken: string) => {
  Cookies.set("accessToken", accessToken, { expires: 7 });
  Cookies.set("refreshToken", refreshToken, { expires: 7 });
};

export const getTokens = () => {
  return {
    accessToken: Cookies.get("accessToken") || "",
    refreshToken: Cookies.get("refreshToken") || "",
  };
};

export const removeTokens = () => {
  Cookies.remove("accessToken");
  Cookies.remove("refreshToken");
};
