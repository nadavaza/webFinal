import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { IPost } from "../../types/posts.types";
import postsService from "../../services/posts-service";

export const PostPage: React.FC<{}> = () => {
  const { id } = useParams();
  const [post, setPost] = useState<IPost>({});

  useEffect(() => {
    const fetchPost = async () => {
      const fetchedPost = await postsService.getPostById(id!!);
      setPost(fetchedPost);
    };

    fetchPost();
  }, [id]);

  return <div></div>;
};
