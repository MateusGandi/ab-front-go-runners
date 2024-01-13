import React, { useMemo } from "react";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Info from "../Info/index";
import DivField from "../../../components/Fields";
import TogglerB from "../../../components/TogglerButtom/";
import PixRoundedIcon from "@mui/icons-material/PixRounded";
import CreditCardRoundedIcon from "@mui/icons-material/CreditCardRounded";
import ReceiptRoundedIcon from "@mui/icons-material/ReceiptRounded";
import Typography from "@mui/material/Typography";
import Map from "../../../components/Mapa/";
const InicialPage = () => {
  return (
    <Grid container spacing={2} justifyContent={"flex-end"}>
      <Grid item xs={12} md={6}>
        {/* ... Seu primeiro bloco de código ... */}
      </Grid>

      <Grid item xs={12} md={6}>
        <DivField
          required
          label="Mais informações"
          style={{ padding: "30px 10px" }}
        >
          <Typography variant="p1">Formas de pagamento</Typography>
          <Grid container style={{ justifyContent: "start" }} spacing={1}>
            <Grid item>
              <TogglerB icon={PixRoundedIcon} />
            </Grid>
            <Grid item>
              <TogglerB icon={CreditCardRoundedIcon} />
            </Grid>
            <Grid item>
              <TogglerB icon={ReceiptRoundedIcon} />
            </Grid>
          </Grid>
          <p>Organizadores</p>
          <p>Circuito programado</p>
          <Map />
        </DivField>
      </Grid>
    </Grid>
  );
};

export default InicialPage;
