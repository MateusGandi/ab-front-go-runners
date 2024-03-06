import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  MenuItem,
  Typography,
} from "@mui/material";
import Location from "../../components/Mapa/location";
import axios from "../../utils/configAxios";
import DataAttemp from "../../utils/DataAttemp";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

const REACT_APP_URL_BIBLIOTECA_RUNNERS =
  process.env.REACT_APP_URL_BIBLIOTECA_RUNNERS;

const EditProfileDialog = ({
  open,
  onClose,

  alertCustom,
}) => {
  const navigate = useNavigate();
  const dataMaganer = DataAttemp();
  console.log(dataMaganer.userData);
  const [editedProfileData, setEditedProfileData] = useState({
    ...dataMaganer.userData,
    cpf: dataMaganer.userData.auth.cpf,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    let valor = "";
    if (name === "telefone") {
      valor = phoneMask(value);
    } else if (name === "cpf") {
      valor = cpfMask(value);
    } else {
      valor = value;
    }
    if (name === "dataNasc") {
      console.log(value);
    } else {
      console.log(name);
    }

    setEditedProfileData((prevData) => ({
      ...prevData,
      [name]: valor,
    }));
  };

  const phoneMask = (value) => {
    if (!value) return "";
    if (value.length <= 15) {
      value = value.replace(/\D/g, "");
      value = value.replace(/(\d{2})(\d)/, "($1)$2");
      value = value.replace(/(\d)(\d{4})$/, "$1-$2");

      return value;
    } else {
      return value.slice(0, 15);
    }
  };

  const cpfMask = (value) => {
    if (!value) return "";
    if (value.length <= 14) {
      value = value.replace(/\D/g, "");
      value = value.replace(/(\d{3})(\d)/, "$1.$2");
      value = value.replace(/(\d{3})(\d)/, "$1.$2");
      value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
      return value;
    } else {
      return value.slice(0, 14);
    }
  };

  const handleSave = async () => {
    try {
      const data = {
        ...editedProfileData,
        endereco: editedProfileData.endereco.description,
        auth: {
          ...dataMaganer.userData.auth,
          cpf: editedProfileData.cpf,
        },
      };
      const response = await axios.put(
        `${REACT_APP_URL_BIBLIOTECA_RUNNERS}/v1/user/atualizar-user-data/${dataMaganer.userData.id}`,
        data
      );
      alertCustom(response.data.message || "Alteração realizada com sucesso!");

      alertCustom(dataMaganer.reload());
      navigate("/login");
    } catch (error) {
      alertCustom(
        error.data.message ||
          "Ocorreu um erro, favor, tente novamente mais tarde!"
      );
    }
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleCancel}>
      <DialogTitle>Editar Perfil</DialogTitle>
      <DialogContent>
        <Grid container spacing={1}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Nome"
              variant="standard"
              fullWidth
              name="nome"
              value={editedProfileData.nome}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Telefone"
              variant="standard"
              fullWidth
              name="telefone"
              value={phoneMask(editedProfileData.telefone)}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="CPF"
              variant="standard"
              fullWidth
              name="cpf"
              value={cpfMask(editedProfileData.cpf)}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Data de Nascimento"
              variant="standard"
              type="date"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              name="dataNasc"
              value={format(new Date(editedProfileData.dataNasc), "yyyy-MM-dd")}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              select
              label="Sexo"
              variant="standard"
              fullWidth
              name="sexo"
              value={editedProfileData.sexo}
              onChange={handleChange}
            >
              <MenuItem value="masculino">Masculino</MenuItem>
              <MenuItem value="feminino">Feminino</MenuItem>
              <MenuItem value="none">Não informar</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <Location
              label="Endereço"
              valor={{ description: editedProfileData.endereco }}
              variant="standard"
              setLocation={(value) =>
                setEditedProfileData({ ...editedProfileData, endereco: value })
              }
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>Cancelar</Button>
        <Button
          disableElevation
          onClick={handleSave}
          variant="contained"
          color="primary"
        >
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProfileDialog;
