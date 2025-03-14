import { Fab, IconButton } from "@mui/material";
import styled from "styled-components";

export const StyledAddNewPost = styled("div")(() => ({
  bottom: "3rem",
  right: "3rem ",
  position: "absolute !important",
}));

export const StyledAddFab = styled(Fab)(() => ({}));

export const StyledCloseEdit = styled(IconButton)(() => ({
  width: "fit-content",
  height: "fit-content",
  right: "5rem",
  position: "absolute !important",
}));

export const StyledImgPreview = styled("div")(() => ({
  display: "flex",
  width: "100%",
  justifyContent: "center",
  position: "relative",
}));
