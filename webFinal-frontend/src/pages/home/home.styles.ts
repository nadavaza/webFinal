import styled from "styled-components";

export const StyledHome = styled("div")(() => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  flexWrap: "wrap",
  height: "100%",
}));

export const StyledLogo = styled("img")(() => ({
  height: "5rem",
  width: "5rem",
}));
