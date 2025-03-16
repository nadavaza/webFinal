import React, { useEffect, useState } from "react";
import { INewPost, IPost } from "../../types/posts.types";
import postsService from "../../services/posts-service";
import { StyledAiLogo, StyledHome, StyledHomeHeader } from "./home.styles";
import { toast, ToastContainer } from "react-toastify";
import { AddNewPost } from "../../components/addNewPost/AddNewPost";
import { useUserStore } from "../../store/userStore";
import { useLoaderStore } from "../../store/loaderStore";
import { PostsContainer } from "../../components/postsContainer/PostsContainer";
import { Button, Typography } from "@mui/material";
import { HOME_TEXTS } from "../../consts/homeConsts";
import filesService from "../../services/files-service";
import aiService from "../../services/ai-service";
import chatgpt from "../../assets/chatgpt.webp";

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

  const addNewPost = async (newPost: INewPost): Promise<void> => {
    try {
      setIsloading(true);
      let photoPath = "";
      if (newPost.photo) {
        photoPath = await filesService.uploadFile(newPost.photo);
      }
      const addedPost = await postsService.addPost(
        {
          title: newPost?.title,
          content: newPost?.content,
          photo: photoPath,
        } as IPost,
        user?._id
      );
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

  const getAiPosts = async () => {
    const aiPosts = await aiService.getAiPosts();

    const updatedPosts = aiPosts.map((post) => ({
      ...post,
      _id: "",
      photo: chatgpt,
      date: Date.now(),
      isAi: true,
    }));
    setPosts([...posts, ...updatedPosts]);
  };

  return (
    <>
      <StyledHomeHeader>
        <Typography variant="h1" color="primary">
          {HOME_TEXTS.TITLE}
        </Typography>
        <Button variant="outlined" color="success" onClick={getAiPosts}>
          {HOME_TEXTS.GET_AI_POST}
          <StyledAiLogo src={chatgpt} />
        </Button>
      </StyledHomeHeader>
      <StyledHome>
        <PostsContainer posts={posts} />
        <AddNewPost onSave={addNewPost} />
      </StyledHome>
      <ToastContainer
        autoClose={3000} // Closes after 3 seconds
        closeOnClick // Enables click-to-close
        pauseOnHover={false} // Prevents staying open on hover
      />
    </>
  );
};
