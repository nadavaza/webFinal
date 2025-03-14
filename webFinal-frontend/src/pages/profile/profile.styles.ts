import { Avatar, IconButton, Paper, Stack } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import styled from "styled-components";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";

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

export const StyledProfileImgContainer = styled("div")(() => ({
  position: "relative",
  height: "8rem",
}));

export const StyledProfileActions = styled("div")(() => ({
  position: "absolute",
  bottom: "0",
  right: "-2rem",
}));

export const StyledProfileImg = styled(Avatar)(() => ({
  height: "8rem !important",
  width: "8rem !important",
}));

export const StyledProfileEdit = styled(EditIcon)(() => ({
  cursor: "pointer",
}));

export const StyledProfileClose = styled(CloseIcon)(() => ({
  cursor: "pointer",
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
