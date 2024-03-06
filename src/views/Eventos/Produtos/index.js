import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import ListItem from "@mui/material/ListItem";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Tabela from "./tabela";
import NewProduto from "./newProduto";
import RenderProduto from "./renderProduto";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import axios from "../../../utils/configAxios";
const REACT_APP_URL_BIBLIOTECA_RUNNERS =
  process.env.REACT_APP_URL_BIBLIOTECA_RUNNERS;

const Produtos = (props) => {
  const { alertCustom } = props;
  const [newProduto, setNewProduto] = useState(null);
  const [activeItem, setActiveItem] = useState(null);
  const [itemToEdit, setItemToEdit] = useState(null);
  const [tabelas, setTabelas] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const fetchData = async () => {
    if (tabelas.length === 0 || newProduto || !itemToEdit) {
      try {
        const response = await axios.get(
          `${REACT_APP_URL_BIBLIOTECA_RUNNERS}/v1/produto/listar-tabelas`
        );
        setTabelas(response.data);
      } catch (error) {
        alertCustom("Erro ao buscar dados das tabelas");
        console.error("Erro ao buscar dados das tabelas:", error);
      }
    }
  };
  useEffect(() => {
    fetchData();
  }, [newProduto, itemToEdit]);

  const resetPage = (force) => {
    setActiveItem(null);
    setOpenDialog(false);
    if (force) {
      fetchData();
    }
  };

  const handleOpenDialog = (item) => {
    switch (item) {
      case "newProduto":
        setActiveItem(item);
        break;
      case "editProduto":
        setActiveItem(item);
        break;
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <Typography variant="h6">Gerenciar Produtos</Typography>
        <Typography variant="body2" color="textSecondary">
          Produtos cadastrados
        </Typography>
        <Grid item xs={12} md={12}>
          <List>
            <ListItem
              button={true}
              onClick={() => handleOpenDialog("newProduto")}
            >
              <ListItemAvatar>
                <Avatar>
                  <AddIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={"Criar novo produto"}
                secondary={"Mais informações sobre os produtos"}
              />
            </ListItem>
          </List>
        </Grid>
      </Grid>
      <Grid item xs={12} md={6}>
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          fullWidth
          maxWidth="md"
        >
          <DialogContent>
            {activeItem === "editProduto" ? (
              <RenderProduto
                resetPage={resetPage}
                produtoToEdit={itemToEdit}
                setProdutoToEdit={setItemToEdit}
                alertCustom={alertCustom}
                tabelas={tabelas}
                closeModal={handleCloseDialog}
              />
            ) : (
              <NewProduto
                setNewProduto={setNewProduto}
                resetPage={resetPage}
                tabelas={tabelas}
                alertCustom={alertCustom}
              />
            )}
          </DialogContent>
        </Dialog>
      </Grid>
      <Grid item xs={12} md={12}>
        <Tabela
          alertCustom={alertCustom}
          tabelas={tabelas}
          openModal={handleOpenDialog}
          setItemToEdit={setItemToEdit}
          resetPage={resetPage}
        />
      </Grid>
    </Grid>
  );
};

export default Produtos;
