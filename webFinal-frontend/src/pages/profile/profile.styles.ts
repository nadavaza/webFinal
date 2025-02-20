import { Avatar, Card, Paper } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import styled from "styled-components";

export const StyledProfile = styled("div")(() => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginTop: "4rem",
  gap: "2rem",
  padding: " 0 3rem",
}));

export const StyledProfileCard = styled(Paper)(() => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
  gap: "1rem",
  padding: "2rem",
}));

export const StyledProfileImg = styled(Avatar)(() => ({
  height: "8rem !important",
  width: "8rem !important",
  marginRight: "1rem",
}));

export const StyledProfileIcon = styled(PersonIcon)(() => ({
  height: "8rem !important",
  width: "8rem !important",
}));

export const StyledPostsContainer = styled("div")(() => ({
  width: "100%",
  display: "flex",
  flexDirection: "column",
}));
