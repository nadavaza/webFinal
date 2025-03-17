import React, { useEffect, useMemo, useRef, useState } from "react";
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
import { Avatar, Button, IconButton, Stack, TextField, Typography } from "@mui/material";
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
import { Controller, useForm } from "react-hook-form";
import { StyledImgPreview } from "../../components/addNewPost/addNewPost.styles";
import { ADD_NEW_POST_TEXTS } from "../../consts/homeConsts";
import { StyledCloseEdit } from "../profile/profile.styles";

export const PostPage: React.FC<{}> = () => {
  const { postId } = useParams();
  const { user } = useUserStore();
  const navigate = useNavigate();
  const { setIsloading } = useLoaderStore();
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [post, setPost] = useState<IPost>();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const { handleSubmit, control, setValue } = useForm({
    defaultValues: {
      title: post?.title,
      content: post?.content,
      photo: post?.photo || null,
    },
  });

  const isPostLiked = useMemo<boolean>(() => {
    return post?.likes?.find((like) => like?._id === user?._id) !== undefined;
  }, [post]);

  const isUsersPost = useMemo<boolean>(() => {
    return user._id === post?.owner?._id;
  }, [post]);

  useEffect(() => {
    const fetchPost = async (): Promise<void> => {
      const fetchedPost = await postsService.getPostById(postId!!);
      setPost(fetchedPost);
      setValue("title", fetchedPost?.title);
      setValue("content", fetchedPost?.content);
      setValue("photo", fetchedPost?.photo as any);
    };

    fetchPost();
  }, [postId]);

  const deletePost = () => {
    setShowConfirm(true);
  };

  const handleDeleteImage = () => {
    setPreview(null);
    setValue("photo", null as any);
  };

  const handleClose = (): void => {
    setIsEdit(false);
    setPreview(null);
    setValue("title", post?.title);
    setValue("content", post?.content);
    setValue("photo", post?.photo as any);
  };

  const onSubmit = async (data: any): Promise<void> => {
    try {
      setIsloading(true);
      const updatedPost = await postsService.updatePost({ ...post, ...data });
      setPost(updatedPost);
      toast(POST_TEXTS.POST_UPDATED, {
        position: "bottom-center",
        type: "success",
        delay: 500,
        theme: "colored",
      });
      setIsEdit(false);
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

  const selectPhoto = (): void => {
    fileInput?.current?.click();
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
        const updatedLikes = isLiked
          ? [...(post?.likes as any), user]
          : post?.likes?.filter((like) => like._id !== user._id);
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
      setPost({
        ...(post as IPost),
        comments: [newComment, ...(post?.comments ?? [])],
      });
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
          <form onSubmit={handleSubmit(onSubmit)}>
            <StyledPostActions>
              {isUsersPost && (
                <>
                  {!isEdit ? (
                    <>
                      <IconButton
                        type="button"
                        onClick={(e) => {
                          e.preventDefault(), setIsEdit(true);
                        }}
                      >
                        <EditIcon color="primary" />
                      </IconButton>
                      <IconButton type="button" onClick={deletePost}>
                        <DeleteIcon color="primary" />
                      </IconButton>
                    </>
                  ) : (
                    <>
                      <IconButton
                        type="submit"
                        onClick={() => {
                          console.log("save click");
                        }}
                      >
                        <SaveIcon color="primary" />
                      </IconButton>
                      <IconButton type="button" onClick={handleClose}>
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
              {isEdit ? (
                <Stack gap={4} sx={{ marginTop: "1rem" }}>
                  <Controller
                    name="title"
                    control={control}
                    rules={{ required: ADD_NEW_POST_TEXTS.REQUIRED_TITLE }}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        label={ADD_NEW_POST_TEXTS.TITLE}
                        fullWidth
                        required
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                      />
                    )}
                  />
                  <Controller
                    name="content"
                    control={control}
                    render={({ field }) => (
                      <TextField {...field} label={ADD_NEW_POST_TEXTS.CONTENT} fullWidth multiline rows={4} />
                    )}
                  />
                  <Controller
                    name="photo"
                    control={control}
                    render={({ field }) => (
                      <input
                        style={{ display: "none" }}
                        ref={fileInput}
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const files = e.target.files;
                          if (files && files.length > 0) {
                            field.onChange(files[0]);
                            setPreview(URL.createObjectURL(files[0]));
                          }
                        }}
                        onClick={(e: any) => {
                          e.target.value = null;
                        }}
                      />
                    )}
                  />
                  <Button variant="contained" component="label" fullWidth color="secondary" onClick={selectPhoto}>
                    {ADD_NEW_POST_TEXTS.UPLOAD_IMAGE}
                  </Button>
                  {preview ? (
                    <StyledImgPreview>
                      <img src={preview} alt="Preview" width={300} height={300} />
                      <StyledCloseEdit color="primary" onClick={handleDeleteImage}>
                        <CloseIcon />
                      </StyledCloseEdit>
                    </StyledImgPreview>
                  ) : (
                    <StyledImgPreview>
                      <img src={post?.photo || noImage} alt="Preview" width={300} height={300} />
                    </StyledImgPreview>
                  )}
                </Stack>
              ) : (
                <>
                  <Typography variant="h2" color="primary">
                    {post?.title}
                  </Typography>
                  <StyledPostContentTypography variant="h5" color="secondary">
                    {post?.content}
                  </StyledPostContentTypography>
                  <StyledPostPhoto src={post?.photo || noImage} alt="" />
                </>
              )}
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
          </form>
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
