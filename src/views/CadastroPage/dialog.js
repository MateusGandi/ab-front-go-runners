import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import {
  Typography,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material/";

const ConfirmDialog = ({ open, title, message, onConfirm, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        <Typography variant="h6">{title}</Typography>
        <Typography variant="body2" color="textSecondary">
          {message}
        </Typography>
      </DialogTitle>
      <DialogContent
        sx={{ display: "flex", justifyContent: "center" }}
      ></DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="text">
          Cancelar
        </Button>
        <Button disableElevation onClick={onConfirm} variant="contained">
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
