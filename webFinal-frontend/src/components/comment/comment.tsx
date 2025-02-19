import React from "react";
import {
  StyledComment,
  StyledCommentContentContainer,
  StyledCommentContentTextField,
  StyledCommentContentTypography,
  StyledCommentOwner,
} from "./comment.styles";
import { IComment } from "../../types/comments.types";
import { Avatar, Fab, Typography } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import SendIcon from "@mui/icons-material/Send";
import { formatDate } from "../../utils/dateUtils";
import { Controller, useForm } from "react-hook-form";

export const Comment: React.FC<{
  comment?: IComment;
  isNew?: boolean;
  addComment?: (commentContent: string) => {};
}> = ({ comment, isNew, addComment }) => {
  const { handleSubmit, control } = useForm({
    defaultValues: {
      content: "",
    },
  });

  const onSubmit = (data: { content: string }) => {
    if (addComment) {
      addComment(data.content);
    }
  };

  return (
    <StyledComment>
      <StyledCommentOwner>
        <Avatar>{comment?.owner?.photo ? "" : <PersonIcon />}</Avatar>
        <Typography variant="h5" color="primary">
          {comment?.owner?.userName}
        </Typography>
      </StyledCommentOwner>
      <>
        <StyledCommentContentContainer>
          {isNew ? (
            <Controller
              name="content"
              control={control}
              rules={{ required: "Comment cannot be empty" }}
              render={({ field }) => <StyledCommentContentTextField {...field} multiline required rows={5} />}
            />
          ) : (
            <StyledCommentContentTypography color="primary">{comment?.content}</StyledCommentContentTypography>
          )}
        </StyledCommentContentContainer>
        <Typography variant="body1" color="secondary">
          {formatDate(comment?.date)}
        </Typography>
      </>
      {isNew && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Fab type="submit" size="small" color="primary">
            <SendIcon />
          </Fab>
        </form>
      )}
    </StyledComment>
  );
};
