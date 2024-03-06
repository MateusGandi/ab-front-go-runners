import React, { useState, useEffect } from "react";
import Checkbox from "@mui/material/Checkbox";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import axios from "../../../utils/configAxios";
import { Chip, CardActionArea, CardActions, Divider } from "@mui/material";

const REACT_APP_URL_BIBLIOTECA_RUNNERS =
  process.env.REACT_APP_URL_BIBLIOTECA_RUNNERS;

export default function RenderKits({
  pivo,
  setPivo,
  alertCustom,
  dadosCadastro,
  setDadosCadastro,
  nomeTabela,
}) {
  const [itens, setItens] = useState([]);
  const [selectedKits, setSelectedKits] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${REACT_APP_URL_BIBLIOTECA_RUNNERS}/v1/produto/buscar-tabela/${nomeTabela}`
        );
        const options = response.data.flatMap((item) =>
          item.produto.variacoes.map(
            (variacao) =>
              item.produto.status &&
              item.produto.quantidade > 0 && {
                // Verifica se o produto está ativo e tem estoque disponível
                title: `${item.produto.nomeProduto} - R$ ${item.preco} - ${variacao}`,
                value: {
                  nomeProduto: item.produto.nomeProduto,
                  idProduto: item.produto.id,
                  idTabela: item.id,
                  quantidade: 0, // Começa com quantidade zero
                  maxQuantidade: item.produto.quantidade, // Define a quantidade máxima para a variação
                  variacao: variacao,
                  preco: item.preco,
                },
              }
          )
        );
        setItens(options.filter(Boolean)); // Filtra para remover itens indefinidos
      } catch (error) {
        console.error("Erro ao buscar itens:", error);
      }
    };

    fetchData();
  }, [nomeTabela]);

  const handleToggleItem = (item) => {
    let newSelectedKits = [...selectedKits];

    const selectedIndex = selectedKits.findIndex(
      (selectedItem) =>
        selectedItem.value.idProduto === item.value.idProduto &&
        selectedItem.value.variacao !== item.value.variacao
    );

    if (selectedIndex !== -1) {
      // Remove o item com a mesma idProduto, mas variação diferente
      newSelectedKits.splice(selectedIndex, 1);
    }

    const itemAlreadySelected = selectedKits.some(
      (selectedItem) =>
        selectedItem.value.idProduto === item.value.idProduto &&
        selectedItem.value.variacao === item.value.variacao
    );

    if (itemAlreadySelected) {
      // Se o item já estiver selecionado, desmarca-o
      newSelectedKits = newSelectedKits.filter(
        (selectedItem) =>
          selectedItem.value.idProduto !== item.value.idProduto ||
          selectedItem.value.variacao !== item.value.variacao
      );
    } else {
      // Adiciona o item clicado à lista de seleção com quantidade inicial 1
      newSelectedKits.push({
        ...item,
        value: { ...item.value, quantidade: 1 },
      });
    }

    setSelectedKits(newSelectedKits);
  };

  const handleDecreaseQuantity = (item) => {
    const selectedIndex = selectedKits.findIndex(
      (selectedItem) =>
        selectedItem.value.idTabela === item.value.idTabela &&
        selectedItem.value.variacao === item.value.variacao
    );

    if (selectedIndex !== -1) {
      const newSelectedKits = [...selectedKits];
      if (selectedKits[selectedIndex].value.quantidade > 1) {
        newSelectedKits[selectedIndex] = {
          ...selectedKits[selectedIndex],
          value: {
            ...selectedKits[selectedIndex].value,
            nomeProduto: selectedKits[selectedIndex].value.nomeProduto,
            quantidade: selectedKits[selectedIndex].value.quantidade - 1,
          },
        };
        setSelectedKits(newSelectedKits);
      } else {
        handleToggleItem(item); // Deseleciona o item se a quantidade for reduzida para zero
      }
    }
  };

  const handleIncreaseQuantity = (item) => {
    const selectedIndex = selectedKits.findIndex(
      (selectedItem) =>
        selectedItem.value.idTabela === item.value.idTabela &&
        selectedItem.value.variacao === item.value.variacao
    );

    // Verifica se a quantidade total selecionada já ultrapassa o limite permitido
    if (item.value.quantidade >= item.value.maxQuantidade) {
      alertCustom(
        "Você já selecionou a quantidade máxima disponível deste produto."
      );
      return;
    }

    const newSelectedKits = [...selectedKits];
    newSelectedKits[selectedIndex] = {
      ...selectedKits[selectedIndex],
      value: {
        ...selectedKits[selectedIndex].value,
        quantidade: selectedKits[selectedIndex].value.quantidade + 1,
      },
    };
    setSelectedKits(newSelectedKits);
  };

  useEffect(() => {
    if (
      dadosCadastro.dependentes[pivo] &&
      dadosCadastro.dependentes[pivo].kits.length === 0
    ) {
      setSelectedKits([]);
    } else if (
      selectedKits.length === 0 &&
      dadosCadastro.dependentes[pivo].kits.length > 0
    ) {
      setSelectedKits(
        dadosCadastro.dependentes[pivo].kits.map((item) => ({
          title: `${item.nomeProduto} - R$ ${item.preco} - ${item.variacao}`,
          value: {
            idProduto: item.idProduto,
            idTabela: item.idTabela,
            quantidade: item.quantidade,
            variacao: item.variacao,
            preco: item.preco,
          },
        }))
      );
    }
  }, [dadosCadastro]);

  useEffect(() => {
    if (dadosCadastro.dependentes[pivo].kits.length > 0) {
      setSelectedKits(
        dadosCadastro.dependentes[pivo].kits.map((item) => ({
          title: `${item.nomeProduto} - R$ ${item.preco} - ${item.variacao}`,
          value: {
            idProduto: item.idProduto,
            idTabela: item.idTabela,
            quantidade: item.quantidade,
            variacao: item.variacao,
            preco: item.preco,
          },
        }))
      );
    }
  }, [pivo]);

  useEffect(() => {
    if (selectedKits.length > 0) {
      setDadosCadastro((prevState) => {
        const kitsRemaped = selectedKits.map((kit) => kit.value);
        const dependentesAtualizados = prevState.dependentes.map(
          (dependente, index) => {
            // Verifica se o dependente atual é o dependente sendo modificado
            if (index === pivo) {
              // Cria uma cópia dos kits do dependente atual e adiciona os novos kits selecionados
              const kitsAtualizados = [...kitsRemaped];

              // Retorna o dependente atualizado com os novos kits
              return {
                ...dependente,
                kits: kitsAtualizados,
              };
            } else {
              // Retorna o dependente sem modificações
              return dependente;
            }
          }
        );

        // Retorna o novo estado com os dependentes atualizados
        return {
          ...prevState,
          dependentes: dependentesAtualizados,
        };
      });
    }
  }, [selectedKits]);

  return (
    <Paper
      elevation={0}
      sx={{
        padding: 2,
        height: { xs: "52vh", md: "60vh" },
        overflowX: "scroll",
      }}
    >
      <Grid container spacing={1}>
        <Grid
          item
          xs={12}
          md={12}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          <Typography variant="h6">
            Kit
            <Typography variant="body2" color="textSecondary">
              Selecione produtos disponíveis nos kits para a compra, o mesmo
              será entregue no evento junto à equipe organizadora
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

        <Grid item xs={12} md={12} sx={{ marginTop: "16px" }}>
          <Card variant="outlined">
            {itens.length > 0 ? (
              itens.map((item, index) => (
                <div key={index} style={{ display: "flex" }}>
                  <CardActionArea onClick={() => handleToggleItem(item)}>
                    <CardContent sx={{ display: "flex", alignItems: "center" }}>
                      <Checkbox
                        checked={selectedKits.some(
                          (selectedItem) =>
                            selectedItem.value.idTabela ===
                              item.value.idTabela &&
                            selectedItem.value.variacao === item.value.variacao
                        )}
                        onChange={() => handleToggleItem(item)}
                      />
                      <Typography variant="body1" sx={{ flexGrow: 1 }}>
                        {item.title}
                        <Typography variant="body2" color="textSecondary">
                          {`Quantidade selecionada: ${
                            selectedKits.find(
                              (selectedItem) =>
                                selectedItem.value.idTabela ===
                                  item.value.idTabela &&
                                selectedItem.value.variacao ===
                                  item.value.variacao
                            )?.value.quantidade || 0
                          }`}
                        </Typography>
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                  <CardActions>
                    <IconButton
                      disabled={
                        !selectedKits.some(
                          (selectedItem) =>
                            selectedItem.value.idTabela ===
                              item.value.idTabela &&
                            selectedItem.value.variacao === item.value.variacao
                        )
                      }
                      onClick={() => handleDecreaseQuantity(item)}
                    >
                      <RemoveIcon />
                    </IconButton>
                    <IconButton
                      disabled={
                        !selectedKits.some(
                          (selectedItem) =>
                            selectedItem.value.idTabela ===
                              item.value.idTabela &&
                            selectedItem.value.variacao === item.value.variacao
                        ) ||
                        selectedKits.find(
                          (selectedItem) =>
                            selectedItem.value.idTabela ===
                              item.value.idTabela &&
                            selectedItem.value.variacao === item.value.variacao
                        )?.value.quantidade === item.value.maxQuantidade
                      }
                      onClick={() => handleIncreaseQuantity(item)}
                    >
                      <AddIcon />
                    </IconButton>
                  </CardActions>
                  <Divider />
                </div>
              ))
            ) : (
              <Typography variant="body1" className="show-box">
                Não há produtos disponíveis
                <Typography variant="body2" color="textSecondary">
                  Recomendamos que aguarde, novos lotes estão por vir!
                </Typography>
              </Typography>
            )}
          </Card>
        </Grid>
      </Grid>
    </Paper>
  );
}
