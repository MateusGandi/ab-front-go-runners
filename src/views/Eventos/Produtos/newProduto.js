import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Autocomplete from "../../../components/AutoComplete/";
import ChipInput from "../../../components/ChipInput";
import InputAdornment from "@mui/material/InputAdornment";
import axios from "../../../utils/configAxios";
import { Paper, Typography } from "@mui/material";

const REACT_APP_URL_BIBLIOTECA_RUNNERS =
  process.env.REACT_APP_URL_BIBLIOTECA_RUNNERS;

const NewProduto = ({ setNewProduto, tabelas, alertCustom, resetPage }) => {
  const [dadosProduto, setDadosProduto] = useState({
    nomeTabela: "DEFAULT",
    preco: "",
    percentualDesconto: "",
    nomeProduto: "",
    quantidade: "",
    variacoes: [],
    custo: "",
    status: true,
  });

  const formatNumber = (value) => {
    if (!value) return "";

    value = value.replace(/\D/g, "");
    value = value.replace(/(\d+)(\d{2})$/, "$1.$2");

    return value;
  };

  const [selectedTabelaPreco, setSelectedTabelaPreco] = useState("");
  const [variacoes, setVariacoes] = useState([]);

  const isFormValid = () => {
    const { nomeProduto, preco, percentualDesconto, quantidade, nomeTabela } =
      dadosProduto;

    if (
      !nomeProduto ||
      !preco ||
      !percentualDesconto ||
      !quantidade ||
      !nomeTabela
    ) {
      alertCustom("Por favor, preencha todos os campos obrigatórios.");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!isFormValid()) {
      return;
    }
    try {
      const data = {
        ...dadosProduto,
        preco: dadosProduto.preco.replace(/[^0-9.]/g, ""),
        custo: dadosProduto.custo.replace(/[^0-9.]/g, ""),
        variacoes: variacoes,
        nomeTabela: selectedTabelaPreco.title,
      };
      const response = await axios.post(
        `${REACT_APP_URL_BIBLIOTECA_RUNNERS}/v1/produto/cadastrar-produto`,
        data
      );
      reset();
      setNewProduto(data);
      alertCustom(response.data.message);
      resetPage();
    } catch (error) {
      alertCustom("Não foi possível cadastrar o produto!");
    }
  };

  const reset = () => {
    setDadosProduto({
      nomeTabela: "DEFAULT",
      preco: "",
      percentualDesconto: "",
      nomeProduto: "",
      quantidade: "",
      variacoes: [],
      custo: "",
      status: true,
    });
    setSelectedTabelaPreco(tabelas[0] || "");
  };

  const handleToggleStatus = () => {
    setDadosProduto({
      ...dadosProduto,
      status: !dadosProduto.status,
    });
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={12}>
        <Typography variant="h6">
          Novo produto
          <Typography variant="body2" color="textSecondary">
            Informações sobre o produto
          </Typography>
        </Typography>
      </Grid>
      <Grid item xs={12} md={8}>
        <TextField
          fullWidth
          type="text"
          id="nome"
          label="Nome do produto"
          variant="standard"
          placeholder="Nome do produto"
          value={dadosProduto.nomeProduto}
          onInput={(e) =>
            setDadosProduto({
              ...dadosProduto,
              nomeProduto: e.target.value,
            })
          }
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          type="text"
          id="preco"
          label="Preço"
          variant="standard"
          placeholder="Preço do produto"
          value={formatNumber(dadosProduto.preco)}
          onInput={(e) =>
            setDadosProduto({
              ...dadosProduto,
              preco: formatNumber(e.target.value),
            })
          }
          onBlur={(e) =>
            setDadosProduto({
              ...dadosProduto,
              preco: Number(e.target.value).toFixed(2),
            })
          }
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">R$</InputAdornment>
            ),
          }}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          type="number"
          id="percentualDesconto"
          label="Percentual de Desconto"
          variant="standard"
          placeholder="Percentual de desconto"
          value={dadosProduto.percentualDesconto}
          onInput={(e) =>
            e.target.value >= 0 &&
            e.target.value <= 100 &&
            e.target.value.toString().length < 4
              ? setDadosProduto({
                  ...dadosProduto,
                  percentualDesconto: e.target.value,
                })
              : ""
          }
        />
      </Grid>

      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          type="text"
          id="quantidade"
          label="Quantidade"
          variant="standard"
          placeholder="Quantidade [un]"
          value={dadosProduto.quantidade}
          onInput={(e) =>
            setDadosProduto({
              ...dadosProduto,
              quantidade: e.target.value.replace(/[.,]/g, ""),
            })
          }
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          type="text"
          id="custo"
          label="Custo"
          variant="standard"
          placeholder="Custo do produto"
          value={formatNumber(dadosProduto.custo)}
          onInput={(e) =>
            setDadosProduto({
              ...dadosProduto,
              custo: formatNumber(e.target.value),
            })
          }
          onBlur={(e) =>
            setDadosProduto({
              ...dadosProduto,
              custo: Number(e.target.value).toFixed(2),
            })
          }
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">R$</InputAdornment>
            ),
          }}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <Autocomplete
          options={tabelas.map((tabela) => ({
            title: tabela,
          }))}
          setValue={setSelectedTabelaPreco}
          value={selectedTabelaPreco}
          label={"Tabela de Preço"}
        />
      </Grid>
      <Grid item xs={12} md={8}>
        <ChipInput
          label={"Variações"}
          value={variacoes}
          setValue={setVariacoes}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <Button
          disableElevation
          variant="contained"
          onClick={handleToggleStatus}
          sx={{
            backgroundColor: dadosProduto.status ? "#4CAF50" : "#FF5733",
            "&:hover": {
              backgroundColor: dadosProduto.status ? "#45a049" : "#FF4500",
            },
          }}
        >
          {dadosProduto.status ? "Ativo" : "Inativo"}
        </Button>
      </Grid>
      <Grid item xs={12} md={6}>
        <Grid container spacing={2} style={{ justifyContent: "flex-end" }}>
          <Grid item>
            <Button
              variant="text"
              color="primary"
              onClick={() => resetPage(false)}
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
    </Grid>
  );
};

export default NewProduto;
