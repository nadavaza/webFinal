import { AppBar } from "@mui/material";
import styled from "styled-components";

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

export const StyledAppBar = styled(AppBar)(() => ({
  backgroundColor: "white !important",
  zIndex: "10",
  borderBottom: "1px solid gray",
}));
