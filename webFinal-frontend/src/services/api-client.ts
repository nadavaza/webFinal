import axios from "axios";

export const apiClient = axios.create({
  withCredentials: true,
  baseURL: "http://localhost:3000",
});
