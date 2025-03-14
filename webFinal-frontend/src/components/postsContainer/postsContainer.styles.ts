import { Pagination } from "@mui/material";
import styled from "styled-components";

export const StyledPostsContainer = styled("div")(() => ({
  width: "90%",
  position: "relative",
}));

export const StyledPosts = styled("div")(() => ({
  display: "flex",
  width: "100%",
  flexWrap: "wrap",
  gap: "3rem",
}));

export const StyledPostsNavigation = styled(Pagination)(() => ({
  marginTop: "2rem",
}));
