import { Pagination } from "@mui/material";
import styled from "styled-components";

export const StyledPostsContainer = styled("div")(() => ({
  width: "90%",
  display: "flex",
  gap: "1rem",
  flexWrap: "wrap",
  marginBottom: "2rem",
  position: "relative",
  padding: "1rem",
  justifyContent: "center",
}));

export const StyledPostsNavigation = styled(Pagination)(() => ({
  position: "absolute",
  bottom: "-4rem",
}));
