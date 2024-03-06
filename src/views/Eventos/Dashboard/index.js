import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import ModalEvento from "./ModalEvento";
import RenderEventos from "./RenderEventos";
import EditEvento from "./EditEvento/";
import axios from "../../../utils/configAxios";
const REACT_APP_URL_BIBLIOTECA_RUNNERS =
  process.env.REACT_APP_URL_BIBLIOTECA_RUNNERS;

const Dashboard = ({ alertCustom }) => {
  const [eventos, setEventos] = useState([]);
  const [evento, setEvento] = useState(null);
  const [eventoToEdit, setEventoToEdit] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEvento(null);
    fetchData();
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${REACT_APP_URL_BIBLIOTECA_RUNNERS}/v1/evento/listar-eventos`
      );
      setEventos(response.data);
    } catch (error) {
      alertCustom("Erro ao buscar eventos");
      console.error("Erro ao buscar eventos:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEventoClick = (selectedEvento) => {
    setEvento(selectedEvento);
    openModal();
  };

  return (
    <Grid container spacing={2} sx={{ minWidth: "500px" }}>
      {evento && (
        <ModalEvento
          setEventoToEdit={setEventoToEdit}
          EventoData={evento}
          alertCustom={alertCustom}
          handleClose={closeModal}
          isModalOpen={isModalOpen}
        />
      )}
      {eventoToEdit ? (
        <Grid item xs={12} md={12}>
          <EditEvento
            setEventoToEdit={setEventoToEdit}
            eventoData={eventoToEdit}
          />
        </Grid>
      ) : (
        <>
          <Grid item xs={12} md={12}>
            <RenderEventos
              eventos={eventos}
              setEvento={handleEventoClick}
              customAlert={alertCustom}
              setOpenModal={setIsModalOpen}
            />
          </Grid>
          <Grid item xs={12} md={12}></Grid>
        </>
      )}
    </Grid>
  );
};

export default Dashboard;
