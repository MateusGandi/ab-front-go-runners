import React, { useRef, useState } from "react";
import Dialog from "@mui/material/Dialog";
import { Typography, TextField, Grid } from "@mui/material/";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Autocomplete from "../../components/AutoComplete/";
import { Link } from "react-router-dom";
const PaymentDialog = ({
  openDialog,
  setTransacaoReembolso,
  setOpenDialog,
  transacaoReembolso,
  alertCustom,
}) => {
  const [justificativa, setJustificativa] = useState("");
  console.log(transacaoReembolso);
  const handleCloseDialog = () => {
    setJustificativa("");
    setTransacaoReembolso(null);
    setOpenDialog(false);
  };

  const handleConfirmar = () => {
    // Aqui você pode fazer algo com a justificativa, como enviar para um endpoint
    alertCustom("Justificativa enviada com sucesso");
    handleCloseDialog();
  };

  const opcoesJustificativa = [
    "Não compareci ao evento",
    "Compra indevida",
    "Valor incorreto",
  ];

  return (
    <Dialog open={openDialog} onClose={handleCloseDialog}>
      <DialogTitle>
        <Typography variant="h6" sx={{ textAlign: "justify" }}>
          Formulário de Justificativa
          <Typography variant="body2" color="textSecondary">
            <p>
              <span style={{ fontWeight: "bold" }}>Atenção: </span>
              Sua justificativa estará sujeita a verificação, caso seja
              plausível, você receberá um e-mail com a confirmação.
              <Link to="https://google.com.br">
                Leia a sobre a política de reembolsos
              </Link>
            </p>
          </Typography>
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Grid container sx={{ padding: "10px 0" }} spacing={1}>
          <Grid item xs={12} md={12}>
            <Typography variant="body2">
              Selecione ou informe uma justificativa para análise
            </Typography>
          </Grid>
          <Grid item xs={12} md={12}>
            <Autocomplete
              options={opcoesJustificativa.map((categoria) => ({
                title: categoria,
              }))}
              setValue={setJustificativa}
              value={justificativa}
              label="Informe uma justificativa"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button fullWidth onClick={handleCloseDialog}>
          Cancelar
        </Button>
        <Button
          fullWidth
          disableElevation
          variant="contained"
          onClick={handleConfirmar}
          disabled={!justificativa}
        >
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentDialog;
