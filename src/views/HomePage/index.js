import * as React from "react";
import NavBar from "../../components/NavegationBar/";
import Carousel from "../../components/Carrosel/images";
import axios from "../../axiosConfig.js";
import FeedModalides from "../../components/Feed/Modalidades";
import FeedEventos from "../../components/Feed/Eventos";
import image from "../../components/Icons/run.png";
import Teste from "../../images/teste.png";
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
];

function Home() {
  return (
    <>
      <NavBar />
      <Carousel type={"image"} ArrayItems={dadosCarrossel}></Carousel>
      {/* <FeedModalides arrayCards={teste} filter={"do"}></FeedModalides> */}
      <FeedEventos data={teste}></FeedEventos>
    </>
  );
}

export default Home;
