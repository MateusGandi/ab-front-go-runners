import React from "react";
// import DivField from "../../../components/Fields";
import image from "../../../images/teste.png";
import Grid from "@mui/material/Grid";
// import Button from "@mui/material/Button";
// import Stack from "@mui/material/Stack";
// import Select from "../../../components/Select/tagSelect";
// import Map from "../../../components/Mapa/";
// import GenericCardList from "../../../components/Paper/";
import FeedModalides from "../../../components/Feed/Modalidades/";

export default function InicialPage() {
  const [circuito, setCircuito] = React.useState();

  const teste = [
    {
      id: 121212,
      image: image,
      title: "Corrida urbana",
      description: "Corrida em centros urbanos em grupo",
    },
    {
      id: 121212,
      image: image,
      title: "Corrida urbana",
      description: "Corrida em centros urbanos em grupo",
    },
    {
      id: 121212,
      image: image,
      title: "Corrida urbana",
      description: "Corrida em centros urbanos em grupo",
    },
    {
      id: 121212,
      image: image,
      title: "Corrida urbana",
      description: "Corrida em centros urbanos em grupo",
    },
    {
      id: 121212,
      image: image,
      title: "Corrida urbana",
      description: "Corrida em centros urbanos em grupo",
    },
    {
      id: 121212,
      image: image,
      title: "Corrida urbana",
      description: "Corrida em centros urbanos em grupo",
    },
    {
      id: 121212,
      image: image,
      title: "Corrida urbana",
      description: "Corrida em centros urbanos em grupo",
    },
  ];
  const circuitoOptions = [
    "5km - Vera Cruz",
    "8km - Vera Cruz - Rua Alta",
    "10km - Vera Cruz - Rua Alameda P.",
    "10km - Vera Cruz(Circular)",
  ];
  const data = [
    {
      color: "#554EA2",
      vagas: 12,
      lote: "LOTE 1",
      descricao: "Para idosos",
    },
    {
      color: "#554EA2",
      vagas: 0,
      lote: "LOTE 2",
      descricao: "Para Crianças",
    },
    {
      color: "#554EA2",
      vagas: 1,
      lote: "LOTE 3",
      descricao: "Para Jovens",
    },
    {
      color: "#554EA2",
      vagas: 0,
      lote: "LOTE 4",
      descricao: "Para Crianças",
    },
  ];
  const descricao = `Peço desculpas pela confusão. Parece que você mencionou "red", mas não
  está claro em qual contexto.`;

  return (
    <Grid item overflow={"hidden"}>
      {/* <Grid item xs={12} md={6}>
        <Map />
      </Grid> */}
      <Grid item xs={12} md={6}>
        <FeedModalides arrayCards={teste} filter={"do"}></FeedModalides>
      </Grid>
    </Grid>
  );
}
