import {
  StyledCloseEdit,
  StyledPostsContainer,
  StyledProfile,
  StyledProfileActions,
  StyledProfileCard,
  StyledProfileClose,
  StyledProfileEdit,
  StyledProfileIcon,
  StyledProfileImg,
  StyledProfileImgContainer,
  StyledProfileStack,
} from "./profile.styles";
import { useUserStore } from "../../store/userStore";
import { PROFILE_TEXTS } from "../../consts/profileConsts";
import { useEffect, useRef, useState } from "react";
import { IPost } from "../../types/posts.types";
import postsService from "../../services/posts-service";
import { PostsContainer } from "../../components/postsContainer/PostsContainer";
import { toast, ToastContainer } from "react-toastify";
import { IProfileUser, IUser } from "../../types/users.types";
import { Controller, useForm } from "react-hook-form";
import { Button, TextField, Typography } from "@mui/material";
import usersService from "../../services/users-service";
import { useLoaderStore } from "../../store/loaderStore";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import filesService from "../../services/files-service";

export const Profile: React.FC<{}> = ({}) => {
  const { user, setUser } = useUserStore();
  const [userPosts, setUserPosts] = useState<IPost[]>([]);
  const { setIsloading } = useLoaderStore();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const { control, handleSubmit, reset, setValue } = useForm<IProfileUser>({
    defaultValues: {
      photo: user.photo || null,
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

  const selectPhoto = (): void => {
    fileInput?.current?.click();
  };

  const handleDeleteImage = () => {
    setPreview(null);
    setValue("photo", null as any);
  };

  const onSubmit = handleSubmit(async (editedUserFields: IProfileUser): Promise<void> => {
    try {
      setIsloading(true);
      let photoPath = "";
      if (editedUserFields.photo instanceof File) {
        photoPath = await filesService.uploadFile(editedUserFields.photo);
      }
      const editedUser = await usersService.edituser({
        ...editedUserFields,
        email: user.email,
        password: "",
        photo: photoPath || user.photo,
      } as IUser);
      setUser({ ...user, userName: editedUser.userName, photo: editedUser.photo });
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
  });

  const closeEdit = (): void => {
    setIsEdit(false);
    reset();
    setPreview(null);
  };

  return (
    <>
      <StyledProfile>
        <Typography variant="h2" color="primary">
          {PROFILE_TEXTS.MY_PROFILE}
        </Typography>
        <StyledProfileCard>
          {isEdit && (
            <StyledCloseEdit color="primary" onClick={closeEdit}>
              <CloseIcon />
            </StyledCloseEdit>
          )}
          <form onSubmit={onSubmit}>
            <StyledProfileStack gap={1}>
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
                    onClick={(e) => {
                      e.target.value = null;
                    }}
                  />
                )}
              />

              <StyledProfileImgContainer>
                <StyledProfileImg>
                  {preview ? (
                    <img src={preview} alt="Preview" width={"100%"} height={"100%"} />
                  ) : user.photo ? (
                    <img src={user.photo} alt="Preview" width={"100%"} height={"100%"} />
                  ) : (
                    <StyledProfileIcon />
                  )}
                </StyledProfileImg>
                {isEdit && (
                  <StyledProfileActions>
                    <StyledProfileEdit color="primary" onClick={selectPhoto} />
                    {preview && <StyledProfileClose color="primary" onClick={handleDeleteImage} />}
                  </StyledProfileActions>
                )}
              </StyledProfileImgContainer>
              <Controller
                name="userName"
                control={control}
                render={({ field }) => (
                  <TextField required {...field} label={field.name} variant="outlined" disabled={!isEdit} />
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
      <ToastContainer
        autoClose={3000} // Closes after 3 seconds
        closeOnClick // Enables click-to-close
        pauseOnHover={false} // Prevents staying open on hover
      />
      ;
    </>
  );
};
