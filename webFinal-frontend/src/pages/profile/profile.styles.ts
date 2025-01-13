import { Card } from "@mui/material";
import styled from "styled-components";

export const StyledProfile = styled("div")(() => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginTop: "4rem",
}));

export const StyledProfileCard = styled(Card)(() => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
  padding: "2rem",
}));
