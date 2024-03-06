import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import { Typography } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment"; // Adicionado

export default function NovaCategoriaModal({
  nameGroup,
  alertCustom,
  open,
  onClose,
  onSave,
}) {
  const [numVagas, setNumVagas] = useState("");
  const [titulo, setTitulo] = useState("");
  const [criterio, setCriterio] = useState("");
  const [preco, setPreco] = useState("");
  const reset = () => {
    setNumVagas("");
    setTitulo("");
    setCriterio("");
    setPreco("");
  };

  const formatNumber = (value) => {
    if (!value) return "";
    value = value.replace(/\D/g, "");
    value = value.replace(/(\d+)(\d{2})$/, "$1.$2");

    return value;
  };

  const handleSave = () => {
    // Validar se os campos estão preenchidos
    if (!titulo || !criterio || !numVagas || !preco) {
      alertCustom("Preencha todos os campos!");
      return;
    }

    const novaCategoria = {
      titulo: titulo,
      criterio: criterio,
      numVagas: numVagas,
      numVagasDisponiveis: numVagas,
      valorIngresso: preco,
      grupo: nameGroup,
    };

    onSave(novaCategoria);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        <Typography variant="h6">
          Nova Categoria
          <Typography variant="body2" color="secondaryText">
            Configure categoria
          </Typography>
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Título"
              fullWidth
              placeholder="Informe um título que identifique a categoria"
              variant="standard"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="text"
              id="Valor do ingresso"
              label="Valor do ingresso"
              variant="standard"
              placeholder="Valor do ingresso"
              value={formatNumber(preco)}
              onInput={(e) => setPreco(formatNumber(e.target.value))}
              onBlur={(e) => setPreco(Number(e.target.value).toFixed(2))}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">R$</InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Criterio"
              fullWidth
              placeholder="Informe um critério. Ex.: idade"
              variant="standard"
              value={criterio}
              onChange={(e) => setCriterio(e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Número de Vagas"
              fullWidth
              variant="standard"
              type="number"
              value={numVagas}
              onChange={(e) =>
                e.target.value >= 0 ? setNumVagas(e.target.value) : null
              }
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button disableElevation onClick={onClose}>
          Cancelar
        </Button>
        <Button
          disableElevation
          variant="contained"
          onClick={() => {
            handleSave();
            reset();
          }}
        >
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
