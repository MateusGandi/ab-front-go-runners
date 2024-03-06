import React from "react";
import { Typography, Button } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

const ConfirmDeleteModal = ({ open, onCancel, onConfirm, title, content }) => {
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>
        <Typography variant="h6">
          Confirmação<Typography variant="body2">{title}</Typography>
        </Typography>
      </DialogTitle>
      <DialogContent>{content}</DialogContent>
      <DialogActions>
        <Button fullWidth variant="text" disableElevation onClick={onCancel}>
          Cancelar
        </Button>
        <Button
          fullWidth
          variant="contained"
          disableElevation
          onClick={onConfirm}
        >
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDeleteModal;
