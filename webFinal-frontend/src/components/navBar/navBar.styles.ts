import { Button, Card } from "@mui/material";
import styled from "styled-components";

export const StyledNavBar = styled(Card)(() => ({
  position: "relative",
  height: "4rem",
  marginBottom: "2rem",
  display: "flex",
  alignItems: "center",
  width: "100%",
}));

export const StyledProfile = styled("div")(() => ({
  display: "flex",
  gap: "1rem",
  alignItems: "center",
  ":hover": {
    cursor: "pointer",
  },
  margin: "0 auto",
}));

export const StyledLogo = styled("img")(() => ({
  height: "2rem",
  width: "2rem",
  cursor: "pointer",
  aspectRatio: "auto",
}));
