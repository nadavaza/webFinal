import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, Stack } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useForm, Controller } from "react-hook-form";
import { StyledAddFab } from "./addNewPost.styles";
import { ADD_NEW_POST_TEXTS } from "../../consts/homeConsts";
import { IPost } from "../../types/posts.types";

interface IAddNewPost {
  onSave: (data: IPost) => void;
}

export const AddNewPost: React.FC<IAddNewPost> = ({ onSave }) => {
  const [open, setOpen] = useState(false);
  const { handleSubmit, control, reset } = useForm({
    defaultValues: {
      title: "",
      content: "",
      photo: null,
      owner: "",
    },
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    reset();
  };

  const onSubmit = (data: any) => {
    onSave(data);
    handleClose();
  };

  return (
    <>
      <StyledAddFab color="primary" onClick={handleOpen}>
        <AddIcon />
      </StyledAddFab>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{ADD_NEW_POST_TEXTS.ADD_NEW_POST}</DialogTitle>
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
                name="image"
                control={control}
                render={({ field }) => (
                  <Box>
                    <Button variant="contained" component="label" fullWidth color="secondary">
                      {ADD_NEW_POST_TEXTS.UPLOAD_IMAGE}
                      <input type="file" hidden accept="image/*" onChange={(e) => field.onChange(e.target.files[0])} />
                    </Button>
                  </Box>
                )}
              />
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
