import React, { useEffect, useState } from "react";
import { IPost } from "../../types/posts.types";
import postsService from "../../services/posts-service";
import { Typography } from "@mui/material";
import { HOME_TEXTS } from "../../consts/homeConsts";
import { Post } from "../../components/post/Post";
import nbaLogo from "../../assets/nbaLogo.png";
import { StyledHome, StyledLogo } from "./home.styles";
import { ToastContainer } from "react-toastify";

export const Home: React.FC<{}> = () => {
  const [posts, setPosts] = useState<IPost[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const fetchedPosts = await postsService.getPosts();
      setPosts(fetchedPosts);
    };

    fetchPosts();
  }, []);

  return (
    <>
      <StyledHome>
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
