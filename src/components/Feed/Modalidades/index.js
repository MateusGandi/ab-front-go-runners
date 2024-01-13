// Feed.js
import Grid from "@mui/material/Grid";
import React, { useRef, useState } from "react";
import SimplePaper from "../../Paper/";

const Feed = () => {
  const [selectedCard, setSelectedCard] = useState(null);

  const handleCardClick = (index) => {
    // Removido o teste !isDragging aqui para permitir clique mesmo durante o arraste
    setSelectedCard(index === selectedCard ? null : index);
  };

  const data = [
    { lote: 1, descricao: "Descrição 1", vagas: 5 },
    { lote: 2, descricao: "Descrição 2", vagas: 0 },
    { lote: 3, descricao: "Descrição 3", vagas: 3 },
    { lote: 3, descricao: "Descrição 3", vagas: 3 },
    { lote: 3, descricao: "Descrição 3", vagas: 3 },
    { lote: 3, descricao: "Descrição 3", vagas: 3 },
    { lote: 3, descricao: "Descrição 3", vagas: 3 },
    { lote: 3, descricao: "Descrição 3", vagas: 3 },
    { lote: 3, descricao: "Descrição 3", vagas: 3 },
    { lote: 3, descricao: "Descrição 3", vagas: 7 },
    { lote: 3, descricao: "Descrição 3", vagas: 3 },
    // ... adicione mais dados conforme necessário
  ];

  return (
    <Grid
      container
      spacing={2}
      style={{ padding: "10px", backgroundColor: "#ECECEC" }}
    >
      {data.map((group, index) => (
        <Grid item xs={12} md={2} key={index}>
          <SimplePaper xs={12} md={12} item key={index} data={group} />
        </Grid>
      ))}
    </Grid>
  );
};

export default Feed;
