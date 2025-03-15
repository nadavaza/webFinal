import Cookies from "js-cookie";

export const setTokens = (accessToken: string) => {
  Cookies.set("accessToken", accessToken, { expires: 7 });
};

export const getTokens = () => {
  return {
    accessToken: Cookies.get("accessToken") || "",
  };
};

export const removeTokens = () => {
  Cookies.remove("accessToken");
};
