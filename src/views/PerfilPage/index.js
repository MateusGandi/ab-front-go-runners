import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  IconButton,
  Button,
  Menu,
  MenuItem,
  Grid,
  Paper,
  TextField,
  Avatar,
  Box,
  Typography,
  CardHeader,
  CircularProgress,
} from "@mui/material";
import ListItemWithMenu from "./RenderEventosAnteriores";
import SearchIcon from "@mui/icons-material/Search";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DataAttemp from "../../utils/DataAttemp";
import axios from "../../utils/configAxios";
import Navbar from "../../components/NavegationBar/";
import DialogoQRCode from "./dialogQRcode";
import Location from "../../components/Mapa/location";
import EditProfileDialog from "./dialogEditPerfil";
import { LensTwoTone } from "@mui/icons-material";
import Dialog from "./dialog";
import DialogReembolso from "./dialogReembolso";
const REACT_APP_URL_BIBLIOTECA_RUNNERS =
  process.env.REACT_APP_URL_BIBLIOTECA_RUNNERS;

const ListWithItemsAndMenu = ({ alertCustom }) => {
  const navigate = useNavigate();
  const dataManager = DataAttemp();
  const [searchTerm, setSearchTerm] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [historico, setHistorico] = useState(null);
  const [filteredHistorico, setFilteredHistorico] = useState([]);
  const [conteudo, setConteudo] = useState(null);
  const [transacaoReembolso, setTransacaoReembolso] = useState(null);
  const [validQRcode, setValidQRcode] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialogReembolso, setOpenDialogReembolso] = useState(false);
  const [openDialogQRcode, setOpenDialogQRcode] = useState(false);
  const [showMore, setShowMore] = useState(5); // Define o número inicial de registros a serem exibidos
  const listRef = useRef(null); // Referência para a lista
  const [loading, setLoading] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [location, setLocation] = useState("");
  const gerarQRcode = (dados) => {
    setOpenDialogQRcode(true);
    const text = setValidQRcode(JSON.stringify(dados));
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleOpenDialog = (respostas) => {
    setConteudo(respostas);
    setOpenDialog(true);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const solicitarReembolso = (item) => {
    setTransacaoReembolso(item);
    setOpenDialogReembolso(true);
  };

  const retornarFlags = (itemHistorico) => {
    const { dataExpiracao, formaPagamento, content, status } = itemHistorico;
    const currentDate = new Date();
    const expirationDate = new Date(dataExpiracao);
    if (status === "cancelled") {
    } else if (status === "gratuito") {
      return [
        {
          value: "Gerar QR Code",
          function: () => gerarQRcode(itemHistorico),
        },
      ];
    } else if (status === "approved") {
      return [
        {
          value: "Gerar QR Code",
          function: () => gerarQRcode(itemHistorico),
        },
        {
          value: "Solicitar reembolso",
          function: () => solicitarReembolso(itemHistorico),
        },
      ];
    } else if (content === "Não disponível") {
      return [
        {
          value: "QR Code ou segunda via indisponível",
          function: () => {},
        },
      ];
    }

    switch (formaPagamento) {
      case "pix":
        return [
          {
            value: "Exibir código pix",
            function: () => {
              if (expirationDate > currentDate) {
                handleOpenDialog(content);
              } else {
                alertCustom("Pagamento expirado!");
              }
            },
          },
        ];
      case "bolbradesco":
        return [
          {
            value: "Emitir segunda via de boleto",
            function: () => {
              if (expirationDate > currentDate) {
                window.open(content, "_blank");
              } else {
                alertCustom("Pagamento expirado!");
              }
            },
          },
        ];
      case "master":
        return [
          {
            value: "Cancelar reserva",
            function: () => {
              if (expirationDate > currentDate) {
                window.open(content, "_blank");
              } else {
                alertCustom("Pagamento expirado!");
              }
            },
          },
        ];
      default:
        return [];
    }
  };

  useEffect(() => {
    const fetchEventos = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${REACT_APP_URL_BIBLIOTECA_RUNNERS}/v1/pagamentos/buscar-historico-pagamentos?idUser=${dataManager.userData.id}`
        );
        setHistorico(response.data);
      } catch (error) {
        console.log(error);
        alertCustom(
          "Ocorreu um erro ao buscar seus dados, favor, volte novamente mais tarde!"
        );
      }
      setLoading(false);
    };
    fetchEventos();
  }, [openDialog, conteudo]);

  useEffect(() => {
    if (historico && historico.pagamentosEncontrados) {
      const filteredData = historico.pagamentosEncontrados.filter((item) =>
        `${item.nomeEvento} ${item.subtitleEvento}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
      setFilteredHistorico(filteredData);
    }
  }, [searchTerm, historico, validQRcode, transacaoReembolso]);

  const handleShowMore = () => {
    setShowMore((prev) => prev + 5);
    setTimeout(() => {
      listRef.current.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleShowLess = () => {
    setShowMore(5);
  };

  const handleEditProfile = () => {
    setEditingProfile(true);
  };

  return (
    <div
      style={{
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        padding: "0 5px",
      }}
    >
      <Navbar />
      {editingProfile && (
        <EditProfileDialog
          open={editingProfile}
          onClose={() => setEditingProfile(false)}
          alertCustom={alertCustom}
        />
      )}

      {conteudo ? (
        <Dialog
          openDialog={openDialog}
          setConteudo={setConteudo}
          setOpenDialog={setOpenDialog}
          conteudo={conteudo}
          alertCustom={alertCustom}
        />
      ) : transacaoReembolso ? (
        <DialogReembolso
          openDialog={openDialogReembolso}
          setTransacaoReembolso={setTransacaoReembolso}
          setOpenDialog={setOpenDialogReembolso}
          transacaoReembolso={transacaoReembolso}
          alertCustom={alertCustom}
        />
      ) : (
        <DialogoQRCode
          openDialog={openDialogQRcode}
          setValidQRcode={setValidQRcode}
          setOpenDialog={setOpenDialogQRcode}
          validQRcode={validQRcode}
          alertCustom={alertCustom}
        />
      )}

      <Grid
        container
        sx={{
          marginTop: { md: "70px", xs: "50px" },
          maxWidth: { md: "950px", xs: "100vh" },
          height: "calc(100vh - 70px)",
        }}
        spacing={2}
      >
        <Grid item xs={12} md={6} order={{ xs: 2, md: 1 }}>
          <Typography variant="h6">
            Histórico de Eventos
            <Typography variant="body2" color="textSecondary">
              Acompanhe status de pagamento, emissão de segunda via de boleto e
              mais
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
              endAdornment: <SearchIcon color="secondary" />,
            }}
          />

          <List sx={{ maxHeight: "55vh", overflowY: "scroll" }}>
            {filteredHistorico && filteredHistorico.length > 0 ? (
              filteredHistorico.slice(0, showMore).map((item, index) => (
                <React.Fragment key={index}>
                  <ListItemWithMenu
                    title={item.nomeEvento}
                    subtitle={`${item.subtitleEvento}\t R$ ${item.valorTotal} (${item.formaPagamento})`}
                    content={[item.status]}
                    flags={retornarFlags(item)}
                  />
                  <Divider />
                </React.Fragment>
              ))
            ) : loading ? (
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <CircularProgress />
              </div>
            ) : (
              <Typography
                color="textSecondary"
                className="show-box"
                variant="body2"
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                Nenhum resultado encontrado
              </Typography>
            )}
            <div ref={listRef}></div> {/* Referência para o final da lista */}
          </List>
          {filteredHistorico.length > showMore ? (
            <Button fullWidth onClick={handleShowMore}>
              Ver Mais
            </Button>
          ) : (
            filteredHistorico.length > 5 && (
              <Button fullWidth onClick={handleShowLess}>
                Ver Menos
              </Button>
            )
          )}
        </Grid>
        <Grid item xs={12} md={6} order={{ xs: 1, md: 2 }}>
          <Paper elevation={0} variant="outlined">
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: "red[500]" }} aria-label="recipe">
                  {dataManager.userData.nome[0].toUpperCase()}
                </Avatar>
              }
              action={
                <IconButton aria-label="settings" onClick={handleClick}>
                  <MoreVertIcon />
                </IconButton>
              }
              title={dataManager.userData.nome}
              subheader={dataManager.userData.auth.email}
            />
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleEditProfile}>Editar Perfil</MenuItem>
            </Menu>
            <Box padding={1}>
              <Button
                fullWidth
                variant="text"
                onClick={() => navigate("/home")}
              >
                Ver Eventos
              </Button>
              <Button
                fullWidth
                variant="text"
                onClick={() => {
                  localStorage.clear();
                  navigate("/login");
                }}
              >
                Sair
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default ListWithItemsAndMenu;
