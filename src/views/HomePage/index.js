import React, { useState } from "react";
import NavBar from "../../components/NavegationBar/";
import Carousel from "../../components/Carrosel/images";
import FeedEventos from "../../components/Feed/Eventos";
import image from "../../components/Icons/run.png";
import Teste from "../../images/ban2.png";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Grid } from "@mui/material";
import EventoModal from "./ModalEvento";

const dadosCarrossel = [
  {
    image: Teste,
    describe: "relacionado",
  },
  {
    image: Teste,
    describe: "relacionado",
  },
];

function Home({ alertCustom, userData }) {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("md"));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [evento, setEvento] = useState(false);

  const closeModal = () => {
    setIsModalOpen(false);
    setEvento(null);
  };

  return (
    <div
      style={{
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
      }}
    >
      <Grid
        container
        sx={{
          paddingTop: "5px",
          paddingLeft: "5px",
          maxWidth: { md: "1210px", xs: "100vh" },
          width: "calc(100vw - 5px)",
        }}
      >
        <NavBar userData={userData} />
        <Grid item xs={12} md={12}>
          <Grid container>
            <Grid
              item
              xs={12}
              md={12}
              sx={{
                marginTop: isLargeScreen ? "0" : "50px",
              }}
            >
              {isLargeScreen && (
                <Carousel type={"image"} ArrayItems={dadosCarrossel}></Carousel>
              )}
            </Grid>
            <Grid
              item
              md={12}
              xs={12}
              sx={{ marginTop: isLargeScreen ? "0" : "30px" }}
            >
              <FeedEventos
                setEvento={setEvento}
                setIsModalOpen={setIsModalOpen}
                alertCustom={alertCustom}
              />
            </Grid>
          </Grid>
        </Grid>
        {evento && (
          <EventoModal
            EventoData={evento}
            alertCustom={alertCustom}
            handleClose={closeModal}
            isModalOpen={isModalOpen}
          />
        )}

        <Grid item md={12} xs={12}>
          arte
        </Grid>
      </Grid>
    </div>
  );
}

export default Home;
