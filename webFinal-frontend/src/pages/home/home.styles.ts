import styled from "styled-components";

export const StyledHome = styled("div")(() => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  gap: "1rem",
}));

export const StyledLogo = styled("img")(() => ({
  height: "5rem",
  width: "5rem",
}));

export const StyledProfile = styled("div")(() => ({
  ":hover": {
    cursor: "pointer"
  }
}));
