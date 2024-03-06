import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import { Paper, Typography, CardHeader } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment"; // Adicionado
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import { Card } from "react-bootstrap";

export default function RenderCategoriaModal({
  nameGroup,
  alertCustom,
  open,
  onClose,
  onSave,
  onDelete,
  categoriaEditar,
}) {
  const [numVagas, setNumVagas] = useState(0);
  const [numVagasDisponiveis, setNumVagasDisponiveis] = useState(0);
  const [titulo, setTitulo] = useState("");
  const [criterio, setCriterio] = useState("");
  const [preco, setPreco] = useState("");

  const formatNumber = (value) => {
    if (!value) return "";
    value = value.replace(/\D/g, "");
    value = value.replace(/(\d+)(\d{2})$/, "$1.$2");

    return value;
  };

  useEffect(() => {
    if (categoriaEditar) {
      setNumVagas(categoriaEditar.numVagas || 0);
      setNumVagasDisponiveis(categoriaEditar.numVagasDisponiveis || 0);
      setTitulo(categoriaEditar.titulo || "");
      setCriterio(categoriaEditar.criterio || "");
      setPreco(categoriaEditar.valorIngresso || 0);
      console.log("teste", categoriaEditar);
    }
  }, [categoriaEditar]);

  const reset = () => {
    if (categoriaEditar) {
      setNumVagas(categoriaEditar.numVagas || 0);
      setNumVagasDisponiveis(categoriaEditar.numVagasDisponiveis || 0);
      setTitulo(categoriaEditar.titulo || "");
      setCriterio(categoriaEditar.criterio || "");
      setPreco(categoriaEditar.valorIngresso || "");
    }
  };

  const handleSave = () => {
    if (
      !titulo ||
      !criterio ||
      numVagas < 0 ||
      numVagasDisponiveis < 0 ||
      !preco
    ) {
      alertCustom("Preencha todos os campos!");
      return;
    }

    if (numVagasDisponiveis > numVagas) {
      alertCustom("Número de vagas disponíveis ultrapassa o total de vagas!");
      return;
    }

    const novaCategoria = {
      valorIngresso: preco,
      titulo: titulo,
      criterio: criterio,
      numVagas: numVagas,
      numVagasDisponiveis: numVagasDisponiveis,
      grupo: nameGroup,
    };

    onSave(novaCategoria, true, categoriaEditar);
    onClose();
  };

  const handleDelete = () => {
    onDelete(categoriaEditar);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        <Typography variant="h6">
          Editar Categoria
          <Typography variant="body2" color="secondaryText">
            Altere os dados da categoria
          </Typography>
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              disabled={true}
              label="Título"
              fullWidth
              variant="standard"
              placeholder="Informe um título que identifique a categoria"
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
              disabled={true}
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
              disabled={true}
              label="Número de vagas"
              fullWidth
              variant="standard"
              type="number"
              value={numVagas}
              onChange={(e) => setNumVagas(Math.max(0, +e.target.value))}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Número de vagas disponíveis"
              fullWidth
              variant="standard"
              type="number"
              value={numVagasDisponiveis}
              onChange={(e) =>
                setNumVagasDisponiveis(Math.max(0, +e.target.value))
              }
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <Card variant="outlined">
              <CardHeader
                avatar={<ReportProblemIcon fontSize="small" />}
                title={
                  <Typography color="textSecondary" variant="body2">
                    Alguns dos campos não podem ser editados pois são
                    compartilhados com outros eventos.
                  </Typography>
                }
              />
            </Card>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        {categoriaEditar && (
          <Button variant="text" onClick={handleDelete} disableElevation>
            Excluir
          </Button>
        )}
        <Button
          disableElevation
          onClick={() => {
            onClose();
            reset();
          }}
        >
          Cancelar
        </Button>
        <Button variant="contained" onClick={handleSave} disableElevation>
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
