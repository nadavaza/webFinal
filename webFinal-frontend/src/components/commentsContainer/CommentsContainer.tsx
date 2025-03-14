import React from "react";
import { IComment } from "./../../types/comments.types";
import { StyledPostCommentsContainer } from "./commentsContainer.styles";
import { Comment } from "../comment/Comment";
import { Typography } from "@mui/material";
import { POST_TEXTS } from "../../consts/postConsts";
import Divider from "@mui/material/Divider";

export const CommentsContainer: React.FC<{
  comments?: IComment[];
  addComment: (commentContent: string) => {};
}> = ({ comments, addComment }) => {
  return (
    <StyledPostCommentsContainer>
      <Typography variant="h3" color="secondary">
        {POST_TEXTS.COMMENTS}
      </Typography>
      <Comment isNew addComment={addComment} />
      <Divider />
      {comments?.map((comment, index) => (
        <div key={index}>
          <Comment comment={comment} />
          <Divider />
        </div>
      ))}
    </StyledPostCommentsContainer>
  );
};
