import { Avatar } from "@mui/material";
import { StyledProfile, StyledProfileCard } from "./profile.styles";
import PersonIcon from "@mui/icons-material/Person";

export const Profile: React.FC<{}> = ({}) => {
  return (
    <StyledProfile>
      <StyledProfileCard>
        <Avatar>
          <PersonIcon />
        </Avatar>
      </StyledProfileCard>
    </StyledProfile>
  );
};
