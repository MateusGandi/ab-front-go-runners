import React, { useState, useRef } from "react";
import Dialog from "@mui/material/Dialog";
import { Typography } from "@mui/material/";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import QRCodeGenerator from "../../../../components/QRCodeGenerator/";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

const PaymentDialog = ({
  openDialog,
  setOpenDialog,
  response,
  alertCustom,
}) => {
  const navigate = useNavigate();
  const textAreaRef = useRef(null);

  const layout = (response) => {
    switch (response.payment_method_id) {
      case "pix":
        return {
          title: "QR Code do Pagamento",
          subTitle: (
            <p>
              <span style={{ fontWeight: "bold" }}>Atenção: </span>
              {format(
                new Date(response.date_of_expiration),
                "'Escaneie o código abaixo e realize o pagamento até' dd/MM/yyyy 'às' HH:mm 'horas'"
              )}
            </p>
          ),
          value: {
            type: "QRCODE",
            source:
              response?.point_of_interaction?.transaction_data?.qr_code || "",
          },
        };
      case "bolbradesco":
        return {
          title: "Boleto",
          subTitle: (
            <p>
              <span style={{ fontWeight: "bold" }}>Atenção: </span>
              {format(
                new Date(response.date_of_expiration),
                "'Realize o pagamento do boleto até' dd/MM/yyyy 'às' HH:mm 'horas'"
              )}
            </p>
          ),
          value: {
            type: "BOLETO",
            source: response?.transaction_details?.external_resource_url || "",
          },
        };
      case "master":
        return {
          title: "Pagamentos via Cartão Débido/Crédito",
          subTitle: (
            <p>
              <span style={{ fontWeight: "bold" }}>Atenção: </span>
              Aprovação ocorre dentro de instantes
            </p>
          ),
          value: {
            type: "INFO",
            source: "link to redirect",
          },
        };
      default:
        setOpenDialog(false);
        return null;
    }
  };

  const { title, subTitle, value } = layout(response);

  const handleCopyClick = () => {
    if (textAreaRef.current) {
      textAreaRef.current.select();
      document.execCommand("copy");
      alertCustom("Código PIX copiado com sucesso!");
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    navigate("/perfil");
  };

  return (
    <Dialog open={openDialog} onClose={handleCloseDialog}>
      <DialogTitle>
        <Typography variant="h6">
          {title}
          <Typography variant="body2" color="textSecondary">
            {subTitle}
          </Typography>
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ display: "flex", justifyContent: "center" }}>
        {value && value.type === "QRCODE" && (
          <QRCodeGenerator value={value.source} />
        )}
      </DialogContent>
      <DialogActions>
        {value && value.type === "QRCODE" && (
          <>
            <Button
              disableElevation
              fullWidth
              variant="text"
              sx={{ display: "flex", alignItems: "center" }}
              onClick={handleCopyClick}
            >
              Código <ContentCopyIcon fontSize="small" />
            </Button>
            <textarea
              ref={textAreaRef}
              value={value.source}
              style={{ position: "absolute", left: "-9999px" }}
              readOnly
            />
          </>
        )}

        {value && value.type === "INFO" && (
          <Button
            disableElevation
            fullWidth
            variant="contained"
            onClick={() => {
              navigate("/home");
            }}
          >
            Acompanhar Pedido
          </Button>
        )}

        {value && value.type === "BOLETO" && (
          <Button
            disableElevation
            fullWidth
            variant="contained"
            onClick={() => {
              console.log("teste", value);
              window.open(value.source, "_blank");
            }}
          >
            VISUALIZAR BOLETO
          </Button>
        )}
        <Button fullWidth onClick={handleCloseDialog}>
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentDialog;
