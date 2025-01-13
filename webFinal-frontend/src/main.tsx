import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router";
import { routes } from "./router";
import { createTheme, ThemeProvider } from "@mui/material";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { NavBar } from "./components/navBar/NavBar";

const theme = createTheme({
  palette: {
    primary: { main: "#c1121f" },
    secondary: { main: "#003049" },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <GoogleOAuthProvider clientId="asds">
        <BrowserRouter>
          <NavBar />
          <Routes>
            {routes.map((currRoute, index) => (
              <Route
                path={currRoute.path}
                Component={currRoute.component}
                key={index}
              />
            ))}
          </Routes>
        </BrowserRouter>
      </GoogleOAuthProvider>
    </ThemeProvider>
  </StrictMode>
);
