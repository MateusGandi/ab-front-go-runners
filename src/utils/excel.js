import * as XLSX from "xlsx";
import React, { useState, useEffect } from "react";
import { Button } from "@mui/material";
import GetAppIcon from "@mui/icons-material/GetApp";
// Função auxiliar para converter string em ArrayBuffer
const s2ab = (s) => {
  const buf = new ArrayBuffer(s.length);
  const view = new Uint8Array(buf);
  for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
  return buf;
};

const downloadExcel = (data, filename) => {
  // Cria um novo workbook
  const wb = XLSX.utils.book_new();
  // Converte a tabela em uma planilha Excel
  const ws = XLSX.utils.json_to_sheet(data);
  // Adiciona a planilha ao workbook
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  // Converte o workbook em um arquivo binário Excel
  const wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });
  // Converte o arquivo binário em um Blob
  const blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });
  // Cria um link temporário para download
  const url = window.URL.createObjectURL(blob);
  // Cria um link de download e simula o clique nele
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  // Remove o link temporário
  setTimeout(() => {
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }, 0);
};

const ExportToExcelButton = ({ data, filename }) => {
  return (
    <Button
      fullWidth
      disableElevation
      variant="contained"
      color="success"
      onClick={() => downloadExcel(data, filename)}
    >
      <GetAppIcon />
      Baixar Excel
    </Button>
  );
};

export default ExportToExcelButton;
