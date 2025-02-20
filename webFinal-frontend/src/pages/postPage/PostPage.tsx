import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";
import { IPost } from "../../types/posts.types";
import postsService from "../../services/posts-service";
import {
  StyledDeletePost,
  StyledPost,
  StyledPostComments,
  StyledPostContent,
  StyledPostContentTypography,
  StyledPostDetails,
  StyledPostLikes,
  StyledPostOwner,
  StyledPostPage,
  StyledPostPhoto,
} from "./postPage.styles";
import { toast, ToastContainer } from "react-toastify";
import { ConfirmToast } from "react-confirm-toast";
import { POST_TEXTS } from "../../consts/postConsts";
import { useNavigate } from "react-router";
import { useLoaderStore } from "../../store/loaderStore";
import { Avatar, IconButton, Typography } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { formatDate } from "../../utils/dateUtils";
import CommentIcon from "@mui/icons-material/Comment";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import { useUserStore } from "../../store/userStore";
import DeleteIcon from "@mui/icons-material/Delete";
import { CommentsContainer } from "../../components/commentsContainer/CommentsContainer";
import noImage from "../../assets/noImage.jpg";

export const PostPage: React.FC<{}> = () => {
  const { postId } = useParams();
  const { user } = useUserStore();
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [post, setPost] = useState<IPost>();
  const { setIsloading } = useLoaderStore();

  const isPostLiked = useMemo<boolean>(() => {
    return post?.likes?.find((like) => like?._id === user?._id) !== undefined;
  }, [post]);

  const isUsersPost = useMemo<boolean>(() => {
    return user._id === post?.owner._id;
  }, [post]);

  useEffect(() => {
    const fetchPost = async () => {
      const fetchedPost = await postsService.getPostById(postId!!);
      setPost(fetchedPost);
    };

    fetchPost();
  }, [postId]);

  const deletePost = () => {
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      setIsloading(true);
      await postsService.deletePost(postId!!);
      toast(POST_TEXTS.POST_DELETED, {
        position: "bottom-center",
        type: "success",
        delay: 500,
        theme: "colored",
      });
      setTimeout(function () {
        navigate("/home");
      }, 1000);
    } catch (error: any) {
      toast(error.response.data, {
        position: "bottom-center",
        type: "error",
        delay: 500,
        theme: "colored",
      });
    }
    setIsloading(false);
  };

  const likePost = async () => {
    try {
      const { isLiked } = await postsService.likePost(postId!!, user._id);
      if (post) {
        const updatedLikes = isLiked ? [...post.likes, user] : post.likes.filter((like) => like._id !== user._id);
        setPost({ ...post, likes: updatedLikes });
      }
    } catch (error: any) {
      toast(error.response.data, {
        position: "bottom-center",
        type: "error",
        delay: 500,
        theme: "colored",
      });
    }
  };

  // const addComment = async (commentContent: string) => {
  //   console.log(commentContent);
  // };

  return (
    <>
      <StyledPostPage>
        <StyledPost>
          <div>
            {isUsersPost && (
              <StyledDeletePost onClick={deletePost}>
                <DeleteIcon color="primary" />
              </StyledDeletePost>
            )}
          </div>
          <StyledPostOwner>
            <Avatar>{post?.owner?.photo ? "" : <PersonIcon />}</Avatar>
            <Typography variant="h5" color="primary">
              {post?.owner?.userName}
            </Typography>
          </StyledPostOwner>
          <StyledPostContent>
            <Typography variant="h2" color="primary">
              {post?.title}
            </Typography>
            <StyledPostContentTypography variant="h5" color="secondary">
              {post?.content}
            </StyledPostContentTypography>
            <StyledPostPhoto src={post?.photo || noImage} alt="" />
          </StyledPostContent>
          <StyledPostDetails>
            <Typography variant="body1" color="primary">
              {formatDate(post?.date)}
            </Typography>
            <StyledPostComments>
              <Typography variant="body1" color="secondary">
                {post?.comments?.length}
              </Typography>
              <CommentIcon color="secondary" />
            </StyledPostComments>
            <StyledPostLikes>
              <Typography variant="body1" color={isPostLiked ? "success" : "primary"}>
                {post?.likes?.length}
              </Typography>
              <IconButton onClick={likePost}>
                <ThumbUpIcon color={isPostLiked ? "success" : "primary"} />
              </IconButton>
            </StyledPostLikes>
          </StyledPostDetails>
        </StyledPost>
        <CommentsContainer comments={post?.comments} />
      </StyledPostPage>

      <ConfirmToast
        toastText={POST_TEXTS.CONFIRM_DELETE}
        theme="snow"
        asModal
        customFunction={confirmDelete}
        setShowConfirmToast={setShowConfirm}
        showConfirmToast={showConfirm}
      />
      <ToastContainer />
    </>
  );
};
