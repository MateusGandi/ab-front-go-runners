import React from "react";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import { CardActionArea, Paper } from "@mui/material";

const REACT_APP_URL_BIBLIOTECA_RUNNERS =
  process.env.REACT_APP_URL_BIBLIOTECA_RUNNERS;

export default function RecipeReviewCard({
  handleSelectEvento,
  evento,
  index,
}) {
  const PaperStyle = {
    width: "40px",
    margin: "10px",
    textAlign: "center",
  };
  const TitleStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: "2",
  };
  const CardStyle = {
    background: "none",
    position: "relative",
    backgroundColor: index % 2 === 0 ? "#f5f5f5" : "#fff",
  };
  return (
    <Card className="Card" sx={{ ...CardStyle }} elevation={0}>
      <CardActionArea
        style={{ zIndex: "1", borderRadius: "none" }}
        onClick={() => handleSelectEvento(evento)}
      >
        <div style={TitleStyle}>
          <Paper style={PaperStyle} elevation={0}>
            <Typography variant="h6">
              {evento.dataFinal.split("-")[2]}
              <Typography variant="body2" color="textSecondary">
                {new Date(1, evento.dataFinal.split("-")[1] - 1, 1)
                  .toLocaleDateString("pt-br", { month: "short" })
                  .toUpperCase()
                  .replace(".", "")}
              </Typography>
            </Typography>
          </Paper>
        </div>

        <CardMedia
          component="img"
          image={`${REACT_APP_URL_BIBLIOTECA_RUNNERS}/images?file=Eventos/${evento.perfilImage}`}
          alt="imageAS"
          style={{
            borderRadius: "5px",
            pointerEvents: "none",
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />

        <CardActions
          disableSpacing
          sx={{
            width: "100%",
          }}
        >
          <Typography variant="subtitle1">
            {evento.titulo}
            <Typography variant="subtitle2">
              {evento.localizacao.split(",").slice(1, 3).join(", ")}
            </Typography>
            <Typography variant="subtitle2">
              {"Inscrições a partir de " +
                evento.data.split("-")[2] +
                "/" +
                new Date(1, evento.data.split("-")[1] - 1, 1)
                  .toLocaleDateString("pt-br", { month: "short" })
                  .toUpperCase()
                  .replace(".", "")}
            </Typography>
          </Typography>
        </CardActions>
      </CardActionArea>
    </Card>
  );
}
