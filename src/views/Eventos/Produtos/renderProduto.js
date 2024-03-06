import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import ChipInput from "../../../components/ChipInput";
import Autocomplete from "../../../components/AutoComplete/";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import axios from "../../../utils/configAxios";
import { Paper, Typography } from "@mui/material";

const REACT_APP_URL_BIBLIOTECA_RUNNERS =
  process.env.REACT_APP_URL_BIBLIOTECA_RUNNERS;
const EditProduto = ({
  closeModal,
  tabelas,
  resetPage,
  produtoToEdit,
  setProdutoToEdit,
  alertCustom,
}) => {
  const [variacoes, setVariacoes] = useState([]);
  const [selectedTabelaPreco, setSelectedTabelaPreco] = useState(
    produtoToEdit.nomeTabela
  );
  const [dadosProduto, setDadosProduto] = useState({
    nomeTabela: produtoToEdit.nomeTabela,
    preco: produtoToEdit.preco,
    percentualDesconto: produtoToEdit.percentualDesconto,
    produto: {
      id: produtoToEdit.produto.id,
      nomeProduto: produtoToEdit.produto.nome,
      quantidade: produtoToEdit.produto.quantidade,
      variacoes: produtoToEdit.produto.variacoes,
      custo: produtoToEdit.produto.custo,
      status: produtoToEdit.produto.status,
    },
  });

  const formatNumber = (value) => {
    if (!value) return "";

    value = value.replace(/\D/g, "");
    value = value.replace(/(\d+)(\d{2})$/, "$1.$2");

    return value;
  };

  const handleToggleStatus = () => {
    setDadosProduto({
      ...dadosProduto,
      produto: {
        ...dadosProduto.produto,
        status: !dadosProduto.produto.status,
      },
    });
  };

  useEffect(() => {
    if (produtoToEdit) {
      setDadosProduto({
        nomeTabela: produtoToEdit.nomeTabela,
        preco: Number(produtoToEdit.preco).toFixed(2),
        percentualDesconto: produtoToEdit.percentualDesconto,
        produto: {
          id: produtoToEdit.produto.id,
          nomeProduto: produtoToEdit.produto.nomeProduto,
          quantidade: produtoToEdit.produto.quantidade,
          variacoes: produtoToEdit.produto.variacoes,
          custo: Number(produtoToEdit.produto.custo).toFixed(2),
          status: produtoToEdit.produto.status,
        },
      });
      setVariacoes(produtoToEdit.produto.variacoes);
    }
  }, [produtoToEdit]);

  const isFormValid = () => {
    const {
      produto: { nomeProduto, quantidade },
      preco,
      percentualDesconto,
      nomeTabela,
    } = dadosProduto;

    if (
      !nomeProduto ||
      !quantidade ||
      !preco ||
      !percentualDesconto ||
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
      const newData = {
        ...dadosProduto,
        nomeTabela: selectedTabelaPreco.title,
        preco: Number(dadosProduto.preco).toFixed(2),
        produto: {
          ...dadosProduto.produto,
          custo: Number(dadosProduto.produto.custo).toFixed(2),
          variacoes: variacoes,
        },
      };
      const response = await axios.put(
        `${REACT_APP_URL_BIBLIOTECA_RUNNERS}/v1/produto/atualizar-tabela/${produtoToEdit.produto.id}`,
        newData
      );
      closeModal();
      reset();
      alertCustom(response.data.message);
      setProdutoToEdit(null);
      resetPage();
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
      alertCustom("Não foi possível atualizar o produto!");
    }
  };

  const reset = () => {
    setDadosProduto({
      nomeTabela: produtoToEdit.nomeTabela,
      preco: produtoToEdit.preco,
      percentualDesconto: produtoToEdit.percentualDesconto,
      produto: {
        ...produtoToEdit.produto,
        status: produtoToEdit.produto.status,
      },
    });
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={12}>
        <Typography variant="h6">
          Editar produto
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
          value={dadosProduto.produto.nomeProduto}
          onInput={(e) =>
            setDadosProduto({
              ...dadosProduto,
              produto: { ...dadosProduto.produto, nomeProduto: e.target.value },
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
          value={dadosProduto.preco}
          onInput={(e) =>
            setDadosProduto({
              ...dadosProduto,
              preco: formatNumber(e.target.value),
            })
          }
          onBlur={(e) =>
            e.target.value.length < 4
              ? setDadosProduto({
                  ...dadosProduto,
                  preco: Number(e.target.value).toFixed(2),
                })
              : ""
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
          value={dadosProduto.produto.quantidade}
          onInput={(e) =>
            setDadosProduto({
              ...dadosProduto,
              produto: {
                ...dadosProduto.produto,
                quantidade: e.target.value.replace(/[.,]/g, ""),
              },
            })
          }
        />
      </Grid>

      <Grid item xs={12} md={4}>
        <FormControl fullWidth variant="standard">
          <InputLabel htmlFor="custo">Custo</InputLabel>
          <Input
            type="text"
            id="custo"
            label="Custo"
            variant="standard"
            placeholder="Custo"
            value={dadosProduto.produto.custo}
            onInput={(e) =>
              setDadosProduto({
                ...dadosProduto,
                produto: {
                  ...dadosProduto.produto,
                  custo: formatNumber(e.target.value),
                },
              })
            }
            onBlur={(e) =>
              setDadosProduto({
                ...dadosProduto,
                produto: {
                  ...dadosProduto.produto,
                  custo: Number(e.target.value).toFixed(2),
                },
              })
            }
            startAdornment={
              <InputAdornment position="start">R$</InputAdornment>
            }
          />
        </FormControl>
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
            backgroundColor: dadosProduto.produto.status
              ? "#4CAF50"
              : "#FF5733",
            "&:hover": {
              backgroundColor: dadosProduto.produto.status
                ? "#45a049"
                : "#FF4500",
            },
          }}
        >
          {dadosProduto.produto.status ? "Ativo" : "Inativo"}
        </Button>
      </Grid>
      <Grid item xs={12} md={6} spacing={2}>
        <Grid
          container
          xs={12}
          md={12}
          spacing={2}
          style={{ justifyContent: "end" }}
        >
          <Grid item>
            <Button
              variant="text"
              color="primary"
              onClick={() => {
                closeModal();
              }}
              disableElevation
            >
              Cancelar
            </Button>
          </Grid>
          <Grid item>
            <Button
              type="submit"
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

export default EditProduto;
