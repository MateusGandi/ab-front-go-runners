import React, { useRef } from "react";
import Dialog from "@mui/material/Dialog";
import { Typography } from "@mui/material/";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import QRCodeGenerator from "../../components/QRCodeGenerator";

const PaymentDialog = ({
  openDialog,
  setOpenDialog,
  setValidQRcode,
  validQRcode,
  alertCustom,
}) => {
  const handleCloseDialog = () => {
    setValidQRcode(null);
    setOpenDialog(false);
  };

  return (
    <Dialog open={openDialog} onClose={handleCloseDialog}>
      <DialogTitle>
        <Typography variant="h6">Seu ingresso</Typography>
        <Typography variant="body2" color="textSecondary">
          <p>
            <span style={{ fontWeight: "bold" }}>Atenção: </span>
            Mostre ao organizador do evento o QR Code abaixo
          </p>
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ display: "flex", justifyContent: "center" }}>
        {validQRcode != null && <QRCodeGenerator value={validQRcode} />}
      </DialogContent>
      <DialogActions>
        <Button fullWidth onClick={handleCloseDialog}>
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentDialog;
