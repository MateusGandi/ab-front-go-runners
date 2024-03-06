import React, { useState } from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { Typography } from "@mui/material";
import axios from "../../../utils/configAxios";
const REACT_APP_URL_BIBLIOTECA_RUNNERS =
  process.env.REACT_APP_URL_BIBLIOTECA_RUNNERS;

const NewOrganizador = ({ alertCustom, resetPage }) => {
  const [dadosOrganizador, setDadosOrganizador] = useState({
    nome: "",
    contato: "",
    email: "",
    telefone: "",
    site: "",
  });

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
        alertCustom("Telefone inválido!");
        return;
      }

      const response = await axios.post(
        `${REACT_APP_URL_BIBLIOTECA_RUNNERS}/v1/evento/cadastrar-organizador`,
        dadosOrganizador
      );
      reset();
      alertCustom(response.data.message);
      resetPage();
    } catch (error) {
      alertCustom("Não foi possível cadastrar o organizador!");
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

  const phoneMask = (value) => {
    if (!value) return "";

    value = value.replace(/\D/g, "");
    value = value.replace(/(\d{2})(\d)/, "($1) $2");
    value = value.replace(/(\d)(\d{4})$/, "$1-$2");
    return value;
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={12}>
        <Typography variant="h6">
          Novo organizador
          <Typography variant="body2" color="textSecondary">
            Responsável direto pelos eventos
          </Typography>
        </Typography>
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
          required // Campo obrigatório
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
          required // Campo obrigatório
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
          required // Campo obrigatório
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          type="text"
          id="site"
          label="Site"
          variant="standard"
          placeholder="Site do organizador"
          value={dadosOrganizador.site}
          onInput={(e) =>
            setDadosOrganizador({
              ...dadosOrganizador,
              site: e.target.value,
            })
          }
        />
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
