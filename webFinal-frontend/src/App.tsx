import "./App.css";
import { Navigate, Route, Routes, useNavigate } from "react-router";
import { routes } from "./router";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
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
    primary: { main: "#cb1337" },
    secondary: { main: "#2657b8" },
    background: { default: "#f6f6f6", paper: "#ffffff" },
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
        toast(error.response.data, { position: "bottom-center", type: "error", delay: 500, theme: "colored" });
      }
    };
    refreshUser();
  }, []);

  return (
    <>
      <ThemeProvider theme={theme}>
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
          <Loader isLoading={isLoading} />
          <CssBaseline />
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
