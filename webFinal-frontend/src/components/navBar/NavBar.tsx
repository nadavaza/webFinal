import React from "react";
import { Avatar, Button, IconButton, Toolbar, Typography } from "@mui/material";
import { LOGIN_TEXTS } from "../../consts/loginConsts";
import { useNavigate, useLocation } from "react-router";
import HomeIcon from "@mui/icons-material/Home";
import { StyledNavBar, StyledProfile } from "./navBar.styles";
import { toast } from "react-toastify";
import { getTokens, setTokens } from "../../services/token-service";
import usersService from "../../services/users-service";
import { HOME_TEXTS } from "../../consts/homeConsts";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";

export const NavBar: React.FC<{}> = ({}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const logOut = async () => {
    try {
      const refreshToken = getTokens().refreshToken;
      await usersService.logout(refreshToken);
      setTokens("", "");
      navigate("/login");
    } catch (error: any) {
      toast(error.response.data, { position: "bottom-left", type: "error" });
    }
  };

  const goToHome = () => {
    navigate("/home");
  };

  const goToProfile = () => {
    navigate("/profile");
  };

  if (location.pathname === "/login") {
    return (
      <>
        <StyledNavBar elevation={3}>
          <Toolbar>
            <Typography color="primary" variant="h5">
              {LOGIN_TEXTS.LOGIN}
            </Typography>
          </Toolbar>
        </StyledNavBar>
      </>
    );
  }

  return (
    <StyledNavBar elevation={3}>
      <IconButton size="large" onClick={goToHome}>
        <HomeIcon />
      </IconButton>
      <StyledProfile onClick={goToProfile}>
        <Avatar>
          <PersonIcon />
        </Avatar>
        <div>{HOME_TEXTS.MY_PORFILE}</div>
      </StyledProfile>
      <Button onClick={logOut}>
        {HOME_TEXTS.LOG_OUT} <LogoutIcon />
      </Button>
    </StyledNavBar>
  );
};
