import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import Search from "../../../components/Search/";
import Card from "../../../components/Cards/CardEvento";
import Button from "@mui/material/Button";
import { Paper } from "@mui/material";

export default function BasicGrid({ setEvento, setIsModalOpen, alertCustom }) {
  const [visibleCards, setVisibleCards] = useState(5);
  const [eventosList, setEventosList] = useState([]);
  const [filtredEventos, setFiltredEventos] = useState([]);

  const handleShowMore = () => {
    setVisibleCards((prevVisibleCards) =>
      Math.min(prevVisibleCards + 5, filtredEventos.length)
    );
  };

  const handleSelectEvento = (evento) => {
    if (evento) {
      setEvento(evento);
      setIsModalOpen(true);
    }
  };

  const handleShowLess = () => {
    setVisibleCards((prevVisibleCards) => Math.max(prevVisibleCards - 5, 5));
  };

  return (
    <>
      <Search
        eventosList={eventosList}
        setFiltredEventos={setFiltredEventos}
        setEventosList={setEventosList}
        alertCustom={alertCustom}
      />
      <Grid container spacing={1} sx={{ justifyContent: "start", padding: 1 }}>
        {Array.isArray(filtredEventos) &&
          filtredEventos.length > 0 && // Verifica se filtredEventos é um array e possui elementos
          filtredEventos.slice(0, visibleCards).map(
            (evento, index) =>
              evento.status && (
                <Grid key={index} item xs={6} md={2.4}>
                  <Card
                    evento={evento}
                    index={index}
                    handleSelectEvento={handleSelectEvento}
                  />
                </Grid>
              )
          )}
      </Grid>
      <Grid container justifyContent="center" marginTop={2}>
        {visibleCards < filtredEventos.length && (
          <Button variant="text" onClick={handleShowMore}>
            Ver Mais
          </Button>
        )}
        {visibleCards > 5 && (
          <Button variant="text" onClick={handleShowLess}>
            Ver Menos
          </Button>
        )}
      </Grid>
    </>
  );
}
