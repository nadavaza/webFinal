import { Typography } from "@mui/material";
import styled from "styled-components";

export const StyledPostPage = styled("div")(() => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginTop: "2rem",
  height: "100%",
}));

export const StyledPost = styled("div")(() => ({
  width: "90%",
  textAlign: "left",
  position: "relative",
}));

export const StyledPostContent = styled("div")(() => ({
  width: "100%",
  display: "flex",
  flexWrap: "wrap",
  gap: "1rem",
}));

export const StyledPostContentTypography = styled(Typography)(() => ({
  width: "100%",
  wordWrap: "break-word",
}));

export const StyledPostOwner = styled("div")(() => ({
  display: "flex",
  alignItems: "center",
  gap: "1rem",
}));

export const StyledPostPhoto = styled("img")(() => ({
  width: "15rem",
  height: "15rem",
  borderRadius: "10%",
}));

export const StyledPostDetails = styled("div")(() => ({
  display: "flex",
  alignItems: "center",
  gap: "1rem",
  marginTop: "2rem",
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

export const StyledPostActions = styled("div")(() => ({
  position: "absolute",
  right: "0",
}));
