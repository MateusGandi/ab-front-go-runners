import React, { useRef } from "react";
import Dialog from "@mui/material/Dialog";
import { Typography } from "@mui/material/";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import QRCodeGenerator from "../../components/QRCodeGenerator/";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

const PaymentDialog = ({
  openDialog,
  setOpenDialog,
  setConteudo,
  conteudo,
  alertCustom,
}) => {
  const textAreaRef = useRef(null);

  const handleCloseDialog = () => {
    setConteudo(null);
    setOpenDialog(false);
  };

  return (
    <Dialog open={openDialog} onClose={handleCloseDialog}>
      <DialogTitle>
        <Typography variant="h6">QR Code do Pagamento</Typography>
        <Typography variant="body2" color="textSecondary">
          <p>
            <span style={{ fontWeight: "bold" }}>Atenção: </span>
            Realize o pagamento via QRcode abaixo
          </p>
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ display: "flex", justifyContent: "center" }}>
        <QRCodeGenerator value={conteudo} />
      </DialogContent>
      <DialogActions>
        <Button
          disableElevation
          fullWidth
          variant="text"
          sx={{ display: "flex", alignItems: "center" }}
          onClick={() => {
            if (textAreaRef.current) {
              textAreaRef.current.select();
              document.execCommand("copy");
              alertCustom("Código PIX copiado com sucesso!");
            }
          }}
        >
          Código <ContentCopyIcon fontSize="small" />
        </Button>
        <textarea
          ref={textAreaRef}
          value={conteudo}
          style={{ position: "absolute", left: "-9999px" }}
          readOnly
        />
        <Button fullWidth onClick={handleCloseDialog}>
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentDialog;
