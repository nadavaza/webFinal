import React, { useEffect, useState } from "react";
import { IPost } from "../../types/posts.types";
import postsService from "../../services/posts-service";
import { Avatar, Button, Typography } from "@mui/material";
import { HOME_TEXTS } from "../../consts/homeConsts";
import { Post } from "../../components/post/Post";
import nbaLogo from "../../assets/nbaLogo.png";
import { StyledHome, StyledLogo, StyledProfile } from "./home.styles";
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import usersService from "../../services/users-service";
import { getTokens, setTokens } from "../../services/token-service";
import { useNavigate } from "react-router";
import { toast, ToastContainer } from "react-toastify";

export const Home: React.FC<{}> = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<IPost[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const fetchedPosts = await postsService.getPosts();
      setPosts(fetchedPosts);
    };

    fetchPosts();
  }, []);

  const logOut = async () => {
    try {
      const refreshToken = getTokens().refreshToken
      await usersService.logout(refreshToken)
      setTokens('', '')
      navigate('/login')
    } catch (error: any) {
      toast(error.response.data, { position: "bottom-left", type: "error" });
    }
  }

  return (<>
    <StyledHome>
      <StyledProfile>
        <Avatar>
          <PersonIcon />
        </Avatar>
        {HOME_TEXTS.MY_PORFILE}
        <Button onClick={logOut}>{HOME_TEXTS.LOG_OUT} <LogoutIcon /></Button>
      </StyledProfile>
      <Typography variant="h2" color="primary">
        {HOME_TEXTS.TITLE}
      </Typography>
      <StyledLogo src={nbaLogo} />
      {posts.map((post, index) => (
        <Post post={post} key={index} />
      ))}
    </StyledHome>
    <ToastContainer />
  </>
  );
};
