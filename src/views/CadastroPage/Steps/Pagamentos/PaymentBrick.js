//checkoutMercadoPago.tsx
import React, { useEffect, useState } from "react";
import { initMercadoPago, Payment } from "@mercadopago/sdk-react";
import Dialog from "./Dialog";
import axios from "../../../../utils/configAxios";
import DataAttemp from "../../../../utils/DataAttemp";
const REACT_APP_URL_BIBLIOTECA_RUNNERS_HTTPS =
  process.env.REACT_APP_URL_BIBLIOTECA_RUNNERS_HTTPS;

const REACT_APP_EXTERNAL_REFERENCE_BIBLIOTECA_RUNNERS =
  process.env.REACT_APP_EXTERNAL_REFERENCE_BIBLIOTECA_RUNNERS;
//TEST-bc544065-a388-4d0f-8955-b8e6ea1b0123
initMercadoPago("APP_USR-4bc9a7f1-f380-40a2-830d-66da3991b91e", {
  locale: "pt-BR",
});

const CheckoutMercadoPago = ({
  eventoData,
  dadosCadastro,
  financeiro,
  themeType,
  alertCustom,
}) => {
  const [response, setResponse] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const dataMaganer = DataAttemp();
  const handleOpenDialog = (respostas) => {
    setResponse(respostas.data);
    setOpenDialog(true);
  };

  const initialization = dataMaganer.userData &&
    dataMaganer.userData.nome && {
      amount: Number(financeiro.valorTotal).toFixed(2),
      payer: {
        firstName: dataMaganer.userData.nome.split(" ")[0],
        lastName:
          dataMaganer.userData.nome.split(" ")[
            dataMaganer.userData.nome.split(" ").length - 1
          ],
        email: dataMaganer.userData.auth.email,
      },
      external_reference: REACT_APP_EXTERNAL_REFERENCE_BIBLIOTECA_RUNNERS,
    };
  const customization = {
    visual: {
      hideFormTitle: true,
      style: {
        theme: themeType,
        customVariables: {
          formBackgroundColor: "transparent",
          borderRadiusMedium: "5px",
        },
      },
    },

    paymentMethods: {
      ticket: "all",
      bankTransfer: "all",
      creditCard: "all",
      mercadoPago: "all",
    },
  };
  const onSubmit = async ({ selectedPaymentMethod, formData, customAlert }) => {
    return new Promise((resolve, reject) => {
      axios
        .post(
          `${REACT_APP_URL_BIBLIOTECA_RUNNERS_HTTPS}/v1/pagamentos/cadastrar`,
          {
            body: {
              ...formData,
              external_reference: "testemateusmateusgandi",
            },
            percDesconto: eventoData.desconto,
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
          handleOpenDialog(response.data);
          resolve();
        })
        .catch((error) => {
          alertCustom(
            "Ocorreu um erro ao processar solicitação, tente mais tarde ou selecione outra forma de pagamento!"
          );
          reject();
        });
    });
  };
  const onError = async (error) => {
    console.log(error);
  };
  const onReady = async () => {};

  return (
    <>
      <Payment
        initialization={initialization}
        customization={customization}
        onSubmit={onSubmit}
        onReady={onReady}
        onError={onError}
      />
      {response && (
        <Dialog
          alertCustom={alertCustom}
          openDialog={openDialog}
          setOpenDialog={setOpenDialog}
          response={response}
        />
      )}
    </>
  );
};

export default CheckoutMercadoPago;
