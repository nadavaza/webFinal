import styled from "styled-components";

export const StyledHome = styled("div")(() => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "1rem",
  height: "100%",
}));

export const StyledLogo = styled("img")(() => ({
  height: "5rem",
  width: "5rem",
}));
