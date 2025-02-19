import React from "react";
import { IComment } from "./../../types/comments.types";
import { StyledPostCommentsContainer } from "./commentsContainer.styles";
import { Comment } from "../comment/Comment";

export const CommentsContainer: React.FC<{
  comments?: IComment[];
  addComment: (commentContent: string) => {};
}> = ({ comments, addComment }) => {
  return (
    <>
      <StyledPostCommentsContainer>
        <Comment isNew addComment={addComment} />
        {comments?.map((comment, index) => (
          <Comment comment={comment} key={index} />
        ))}
      </StyledPostCommentsContainer>
    </>
  );
};
