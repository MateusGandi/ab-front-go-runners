import React, { useState, useEffect } from "react";
import { Divider, Grid, Paper, Typography, useMediaQuery } from "@mui/material";
import NavBar from "../../components/NavegationBar/";
import Stepper from "./Steps/stepper";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import axios from "../../utils/configAxios";
import SwipeableEdgeDrawer from "../../components/Drawer/SwipeableEdgeDrawer";
import DataAttemp from "../../utils/DataAttemp";
import NotFound from "./notFound";
import ConfimDialog from "./dialog";
const REACT_APP_URL_BIBLIOTECA_RUNNERS =
  process.env.REACT_APP_URL_BIBLIOTECA_RUNNERS;

export default function IncricaoPage({ alertCustom }) {
  const dataManager = DataAttemp();
  const navigate = useNavigate();
  const parametros = useParams();
  const [evento, setEvento] = useState(null);
  const [pivo, setPivo] = useState(0);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");

  const [dadosCadastro, setDadosCadastro] = useState({
    percDesconto: 0,
    transacao: `${dataManager.userData.id}${new Date()}`,
    dependentes: [
      {
        nome: dataManager.userData.nome,
        doc: dataManager.userData.auth.cpf,
        email: dataManager.userData.auth.email,
        dataNascimento: dataManager.userData.dataNasc,
        sexo: dataManager.userData.sexo,
        dataInscricao: new Date(),
        prop: true,
        formulario: [],
        kits: [],
      },
    ],
  });
  const [financeiro, setFinanceiro] = useState();

  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const [height, setHeight] = useState("20px");

  const handleClick = () => {
    setHeight("100px");
  };

  const handleBlur = () => {
    setHeight("20px");
  };
  const valorComDesconto = (desconto, valor) => {
    if (desconto === 0 || isNaN(desconto) || isNaN(valor)) {
      return { text: "Não adicionado", montante: valor };
    }
    const valRes = (valor * desconto) / 100;
    return {
      text: `- R$ ${valRes.toFixed(2)}`,
      montante: valor - valRes,
    };
  };

  const fetchData = async (force = false) => {
    setLoading(true);
    try {
      const id = Number(parametros.id) || 0;
      const response = await axios.post(
        `${REACT_APP_URL_BIBLIOTECA_RUNNERS}/v1/evento/buscar-evento`,
        {
          idEvento: id,
          force: force,
          idUser: dataManager.userData.id,
        }
      );

      if (response.data && response.data.repetida) {
        setConfirmMessage(response.data.message);
        setOpenDialog(true);
      } else {
        setEvento(response.data.evento);
        setLoading(false);
      }
    } catch (error) {
      alertCustom(error.response?.data?.error || error.response?.data?.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [parametros.id]);

  useEffect(() => {
    let valTotal = 0;
    setFinanceiro(
      dadosCadastro && {
        ingressosText:
          dadosCadastro.dependentes.length > 0
            ? dadosCadastro.dependentes
                .map((ingresso) => {
                  valTotal += Number(ingresso?.valorIngresso ?? 0);
                  return `R$ ${ingresso?.valorIngresso ?? 0}`;
                })
                .join("\n+ ")
            : "",
        kitsText: dadosCadastro.dependentes
          ? dadosCadastro.dependentes.map((dependente) =>
              dependente.kits
                .map((kit) => {
                  valTotal += Number(kit.preco) * Number(kit.quantidade);
                  return `R$ ${kit.preco} x ${kit.quantidade}`;
                })
                .join("\n+ ")
            )
          : "",
        descontoText: dadosCadastro.desconto
          ? valorComDesconto(Number(dadosCadastro.desconto), valTotal).text
          : "Não adicionado",
        valorTotal: Number(
          valorComDesconto(Number(dadosCadastro.desconto), valTotal).montante
        ),
      }
    );
  }, [dadosCadastro]);

  return (
    <div
      style={{
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
      }}
    >
      <ConfimDialog
        open={openDialog}
        title={"confirmação"}
        message={confirmMessage}
        onClose={() => {
          navigate("/home");
        }}
        onConfirm={() => {
          fetchData(true);
          setOpenDialog(false);
        }}
      />
      <Grid
        container
        sx={{
          marginTop: { md: "70px", xs: "40px" },
          maxWidth: { md: "950px", xs: "100vh" },
        }}
        spacing={2}
      >
        {evento ? (
          <>
            <Grid item xs={12} md={isSmallScreen ? 12 : 9}>
              <div
                style={{
                  width: "100%",
                  height: height,
                  display: isSmallScreen ? "flex" : "none",
                  transition: "height 0.3s ease",
                  background: `url(${REACT_APP_URL_BIBLIOTECA_RUNNERS}/images?file=Eventos/${evento.perfilImage})`,
                }}
                onClick={handleClick}
                onBlur={handleBlur}
                tabIndex={0}
              />
              <Stepper
                financeiro={financeiro}
                dadosCadastro={dadosCadastro}
                setDadosCadastro={setDadosCadastro}
                alertCustom={alertCustom}
                evento={evento}
                pivo={pivo}
                setPivo={setPivo}
              />
            </Grid>

            <NavBar />
            {isSmallScreen ? (
              <SwipeableEdgeDrawer
                dadosCadastro={dadosCadastro}
                financeiro={financeiro}
              />
            ) : (
              <Grid item xs={12} md={3}>
                <Grid container spacing={1}>
                  <Grid item xs={12} md={12}>
                    <Paper
                      variant="outlined"
                      sx={{
                        padding: "20px",
                        width: "100%",
                      }}
                    >
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{
                          width: "100%",
                          display: "flex",
                          textAlign: "right",
                          justifyContent: "space-between",
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        <span>Ingressos: </span>
                        <span>{financeiro && financeiro.ingressosText}</span>
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{
                          width: "100%",
                          display: "flex",
                          textAlign: "right",
                          justifyContent: "space-between",
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        <span>Kit:</span>
                        <span>{financeiro && financeiro.kitsText}</span>
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{
                          width: "100%",
                          display: "flex",
                          flexWrap: "wrap",
                          justifyContent: "space-between",
                        }}
                      >
                        <span style={{ textAlign: "right" }}>Cupom:</span>
                        <span style={{ textAlign: "right" }}>
                          {financeiro.descontoText}
                        </span>
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{
                          width: "100%",
                          display: "flex",
                          textAlign: "left",
                          justifyContent: "space-between",
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        <span>Valor:</span>
                        <span>
                          R${" "}
                          {financeiro &&
                            Number(financeiro.valorTotal).toFixed(2)}
                        </span>
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={12} sx={{ textAlign: "center" }}>
                    <img
                      src={`${REACT_APP_URL_BIBLIOTECA_RUNNERS}/images?file=Eventos/${evento.perfilImage}`}
                      style={{
                        display: { xs: "none", md: "flex" },
                        width: "100%",
                        borderRadius: "4px",
                      }}
                    />
                    <Typography variant="body1" className="show-box">
                      {evento.titulo}
                      <Typography variant="body2" color="textSecondary">
                        {evento.subTitulo}
                      </Typography>
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            )}
          </>
        ) : (
          !loading && <NotFound />
        )}
      </Grid>
    </div>
  );
}
