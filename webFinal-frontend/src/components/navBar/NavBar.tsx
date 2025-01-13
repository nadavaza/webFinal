import React from "react";
import { Avatar, Button, Typography } from "@mui/material";
import { useNavigate, useLocation } from "react-router";
import { StyledLogo, StyledNavBar, StyledProfile } from "./navBar.styles";
import { toast } from "react-toastify";
import { getTokens, setTokens } from "../../services/token-service";
import usersService from "../../services/users-service";
import { HOME_TEXTS } from "../../consts/homeConsts";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import { useStore } from "../../store/store";
import nbaLogo from "../../assets/nbaLogo.png";

export const NavBar: React.FC<{}> = ({}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useStore();

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
        <StyledNavBar elevation={5}>
          <StyledLogo src={nbaLogo} />
          <Typography color="primary" variant="h5">
            {HOME_TEXTS.TITLE}
          </Typography>
        </StyledNavBar>
      </>
    );
  }

  return (
    <StyledNavBar elevation={5}>
      <StyledLogo src={nbaLogo} onClick={goToHome} />
      <Typography color="primary" variant="h5">
        {HOME_TEXTS.TITLE}
      </Typography>
      <StyledProfile onClick={goToProfile}>
        <Avatar>
          <PersonIcon />
        </Avatar>
        <Typography variant="h6" color="secondary">
          {user.userName}
        </Typography>
      </StyledProfile>
      <Button onClick={logOut}>
        {HOME_TEXTS.LOG_OUT} <LogoutIcon />
      </Button>
    </StyledNavBar>
  );
};
