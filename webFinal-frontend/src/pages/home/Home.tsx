import React, { useEffect, useState } from "react";
import { IPost } from "../../types/posts.types";
import postsService from "../../services/posts-service";
import { Typography } from "@mui/material";
import { HOME_TEXTS } from "../../consts/homeConsts";
import { Post } from "../../components/post/Post";
import nbaLogo from "../../assets/nbaLogo.png";
import { StyledHome, StyledLogo, StyledPostsContainer } from "./home.styles";
import { toast, ToastContainer } from "react-toastify";
import { AddNewPost } from "../../components/addNewPost/AddNewPost";
import { useUserStore } from "../../store/userStore";
import { Loader } from "../../components/loader/Loader";
import { useLoaderStore } from "../../store/loaderStore";
import { PostsContainer } from "../../components/postsContainer/PostsContainer";

export const Home: React.FC<{}> = () => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const { user } = useUserStore();
  const { setIsloading } = useLoaderStore();

  useEffect(() => {
    const fetchPosts = async () => {
      const fetchedPosts = await postsService.getPosts();
      setPosts(fetchedPosts);
    };

    fetchPosts();
  }, []);

  const addNewPost = async (newPost: IPost) => {
    setIsloading(true);
    try {
      const addedPost = await postsService.addPost(newPost, user?._id);
      setPosts([...posts, addedPost]);
    } catch (error: any) {
      toast(error.response.data, { position: "bottom-left", type: "error" });
    }
    setIsloading(false);
  };

  return (
    <>
      <StyledHome>
        <Typography variant="h2" color="primary">
          {HOME_TEXTS.TITLE}
        </Typography>
        <StyledLogo src={nbaLogo} />
        <PostsContainer posts={posts} />
        <AddNewPost onSave={addNewPost} />
      </StyledHome>
      <ToastContainer />
    </>
  );
};
