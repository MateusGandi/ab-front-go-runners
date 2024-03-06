import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import { Typography, TextField } from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Paper from "@mui/material/Paper";
import { CardActionArea } from "@mui/material";
import axios from "../../../utils/configAxios";
import NewForm from "./newForm";
import RenderForm from "./renderForm";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";

const REACT_APP_URL_BIBLIOTECA_RUNNERS =
  process.env.REACT_APP_URL_BIBLIOTECA_RUNNERS;

const Forms = (props) => {
  const { alertCustom } = props;
  const [listForms, setListForms] = useState([]);
  const [formSelected, setFormSelected] = useState(null);
  const [newForm, setNewForm] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleForms, setVisibleForms] = useState(3);

  const handleItemClick = (item) => {
    setFormSelected(item);
    setNewForm(false);
    setActiveItem(item.id);
  };

  const loadData = async () => {
    try {
      const { data } = await axios.get(
        `${REACT_APP_URL_BIBLIOTECA_RUNNERS}/v1/formulario/listar`
      );
      setListForms(data);
    } catch (error) {
      alertCustom("Houve um erro ao buscar os formulários!");
      console.error("Error loading forms:", error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetPage = () => {
    setFormSelected(null);
    setNewForm(false);
    setActiveItem(null);
    setSearchTerm("");
    setVisibleForms(3);
    loadData();
  };

  const filteredForms = listForms
    .filter(
      (form) =>
        form.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        form.subtitle.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice(0, visibleForms);

  const handleShowMore = () => {
    setVisibleForms((prevVisibleForms) => prevVisibleForms + 3);
  };

  const handleShowLess = () => {
    setVisibleForms(3);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <Typography variant="h6">
          Gerenciar Formulários
          <Typography variant="body2" color="textSecondary">
            Formulários existentes
          </Typography>
        </Typography>
        <TextField
          label="Pesquisar"
          variant="outlined"
          fullWidth
          margin="normal"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            endAdornment: (
              <IconButton onClick={() => setSearchTerm("")}>
                <SearchIcon />
              </IconButton>
            ),
          }}
        />
        <List
          style={{
            maxHeight: "65vh",
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          {filteredForms.length > 0 ? (
            filteredForms.map((form, index) => (
              <CardActionArea
                key={index}
                onClick={() => {
                  handleItemClick(form);
                }}
              >
                <ListItem selected={activeItem === form.id}>
                  <ListItemAvatar>
                    <Avatar>
                      <FolderIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={form.nome} secondary={form.subtitle} />
                </ListItem>
              </CardActionArea>
            ))
          ) : (
            <Typography variant="body2">
              Nenhum resultado encontrado.
            </Typography>
          )}
          {listForms.length > visibleForms ? (
            <Button onClick={handleShowMore} color="primary">
              Visualizar Mais
            </Button>
          ) : (
            <Button onClick={handleShowLess} color="primary">
              Visualizar Menos
            </Button>
          )}
          <CardActionArea
            onClick={() => {
              setNewForm(true);
              setFormSelected(null);
              setActiveItem(null);
            }}
          >
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <AddIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={"Criar novo formulário"}
                secondary={"Mais informações sobre os participantes"}
              />
            </ListItem>
          </CardActionArea>
        </List>
      </Grid>
      <Grid item xs={12} md={6}>
        {formSelected !== null && (
          <Paper elevation={0} variant="outlined" style={{ padding: 20 }}>
            <RenderForm
              resetPage={resetPage}
              formData={formSelected}
              alertCustom={alertCustom}
            />
          </Paper>
        )}
        {newForm && (
          <Paper elevation={0} variant="outlined" style={{ padding: 20 }}>
            <NewForm resetPage={resetPage} alertCustom={alertCustom} />
          </Paper>
        )}
      </Grid>
    </Grid>
  );
};

export default Forms;
