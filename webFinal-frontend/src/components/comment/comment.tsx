import React from "react";
import {
  StyledComment,
  StyledCommentContentContainer,
  StyledCommentContentTextField,
  StyledCommentContentTypography,
  StyledCommentOwner,
} from "./comment.styles";
import { IComment } from "../../types/comments.types";
import { Avatar, Fab, IconButton, Typography } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import SendIcon from "@mui/icons-material/Send";
import { formatDate } from "../../utils/dateUtils";
import { Controller, useForm } from "react-hook-form";
import { POST_TEXTS } from "../../consts/postConsts";

export const Comment: React.FC<{
  comment?: IComment;
  isNew?: boolean;
  addComment?: (commentContent: string) => {};
}> = ({ comment, isNew, addComment }) => {
  const { handleSubmit, control, reset } = useForm({
    defaultValues: {
      content: "",
    },
  });

  const onSubmit = (data: { content: string }) => {
    if (addComment) {
      const isPostAdded = addComment(data.content);
      isPostAdded && reset();
    }
  };

  return (
    <StyledComment>
      <StyledCommentOwner>
        <Avatar>{comment?.owner?.photo ? "" : <PersonIcon />}</Avatar>
        <Typography variant="h5" color="primary">
          {comment?.owner?.userName}
        </Typography>
        <Typography variant="body1" color="secondary">
          {formatDate(comment?.date)}
        </Typography>
      </StyledCommentOwner>
      <>
        <StyledCommentContentContainer elevation={5}>
          {isNew ? (
            <Controller
              name="content"
              control={control}
              rules={{ required: "Comment cannot be empty" }}
              render={({ field }) => (
                <StyledCommentContentTextField
                  {...field}
                  multiline
                  required
                  rows={5}
                  placeholder={POST_TEXTS.ADD_COMMENT}
                />
              )}
            />
          ) : (
            <StyledCommentContentTypography color="primary">{comment?.content}</StyledCommentContentTypography>
          )}
        </StyledCommentContentContainer>
      </>
      {isNew && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <IconButton type="submit" size="small" color="primary">
            <SendIcon />
          </IconButton>
        </form>
      )}
    </StyledComment>
  );
};
