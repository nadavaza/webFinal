import { Avatar, Paper } from "@mui/material";
import styled from "styled-components";
import PersonIcon from "@mui/icons-material/Person";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";

export const StyledLogin = styled("div")(() => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
}));

export const StyledLoginLogo = styled("img")(() => ({
  width: "5rem",
  height: "5rem",
  margin: "2rem",
}));

export const StyledLoginCard = styled(Paper)(() => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
  padding: "2rem",
}));

export const StyledProfileIcon = styled(PersonIcon)(() => ({
  height: "5rem !important",
  width: "5rem !important",
}));

export const StyledProfileImg = styled(Avatar)(() => ({
  height: "5rem !important",
  width: "5rem !important",
}));

export const StyledProfileIconContainer = styled("div")(() => ({
  width: "100%",
  display: "flex",
  justifyContent: "center",
  position: "relative",
}));

export const StyledProfileActions = styled("div")(() => ({
  position: "absolute",
  bottom: "0",
  right: "1rem",
}));

export const StyledProfileEdit = styled(EditIcon)(() => ({
  cursor: "pointer",
}));

export const StyledProfileClose = styled(CloseIcon)(() => ({
  cursor: "pointer",
}));
