import React, { useMemo, useState } from "react";
import { IPostsContainer } from "./postContainer.types";
import { StyledPosts, StyledPostsContainer, StyledPostsNavigation } from "./postsContainer.styles";
import { Post } from "../post/Post";
import { IPost } from "../../types/posts.types";

const maxPostsPerPage = 6;

export const PostsContainer: React.FC<IPostsContainer> = ({ posts }) => {
  const [page, setPage] = useState(1);

  const currentPosts = useMemo<IPost[]>(() => {
    return posts.slice((page - 1) * maxPostsPerPage, page * maxPostsPerPage);
  }, [posts, page]);

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  return (
    <StyledPostsContainer>
      <StyledPosts>
        {currentPosts.map((post, index) => (
          <Post post={post} key={index} />
        ))}
      </StyledPosts>
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
