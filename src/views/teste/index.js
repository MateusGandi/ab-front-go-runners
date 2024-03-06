import React, { useState } from "react";
import DivField from "../../components/Fields/";
import image from "../../images/teste.png";
import HorizontalNonLinearStepper from "./stepper.js";
import Inscrição from "./Etapas/inscricao.js";
import Dados from "./Etapas/dados.js";
import Categoria from "./Etapas/categoria.js";

export default function Teste() {
  const [activeStep, setActiveStep] = useState(0);

  const handleStepChange = (step) => {
    setActiveStep(step);
  };

  return (
    <>
      <DivField required image={image}>
        <HorizontalNonLinearStepper
          activeStep={activeStep}
          onChangeStep={handleStepChange}
        />
        {activeStep === 0 && <Inscrição />}
        {activeStep === 1 && <Dados />}
        {activeStep === 2 && <Categoria />}
      </DivField>
    </>
  );
}
