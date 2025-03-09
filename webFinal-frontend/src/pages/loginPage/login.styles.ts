import { Card, Paper } from "@mui/material";
import styled from "styled-components";

export const StyledLogin = styled("div")(() => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
  marginTop: "4rem",
}));

export const StyledLoginLogo = styled("img")(() => ({
  width: "5rem",
  height: "5rem",
  margin: "2rem",
}));

export const StyledLoginCard = styled(Paper)(() => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
  padding: "2rem",
}));
