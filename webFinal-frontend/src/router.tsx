import { Home } from "./pages/home/home";
import { LoginPage } from "./pages/loginPage/LoginPage";

export const routes = [
  {
    path: "/login",
    component: LoginPage,
  },
  {
    path: "/home",
    component: Home,
  },
];
