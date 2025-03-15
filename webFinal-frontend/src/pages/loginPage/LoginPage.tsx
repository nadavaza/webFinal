import { Button, IconButton, InputAdornment, Stack, Tab, Tabs, TextField } from "@mui/material";
import React, { useMemo, useRef, useState } from "react";
import { LOGIN_TEXTS } from "../../consts/loginConsts";
import {
  StyledLogin,
  StyledLoginCard,
  StyledLoginLogo,
  StyledProfileActions,
  StyledProfileClose,
  StyledProfileEdit,
  StyledProfileIcon,
  StyledProfileIconContainer,
  StyledProfileImg,
} from "./login.styles";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { Controller, useForm } from "react-hook-form";
import usersService from "../../services/users-service";
import { ILoginUser, IUser } from "../../types/users.types";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router";
import { setTokens } from "../../services/token-service";
import { useUserStore } from "../../store/userStore";
import basketballLogo from "../../assets/basketball.png";
import filesService from "../../services/files-service";
import { VisibilityOff, Visibility } from "@mui/icons-material";

export const LoginPage: React.FC<{}> = () => {
  const navigate = useNavigate();
  const [currTab, setCurrTab] = React.useState(0);
  const isLogin = useMemo<Boolean>(() => !currTab, [currTab]);
  const { control, handleSubmit, setValue, reset } = useForm<ILoginUser>({
    defaultValues: {
      photo: null,
      email: "",
      userName: "",
      password: "",
    },
  });
  const { setUser } = useUserStore();
  const fileInput = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const selectPhoto = (): void => {
    fileInput?.current?.click();
  };

  const handleDeleteImage = () => {
    setPreview(null);
    setValue("photo", null as any);
  };

  const onSubmit = handleSubmit(async (user: ILoginUser): Promise<void> => {
    try {
      let photoPath = "";
      if (user.photo) {
        photoPath = await filesService.uploadFile(user.photo);
      }
      const loggedUser = isLogin
        ? await usersService.login(user as IUser)
        : await usersService.register({ ...user, photo: photoPath } as IUser);
      if (loggedUser) {
        setTokens(loggedUser.accessToken!!, loggedUser.refreshToken!!);
        setUser(loggedUser);
        navigate("/home");
      }
    } catch (error: any) {
      toast(error.response.data, { position: "bottom-center", type: "error", delay: 500 });
    }
  });

  const handleChangeTab = (_event: React.SyntheticEvent, newTab: number) => {
    setCurrTab(newTab);
    reset();
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
          <Tabs value={currTab} onChange={handleChangeTab}>
            <Tab label={LOGIN_TEXTS.LOGIN} />
            <Tab label={LOGIN_TEXTS.REGISTER} />
          </Tabs>
          <br />
          <form onSubmit={onSubmit}>
            <Stack gap={4}>
              {Object.keys(control._defaultValues)
                .map((field) => {
                  if (isLogin && (field === "userName" || field === "photo")) return null;
                  if (field === "photo") {
                    return (
                      <div key={field}>
                        <Controller
                          name="photo"
                          control={control}
                          render={({ field }) => (
                            <input
                              style={{ display: "none" }}
                              ref={fileInput}
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const files = e.target.files;
                                if (files && files.length > 0) {
                                  field.onChange(files[0]);
                                  setPreview(URL.createObjectURL(files[0]));
                                }
                              }}
                              onClick={(e) => {
                                e.target.value = null;
                              }}
                            />
                          )}
                        />
                        <StyledProfileIconContainer>
                          <StyledProfileImg>
                            {preview ? (
                              <img src={preview} alt="Preview" width={"100%"} height={"100%"} />
                            ) : (
                              <StyledProfileIcon />
                            )}
                          </StyledProfileImg>
                          <StyledProfileActions>
                            <StyledProfileEdit color="primary" onClick={selectPhoto} />
                            {preview && <StyledProfileClose color="primary" onClick={handleDeleteImage} />}
                          </StyledProfileActions>
                        </StyledProfileIconContainer>
                      </div>
                    );
                  }

                  return (
                    <Controller
                      key={field}
                      name={field}
                      control={control}
                      rules={{ required: LOGIN_TEXTS.FIELD_REQUIRED }}
                      render={({ field, fieldState }) => (
                        <TextField
                          required
                          {...field}
                          label={field.name}
                          variant="outlined"
                          type={field.name === "password" ? (showPassword ? "text" : "password") : "text"}
                          InputProps={{
                            endAdornment: field.name === "password" && (
                              <InputAdornment position="end">
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={handleClickShowPassword}
                                  edge="end"
                                >
                                  {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      )}
                    />
                  );
                })
                .filter(Boolean)}
              <Button type="submit" variant="contained">
                {isLogin ? LOGIN_TEXTS.LOGIN : LOGIN_TEXTS.REGISTER}
              </Button>
              <GoogleLogin onSuccess={googleSuccess} onError={googleError} />
            </Stack>
          </form>
        </StyledLoginCard>
      </StyledLogin>
      <ToastContainer
        autoClose={3000} // Closes after 3 seconds
        closeOnClick // Enables click-to-close
        pauseOnHover={false} // Prevents staying open on hover
      />
    </>
  );
};
