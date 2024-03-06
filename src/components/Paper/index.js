import { Typography } from "@mui/material";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import React from "react";

export default function SimplePaper(props) {
  const { edit, key, data, isSelected, setFunction } = props;

  const customStyle = {
    card: {
      height: "100%",
      display: "flex",
      justifyContent: "center",
      flexDirection: "column",
      cursor: "pointer",
    },
    title: {
      borderRadius: "5px 5px 0 0",
      padding: "10px",
      textAlign: "center",
      width: "100%",
    },
  };

  return (
    <Paper key={key} variant="outlined" style={customStyle.card} elevation={0}>
      <div style={customStyle.title}>
        <Typography variant="button">
          <span style={{ fontWeight: "bold" }}>{data.titulo}</span>
        </Typography>
      </div>
      <Typography style={{ margin: "10px" }} variant="body2">
        {`${data.criterio}`}
        <Typography variant="body2" color="secondaryText">
          {`Valor do ingresso: R$ ${Number(data.valorIngresso).toFixed(2)}`}
        </Typography>
        <Typography variant="body2" color="secondaryText">
          {`${data.numVagasDisponiveis}/${data.numVagas} vagas`}
        </Typography>
      </Typography>

      <Button
        style={{ margin: "10px" }}
        variant="text"
        disableElevation
        disabled={data.numVagasDisponiveis === 0 || isSelected}
        onClick={() => {
          setFunction(data);
        }}
      >
        {edit && "Editar"}
        {!edit
          ? data.numVagasDisponiveis > 0
            ? isSelected
              ? "Selecionado"
              : "Inscrever"
            : "Esgotado"
          : null}
      </Button>
    </Paper>
  );
}
