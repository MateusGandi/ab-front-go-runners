import React, { useEffect, useState } from "react";
import { loadMercadoPago } from "@mercadopago/sdk-js";
import axios from "axios";

const PaymentBrick = () => {
  const [initialized, setInitialized] = useState(false);
  let mp;
  let url = "APP_USR-4bc9a7f1-f380-40a2-830d-66da3991b91e";
  const renderPaymentBrick = async (bricksBuilder) => {
    const settings = {
      initialization: {
        amount: 10000,
        payer: {
          firstName: "",
          lastName: "",
          email: "",
        },
      },
      customization: {
        visual: {
          style: {
            theme: "default",
          },
        },
        paymentMethods: {
          creditCard: "all",
          debitCard: "all",
          ticket: "all",
          bankTransfer: "all",
          atm: "all",
          onboarding_credits: "all",
          wallet_purchase: "all",
          maxInstallments: 1,
        },
      },
      callbacks: {
        onReady: () => {
          // Callback chamado quando o Brick está pronto.
          // Aqui, você pode ocultar seu site, por exemplo.
        },
        onSubmit: async ({ selectedPaymentMethod, formData }) => {
          // Callback chamado quando há clique no botão de envio de dados
          return new Promise(async (resolve, reject) => {
            try {
              const response = await axios.post(
                "https://73b9-201-88-57-248.ngrok-free.app/criar-pagamento/",
                formData,
                {
                  headers: {
                    "Content-Type": "application/json",
                  },
                }
              );

              // Lógica adicional, se necessário, com a resposta do servidor
              console.log("mateus respostas", response.data);
                
              resolve();
            } catch (error) {
              console.log("mateus respostas", error);
              reject();
            }
          });
        },

        onError: (error) => {
          // Callback chamado para todos os casos de erro do Brick
          console.error(error);
        },
      },
    };
    console.log(mp);
    mp.paymentBrickController = await bricksBuilder.create(
      "payment",
      "paymentBrick_container",
      settings
    );
  };

  useEffect(() => {
    if (!initialized) {
      setInitialized(true);

      loadMercadoPago().then(() => {
        mp = new window.MercadoPago(url, {
          locale: "pt-BR",
        });

        const bricksBuilder = mp.bricks();
        renderPaymentBrick(bricksBuilder);
      });
    }
  }, [initialized]);

  return <div id="paymentBrick_container"></div>;
};

export default PaymentBrick;
