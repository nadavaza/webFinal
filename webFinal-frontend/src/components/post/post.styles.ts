import { Card, CardActions, Typography } from "@mui/material";
import styled from "styled-components";

export const StyledPostCard = styled(Card)(() => ({
  height: "12rem",
  width: "25rem",
  textAlign: "left",
}));

export const StyledPostCardActions = styled(CardActions)(() => ({
  marginTop: "3rem",
  display: "flex",
  justifyContent: "space-between",
  padding: "0 1rem 0 1rem !important",
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
