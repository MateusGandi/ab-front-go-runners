import React, { useState } from "react";
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
import { Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "../../../utils/configAxios";
const REACT_APP_URL_BIBLIOTECA_RUNNERS =
  process.env.REACT_APP_URL_BIBLIOTECA_RUNNERS;

const NewForm = ({ alertCustom, resetPage }) => {
  const [campos, setCampos] = useState([]);
  const [open, setOpen] = useState(false);
  const [typeInput, setTypeInput] = useState("text");
  const [label, setLabel] = useState("");
  const [placeholder, setPlaceholder] = useState("");
  const [chips, setChips] = useState([]);
  const [newChip, setNewChip] = useState("");
  const [nomeForm, setNomeForm] = useState("");
  const [subtitleForm, setSubtitleForm] = useState("");

  const deleteCampo = (index) => {
    setCampos((prevCampos) =>
      prevCampos.filter((_, currentIndex) => currentIndex !== index)
    );
  };

  const handleSubmit = async () => {
    try {
      if (!nomeForm || !subtitleForm) {
        alertCustom("Favor, preencha o nome e o subtítulo do formulário!");
        return;
      }

      if (campos.length === 0) {
        alertCustom("Não é possível criar um formulário sem campos");
        return;
      }

      const invalidField = campos.find((campo) => {
        return (
          !campo.label ||
          !campo.placeholder ||
          !campo.type ||
          (campo.type === "select" && campo.options.length === 0)
        );
      });

      if (invalidField) {
        alertCustom(
          "Favor, preencha todos os campos do novo campo para prosseguir!"
        );
        return;
      }

      const data = {
        nome: nomeForm,
        subtitle: subtitleForm,
        campos: campos,
      };

      const response = await axios.post(
        `${REACT_APP_URL_BIBLIOTECA_RUNNERS}/v1/formulario/cadastrar`,
        data
      );
      reset();
      alertCustom(response.data.message);
      resetPage();
    } catch (error) {
      alertCustom("Não foi possível cadastrar o formulário!");
    }
  };

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
    setCampos([...campos, data]);
    setCampos([...campos, data]); // Atualize o estado global usando setCampos
    reset();
    handleClose();
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={12}>
        <Typography variant="h6">
          Novo formulário
          <Typography variant="body2" color="textSecondary">
            Personalize como desejar e informe os campos
          </Typography>
        </Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          type="text"
          id="nome"
          label="Nome do formulário"
          variant="standard"
          placeholder="Nome do formulário"
          onInput={(e) => setNomeForm(e.target.value)}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          type="text"
          id="subtitle"
          label="Subtítulo"
          variant="standard"
          placeholder="Subtítulo do formulário"
          onInput={(e) => setSubtitleForm(e.target.value)}
        />
      </Grid>

      {campos
        ? campos.map((campo, index) => (
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
                }}
                onClick={() => {
                  deleteCampo(index);
                }}
              />
            </Grid>
          ))
        : null}

      <Grid item xs={12} md={12} spacing={2}>
        <Grid
          container
          xs={12}
          md={12}
          spacing={1}
          style={{ justifyContent: "end" }}
        >
          <Grid item>
            <Button
              item
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
                      style={{ margin: "2px" }}
                      onDelete={() =>
                        setChips(chips.filter((_, i) => i !== index))
                      }
                    />
                  ))}
                </>
              ) : typeInput === "multiselect" ? (
                <></>
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

export default NewForm;
