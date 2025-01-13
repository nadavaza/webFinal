import { Card, CardActions } from "@mui/material";
import styled from "styled-components";

export const StyledCard = styled(Card)(() => ({
  height: "12rem",
  width: "25rem",
  textAlign: "left",
}));

export const StyledCardActions = styled(CardActions)(() => ({
  marginTop: "3rem",
  display: "flex",
  justifyContent: "space-between",
  padding: "0 1rem 0 1rem !important",
}));
