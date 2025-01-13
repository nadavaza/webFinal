import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { routes } from "./router";
import { createTheme, ThemeProvider } from "@mui/material";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { NavBar } from "./components/navBar/NavBar";

const theme = createTheme({
  palette: {
    primary: { main: "#c1121f" },
    secondary: { main: "#2196f3" },
  },
});

function App() {
  return (
    <>
      <ThemeProvider theme={theme}>
        <GoogleOAuthProvider clientId="asds">
          <BrowserRouter>
            <NavBar />
            <Routes>
              <Route path="/" element={<Navigate to="/login" />} />
              {routes.map((currRoute, index) => (
                <Route path={currRoute.path} Component={currRoute.component} key={index} />
              ))}
            </Routes>
          </BrowserRouter>
        </GoogleOAuthProvider>
      </ThemeProvider>
    </>
  );
}

export default App;
