import React, { useState } from "react";
import NotFoundImage from "../../images/notfound.png";
import { Button, Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Grid container direction="column" alignItems="center" spacing={2}>
      <Typography variant="h6" color="textSecondary">
        Página não encontrada
      </Typography>
      <Typography variant="body1">
        A página que você está procurando não foi encontrada.
      </Typography>
      <Button
        sx={{ marginTop: "20px" }}
        variant="contained"
        disableElevation
        onClick={() => navigate("/home")}
      >
        Voltar ao feed
      </Button>
      <div
        style={{
          width: "100%",
          height: "70vh",
          textAlign: "center",
          background: `url(${NotFoundImage})`, // URL inválida para simular o erro
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          alignItems: "contain",
        }}
      />
    </Grid>
  );
};

export default NotFound;
