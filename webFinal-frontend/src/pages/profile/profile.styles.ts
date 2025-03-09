import { Avatar, Card, IconButton, Paper, Stack } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import styled from "styled-components";

export const StyledProfile = styled("div")(() => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  marginTop: "4rem",
  gap: "2rem",
}));

export const StyledProfileCard = styled(Paper)(() => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  padding: "2rem",
  position: "relative",
}));

export const StyledCloseEdit = styled(IconButton)(() => ({
  position: "absolute !important",
  top: "0.5rem",
  right: "0.5rem",
}));

export const StyledProfileStack = styled(Stack)(() => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
}));

export const StyledProfileImg = styled(Avatar)(() => ({
  height: "8rem !important",
  width: "8rem !important",
}));

export const StyledProfileIcon = styled(PersonIcon)(() => ({
  height: "8rem !important",
  width: "8rem !important",
}));

export const StyledProfileHeader = styled("div")(() => ({}));

export const StyledPostsContainer = styled("div")(() => ({
  width: "100%",
  display: "flex",
  flexDirection: "column",
}));
