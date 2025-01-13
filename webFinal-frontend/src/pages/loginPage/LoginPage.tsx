import { Button, Stack, Tab, Tabs, TextField } from "@mui/material";
import React, { useMemo } from "react";
import { LOGIN_TEXTS } from "../../consts/loginConsts";
import { StyledLogin, StyledLoginCard } from "./login.styles";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { Controller, useForm } from "react-hook-form";
import usersService from "../../services/users-service";
import { IUser } from "../../types/users.types";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router";
import { setTokens } from "../../services/token-service";
import { useStore } from "../../store/store";

interface IFormFields {
  userName: string;
  password: string;
}

export const LoginPage: React.FC<{}> = () => {
  const navigate = useNavigate();
  const [currTab, setCurrTab] = React.useState(0);
  const isLogin = useMemo<Boolean>(() => !currTab, [currTab]);
  const { control, handleSubmit } = useForm<IFormFields>({
    defaultValues: {
      userName: "",
      password: "",
    },
  });
  const { setUser } = useStore();

  const onSubmit = handleSubmit(async (user: IFormFields) => {
    try {
      const loggedUser = isLogin ? await usersService.login(user as IUser) : await usersService.register(user as IUser);
      if (loggedUser) {
        setTokens(loggedUser.accessToken!!, loggedUser.refreshToken!!);
        setUser(loggedUser);
        navigate("/home");
      }
    } catch (error: any) {
      toast(error.response.data, { position: "bottom-left", type: "error" });
    }
  });

  const handleChange = (event: React.SyntheticEvent, newTab: number) => {
    setCurrTab(newTab);
  };

  const googleSuccess = (credentialResponse: CredentialResponse): void => {
    console.log("success");
    console.log(credentialResponse);
  };
  const googleError = (): void => {
    console.log("error");
  };

  return (
    <>
      <StyledLogin>
        <StyledLoginCard elevation={10}>
          <Tabs value={currTab} onChange={handleChange}>
            <Tab label={LOGIN_TEXTS.LOGIN} />
            <Tab label={LOGIN_TEXTS.REGISTER} />
          </Tabs>
          <br />
          <form onSubmit={onSubmit}>
            <Stack gap={4}>
              <Controller
                name="userName"
                control={control}
                render={({ field }) => <TextField label="userName" {...field} />}
              />
              <Controller
                name="password"
                control={control}
                render={({ field }) => <TextField type="password" label="password" {...field} />}
              />
              <Button type="submit" variant="contained">
                {isLogin ? LOGIN_TEXTS.LOGIN : LOGIN_TEXTS.REGISTER}
              </Button>
              <GoogleLogin onSuccess={googleSuccess} onError={googleError} />
            </Stack>
          </form>
        </StyledLoginCard>
      </StyledLogin>
      <ToastContainer />
    </>
  );
};
