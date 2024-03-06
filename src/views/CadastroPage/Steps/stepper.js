import React, { useState, useRef, useEffect } from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Categorias from "./Categorias";
import RenderForm from "./RenderForm";
import RenderKits from "./RenderKits";
import DataAttemp from "../../../utils/DataAttemp";
import Pagamentos from "./Pagamentos/";
import axios from "../../../utils/configAxios";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import Confirmacao from "./Confirmacao";
import NewParticpante from "./NewParticipante";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "@mui/material";
const REACT_APP_URL_BIBLIOTECA_RUNNERS =
  process.env.REACT_APP_URL_BIBLIOTECA_RUNNERS;

const VerticalLinearStepper = ({
  setPivo,
  pivo,
  dadosCadastro,
  setDadosCadastro,
  alertCustom,
  evento,
  financeiro,
}) => {
  const dataManager = DataAttemp();
  const [activeStep, setActiveStep] = useState(0);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [formData, setFormData] = useState(null);
  const [respondidos, setRespondidos] = useState(null);
  const [loading, setLoading] = useState(false); // Estado para controle de carregamento
  const [visibilityButtonStep, setVisibilityButtonStep] = useState(true);
  const containerRef = useRef(null);
  const isDesktop = useMediaQuery("(min-width:960px)");
  const navigate = useNavigate();
  const handleReserveVaga = async () => {
    try {
      const data = {
        pivo: pivo,
        transacao: dadosCadastro.transacao,
        idUser: dataManager.userData.id,
        idEvento: evento.id,
        dependentes: dadosCadastro.dependentes,
      };
      const response = await axios.post(
        `${REACT_APP_URL_BIBLIOTECA_RUNNERS}/v1/evento/reservar-vaga`,
        data
      );
    } catch (error) {
      alertCustom(
        error.response.data.message || "Não foi possível reservar a vaga"
      );
      throw new Error(error);
    }
  };

  const steps = [
    {
      label: "Categoria",
      description: evento.categorias && (
        <Categorias
          setActiveStep={setActiveStep}
          setPivo={setPivo}
          pivo={pivo}
          dadosCadastro={dadosCadastro}
          setDadosCadastro={setDadosCadastro}
          categorias={evento.categorias}
        />
      ),
      status:
        dadosCadastro.dependentes[pivo] &&
        dadosCadastro.dependentes[pivo].categoriaId,
      function: true,
    },
    {
      label: "Questionário",
      description: evento.formulario && (
        <RenderForm
          pivo={pivo}
          setPivo={setPivo}
          alertCustom={alertCustom}
          formData={evento.formulario}
          dadosCadastro={dadosCadastro}
          setRespondidos={setRespondidos}
          setDadosCadastro={setDadosCadastro}
        />
      ),
      function: false,
      status: respondidos,
    },
    {
      label: "Kit Corrida",
      description: evento.tabelaPreco && (
        <RenderKits
          pivo={pivo}
          setPivo={setPivo}
          alertCustom={alertCustom}
          dadosCadastro={dadosCadastro}
          setDadosCadastro={setDadosCadastro}
          nomeTabela={evento.tabelaPreco}
        />
      ),
      function: true,
      status:
        dadosCadastro.dependentes[pivo] &&
        dadosCadastro.dependentes[pivo].kits.length > 0,
    },

    {
      label: "Participante",
      description: evento.tabelaPreco && (
        <NewParticpante
          setVisibilityButtonStep={setVisibilityButtonStep}
          setActiveStep={setActiveStep}
          setPivo={setPivo}
          pivo={pivo}
          alertCustom={alertCustom}
          dadosCadastro={dadosCadastro}
          setDadosCadastro={setDadosCadastro}
        />
      ),
      function: true,
      status: true,
    },
    {
      label: "Pagamento",
      description:
        dadosCadastro &&
        (financeiro.valorTotal > 0 ? (
          <Pagamentos
            eventoData={evento}
            alertCustom={alertCustom}
            financeiro={financeiro}
            dadosCadastro={dadosCadastro}
            setDadosCadastro={setDadosCadastro}
            setFormData={setFormData}
            pivo={pivo}
          />
        ) : (
          <Confirmacao
            eventoData={evento}
            alertCustom={alertCustom}
            dadosCadastro={dadosCadastro}
          />
        )),
      status: true,
    },
  ];

  useEffect(() => {
    if (containerRef.current) {
      const stepWidth = isDesktop ? 200 : window.innerWidth * 0.5;
      setScrollPosition(activeStep * stepWidth);
    }
  }, [activeStep, steps]);

  const handleNext = async () => {
    if (activeStep < steps.length - 1) {
      setLoading(true);
      if (steps[activeStep]?.function) {
        await handleReserveVaga()
          .then(() => {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
          })
          .catch((erro) => console.log(erro));
      } else {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      }
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    }
  };

  const handleDeleteDependent = (dependent) => {
    console.log(dependent.doc);
    setDadosCadastro({
      ...dadosCadastro,
      dependentes: dadosCadastro.dependentes.filter(
        (item) => item.doc != dependent.doc
      ),
    });
    setPivo(pivo - 1);
    setActiveStep(3);
  };

  return (
    <Grid container>
      <Grid
        item
        sx={{
          padding: 1,
          height: "70px",
          overflowX: "hidden",
        }}
      >
        <Stepper
          activeStep={activeStep}
          sx={{
            maxWidth: { xs: "100vw", md: "100%" },
            "& .MuiStepConnector-line": { display: "none" },
          }}
          ref={containerRef}
        >
          {steps.map((step, index) => (
            <Step
              sx={{
                margin: {
                  xs: index === 0 ? "0 0 0 50vw" : 0,
                  md: 0,
                },
                transition: "transform 0.3s ease",
                transform: `translateX(-${scrollPosition}px)`,
              }}
              key={index}
            >
              <StepLabel>
                <Typography
                  variant="body1"
                  sx={{
                    width: { xs: "37vw", md: "150px" },
                    cursor: "pointer",
                    whiteSpace: "inherit",
                  }}
                  onClick={() =>
                    activeStep - 1 === index ? setActiveStep(index) : null
                  }
                >
                  {step.label}
                </Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Grid>
      <Grid item md={12} xs={12}>
        <Grid container spacing={1}>
          {pivo > 0 && activeStep < 3 && (
            <Grid item md={12} xs={12}>
              <Button
                color="error"
                fullWidth
                disableElevation
                onClick={() =>
                  handleDeleteDependent(dadosCadastro.dependentes[pivo])
                }
              >
                Cancelar incrição de novo participante
              </Button>
            </Grid>
          )}

          <Grid item md={12} xs={12}>
            <Grid container>
              {steps.map((step, index) => (
                <Grid
                  item
                  xs={12}
                  md={12}
                  key={index}
                  style={{
                    display: activeStep === index ? "block" : "none",
                  }}
                >
                  {step.description}
                </Grid>
              ))}
            </Grid>
          </Grid>

          <Grid item md={12} xs={12}>
            {visibilityButtonStep && (
              <Grid
                container
                spacing={1}
                sx={{
                  padding: 1,
                  display: "flex",
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                <Grid
                  item
                  xs={12}
                  md={6}
                  sx={{
                    order: { xs: 1, md: 2 },
                    display: activeStep === steps.length - 1 ? "none" : "block",
                  }}
                >
                  <Button
                    fullWidth
                    disableElevation
                    disabled={!steps[activeStep]?.status || loading}
                    variant="contained"
                    onClick={handleNext}
                  >
                    {loading ? "Carregando..." : "Próximo"}
                  </Button>
                </Grid>
                <Grid item xs={12} md={6} sx={{ order: { xs: 2, md: 1 } }}>
                  <Button
                    fullWidth
                    disableElevation
                    onClick={
                      activeStep === 0 ? () => navigate("/home") : handleBack
                    }
                  >
                    {activeStep === 0 ? "Voltar pra Home" : "Voltar"}
                  </Button>
                </Grid>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default VerticalLinearStepper;
