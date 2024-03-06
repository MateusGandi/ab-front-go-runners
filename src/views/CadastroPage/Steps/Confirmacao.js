import React from "react";
import { Button, Typography, Box } from "@mui/material";
import DataAttemp from "../../../utils/DataAttemp";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const REACT_APP_URL_BIBLIOTECA_RUNNERS_HTTPS =
  process.env.REACT_APP_URL_BIBLIOTECA_RUNNERS_HTTPS;

const FreeEventComponent = ({ dadosCadastro, eventoData, alertCustom }) => {
  const dataMaganer = DataAttemp();
  const navigate = useNavigate();
  const handleClick = () => {
    // Aqui você coloca a lógica para fazer a requisição POST
    axios
      .post(
        `${REACT_APP_URL_BIBLIOTECA_RUNNERS_HTTPS}/v1/pagamentos/cadastrar-gratuito`,
        {
          transacao: dadosCadastro.trasacao,
          user: {
            id: dataMaganer.userData.id,
            nome: dataMaganer.userData.nome,
          },
          evento: {
            nome: eventoData.titulo,
            subtitle: eventoData.subTitulo,
            dataFinal: eventoData.dataFinal,
          },
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        alertCustom(response.data.message || "Sucesso!");
        navigate("/perfil");
      })
      .catch((error) => {
        alertCustom(
          "Ocorreu um erro ao realizar incrição, favor, tente novamente mais tarde!"
        );
        console.error("Erro ao enviar requisição POST:", error);
      });
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      sx={{
        height: {
          xs: "52vh",
          md: "60vh",
        },
      }}
    >
      <Typography variant="h4" align="center" gutterBottom>
        Este evento é gratuito!
        <Typography variant="body1" gutterBottom>
          Podemos contar com a sua participação?
        </Typography>
      </Typography>
      <Button
        disableElevation
        margin={1}
        variant="contained"
        color="primary"
        onClick={handleClick}
      >
        Confirmar participação
      </Button>
    </Box>
  );
};

export default FreeEventComponent;
