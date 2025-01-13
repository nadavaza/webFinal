import { Card } from "@mui/material";
import styled from "styled-components";

export const StyledNavBar = styled(Card)(() => ({
  position: "static",
  height: "4rem",
  marginBottom: "2rem",
  display: "flex",
  alignItems: "center",
  gap: "1rem",
}));

export const StyledProfile = styled("div")(() => ({
  display: "flex",
  gap: "1rem",
  alignItems: "center",
  ":hover": {
    cursor: "pointer",
  },
}));
