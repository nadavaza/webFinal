import {
  StyledPostsContainer,
  StyledProfile,
  StyledProfileCard,
  StyledProfileIcon,
  StyledProfileImg,
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
import { Button, Stack, TextField, Typography } from "@mui/material";
import usersService from "../../services/users-service";
import { useLoaderStore } from "../../store/loaderStore";
import EditIcon from "@mui/icons-material/Edit";

export const Profile: React.FC<{}> = ({}) => {
  const { user, setUser } = useUserStore();
  const [userPosts, setUserPosts] = useState<IPost[]>([]);
  const { setIsloading } = useLoaderStore();

  const { control, handleSubmit } = useForm<IUser>({
    defaultValues: {
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

  const onSubmit = handleSubmit(async (editedUserFields: IUser): Promise<void> => {
    try {
      setIsloading(true);
      const editedUser = await usersService.edituser({ ...editedUserFields, email: user.email, password: "" });
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
    setIsloading(false);
  });

  return (
    <>
      <StyledProfile>
        <StyledProfileCard>
          <StyledProfileImg>
            <StyledProfileIcon />
          </StyledProfileImg>
          <form onSubmit={onSubmit}>
            <Stack gap={1}>
              <Controller
                name="userName"
                control={control}
                render={({ field }) => <TextField required {...field} label={field.name} variant="outlined" />}
              />
              <Button type="submit" variant="contained">
                {PROFILE_TEXTS.EDIT_PROFILE}
                <EditIcon />
              </Button>
            </Stack>
          </form>
        </StyledProfileCard>
        <StyledPostsContainer>
          <Typography variant="h2" color="primary">
            {PROFILE_TEXTS.MY_POSTS}
          </Typography>
          <PostsContainer posts={userPosts} />
        </StyledPostsContainer>
      </StyledProfile>
      <ToastContainer />
    </>
  );
};
