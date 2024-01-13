import { Typography } from "@mui/material";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import React from "react";

export default function SimplePaper(props) {
  const { data, xs, md, isSelected, onClick } = props;

  const customStyle = {
    card: {
      height: "100%",
      display: "flex",
      justifyContent: "center",
      flexDirection: "column",
      cursor: "pointer",
    },
    title: {
      padding: "10px",
      textAlign: "center",
      width: "100%",
    },
  };

  return (
    <Grid item xs={xs} md={md}>
      <Paper key={data.lote} style={customStyle.card} elevation={0}>
        <div style={customStyle.title}>{data.lote}</div>
        <Typography style={{ margin: "10px" }} variant="subtitle1">
          {data.descricao}
        </Typography>
        <Typography style={{ margin: "10px" }} variant="subtitle1">
          {data.vagas}
        </Typography>
        <Button
          style={{ margin: "10px" }}
          variant="contained"
          disableElevation
          disabled={data.vagas === 0 || isSelected}
          onClick={() => {
            alert("oi");
          }}
        >
          {data.vagas ? (isSelected ? "Inscrito" : "Inscrever") : "Esgotado"}
        </Button>
      </Paper>
    </Grid>
  );
}
