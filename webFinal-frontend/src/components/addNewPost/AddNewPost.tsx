import React, { useRef, useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Stack } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useForm, Controller } from "react-hook-form";
import { StyledAddFab, StyledCloseEdit, StyledImgPreview } from "./addNewPost.styles";
import { ADD_NEW_POST_TEXTS } from "../../consts/homeConsts";
import { INewPost } from "../../types/posts.types";
import CloseIcon from "@mui/icons-material/Close";

export const AddNewPost: React.FC<{ onSave: (data: INewPost) => void }> = ({ onSave }) => {
  const [open, setOpen] = useState(false);
  const { handleSubmit, control, reset, setValue } = useForm({
    defaultValues: {
      title: "",
      content: "",
      photo: null,
    },
  });
  const fileInput = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleClose = (): void => {
    setOpen(false);
    setPreview(null);
    reset();
  };

  const onSubmit = (data: any): void => {
    onSave(data);
    handleClose();
  };

  const selectPhoto = (): void => {
    fileInput?.current?.click();
  };

  const handleDeleteImage = () => {
    setPreview(null);
    setValue("photo", null as any);
  };

  return (
    <>
      <StyledAddFab color="primary" onClick={() => setOpen(true)}>
        <AddIcon />
      </StyledAddFab>
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle color="primary">{ADD_NEW_POST_TEXTS.ADD_NEW_POST}</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Stack gap={4}>
              <Controller
                name="title"
                control={control}
                rules={{ required: ADD_NEW_POST_TEXTS.REQUIRED_TITLE }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label={ADD_NEW_POST_TEXTS.TITLE}
                    fullWidth
                    required
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
              <Controller
                name="content"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label={ADD_NEW_POST_TEXTS.CONTENT} fullWidth multiline rows={4} />
                )}
              />
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
              <Button variant="contained" component="label" fullWidth color="secondary" onClick={selectPhoto}>
                {ADD_NEW_POST_TEXTS.UPLOAD_IMAGE}
              </Button>
              {preview && (
                <StyledImgPreview>
                  <img src={preview} alt="Preview" width={300} height={300} />
                  <StyledCloseEdit color="primary" onClick={handleDeleteImage}>
                    <CloseIcon />
                  </StyledCloseEdit>
                </StyledImgPreview>
              )}
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              {ADD_NEW_POST_TEXTS.CANCEL}
            </Button>
            <Button type="submit" color="secondary" variant="contained">
              {ADD_NEW_POST_TEXTS.ADD_POST}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};
