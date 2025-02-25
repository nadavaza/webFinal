import React, { useEffect, useState } from "react";
import { IPost } from "../../types/posts.types";
import postsService from "../../services/posts-service";
import { StyledHome } from "./home.styles";
import { toast, ToastContainer } from "react-toastify";
import { AddNewPost } from "../../components/addNewPost/AddNewPost";
import { useUserStore } from "../../store/userStore";
import { useLoaderStore } from "../../store/loaderStore";
import { PostsContainer } from "../../components/postsContainer/PostsContainer";
import { Typography } from "@mui/material";
import { HOME_TEXTS } from "../../consts/homeConsts";

export const Home: React.FC<{}> = () => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const { user } = useUserStore();
  const { setIsloading } = useLoaderStore();

  useEffect(() => {
    const fetchPosts = async (): Promise<void> => {
      const fetchedPosts = await postsService.getPosts();
      setPosts(fetchedPosts);
    };

    fetchPosts();
  }, []);

  const addNewPost = async (newPost: IPost): Promise<void> => {
    try {
      setIsloading(true);
      const addedPost = await postsService.addPost(newPost, user?._id);
      setPosts([...posts, addedPost]);
    } catch (error: any) {
      toast(error.response.data, {
        position: "bottom-center",
        type: "error",
        delay: 500,
      });
    }
    setIsloading(false);
  };

  return (
    <>
      <Typography variant="h1" color="primary">
        {HOME_TEXTS.TITLE}
      </Typography>
      <StyledHome>
        <PostsContainer posts={posts} />
        <AddNewPost onSave={addNewPost} />
      </StyledHome>
      <ToastContainer />
    </>
  );
};
