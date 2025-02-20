import {
  StyledProfile,
  StyledProfileCard,
  StyledProfileIcon,
  StyledProfileImg,
} from "./profile.styles";
import { useUserStore } from "../../store/userStore";
import { PROFILE_TEXTS } from "../../consts/profileConsts";
import { useEffect, useMemo, useState } from "react";
import { IPost } from "../../types/posts.types";
import postsService from "../../services/posts-service";
import { PostsContainer } from "../../components/postsContainer/PostsContainer";
import { toast, ToastContainer } from "react-toastify";
import { IUser } from "../../types/users.types";
import { Controller, useForm } from "react-hook-form";
import { Button, Stack, TextField, Typography } from "@mui/material";
import usersService from "../../services/users-service";
import { useLoaderStore } from "../../store/loaderStore";

export const Profile: React.FC<{}> = ({}) => {
  const { user, setUser } = useUserStore();
  const [userPosts, setUserPosts] = useState<IPost[]>([]);
  const { setIsloading } = useLoaderStore();

  const { control, handleSubmit } = useForm<IUser>({
    defaultValues: {
      userName: user.userName,
      email: user.email,
      password: "password",
    },
  });

  const fields = useMemo(() => {
    return Object.keys(control._defaultValues).map((field) => {
      return (
        <Controller
          key={field}
          name={field}
          control={control}
          render={({ field }) => (
            <TextField
              required
              disabled={field.name === "password" || field.name === "email"}
              {...field}
              label={field.name}
              variant="outlined"
              type={field.name === "password" ? "password" : "text"}
            />
          )}
        />
      );
    });
  }, []);

  useEffect(() => {
    const fetchUserPosts = async () => {
      const fetchedUserPosts = await postsService.getPostsByOwner(user._id);
      setUserPosts(fetchedUserPosts);
    };
    fetchUserPosts();
  }, []);

  const onSubmit = handleSubmit(async (editedUserFields: IUser) => {
    try {
      setIsloading(true);
      const editedUser = await usersService.edituser(editedUserFields);
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
            <Stack gap={4}>
              {fields}
              <Button type="submit" variant="contained">
                {PROFILE_TEXTS.EDIT_PROFILE}
              </Button>
            </Stack>
          </form>
        </StyledProfileCard>
        <div>
          <Typography variant="h2" color="primary">
            {PROFILE_TEXTS.MY_POSTS}
          </Typography>
          <PostsContainer posts={userPosts} />
        </div>
      </StyledProfile>
      <ToastContainer />
    </>
  );
};
