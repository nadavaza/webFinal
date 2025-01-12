import React from "react";
import { StyledCard } from "./post.styles";
import { CardContent, CardMedia, Typography } from "@mui/material";
import { IPost } from "../../types/posts.types";

export const Post: React.FC<{ post: IPost }> = ({ post }) => {
  return (
    <StyledCard elevation={10}>
      <CardMedia></CardMedia>
      <CardContent>
        <Typography variant="h5" color="primary">
          {post.title}
        </Typography>
        <Typography variant="body1" color="secondary">
          {post.content}
        </Typography>
      </CardContent>
    </StyledCard>
  );
};
