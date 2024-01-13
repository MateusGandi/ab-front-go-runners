import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

const steps = [
  {
    label: "Selecionar circuito e lote",
    numero: 1,
    descricao:
      "Selecione o circuito que deseja correr e o lote respectivo para sua faixa etária...",
  },
  {
    label: "Dados pessoais e questionário",
    numero: 2,
    descricao:
      "Caso possua uma conta, clique aqui e pule esse passo! Se não, crie agora mesmo aqui!",
  },
  {
    label: "Realize o pagamento",
    numero: 3,
    descricao:
      "Realize o pagamento para confirmar sua inscrição, caso o mesmo não seja efetuado, sua vaga será liberada e sua inscrição cancelada...",
  },
];

export default function HorizontalNonLinearStepper({
  activeStep,
  onChangeStep,
}) {
  const [completed, setCompleted] = React.useState({});

  const totalSteps = () => {
    return steps.length;
  };

  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };

  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? steps.findIndex((step, i) => !(i in completed))
        : activeStep + 1;
    onChangeStep(newActiveStep);
  };

  const handleBack = () => {
    onChangeStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStep = (step) => () => {
    onChangeStep(step);
  };

  const handleComplete = () => {
    const newCompleted = completed;
    newCompleted[activeStep] = true;
    setCompleted(newCompleted);
    handleNext();
  };

  const handleReset = () => {
    onChangeStep(0);
    setCompleted({});
  };

  return (
    <Box>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((labelObj, index) => (
          <Step key={labelObj.label}>
            <StepLabel onClick={handleStep(index)}>{labelObj.label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <div>
        {allStepsCompleted() ? (
          <React.Fragment>
            <Typography sx={{ mt: 2, mb: 1 }}>
              All steps completed - you&apos;re finished
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Box sx={{ flex: "1 1 auto" }} />
              <Button onClick={handleReset}>Reset</Button>
            </Box>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Typography sx={{ mt: 2, mb: 1, py: 1 }} textAlign={"center"}>
              {steps[activeStep].descricao}
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Button
                color="inherit"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Anterior
              </Button>
              <Box sx={{ flex: "1 1 auto" }} />
              <Button onClick={handleNext} sx={{ mr: 1 }}>
                Próximo
              </Button>
              {activeStep !== steps.length &&
                (completed[activeStep] ? (
                  <Typography
                    variant="caption"
                    sx={{ display: "inline-block" }}
                  >
                    Etapa {activeStep + 1} já completado
                  </Typography>
                ) : (
                  <Button onClick={handleComplete}>
                    {completedSteps() === totalSteps() - 1
                      ? "Finalizar"
                      : "Completar etapa"}
                  </Button>
                ))}
            </Box>
          </React.Fragment>
        )}
      </div>
    </Box>
  );
}
