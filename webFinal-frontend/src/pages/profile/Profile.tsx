import { IconButton, Typography } from "@mui/material";
import { StyledProfile, StyledProfileCard, StyledProfileIcon, StyledProfileImg } from "./profile.styles";
import { useStore } from "../../store/store";
import EditIcon from "@mui/icons-material/Edit";
import { PROFILE_TEXTS } from "../../consts/profileConsts";
import { useEffect, useState } from "react";
import { IPost } from "../../types/posts.types";
import postsService from "../../services/posts-service";
import { Post } from "../../components/post/Post";

export const Profile: React.FC<{}> = ({}) => {
  const { user } = useStore();
  const [userPosts, setUserPosts] = useState<IPost[]>([]);

  useEffect(() => {
    const fetchUserPosts = async () => {
      const fetchedUserPosts = await postsService.getPostsByOwner(user._id);
      setUserPosts(fetchedUserPosts);
    };
    fetchUserPosts();
  }, []);

  return (
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
      <div>
        {userPosts.map((post, index) => (
          <Post post={post} key={index} />
        ))}
      </div>
    </StyledProfile>
  );
};
