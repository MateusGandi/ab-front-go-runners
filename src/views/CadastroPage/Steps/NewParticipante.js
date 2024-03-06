import React, { useState, useEffect, Fragment } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { Grid, Paper, Typography, Chip } from "@mui/material";
import DataAttemp from "../../../utils/DataAttemp";

const AddDependentButton = ({
  setActiveStep,
  alertCustom,
  dadosCadastro,
  setDadosCadastro,
  setVisibilityButtonStep,
  setPivo,
  pivo,
}) => {
  const dataManager = DataAttemp();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [doc, setDoc] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [sexo, setSexo] = useState("");
  const [email, setEmail] = useState("");

  const maskDoc = (value) => {
    if (!value) return "";
    if (value.length <= 14) {
      value = value.replace(/\D/g, "");
      if (value.length > 7) {
        value = value.replace(/(\d{3})(\d)/, "$1.$2");
        value = value.replace(/(\d{3})(\d)/, "$1.$2");
        value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
      }
      return value;
    } else {
      return value.slice(0, 14);
    }
  };

  const handleSetPivo = (newDependent) => {
    if (newDependent) {
      setDadosCadastro((prevState) => ({
        ...prevState,
        dependentes: [...dadosCadastro.dependentes, newDependent],
      }));
      setPivo(dadosCadastro.dependentes.length);
      setActiveStep(0);
    }
  };

  const handleAddDependent = () => {
    if (doc.length < 7) {
      alertCustom("Por favor, insira um documento válido para o dependente.");
      return;
    }
    if (!name.trim()) {
      alertCustom("Por favor, insira um nome para o dependente.");
      return;
    }
    if (dadosCadastro.dependentes.length >= 4) {
      alertCustom("Você já atingiu o limite máximo de dependentes (4).");
      return;
    }

    const newDependent = {
      nome: name,
      doc: doc,
      prop: false,
      email: email || dataManager.userData.auth.email,
      dataNascimento: new Date(dataNascimento),
      sexo: sexo,
      kits: [],
      formulario: [],
      dataInscricao: new Date(),
    };
    setVisibilityButtonStep(true);
    handleSetPivo(newDependent);

    setName("");
    setDoc("");
    setDataNascimento("");
    setSexo("");
    setShowForm(false);
    setEmail("");
  };

  const handleDeleteDependent = (dependent) => {
    setDadosCadastro((prevState) => ({
      ...prevState,
      dependentes: prevState.dependentes.filter(
        (item) => item.doc !== dependent.doc
      ),
    }));
    setActiveStep(3);
    setPivo(pivo - 1);
  };

  useEffect(() => {
    console.log("testando", dadosCadastro, pivo);
  }, [dadosCadastro, pivo]);

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          padding: 2,
          height: {
            xs: "52vh",
            md: "60vh",
          },
          overflowX: "scroll",
        }}
      >
        {!showForm && (
          <Grid container spacing={1}>
            <Grid item md={12} xs={12}>
              <Typography variant="h6">
                Adicionar Dependente
                <Typography variant="body1" color="textSecondary">
                  Por favor, insira as informações do dependente.
                </Typography>
              </Typography>
            </Grid>
            {dadosCadastro.dependentes.map((item, index) => (
              <Grid item key={index} md={12} xs={12}>
                <Chip
                  label={item.nome}
                  onDelete={
                    index !== 0 ? () => handleDeleteDependent(item) : undefined
                  }
                />
              </Grid>
            ))}

            <Grid item>
              <Button
                disableElevation
                size="small"
                onClick={() => {
                  setShowForm(true);
                  setVisibilityButtonStep(false);
                }}
                variant="outlined"
              >
                Adicionar mais um participante
              </Button>
            </Grid>
          </Grid>
        )}
        {showForm && (
          <Fragment>
            <Typography variant="h6">
              Adicionar Dependente
              <Typography variant="body1" color="textSecondary">
                Por favor, insira as informações do dependente.
              </Typography>
            </Typography>
            <Paper elevation={0} sx={{ marginTop: "16px" }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={12}>
                  <TextField
                    autoFocus
                    variant="standard"
                    id="name"
                    label="Nome completo do dependente"
                    type="text"
                    fullWidth
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    variant="standard"
                    id="name"
                    placeholder="CPF ou RG"
                    label="Documento"
                    type="text"
                    fullWidth
                    value={doc}
                    onChange={(e) => setDoc(maskDoc(e.target.value))}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    variant="standard"
                    id="email"
                    placeholder="Email"
                    label="E-mail do novo participante (Opcional)"
                    type="text"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    InputLabelProps={{
                      shrink: true,
                    }}
                    variant="outlined"
                    id="dataNascimento"
                    label="Data de Nascimento"
                    type="date"
                    fullWidth
                    value={dataNascimento}
                    onChange={(e) => setDataNascimento(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id="sexo-label">Sexo</InputLabel>
                    <Select
                      labelId="sexo-label"
                      id="sexo"
                      variant="outlined"
                      value={sexo}
                      label="Sexo"
                      onChange={(e) => setSexo(e.target.value)}
                    >
                      <MenuItem value="">Não informar</MenuItem>
                      <MenuItem value="Masculino">Masculino</MenuItem>
                      <MenuItem value="Feminino">Feminino</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Paper>
          </Fragment>
        )}
      </Paper>

      {showForm && (
        <Grid
          container
          sx={{
            p: "16px 8px",
            alignSelf: "flex-end",
          }}
          spacing={1}
        >
          <Grid item xs={12} md={6} sx={{ order: { xs: 2, md: 1 } }}>
            <Button
              fullWidth
              disableElevation
              onClick={() => {
                setShowForm(false);
                setVisibilityButtonStep(true);
              }}
              variant="text"
              color="primary"
              sx={{ height: "32px" }}
            >
              Cancelar
            </Button>
          </Grid>
          <Grid item xs={12} md={6} sx={{ order: { xs: 1, md: 2 } }}>
            <Button
              fullWidth
              disableElevation
              onClick={handleAddDependent}
              variant="contained"
              color="success"
              sx={{ height: "37px" }}
            >
              Adicionar
            </Button>
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default AddDependentButton;
