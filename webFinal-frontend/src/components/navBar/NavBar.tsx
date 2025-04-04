import React from "react";
import { Avatar, Button, Toolbar, Typography } from "@mui/material";
import { useNavigate, useLocation } from "react-router";
import { StyledAppBar, StyledLogo, StyledProfile } from "./navBar.styles";
import { toast } from "react-toastify";
import { setTokens } from "../../services/token-service";
import usersService from "../../services/users-service";
import { HOME_TEXTS } from "../../consts/homeConsts";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import { useUserStore } from "../../store/userStore";
import nbaLogo from "../../assets/nbaLogo.png";

export const NavBar: React.FC<{}> = ({}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUserStore();

  const logOut = async (): Promise<void> => {
    try {
      await usersService.logout();
      setTokens("");
      navigate("/login");
    } catch (error: any) {
      toast(error.response.data, { position: "bottom-center", type: "error", delay: 500, theme: "colored" });
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
        <StyledAppBar position="sticky" elevation={0}>
          <Toolbar>
            <StyledLogo src={nbaLogo} />
            <Typography color="primary" variant="h5">
              {HOME_TEXTS.TITLE}
            </Typography>
          </Toolbar>
        </StyledAppBar>
      </>
    );
  }

  return (
    <StyledAppBar position="sticky" elevation={0}>
      <Toolbar>
        <StyledLogo src={nbaLogo} onClick={goToHome} />
        <Typography color="primary" variant="h5">
          {HOME_TEXTS.TITLE}
        </Typography>
        <StyledProfile onClick={goToProfile}>
          <Avatar>
            {user.photo ? <img src={user.photo} alt="Preview" width={"100%"} height={"100%"} /> : <PersonIcon />}
          </Avatar>
          <Typography variant="h6" color="secondary">
            {user.userName}
          </Typography>
          <Button onClick={logOut}>
            {HOME_TEXTS.LOG_OUT} <LogoutIcon />
          </Button>
        </StyledProfile>
      </Toolbar>
    </StyledAppBar>
  );
};
