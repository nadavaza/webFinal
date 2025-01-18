import React from "react";
import {
  StyledComment,
  StyledCommentContentContainer,
  StyledCommentContentTypography,
  StyledCommentOwner,
} from "./comment.styles";
import { IComment } from "../../types/comments.types";
import { Avatar, Paper, Typography } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";

export const Comment: React.FC<{ comment: IComment; isNew?: boolean }> = ({ comment, isNew }) => {
  return (
    <StyledComment>
      <StyledCommentOwner>
        <Avatar>{comment?.owner?.photo ? "" : <PersonIcon />}</Avatar>
        <Typography variant="h5" color="primary">
          {comment?.owner?.userName}
        </Typography>
      </StyledCommentOwner>
      <StyledCommentContentContainer>
        <StyledCommentContentTypography color="primary">{comment?.content}</StyledCommentContentTypography>
      </StyledCommentContentContainer>
    </StyledComment>
  );
};
