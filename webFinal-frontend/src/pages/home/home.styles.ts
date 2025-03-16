import styled from "styled-components";

export const StyledHome = styled("div")(() => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginTop: "3rem",
  flexWrap: "wrap",
  height: "100%",
}));

export const StyledHomeHeader = styled("div")(() => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
}));

export const StyledAiLogo = styled("img")(() => ({
  height: "2rem",
  width: "2rem",
  marginLeft: "1rem",
  borderRadius: "10%",
}));
