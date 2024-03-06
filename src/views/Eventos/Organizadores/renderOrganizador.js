import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { Typography, Tooltip, IconButton } from "@mui/material";
import axios from "../../../utils/configAxios";
import DeleteIcon from "@mui/icons-material/Delete";

const REACT_APP_URL_BIBLIOTECA_RUNNERS =
  process.env.REACT_APP_URL_BIBLIOTECA_RUNNERS;

const NewOrganizador = ({ organizadorData, alertCustom, resetPage }) => {
  const [dadosOrganizador, setDadosOrganizador] = useState({
    nome: organizadorData.nome,
    contato: organizadorData.contato,
    email: organizadorData.email,
    telefone: organizadorData.telefone,
    site: organizadorData.site,
  });

  const phoneMask = (value) => {
    if (!value) return "";

    value = value.replace(/\D/g, "");
    value = value.replace(/(\d{2})(\d)/, "($1) $2");
    value = value.replace(/(\d)(\d{4})$/, "$1-$2");
    return value;
  };

  useEffect(() => {
    if (organizadorData) {
      setDadosOrganizador({
        nome: organizadorData.nome,
        contato: organizadorData.contato,
        email: organizadorData.email,
        telefone: organizadorData.telefone,
        site: organizadorData.site,
      });
    }
  }, [organizadorData]);

  const handleSubmit = async () => {
    try {
      // Adicionando validações aos campos
      if (
        !dadosOrganizador.nome ||
        !dadosOrganizador.email ||
        !dadosOrganizador.telefone
      ) {
        alertCustom("Favor, preencha todos os campos obrigatórios!");
        return;
      }

      if (dadosOrganizador.telefone.length < 13) {
        alertCustom("Telefone deve ter no mínimo 13 dígitos!");
        return;
      }

      const response = await axios.put(
        `${REACT_APP_URL_BIBLIOTECA_RUNNERS}/v1/evento/atualizar-organizador/${organizadorData.id}`,
        dadosOrganizador
      );
      reset();
      alertCustom(response.data.message);
      resetPage();
    } catch (error) {
      alertCustom("Não foi possível atualizar o organizador!");
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `${REACT_APP_URL_BIBLIOTECA_RUNNERS}/v1/evento/remover-organizador/${organizadorData.id}`
      );
      reset();
      alertCustom(response.data.message);
      resetPage();
    } catch (error) {
      alertCustom("Não foi possível remover o organizador!");
    }
  };

  const reset = () => {
    setDadosOrganizador({
      nome: "",
      contato: "",
      email: "",
      telefone: "",
      site: "",
    });
  };

  return (
    <Grid container>
      <Grid
        container
        spacing={2}
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <Grid item xs={9} md={9}>
          <Typography variant="h6">
            Editar organizador
            <Typography variant="body2" color="textSecondary">
              Responsável direto pelos eventos
            </Typography>
          </Typography>
        </Grid>

        <Grid item>
          <Tooltip title="Excluir">
            <IconButton onClick={handleDelete}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            type="text"
            id="nome"
            label="Nome do organizador"
            variant="standard"
            placeholder="Nome do organizador"
            value={dadosOrganizador.nome}
            onInput={(e) =>
              setDadosOrganizador({
                ...dadosOrganizador,
                nome: e.target.value,
              })
            }
            required
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            type="text"
            id="contato"
            label="Nome do contato"
            variant="standard"
            placeholder="Contato do organizador"
            value={dadosOrganizador.contato}
            onInput={(e) =>
              setDadosOrganizador({
                ...dadosOrganizador,
                contato: e.target.value,
              })
            }
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            type="email"
            id="email"
            label="E-mail"
            variant="standard"
            placeholder="E-mail do organizador"
            value={dadosOrganizador.email}
            onInput={(e) =>
              setDadosOrganizador({
                ...dadosOrganizador,
                email: e.target.value,
              })
            }
            required
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            type="tel"
            id="telefone"
            label="Telefone"
            variant="standard"
            placeholder="Telefone do organizador"
            value={dadosOrganizador.telefone}
            onChange={(event) => {
              setDadosOrganizador({
                ...dadosOrganizador,
                telefone: phoneMask(event.target.value),
              });
            }}
            onInput={(event) => {
              setDadosOrganizador({
                ...dadosOrganizador,
                telefone: phoneMask(event.target.value),
              });
            }}
            inputProps={{ maxLength: 15 }}
            required
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            type="text"
            id="site"
            label="Site"
            variant="standard"
            value={dadosOrganizador.site}
            placeholder="Site do organizador"
            onInput={(e) =>
              setDadosOrganizador({
                ...dadosOrganizador,
                site: e.target.value,
              })
            }
          />
        </Grid>
      </Grid>
      <Grid item xs={12} md={12} sx={{ padding: 1 }}>
        <Grid container xs={12} md={12} spacing={2}>
          <Grid item xs={6} md={6}>
            <Button
              fullWidth
              variant="text"
              color="primary"
              onClick={resetPage}
              disableElevation
            >
              Cancelar
            </Button>
          </Grid>
          <Grid item xs={6} md={6}>
            <Button
              fullWidth
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
    </Grid>
  );
};

export default NewOrganizador;
