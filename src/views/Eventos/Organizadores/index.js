import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import { Typography, TextField } from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import AddIcon from "@mui/icons-material/Add";
import CardActionArea from "@mui/material/CardActionArea";
import axios from "../../../utils/configAxios";
import DinamicOrganizador from "./newOrganizador";
import RenderOrganizador from "./renderOrganizador";
import SearchIcon from "@mui/icons-material/Search";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";

const REACT_APP_URL_BIBLIOTECA_RUNNERS =
  process.env.REACT_APP_URL_BIBLIOTECA_RUNNERS;

const organizerMatchesSearchTerm = (organizador, term) => {
  const lowerCaseSearchTerm = term.toLowerCase();
  return (
    organizador.nome.toLowerCase().includes(lowerCaseSearchTerm) ||
    organizador.contato.toLowerCase().includes(lowerCaseSearchTerm)
  );
};

const Organizadores = (props) => {
  const { alertCustom } = props;
  const [listOrganizadores, setListOrganizadores] = useState([]);
  const [organizadorSelected, setOrganizadorSelected] = useState(null);
  const [newOrganizador, setNewOrganizador] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleOrganizadores, setVisibleOrganizadores] = useState(3);

  const handleItemClick = (item) => {
    setOrganizadorSelected(item);
    setNewOrganizador(false);
    setActiveItem(item.id);
  };

  const loadData = async () => {
    try {
      const { data } = await axios.get(
        `${REACT_APP_URL_BIBLIOTECA_RUNNERS}/v1/evento/listar-organizadores`
      );
      setListOrganizadores(data);
    } catch (error) {
      alertCustom("Houve um erro ao buscar os organizadores!");
      console.error("Error loading organizers:", error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetPage = () => {
    setOrganizadorSelected(null);
    setNewOrganizador(false);
    setActiveItem(null);
    setSearchTerm("");
    setVisibleOrganizadores(5);
    loadData();
  };

  const filteredOrganizadores = listOrganizadores
    .filter((organizador) =>
      organizerMatchesSearchTerm(organizador, searchTerm)
    )
    .slice(0, visibleOrganizadores);

  const handleShowMore = () => {
    setVisibleOrganizadores(
      (prevVisibleOrganizadores) => prevVisibleOrganizadores + 3
    );
  };

  const handleShowLess = () => {
    setVisibleOrganizadores(3);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <Typography variant="h6">
          Gerenciar Organizadores
          <Typography variant="body2" color="textSecondary">
            Organizadores cadastrados
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
        <Grid
          item
          xs={12}
          md={12}
          style={{
            maxHeight: "65vh",
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          <List>
            {filteredOrganizadores.length > 0 ? (
              filteredOrganizadores.map((organizador, index) => (
                <CardActionArea
                  key={index}
                  onClick={() => {
                    handleItemClick(organizador);
                  }}
                >
                  <ListItem selected={activeItem === organizador.id}>
                    <ListItemAvatar>
                      <Avatar>
                        <FolderIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={organizador.nome}
                      secondary={organizador.contato}
                    />
                  </ListItem>
                </CardActionArea>
              ))
            ) : (
              <Typography variant="body2">
                Nenhum resultado encontrado.
              </Typography>
            )}
            {listOrganizadores.length > visibleOrganizadores ? (
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
                setNewOrganizador(true);
                setOrganizadorSelected(null);
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
                  primary={"Criar novo organizador"}
                  secondary={"Mais informações sobre os organizadores"}
                />
              </ListItem>
            </CardActionArea>
          </List>
        </Grid>
      </Grid>
      <Grid item xs={12} md={6}>
        {organizadorSelected !== null && (
          <Paper elevation={0} variant="outlined" style={{ padding: 20 }}>
            <RenderOrganizador
              resetPage={resetPage}
              organizadorData={organizadorSelected}
              alertCustom={alertCustom}
            />
          </Paper>
        )}
        {newOrganizador && (
          <Paper elevation={0} variant="outlined" style={{ padding: 20 }}>
            <DinamicOrganizador
              resetPage={resetPage}
              alertCustom={alertCustom}
            />
          </Paper>
        )}
      </Grid>
    </Grid>
  );
};

export default Organizadores;
