import React, { useEffect, useState } from "react";
import { Typography, Grid, Paper, Button, Chip } from "@mui/material";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import { CardActionArea, Checkbox } from "@mui/material";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import DataAttemp from "../../../utils/DataAttemp";

export default function Options({
  setActiveStep,
  pivo,
  setPivo,
  dadosCadastro,
  setDadosCadastro,
  categorias,
}) {
  const [categoriasRemaped, setCategoriasRemaped] = useState(
    categorias.filter((categoria) => categoria.numVagas > 0)
  );

  const [selectedCategoria, setSelectedCategoria] = useState(
    dadosCadastro.categoriaId
  );
  const dataManager = DataAttemp();

  useEffect(() => {
    if (
      dadosCadastro.dependentes[pivo] &&
      !dadosCadastro.dependentes[pivo].categoriaId
    ) {
      setSelectedCategoria(null);
    } else if (dadosCadastro.dependentes[pivo]) {
      setSelectedCategoria(dadosCadastro.dependentes[pivo].categoriaId);
    }
  }, [dadosCadastro, pivo]);

  const handleClickCategoria = (categoria) => {
    const categoriaSelecionada = selectedCategoria === categoria.id;
    if (dadosCadastro.dependentes[pivo]) {
      const dependenteExistente =
        dadosCadastro.dependentes[pivo] &&
        dadosCadastro.dependentes.find((dependente) => {
          return dependente.doc === dadosCadastro.dependentes[pivo].doc;
        });

      const updatedDependente =
        dadosCadastro.dependentes[pivo]?.categoriaId === categoria.id
          ? {
              nome: dadosCadastro.dependentes[pivo].nome,
              doc: dadosCadastro.dependentes[pivo].doc,
              email: dadosCadastro.dependentes[pivo].email,
              dataNascimento: dadosCadastro.dependentes[pivo].dataNasc,
              sexo: dadosCadastro.dependentes[pivo].sexo,
              kits: [...dadosCadastro.dependentes[pivo].kits],
              formulario: [],
              dataInscricao: new Date(),
              prop:
                dadosCadastro.dependentes[pivo].doc ===
                dataManager.userData.auth.cpf,
            }
          : categoria.id
          ? {
              ...dadosCadastro.dependentes[pivo],
              categoriaId: categoria.id,
              categoriaName: categoria.categoria.titulo,
              valorIngresso: categoria.valorIngresso,
            }
          : !categoriaSelecionada &&
            dadosCadastro.dependentes[pivo]?.categoriaId && {
              nome: dadosCadastro.dependentes[pivo].nome,
              doc: dadosCadastro.dependentes[pivo].doc,
              email: dadosCadastro.dependentes[pivo].email,
              dataNascimento: dadosCadastro.dependentes[pivo].dataNasc,
              sexo: dadosCadastro.dependentes[pivo].sexo,
              kits: [...dadosCadastro.dependentes[pivo].kits],
              formulario: [],
              dataInscricao: new Date(),
              prop:
                dadosCadastro.dependentes[pivo].doc ===
                dataManager.userData.auth.cpf,
            };

      setSelectedCategoria(categoriaSelecionada ? null : categoria.id);
      setDadosCadastro((prevState) => ({
        ...prevState,
        dependentes: dependenteExistente
          ? prevState.dependentes.map((dependente) =>
              dependente.doc === dadosCadastro.dependentes[pivo].doc
                ? updatedDependente
                : dependente
            )
          : [...prevState.dependentes, updatedDependente].filter(Boolean), // Adiciona apenas se não for null
      }));
    }
  };

  const handleDeleteDependent = (dependent) => {
    setDadosCadastro({
      ...dadosCadastro,
      dependentes: dadosCadastro.dependentes.filter(
        (item) => item.doc !== dependent.doc
      ),
    });
    setPivo(pivo - 1);
    setActiveStep(3);
  };

  return (
    <Paper
      elevation={0}
      sx={{ p: 2, height: { xs: "52vh", md: "60vh" }, overflowY: "scroll" }}
    >
      <Grid spacing={1} container>
        <Grid
          xs={12}
          md={12}
          item
          sx={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          <Typography variant="h6">
            Categoria
            <Typography variant="body2" color="textSecondary">
              {pivo > 0 ? (
                <span>
                  Selecione a categoria para inscrever
                  <span style={{ fontWeight: "bold", margin: "0 5px" }}>
                    {dadosCadastro.dependentes[pivo] &&
                      dadosCadastro.dependentes[pivo].nome}
                  </span>
                </span>
              ) : (
                "Selecione a categoria que deseja participar"
              )}
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

        <Grid xs={12} md={12} item sx={{ marginTop: "16px" }}>
          <Card variant="outlined">
            {categoriasRemaped.length > 0 ? (
              categoriasRemaped.map((categoria, index) => (
                <React.Fragment key={index}>
                  <CardActionArea
                    onClick={() => handleClickCategoria(categoria)}
                    sx={{ backgroundColor: "transparent" }}
                  >
                    <Box
                      sx={{
                        p: "16px",
                      }}
                    >
                      <Grid container>
                        <Grid
                          item
                          xs={12}
                          md={12}
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <Checkbox
                              checked={selectedCategoria === categoria.id}
                              onChange={() => handleClickCategoria(categoria)}
                            />
                            <Typography variant="body1">
                              {categoria.categoria.titulo}
                              <Typography
                                color="text.secondary"
                                variant="body2"
                              >
                                {categoria.categoria.criterio}
                              </Typography>
                            </Typography>
                          </div>

                          <Typography variant="body1">
                            {Number(categoria.valorIngresso) > 0
                              ? `R$ ${categoria.valorIngresso}`
                              : "Gratuito"}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>
                  </CardActionArea>
                  <Divider />
                </React.Fragment>
              ))
            ) : (
              <Typography variant="body1" className="show-box">
                Não há ingressos disponíveis
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
