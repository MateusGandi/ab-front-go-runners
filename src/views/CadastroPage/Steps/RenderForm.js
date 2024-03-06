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
import Paper from "@mui/material/Paper";
import axios from "../../../utils/configAxios";
import { DivIcon } from "leaflet";
const REACT_APP_URL_BIBLIOTECA_RUNNERS =
  process.env.REACT_APP_URL_BIBLIOTECA_RUNNERS;

const RenderForm = ({
  pivo,
  setPivo,
  formData,
  dadosCadastro,
  setDadosCadastro,
  setRespondidos,
}) => {
  const [campos, setCampos] = useState([]);

  useEffect(() => {
    if (
      dadosCadastro.dependentes[pivo] &&
      dadosCadastro.dependentes[pivo].formulario.length === 0
    ) {
      // Zerar as respostas dos campos quando o formulário estiver vazio
      setCampos(formData.campos.map((campo) => ({ ...campo, resposta: "" })));
    } else if (dadosCadastro.dependentes[pivo]) {
      setCampos(dadosCadastro.dependentes[pivo].formulario);
    }
  }, [dadosCadastro, formData, pivo]);

  const handleFieldChange = (index, value) => {
    const updatedCampos = [...campos];
    updatedCampos[index].resposta = value;
    setCampos(updatedCampos);

    const allFieldsAnswered = updatedCampos.every(
      (campo) => campo.resposta && campo.resposta.trim() !== ""
    );
    setRespondidos(allFieldsAnswered);

    // Atualizar o estado dos dados do cadastro
    const updatedFormulario = updatedCampos.map((campo) => ({
      input: campo.label,
      resposta: campo.resposta,
    }));

    setDadosCadastro((prevState) => ({
      ...prevState,
      dependentes: prevState.dependentes.map((dependente, index) =>
        index === pivo
          ? {
              ...dependente,
              formulario: updatedFormulario,
            }
          : dependente
      ),
    }));
  };

  return (
    <Paper
      elevation={0}
      sx={{
        padding: 2,
        height: { xs: "52vh", md: "60vh" },
        overflowX: "scroll",
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} md={12}>
          <Grid
            container
            spacing={1}
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Grid
              item
              xs={12}
              md={12}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "16px",
                flexWrap: "wrap",
              }}
            >
              <Typography variant="h6">
                {formData.nome}
                <Typography variant="body1" color="textSecondary">
                  {formData.subtitle.toLowerCase()}
                </Typography>

                <Typography variant="body2" color="textSecondary">
                  Precisamos saber mais sobre
                  <span style={{ marginLeft: "5px", fontWeight: "bold" }}>
                    {pivo > 0 && dadosCadastro.dependentes[pivo]
                      ? dadosCadastro.dependentes[pivo].nome
                      : "você"}
                  </span>
                  , favor, responder às perguntas abaixo
                </Typography>
              </Typography>

              <Chip
                label={
                  dadosCadastro.dependentes[pivo]
                    ? dadosCadastro.dependentes[pivo].nome
                    : ""
                }
                style={{ margin: "1px" }}
              />
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
                    <FormControl fullWidth variant="outlined">
                      <InputLabel id={`label-${index}`}>
                        {campo.label}
                      </InputLabel>
                      <Select
                        labelId={`label-${index}`}
                        id={`select-${index}`}
                        label={campo.label}
                        value={campo.resposta || ""}
                        placeholder={campo.placeholder}
                        onChange={(e) =>
                          handleFieldChange(index, e.target.value)
                        }
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
                      variant="outlined"
                      placeholder={campo.placeholder}
                      value={campo.resposta || ""}
                      onChange={(e) => handleFieldChange(index, e.target.value)}
                    />
                  )}
                </Grid>
              ))
            ) : (
              <Typography variant="body2">Nenhum campo cadastrado</Typography>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default RenderForm;
