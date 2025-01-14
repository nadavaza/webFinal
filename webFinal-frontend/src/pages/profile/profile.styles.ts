import { Avatar, Card } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import styled from "styled-components";

export const StyledProfile = styled("div")(() => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
  marginTop: "4rem",
  gap: "2rem",
}));

export const StyledProfileCard = styled(Card)(() => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
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
  height: "90%",
  width: "90%",
  display: "flex",
  gap: "1rem",
  flexWrap: "wrap",
  marginBottom: "2rem",
}));
