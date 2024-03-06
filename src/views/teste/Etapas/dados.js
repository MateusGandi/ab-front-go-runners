import React, { useState } from "react";
import DivField from "../../../components/Fields";
import image from "../../../images/teste.png";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

export default function InicialPage() {
  const [personName, setPersonName] = React.useState([]);
  const names = [
    "Oliver Hansen",
    "Van Henry",
    "April Tucker",
    "Ralph Hubbard",
    "Omar Alexander",
    "Carlos Abbott",
    "Miriam Wagner",
    "Bradley Wilkerson",
    "Virginia Andrews",
    "Kelly Snyder",
  ];

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(typeof value === "string" ? value.split(",") : value);
  };

  return (
    <Grid container spacing={2} justifyContent={"flex-end"}>
      <Grid item xs={12} md={6}>
        <DivField
          required
          label="Mais informações"
          style={{ padding: "30px 10px" }}
        >
          <Stack spacing={1}>
            <Button
              variant="contained"
              disableElevation
              style={{ backgroundColor: "#9E9E9E" }}
            >
              Dados
            </Button>
            <Button variant="contained" disableElevation>
              Realizar inscrição
            </Button>
          </Stack>
        </DivField>
      </Grid>

      <Grid item xs={12} md={6}>
        <DivField
          required
          label="Mais informações"
          style={{ padding: "30px 10px" }}
        >
          <p>Formas de pagamento</p>
          <p>Organizadores</p>
          <p>Circuito programado</p>
        </DivField>
      </Grid>
    </Grid>
  );
}
