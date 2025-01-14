import { IconButton, Typography } from "@mui/material";
import { StyledProfile, StyledProfileCard, StyledProfileIcon, StyledProfileImg } from "./profile.styles";
import { useUserStore } from "../../store/userStore";
import EditIcon from "@mui/icons-material/Edit";
import { PROFILE_TEXTS } from "../../consts/profileConsts";
import { useEffect, useState } from "react";
import { IPost } from "../../types/posts.types";
import postsService from "../../services/posts-service";
import { PostsContainer } from "../../components/postsContainer/PostsContainer";
import { ConfirmToast } from "react-confirm-toast";
import { toast, ToastContainer } from "react-toastify";

export const Profile: React.FC<{}> = ({}) => {
  const { user } = useUserStore();
  const [userPosts, setUserPosts] = useState<IPost[]>([]);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [userPostsIdToDelete, setUserPostsIdToDelete] = useState<string>("");

  useEffect(() => {
    const fetchUserPosts = async () => {
      const fetchedUserPosts = await postsService.getPostsByOwner(user._id);
      setUserPosts(fetchedUserPosts);
    };
    fetchUserPosts();
  }, []);

  const deletePost = (postId: string) => {
    setUserPostsIdToDelete(postId);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await postsService.deletePost(userPostsIdToDelete);
      setUserPosts(userPosts.filter((post) => post._id !== userPostsIdToDelete));
    } catch (error: any) {
      toast(error.response.data, { position: "bottom-left", type: "error" });
    }
  };

  return (
    <>
      <StyledProfile>
        <StyledProfileCard>
          <StyledProfileImg>
            <StyledProfileIcon />
          </StyledProfileImg>
          <Typography variant="h4">{user.userName}</Typography>
          <IconButton>
            <EditIcon />
          </IconButton>
        </StyledProfileCard>
        <Typography variant="h2">{PROFILE_TEXTS.MY_POSTS}</Typography>
        <PostsContainer posts={userPosts} isProfile onDeletePost={deletePost} />
      </StyledProfile>
      <ConfirmToast
        toastText={PROFILE_TEXTS.CONFIRM_DELETE}
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
