import React from "react";
import {
  StyledActions,
  StyledPostCard,
  StyledPostCardActions,
  StyledPostComments,
  StyledPostContent,
  StyledPostDate,
  StyledPostLikes,
  StyledPostOwner,
} from "./post.styles";
import { Avatar, CardContent, Chip, Typography } from "@mui/material";
import { IPost } from "../../types/posts.types";
import CommentIcon from "@mui/icons-material/Comment";
import { useNavigate } from "react-router";
import PersonIcon from "@mui/icons-material/Person";
import { formatPostDate } from "../../utils/dateUtils";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";

export const Post: React.FC<{
  post: IPost;
}> = ({ post }) => {
  const navigate = useNavigate();

  const goToPost = () => {
    navigate(`/post/${post._id}`);
  };

  return (
    <StyledPostCard elevation={10} onClick={goToPost}>
      {/* <CardMedia></CardMedia> */}
      <CardContent>
        <StyledPostContent variant="h5" color="primary">
          {post?.title}
        </StyledPostContent>
        <StyledPostContent variant="h6" color="secondary">
          {post?.content}
        </StyledPostContent>
      </CardContent>
      <StyledPostCardActions>
        <StyledPostOwner>
          <Avatar>{post?.owner?.photo ? "" : <PersonIcon />}</Avatar>
          <Chip label={post?.owner?.userName} />
        </StyledPostOwner>

        <StyledActions>
          <StyledPostDate variant="body2" color="secondary">
            {formatPostDate(post?.date)}
          </StyledPostDate>
          <StyledPostComments>
            <Typography variant="h6" color="secondary">
              {post?.comments?.length}
            </Typography>
            <CommentIcon color="secondary" />
          </StyledPostComments>
          <StyledPostLikes>
            <Typography variant="h6" color="secondary">
              {post?.likes?.length}
            </Typography>
            <ThumbUpIcon color="secondary" />
          </StyledPostLikes>
        </StyledActions>
      </StyledPostCardActions>
    </StyledPostCard>
  );
};
