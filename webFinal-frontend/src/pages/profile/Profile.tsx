import {
  StyledCloseEdit,
  StyledPostsContainer,
  StyledProfile,
  StyledProfileCard,
  StyledProfileIcon,
  StyledProfileImg,
  StyledProfileStack,
} from "./profile.styles";
import { useUserStore } from "../../store/userStore";
import { PROFILE_TEXTS } from "../../consts/profileConsts";
import { useEffect, useState } from "react";
import { IPost } from "../../types/posts.types";
import postsService from "../../services/posts-service";
import { PostsContainer } from "../../components/postsContainer/PostsContainer";
import { toast, ToastContainer } from "react-toastify";
import { IUser } from "../../types/users.types";
import { Controller, useForm } from "react-hook-form";
import { Button, IconButton, TextField, Typography } from "@mui/material";
import usersService from "../../services/users-service";
import { useLoaderStore } from "../../store/loaderStore";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import ImageUploading from "react-images-uploading";

export const Profile: React.FC<{}> = ({}) => {
  const { user, setUser } = useUserStore();
  const [userPosts, setUserPosts] = useState<IPost[]>([]);
  const { setIsloading } = useLoaderStore();
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const { control, handleSubmit } = useForm<IUser>({
    defaultValues: {
      photo: user.photo,
      userName: user.userName,
    },
  });

  useEffect(() => {
    const fetchUserPosts = async (): Promise<void> => {
      const fetchedUserPosts = await postsService.getPostsByOwner(user._id);
      setUserPosts(fetchedUserPosts);
    };
    fetchUserPosts();
  }, []);

  const onSubmit = handleSubmit(
    async (editedUserFields: IUser): Promise<void> => {
      try {
        setIsloading(true);
        const editedUser = await usersService.edituser({
          ...editedUserFields,
          email: user.email,
          password: "",
        });
        setUser({ ...user, userName: editedUser.userName });
        toast(PROFILE_TEXTS.PROFILE_EDIT_SUCCESS, {
          position: "bottom-center",
          type: "success",
          delay: 500,
          theme: "colored",
        });
      } catch (error: any) {
        toast(error.response.data, {
          position: "bottom-center",
          type: "error",
          delay: 500,
          theme: "colored",
        });
      }
      setIsEdit(false);
      setIsloading(false);
    }
  );

  return (
    <>
      <StyledProfile>
        <Typography variant="h2" color="primary">
          {PROFILE_TEXTS.MY_PROFILE}
        </Typography>
        <StyledProfileCard>
          {isEdit && (
            <StyledCloseEdit color="primary" onClick={() => setIsEdit(false)}>
              <CloseIcon />
            </StyledCloseEdit>
          )}
          <form onSubmit={onSubmit}>
            <StyledProfileStack gap={1}>
              {/* <Controller
                name="photo"
                control={control}
                render={({ field }) => (

                )}
              /> */}

              <StyledProfileImg>
                <StyledProfileIcon />
              </StyledProfileImg>
              {isEdit && (
                <Button>
                  {PROFILE_TEXTS.EDIT_PROFILE_IMG}
                  <EditIcon />
                </Button>
              )}
              <Controller
                name="userName"
                control={control}
                render={({ field }) => (
                  <TextField
                    required
                    {...field}
                    label={field.name}
                    variant="outlined"
                    disabled={!isEdit}
                  />
                )}
              />
              {isEdit && (
                <Button type="submit" variant="contained">
                  {PROFILE_TEXTS.SAVE_PROFILE}
                  <SaveIcon />
                </Button>
              )}
            </StyledProfileStack>
          </form>
          {!isEdit && (
            <Button onClick={() => setIsEdit(true)}>
              {PROFILE_TEXTS.EDIT_PROFILE} <EditIcon />
            </Button>
          )}
        </StyledProfileCard>
        <StyledPostsContainer>
          <Typography variant="h2" color="secondary">
            {PROFILE_TEXTS.MY_POSTS}
          </Typography>
          <PostsContainer posts={userPosts} />
        </StyledPostsContainer>
      </StyledProfile>
      <ToastContainer />
    </>
  );
};
