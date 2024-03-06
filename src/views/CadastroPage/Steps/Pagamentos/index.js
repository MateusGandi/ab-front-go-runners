import React, { useEffect, useState } from "react";
import PaymentBrick from "./PaymentBrick";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { useTheme } from "@mui/material/styles"; // Importando useTheme
import TextField from "@mui/material/TextField";
import axios from "../../../../utils/configAxios";
const REACT_APP_URL_BIBLIOTECA_RUNNERS =
  process.env.REACT_APP_URL_BIBLIOTECA_RUNNERS;

const Payment = ({
  eventoData,
  financeiro,
  dadosCadastro,
  setDadosCadastro,
  setFormData,
  alertCustom,
  pivo,
}) => {
  useEffect(() => {
    console.log("xxx", financeiro);
  }, [financeiro]);

  const [paymentBrickController, setPaymentBrickController] = useState(null);
  const [cupom, setCupom] = useState("");
  const theme = useTheme();
  useEffect(() => {
    const setData = async () => {
      if (paymentBrickController) {
        const result = await paymentBrickController.getFormData();
        setFormData(result);
      }
    };
    setData();
  }, [paymentBrickController]);

  const handlePaymentBrickReady = (controller) => {
    setPaymentBrickController(controller);
  };
  const handleVerifyCupom = async (controller) => {
    try {
      const response = await axios.get(
        `${REACT_APP_URL_BIBLIOTECA_RUNNERS}/v1/evento/verificar-cupom/${cupom}`
      );
      alertCustom(response.data.message || "Erro ao inserir cupom");
      setDadosCadastro({
        ...dadosCadastro,
        desconto: response.data.desconto,
        percDesconto: response.data.desconto,
      });
    } catch (error) {
      alertCustom("Ocorreu um erro ao inserir Cupom ou cupom é inválido!");
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        padding: 2,
        minHeight: { xs: "52vh", md: "60vh" },
        overflowX: "scroll",
      }}
    >
      <Grid
        container
        spacing={1}
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Grid item xs={12} md={12}>
          <Typography variant="h6">
            Pagamento
            <Typography variant="body2" color="textSecondary">
              Acompanhe o resumo do pedido antes de prosseguir
            </Typography>
          </Typography>
        </Grid>
        <Grid item xs={12} md={12}>
          <Grid
            container
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Grid item sx={{ padding: "10px 10px 10px 0" }}>
              <TextField
                id="outlined-basic"
                label="Cupom de desconto"
                variant="outlined"
                placeholder="Digite um cupom promocional"
                onInput={(e) => setCupom(e.target.value)}
              />
            </Grid>
            <Grid item sx={{ padding: "10px 10px 10px 0" }}>
              <Button
                disableElevation
                color="primary"
                onClick={handleVerifyCupom}
              >
                Adicionar
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={12}>
          {financeiro && financeiro.valorTotal && (
            <PaymentBrick
              eventoData={eventoData}
              dadosCadastro={dadosCadastro}
              themeType={theme.palette.mode}
              onPaymentBrickReady={handlePaymentBrickReady}
              financeiro={financeiro}
              alertCustom={alertCustom}
              pivo={pivo}
            />
          )}
        </Grid>
      </Grid>
    </Paper>
  );
};

export default Payment;
