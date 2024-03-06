import React from "react";
import EnhancedTable from "../../../components/Table/";
import { Tooltip } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";

const RenderData = ({ dados }) => {
  // Função para renderizar as células de ação

  // Label para o componente EnhancedTable
  const label = "Participantes";

  // Definição das células do cabeçalho
  let headCells = [
    {
      id: "TRANSACAO",
      numeric: false,
      disablePadding: true,
      label: "Transação",
      width: 150,
    },
    {
      id: "NOME",
      numeric: false,
      disablePadding: true,
      label: "Nome",
      width: 150,
    },
    {
      id: "STATUS",
      numeric: false,
      disablePadding: true,
      label: "Status",
      width: 120,
    },
    {
      id: "EMAIL",
      numeric: false,
      disablePadding: true,
      label: "Email",
      width: 200,
    },
    {
      id: "DOCUMENTO",
      numeric: false,
      disablePadding: true,
      label: "Documento",
      width: 120,
    },
    {
      id: "DATANASC",
      numeric: false,
      disablePadding: true,
      label: "Nascimento",
      width: 120,
    },
    {
      id: "VALORTOTAL",
      numeric: true,
      disablePadding: true,
      label: "Total",
      width: 120,
    },
    {
      id: "CATEGORIANAME",
      numeric: false,
      disablePadding: true,
      label: "Categoria",
      width: 120,
    },
    {
      id: "DATAINSCRICAO",
      numeric: false,
      disablePadding: true,
      label: "Inscrição",
      width: 120,
    },
  ];

  // Adicionar colunas para os kits dinamicamente
  let indiceAnterior = -1;
  for (const row of dados) {
    const kitColumns = [];
    if (row.KITS.length > indiceAnterior) {
      indiceAnterior = row.KITS.length;
      row.KITS.map((value, index) => {
        console.log("teste length", index);

        kitColumns.push({
          id: `KIT_${index}`,
          numeric: false,
          disablePadding: true,
          label: `[Kit] Item ${index + 1}`,
          width: 150,
        });
      });
    }
    //console.log("testett", kitColumns);
    headCells = [...headCells, ...kitColumns];
  }

  return <EnhancedTable rows={dados} headCells={headCells} label={label} />;
};

export default RenderData;
