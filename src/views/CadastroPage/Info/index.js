import * as React from "react";
import Chip from "@mui/material/Chip";
import FlagCircleRoundedIcon from "@mui/icons-material/FlagCircleRounded";
import Typography from "@mui/material/Typography";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import Grid from "@mui/material/Grid";

export default function HorizontalNonLinearStepper() {
  const raceData = {
    description:
      "A corrida VOLTA DA LAGOA DA CONCEIÇÃO está em sua 13° edição acontecerá no dia 17 de dezembro de 2023 com quaisquer condições climáticas. A corrida terá distância de 5 km e 12 km, individual, revezamento e caminhada.",
    title1: "TAGS",
    tags: [
      {
        icon: <FlagCircleRoundedIcon />,
        label: "PACORSJ-Associação dos Corredores de Rua de São José",
      },
      {
        icon: <EventOutlinedIcon />,
        label: "17/12/2023",
      },
      {
        icon: <LocationOnOutlinedIcon />,
        label:
          "Lagoa da Conceição: R. Hyppólito do Valle Pereira, 620, Florianópolis, SC, Brasil",
      },
    ],
    title2: "RETIRADA DE KIT",
    kitInfo:
      "Todo participante regularmente inscrito na CORRIDA terá direito a um kit exclusivo, conforme escolha no ato da inscrição.",
    title3: "ENTREGA DE KITS",
    kitDeliveryInfo:
      "Dia 16 de dezembro de 2023.LOJA STZR. Deodoro, 94 - Centro, Florianópolis - SC, 88010-02008:30 ás 17:30 min",
    title4: "DOCUMENTOS E RETIRADA POR TERCEIROS",
    kitDocsInfo:
      "Para retirar o kit, o participante deverá apresentar a confirmação da inscrição, o comprovante de pagamento e um documento oficial (RG ou Carteira de Habilitação).\n\nCaso o participante não possa retirar o kit pessoalmente, outra pessoa poderá retirá-lo em seu lugar. Para isto, esta pessoa deverá levar uma autorização por escrito do referido participante (MODELO EM ANEXO), na qual conste o nome, RG e telefone de quem está retirando, acompanhado da confirmação da inscrição e/ou boleto bancário pago.",
  };

  return (
    <div>
      <p style={{ textAlign: "justify" }}>{raceData.description}</p>
      <Typography variant="h6">{raceData.title1}</Typography>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Chip
            sx={{
              height: "auto",
              "& .MuiChip-label": {
                display: "block",
                //whiteSpace: "normal",
              },
            }}
            {...raceData.tags[0]}
          />
        </Grid>
        <Grid item xs={12}>
          <Chip
            sx={{
              height: "auto",
              "& .MuiChip-label": {
                display: "block",
                whiteSpace: "normal",
              },
            }}
            {...raceData.tags[1]}
          />
        </Grid>
        <Grid item xs={12}>
          <Chip
            sx={{
              height: "auto",
              "& .MuiChip-label": {
                display: "block",
                whiteSpace: "normal",
              },
            }}
            style={{ maxWidht: "300px" }}
            {...raceData.tags[2]}
          />
        </Grid>
      </Grid>

      <Typography variant="h6">{raceData.title2}</Typography>
      <p style={{ textAlign: "justify" }}>{raceData.kitInfo}</p>

      <Typography variant="h6">{raceData.title3}</Typography>
      <p style={{ textAlign: "justify" }}>{raceData.kitDeliveryInfo}</p>

      <Typography variant="h6">{raceData.title4}</Typography>
      <p style={{ textAlign: "justify" }}>{raceData.kitDocsInfo}</p>
    </div>
  );
}
