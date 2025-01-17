import { Home } from "./pages/home/Home";
import { LoginPage } from "./pages/loginPage/LoginPage";
import { PostPage } from "./pages/postPage/PostPage";
import { Profile } from "./pages/profile/Profile";

export const routes = [
  {
    path: "/login",
    component: LoginPage,
  },
  {
    path: "/home",
    component: Home,
  },
  {
    path: "/profile",
    component: Profile,
  },
  {
    path: "/post/:postId",
    component: PostPage,
  },
];
