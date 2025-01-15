import "./App.css";
import { Navigate, Route, Routes, useNavigate } from "react-router";
import { routes } from "./router";
import { createTheme, ThemeProvider } from "@mui/material";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { NavBar } from "./components/navBar/NavBar";
import { Loader } from "./components/loader/Loader";
import { useLoaderStore } from "./store/loaderStore";
import { useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { getTokens, setTokens } from "./services/token-service";
import usersService from "./services/users-service";
import { useUserStore } from "./store/userStore";

const theme = createTheme({
  palette: {
    primary: { main: "#c1121f" },
    secondary: { main: "#2196f3" },
  },
});

function App() {
  const navigate = useNavigate();
  const { setUser } = useUserStore();
  const { isLoading } = useLoaderStore();

  useEffect(() => {
    const refreshUser = async () => {
      try {
        if (getTokens().refreshToken) {
          const refreshedUser = await usersService.refresh(getTokens().refreshToken);
          if (refreshedUser) {
            setTokens(refreshedUser.accessToken!!, refreshedUser.refreshToken!!);
            setUser(refreshedUser);
            navigate("/home");
          }
        }
      } catch (error: any) {
        // setTokens("", "");
        // navigate("/login");
        toast(error.response.data, { position: "bottom-left", type: "error" });
      }
    };
    refreshUser();
  }, []);

  return (
    <>
      <ThemeProvider theme={theme}>
        <GoogleOAuthProvider clientId="asds">
          <Loader isLoading={isLoading} />
          <NavBar />
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            {routes.map((currRoute, index) => (
              <Route path={currRoute.path} Component={currRoute.component} key={index} />
            ))}
          </Routes>
          <ToastContainer />
        </GoogleOAuthProvider>
      </ThemeProvider>
    </>
  );
}

export default App;
