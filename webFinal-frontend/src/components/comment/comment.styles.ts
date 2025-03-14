import { Paper, TextField, Typography } from "@mui/material";
import styled from "styled-components";

export const StyledComment = styled("div")(() => ({
  display: "flex",
  gap: "1rem",
  alignItems: "center",
}));

export const StyledCommentOwner = styled("div")(() => ({
  display: "flex",
  alignItems: "center",
  gap: "1rem",
  flexDirection: "column",
  width: "8rem",
}));

export const StyledCommentContentTypography = styled(Typography)(() => ({
  width: "80%",
  wordBreak: "break-word",
  padding: "1rem",
}));

export const StyledCommentContentContainer = styled(Paper)(() => ({
  width: "80%",
  minHeight: "8rem",
  padding: "1rem",
}));

export const StyledCommentContentTextField = styled(TextField)(() => ({
  width: "100%",
}));
