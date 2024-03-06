import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import { Typography, Tooltip, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";

import axios from "../../../utils/configAxios";
const REACT_APP_URL_BIBLIOTECA_RUNNERS =
  process.env.REACT_APP_URL_BIBLIOTECA_RUNNERS;

const RenderForm = ({ formData, alertCustom, resetPage }) => {
  const [feedback, setFeedback] = useState("");
  const [open, setOpen] = useState(false);
  const [campos, setCampos] = useState([]);
  const [typeInput, setTypeInput] = useState("text");
  const [label, setLabel] = useState("");
  const [placeholder, setPlaceholder] = useState("");
  const [chips, setChips] = useState([]);
  const [newChip, setNewChip] = useState("");

  const deleteCampo = (index) => {
    setFeedback("Clique em salvar para fixar as alterações");
    setCampos((prevCampos) =>
      prevCampos.filter((_, currentIndex) => currentIndex !== index)
    );
  };

  const handleSubmit = async () => {
    try {
      if (campos.length === 0) {
        return alertCustom("Não é possível criar um formulário sem campos");
      }
      const data = {
        ...formData,
        campos: campos,
      };
      const response = await axios.put(
        `${REACT_APP_URL_BIBLIOTECA_RUNNERS}/v1/formulario/atualizar-formulario/${formData.id}`,
        data
      );
      reset();
      alertCustom(response.data.message);
      resetPage();
    } catch (error) {
      console.log(error);
      alertCustom("Ocorreu um erro ao atualizar o formulário");
    }
  };

  const handleDelete = async () => {
    try {
      if (campos.length === 0) {
        return alertCustom("Não é possível criar um formulário sem campos");
      }
      const response = await axios.delete(
        `${REACT_APP_URL_BIBLIOTECA_RUNNERS}/v1/formulario/deletar-formulario/${formData.id}`
      );
      reset();
      alertCustom(response.data.message);
      resetPage();
    } catch (error) {
      console.log(error);
      alertCustom("Ocorreu um erro ao remover o formulário");
    }
  };

  useEffect(() => {
    if (formData && formData.campos) {
      setCampos(formData.campos);
    }
  }, [formData]);

  const reset = () => {
    setTypeInput("text");
    setLabel("");
    setPlaceholder("");
    setChips([]);
    setNewChip("");
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAction = () => {
    if (
      !label ||
      !placeholder ||
      !typeInput ||
      (typeInput === "select" && chips.length === 0)
    ) {
      alertCustom("Favor, preencha todos os campos para prosseguir!");
      return;
    }

    const data = {
      label: label,
      placeholder: placeholder,
      options: typeInput === "select" ? chips : [],
      group: "",
      type: typeInput,
      multiple: typeInput === "multiselect",
    };
    setFeedback("Clique em salvar para fixar as alterações");
    setCampos([...campos, data]);
    reset();
    handleClose();
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={12}>
        <Grid
          container
          spacing={2}
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <Grid item xs={9} md={9}>
            <Typography variant="h6">
              {formData.nome}
              <Typography variant="body2" color="textSecondary">
                {formData.subtitle}
              </Typography>
            </Typography>
          </Grid>
          <Grid item>
            <Tooltip title="Excluir" onClick={handleDelete}>
              <IconButton>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Grid>

          {campos ? (
            campos.map((campo, index) => (
              <Grid
                item
                xs={12}
                md={6}
                key={index}
                style={{
                  display: "flex",
                  justifyContent: "end",
                  flexWrap: "wrap",
                  position: "relative",
                }}
              >
                {campo.type === "select" ? (
                  <FormControl fullWidth variant="standard">
                    <InputLabel id={`label-${index}`}>{campo.label}</InputLabel>
                    <Select
                      labelId={`label-${index}`}
                      id={`select-${index}`}
                      label={campo.label}
                    >
                      {campo.options.map((item, index) => (
                        <MenuItem key={index} value={item}>
                          {item}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                ) : (
                  <TextField
                    fullWidth
                    type={campo.type}
                    id={`text-${index}`}
                    label={campo.label}
                    variant="standard"
                    placeholder={campo.placeholder}
                  />
                )}
                <CloseIcon
                  style={{
                    cursor: "pointer",
                    fontSize: 15,
                    position: "absolute",
                    top: "25px",
                    right: "5px",
                  }}
                  onClick={() => {
                    deleteCampo(index);
                  }}
                />
              </Grid>
            ))
          ) : (
            <Typography variant="body2">Nãp há campos cadastrados</Typography>
          )}

          <Grid item xs={12} md={12}>
            <Grid
              container
              xs={12}
              md={12}
              spacing={1}
              style={{ justifyContent: "end" }}
            >
              <Grid item>
                <Button
                  variant="text"
                  color="primary"
                  onClick={handleOpen}
                  disableElevation
                >
                  Novo campo
                </Button>
              </Grid>

              <Grid item>
                <Button
                  variant="text"
                  color="primary"
                  onClick={resetPage}
                  disableElevation
                >
                  Cancelar
                </Button>
              </Grid>

              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                  disableElevation
                >
                  Salvar
                </Button>
              </Grid>
              <Grid item xs={12} md={12}>
                <Typography
                  variant="body2"
                  style={{ width: "100%", textAlign: "right" }}
                  color="textSecondary"
                >
                  {feedback && `Atenção: ${feedback}`}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Inserir novo campo</DialogTitle>
        <DialogContent style={{ maxWidth: "350px" }}>
          <Typography variant="body2" color="textSecondary">
            Pré configure o campo que deseja adicionar
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={12}>
              <TextField
                fullWidth
                id="standard-basic"
                label="Label"
                variant="standard"
                value={label}
                onInput={(e) => setLabel(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <TextField
                fullWidth
                id="standard-basic"
                label="Placeholder"
                variant="standard"
                value={placeholder}
                onInput={(e) => setPlaceholder(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Tipo do campo
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={typeInput}
                  label="Tipo do campo"
                  onChange={(e) => setTypeInput(e.target.value)}
                >
                  <MenuItem value="text">Texto</MenuItem>
                  <MenuItem value="select">Seleção</MenuItem>
                  <MenuItem value="number">Número</MenuItem>
                  <MenuItem value="date">Data</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={12}>
              {typeInput === "select" ? (
                <>
                  <TextField
                    fullWidth
                    id="chip-input"
                    label="Adicionar opções"
                    variant="outlined"
                    placeholder="Digite e tecle Enter"
                    value={newChip}
                    onInput={(e) => setNewChip(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && newChip.trim() !== "") {
                        setChips([...chips, newChip.trim()]);
                        setNewChip("");
                      }
                    }}
                  />

                  {chips.map((chip, index) => (
                    <Chip
                      key={index}
                      label={chip}
                      onDelete={() =>
                        setChips(chips.filter((_, i) => i !== index))
                      }
                      style={{ margin: "2px" }}
                    />
                  ))}
                </>
              ) : null}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <Button
            onClick={handleClose}
            variant="text"
            disableElevation
            color="primary"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleAction}
            variant="contained"
            disableElevation
            color="primary"
          >
            Criar
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default RenderForm;
