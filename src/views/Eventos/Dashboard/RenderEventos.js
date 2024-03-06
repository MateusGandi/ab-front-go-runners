import React, { useState } from "react";
import {
  Button,
  Modal,
  Box,
  Typography,
  Card,
  CardActionArea,
  Divider,
  CardMedia,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import testeImage from "../../../images/perfil.png";

const REACT_APP_URL_BIBLIOTECA_RUNNERS =
  process.env.REACT_APP_URL_BIBLIOTECA_RUNNERS;

const RenderEventos = ({ eventos, setEvento, customAlert, setOpenModal }) => {
  const handleOpenModal = (evento) => {
    setEvento(evento);
    setOpenModal(true);
  };

  return (
    <>
      <Grid item xs={12} md={12}>
        <Typography variant="h6">
          Eventos Cadastrados
          <Typography variant="body2" color="textSecondary">
            Visualizar e Editar eventos cadastrados
          </Typography>
        </Typography>
      </Grid>
      {eventos.map((evento, index) => (
        <Grid item xs={12} md={12} key={index}>
          <CardActionArea
            style={{ padding: "10px", width: "100%" }}
            onClick={() => handleOpenModal(evento)}
          >
            <Grid container spacing={2}>
              <Grid item>
                <CardMedia
                  component="img"
                  alt="imagem do evento"
                  height="75"
                  image={`${REACT_APP_URL_BIBLIOTECA_RUNNERS}/images?file=Eventos/${evento.perfilImage}`}
                  style={{ borderRadius: "5px", maxWidth: "75px" }}
                />
              </Grid>
              <Grid item style={{ textAlign: "center" }}>
                <Typography variant="h4">
                  {evento.data.split("-")[2]}
                  <Typography variant="body1" color="textSecondary">
                    {new Date(1, evento.data.split("-")[2] - 1, 1)
                      .toLocaleDateString("pt-br", { month: "short" })
                      .toUpperCase()
                      .replace(".", "")}
                  </Typography>
                </Typography>
              </Grid>
              <Grid item style={{ textAlign: "center" }}>
                <Typography variant="h6">
                  {evento.dataFinal.split("-")[2]}

                  <Typography variant="body2" color="textSecondary">
                    {new Date(1, evento.dataFinal.split("-")[2] - 1, 1)
                      .toLocaleDateString("pt-br", { month: "short" })
                      .toUpperCase()
                      .replace(".", "")}
                  </Typography>
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="h6">
                  {evento.titulo}
                  <Typography variant="body2" color="textSecondary">
                    <AccessTimeIcon fontSize="small" /> {evento.data}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{
                      maxWidth: { xs: "100px", md: "300px" },
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    <LocationOnIcon fontSize="small" />
                    {evento.localizacao}
                  </Typography>
                </Typography>
              </Grid>
            </Grid>
          </CardActionArea>
          <Divider />
        </Grid>
      ))}
    </>
  );
};

export default RenderEventos;
