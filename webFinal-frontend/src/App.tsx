import "./App.css";
import { Navigate, Route, Routes, useNavigate } from "react-router";
import { routes } from "./router";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { NavBar } from "./components/navBar/NavBar";
import { Loader } from "./components/loader/Loader";
import { useLoaderStore } from "./store/loaderStore";
import { useEffect } from "react";
import { setTokens } from "./services/token-service";
import usersService from "./services/users-service";
import { useUserStore } from "./store/userStore";

const theme = createTheme({
  palette: {
    primary: { main: "#cb1337" },
    secondary: { main: "#2657b8" },
    background: { default: "#ffffff", paper: "#ffffff" },
  },
  typography: { fontFamily: "fantasy" },
});

function App() {
  const navigate = useNavigate();
  const { setUser } = useUserStore();
  const { isLoading } = useLoaderStore();

  useEffect(() => {
    const refreshUser = async (): Promise<void> => {
      try {
        const refreshedUser = await usersService.refresh();
        if (refreshedUser) {
          setTokens(refreshedUser?.accessToken ?? "");
          setUser(refreshedUser);
          navigate("/home");
        }
      } catch (error: any) {
        setTokens("");
        navigate("/login");
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
        </GoogleOAuthProvider>
      </ThemeProvider>
    </>
  );
}

export default App;
