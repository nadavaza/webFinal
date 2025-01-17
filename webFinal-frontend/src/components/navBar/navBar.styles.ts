import { Card, Paper } from "@mui/material";
import styled from "styled-components";

export const StyledNavBar = styled(Card)(({ theme }) => ({
  position: "relative",
  height: "4rem",
  display: "flex",
  alignItems: "center",
  width: "100%",
  backgroundColor: "#FDF0D5 !important",
}));

export const StyledProfile = styled("div")(() => ({
  display: "flex",
  gap: "1rem",
  alignItems: "center",
  ":hover": {
    cursor: "pointer",
  },
  position: "absolute",
  right: "0",
}));

export const StyledLogo = styled("img")(() => ({
  height: "2rem",
  width: "2rem",
  cursor: "pointer",
  aspectRatio: "auto",
}));
