import { Button, Stack, Tab, Tabs, TextField } from "@mui/material";
import React, { useEffect, useMemo } from "react";
import { LOGIN_TEXTS } from "../../consts/loginConsts";
import { StyledLogin, StyledLoginCard, StyledLoginLogo } from "./login.styles";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { Controller, useForm } from "react-hook-form";
import usersService from "../../services/users-service";
import { IUser } from "../../types/users.types";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router";
import { getTokens, setTokens } from "../../services/token-service";
import { useUserStore } from "../../store/userStore";
import basketballLogo from "../../assets/basketball.png";

export const LoginPage: React.FC<{}> = () => {
  const navigate = useNavigate();
  const [currTab, setCurrTab] = React.useState(0);
  const isLogin = useMemo<Boolean>(() => !currTab, [currTab]);
  const { control, handleSubmit } = useForm<IUser>({
    defaultValues: {
      email: "",
      userName: "",
      password: "",
    },
  });
  const { setUser } = useUserStore();

  const fields = useMemo(() => {
    return Object.keys(control._defaultValues)
      .map((field) => {
        if (isLogin && field === "userName") return null;
        return (
          <Controller
            key={field}
            name={field}
            control={control}
            render={({ field }) => (
              <TextField
                required
                {...field}
                label={field.name}
                variant="outlined"
                type={field.name === "password" ? "password" : "text"}
              />
            )}
          />
        );
      })
      .filter(Boolean);
  }, [isLogin]);

  const onSubmit = handleSubmit(async (user: IUser): Promise<void> => {
    try {
      const loggedUser = isLogin ? await usersService.login(user as IUser) : await usersService.register(user as IUser);
      if (loggedUser) {
        setTokens(loggedUser.accessToken!!, loggedUser.refreshToken!!);
        setUser(loggedUser);
        navigate("/home");
      }
    } catch (error: any) {
      toast(error.response.data, { position: "bottom-center", type: "error", delay: 500 });
    }
  });

  const handleChange = (_event: React.SyntheticEvent, newTab: number) => {
    setCurrTab(newTab);
  };

  const googleSuccess = async (credentialResponse: CredentialResponse): Promise<void> => {
    const googleUser = await usersService.googleSignin(credentialResponse);
    if (googleUser) {
      setTokens(googleUser.accessToken!!, googleUser.refreshToken!!);
      setUser(googleUser);
      navigate("/home");
    }
  };
  const googleError = (): void => {
    toast(LOGIN_TEXTS.GOOGLE_ERROR, { position: "bottom-center", type: "error", delay: 500 });
  };

  return (
    <>
      <StyledLogin>
        <StyledLoginLogo src={basketballLogo} />
        <StyledLoginCard>
          <Tabs value={currTab} onChange={handleChange}>
            <Tab label={LOGIN_TEXTS.LOGIN} />
            <Tab label={LOGIN_TEXTS.REGISTER} />
          </Tabs>
          <br />
          <form onSubmit={onSubmit}>
            <Stack gap={4}>
              {fields}
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
