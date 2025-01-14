import React from "react";
import {
  StyledActions,
  StyledPostCard,
  StyledPostCardActions,
  StyledPostContent,
  StyledPostOwner,
} from "./post.styles";
import { Avatar, CardContent, Chip, IconButton, Typography } from "@mui/material";
import { IPost } from "../../types/posts.types";
import CommentIcon from "@mui/icons-material/Comment";
import { useNavigate } from "react-router";
import PersonIcon from "@mui/icons-material/Person";
import DeleteIcon from "@mui/icons-material/Delete";

export const Post: React.FC<{ post: IPost; isProfile?: boolean; onDeletePost?: (postId: string) => void }> = ({
  post,
  isProfile,
  onDeletePost,
}) => {
  const navigate = useNavigate();

  const goToPost = () => {
    navigate(`/post/${post._id}`);
  };

  const handleDeleteClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (onDeletePost) {
      onDeletePost(post._id);
    }
  };

  return (
    <StyledPostCard elevation={10} onClick={goToPost}>
      {/* <CardMedia></CardMedia> */}
      <CardContent>
        <StyledPostContent variant="h5" color="primary">
          {post.title}
        </StyledPostContent>
        <StyledPostContent variant="h6" color="secondary">
          {post.content}
        </StyledPostContent>
      </CardContent>
      <StyledPostCardActions>
        <StyledPostOwner>
          <Avatar>{post?.owner?.photo ? "" : <PersonIcon />}</Avatar>
          <Chip label={post?.owner?.userName} />
        </StyledPostOwner>

        <StyledActions>
          {isProfile && (
            <IconButton onClick={handleDeleteClick}>
              <DeleteIcon />
            </IconButton>
          )}
          <Typography variant="h6" color="secondary">
            {post?.comments?.length}
            <CommentIcon color="secondary" />
          </Typography>
        </StyledActions>
      </StyledPostCardActions>
    </StyledPostCard>
  );
};
