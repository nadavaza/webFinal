import React from "react";
import { StyledCard, StyledCardActions } from "./post.styles";
import { CardContent, Chip, Typography } from "@mui/material";
import { IPost } from "../../types/posts.types";
import CommentIcon from "@mui/icons-material/Comment";

export const Post: React.FC<{ post: IPost }> = ({ post }) => {
  return (
    <StyledCard elevation={10}>
      {/* <CardMedia></CardMedia> */}
      <CardContent>
        <Typography variant="h5" color="primary">
          {post.title}
        </Typography>
        <Typography variant="h6" color="secondary">
          {post.content}
        </Typography>
      </CardContent>
      <StyledCardActions>
        <Chip color="primary" label={post?.owner?.userName} />
        <div>
          <Typography variant="h6" color="secondary">
            {post?.comments.length}
            <CommentIcon color="secondary" />
          </Typography>
        </div>
      </StyledCardActions>
    </StyledCard>
  );
};
