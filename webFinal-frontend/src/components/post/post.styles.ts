import { Card, CardActions, Typography } from "@mui/material";
import styled from "styled-components";

export const StyledPost = styled("div")(() => ({
  width: "30%",
  display: "flex",
  alignItems: "center",
}));

export const StyledPostCard = styled(Card)(() => ({
  height: "10rem",
  textAlign: "left",
}));

export const StyledPostCardActions = styled(CardActions)(() => ({
  display: "flex",
  justifyContent: "space-between",
}));

export const StyledPostContent = styled(Typography)(() => ({
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  width: "100%",
}));

export const StyledPostOwner = styled("div")(() => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: ".2rem",
}));

export const StyledActions = styled("div")(() => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: ".2rem",
}));

export const StyledPostDate = styled(Typography)(() => ({
  padding: "1rem",
}));

export const StyledPostComments = styled("div")(() => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}));

export const StyledPostLikes = styled("div")(() => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}));

export const StyledPostPhoto = styled("img")(() => ({
  width: "8rem",
  height: "8rem",
  borderRadius: "10%",
}));
