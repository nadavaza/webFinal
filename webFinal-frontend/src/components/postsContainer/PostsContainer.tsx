import React, { useMemo, useState } from "react";
import { IPostsContainer } from "./postContainer.types";
import { StyledPostsContainer, StyledPostsNavigation } from "./postsContainer.styles";
import { Post } from "../post/Post";
import { IPost } from "../../types/posts.types";

const maxPostsPerPage = 8;

export const PostsContainer: React.FC<IPostsContainer> = ({ posts, isHome }) => {
  const [page, setPage] = useState(1);

  const currentPosts = useMemo<IPost[]>(() => {
    return posts.slice((page - 1) * maxPostsPerPage, page * maxPostsPerPage);
  }, [posts, page]);

  const mainPost = useMemo<IPost>(() => posts[0], [posts]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  if (isHome) {
    return (
      <StyledPostsContainer>
        <Post post={mainPost} />
      </StyledPostsContainer>
    );
  }

  return (
    <StyledPostsContainer>
      {currentPosts.map((post, index) => (
        <Post post={post} key={index} />
      ))}
      {currentPosts.length > 0 && (
        <StyledPostsNavigation
          count={Math.ceil(posts.length / maxPostsPerPage)}
          page={page}
          onChange={handlePageChange}
          color="secondary"
        />
      )}
    </StyledPostsContainer>
  );
};
