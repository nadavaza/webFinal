import React, { useMemo, useState } from "react";
import { IPostsContainer } from "./postContainer.types";
import { StyledPostsContainer, StyledPostsNavigation } from "./postsContainer.styles";
import { Post } from "../post/Post";
import { Pagination } from "@mui/material";

const maxPostsPerPage = 8;

export const PostsContainer: React.FC<IPostsContainer> = ({ posts, isDeleteable, onDeletePost }) => {
  const [page, setPage] = useState(1);

  const currentPosts = useMemo(() => {
    return posts.slice((page - 1) * maxPostsPerPage, page * maxPostsPerPage);
  }, [posts, page]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  return (
    <>
      <StyledPostsContainer>
        {currentPosts.map((post, index) => (
          <Post post={post} isDeleteable={isDeleteable} key={index} onDeletePost={onDeletePost} />
        ))}
        <StyledPostsNavigation
          count={Math.ceil(posts.length / maxPostsPerPage)}
          page={page}
          onChange={handlePageChange}
          color="secondary"
        />
      </StyledPostsContainer>
    </>
  );
};
