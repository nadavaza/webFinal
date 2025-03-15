import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";
import { IPost } from "../../types/posts.types";
import postsService from "../../services/posts-service";
import {
  StyledPost,
  StyledPostActions,
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
import commentsService from "../../services/comments-service";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";

export const PostPage: React.FC<{}> = () => {
  const { postId } = useParams();
  const { user } = useUserStore();
  const navigate = useNavigate();
  const { setIsloading } = useLoaderStore();
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [post, setPost] = useState<IPost>();
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const isPostLiked = useMemo<boolean>(() => {
    return post?.likes?.find((like) => like?._id === user?._id) !== undefined;
  }, [post]);

  const isUsersPost = useMemo<boolean>(() => {
    return user._id === post?.owner._id;
  }, [post]);

  useEffect(() => {
    const fetchPost = async (): Promise<void> => {
      const fetchedPost = await postsService.getPostById(postId!!);
      setPost(fetchedPost);
    };

    fetchPost();
  }, [postId]);

  const deletePost = () => {
    setShowConfirm(true);
  };

  const confirmDelete = async (): Promise<void> => {
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

  const likePost = async (): Promise<void> => {
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

  const addComment = async (commentContent: string): Promise<boolean> => {
    try {
      setIsloading(true);
      const newComment = await commentsService.addComment({
        content: commentContent,
        owner: user._id,
        postId: post?._id,
      });
      setPost({ ...(post as IPost), comments: [newComment, ...(post?.comments ?? [])] });
      setIsloading(false);
      return true;
    } catch (error: any) {
      toast(error.response.data, {
        position: "bottom-center",
        type: "error",
        delay: 500,
        theme: "colored",
      });
      setIsloading(false);
      return false;
    }
  };

  return (
    <>
      <StyledPostPage>
        <StyledPost>
          <StyledPostActions>
            {isUsersPost && (
              <>
                {!isEdit ? (
                  <>
                    <IconButton onClick={() => setIsEdit(true)}>
                      <EditIcon color="primary" />
                    </IconButton>
                    <IconButton onClick={deletePost}>
                      <DeleteIcon color="primary" />
                    </IconButton>
                  </>
                ) : (
                  <>
                    <IconButton>
                      <SaveIcon color="primary" />
                    </IconButton>
                    <IconButton onClick={() => setIsEdit(false)}>
                      <CloseIcon color="primary" />
                    </IconButton>
                  </>
                )}
              </>
            )}
          </StyledPostActions>
          <StyledPostOwner>
            <Avatar>
              {post?.owner?.photo ? (
                <img src={post?.owner?.photo} alt="Preview" width={"100%"} height={"100%"} />
              ) : (
                <PersonIcon />
              )}
            </Avatar>
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
        <CommentsContainer comments={post?.comments} addComment={addComment} />
      </StyledPostPage>
      <ConfirmToast
        toastText={POST_TEXTS.CONFIRM_DELETE}
        theme="snow"
        asModal
        customFunction={confirmDelete}
        setShowConfirmToast={setShowConfirm}
        showConfirmToast={showConfirm}
      />
      <ToastContainer
        autoClose={3000} // Closes after 3 seconds
        closeOnClick // Enables click-to-close
        pauseOnHover={false} // Prevents staying open on hover
      />
    </>
  );
};
