import { Pagination } from "@mui/material";
import styled from "styled-components";

export const StyledPostsContainer = styled("div")(() => ({
  width: '100%',
  position: "relative",
  padding: '0 1rem'
}));

export const StyledPosts = styled("div")(() => ({
  display: "flex",
  width: "100%",
  flexWrap: "wrap",
  gap: "1rem",
}));

export const StyledPostsNavigation = styled(Pagination)(() => ({
  marginTop: "2rem",
}));
