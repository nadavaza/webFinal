import React from "react";
import {
  StyledActions,
  StyledPost,
  StyledPostCard,
  StyledPostCardActions,
  StyledPostComments,
  StyledPostContent,
  StyledPostDate,
  StyledPostLikes,
  StyledPostOwner,
  StyledPostPhoto,
} from "./post.styles";
import { Avatar, CardContent, CardMedia, Chip, Typography } from "@mui/material";
import { IPost } from "../../types/posts.types";
import CommentIcon from "@mui/icons-material/Comment";
import { useNavigate } from "react-router";
import PersonIcon from "@mui/icons-material/Person";
import { formatDate } from "../../utils/dateUtils";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import noImage from "../../assets/noImage.jpg";

export const Post: React.FC<{
  post: IPost;
}> = ({ post }) => {
  const navigate = useNavigate();

  const goToPost = () => {
    navigate(`/post/${post._id}`);
  };

  return (
    <StyledPost>
      <StyledPostPhoto src={post?.photo || noImage} />
      <StyledPostCard elevation={0} onClick={goToPost}>
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
            <Typography variant="body2" color="primary">
              {post?.owner?.userName}
            </Typography>
          </StyledPostOwner>
          <StyledActions>
            <StyledPostDate variant="body2" color="primary">
              {formatDate(post?.date)}
            </StyledPostDate>
            <StyledPostComments>
              <Typography variant="h6" color="secondary">
                {post?.comments?.length}
              </Typography>
              <CommentIcon color="secondary" />
            </StyledPostComments>
            <StyledPostLikes>
              <Typography variant="h6" color="primary">
                {post?.likes?.length}
              </Typography>
              <ThumbUpIcon color="primary" />
            </StyledPostLikes>
          </StyledActions>
        </StyledPostCardActions>
      </StyledPostCard>
    </StyledPost>
  );
};
