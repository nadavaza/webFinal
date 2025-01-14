import React from "react";
import basketBallLoader from "../../assets/basketballLoader.gif";
import { ILoader } from "./loader.types";
import { StyledLoader } from "./loader.styles";

export const Loader: React.FC<ILoader> = ({ isLoading }) => {
  return (
    isLoading && (
      <StyledLoader>
        <img src={basketBallLoader} alt="" />
      </StyledLoader>
    )
  );
};
