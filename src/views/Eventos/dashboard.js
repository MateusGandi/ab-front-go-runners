import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import EmailIcon from "@mui/icons-material/Email";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Avatar from "@mui/material/Avatar";
import LogoutIcon from "@mui/icons-material/Logout";
import { MainListItems, SecondaryListItems } from "./ListItems";
import Chart from "./Chart";
import NovoEvento from "./Cadastrar/Evento";
import Orders from "./Orders";
import PagamentosPage from "../CadastroPage/Steps/Pagamentos";
import Forms from "./Forms/";
import Organizadores from "./Organizadores/";
import Produtos from "./Produtos/";
import MapRender from "../../components/Mapa/renderCircuito";
import Dashboard from "./Dashboard/";
import DataAttemp from "../../utils/DataAttemp";
import { useNavigate } from "react-router-dom";
import ParticipantesPage from "./Participante/";
const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: `100%`,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth - 1}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(0),
    }),
  },
}));

export default function Main({ alertCustom }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const dataManager = DataAttemp(); // Assuming this function returns necessary user data
  const [selectedComponent, setSelectedComponent] = useState("dashboard");
  const [isTransitionEnd, setIsTransitionEnd] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const componentMap = {
    dashboard: <Dashboard alertCustom={alertCustom} />,
    novoEvento: <NovoEvento />,
    gerenciarPerfis: <ParticipantesPage />,
    pagamentos: <PagamentosPage />,
    formularios: <Forms alertCustom={alertCustom} />,
    organizadores: <Organizadores alertCustom={alertCustom} />,
    produtos: <Produtos alertCustom={alertCustom} />,
    // Add more mappings as needed
  };

  const handleListItemClick = (componentKey) => {
    setSelectedComponent(componentKey);
  };

  const handleDrawerTransitionEnd = () => {
    setIsTransitionEnd(true);
  };

  const toggleDrawer = () => {
    setOpen(!open);
    setIsTransitionEnd(false);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="absolute" open={open} elevation={0} color="terciary">
        <Toolbar>
          <IconButton style={{ marginRight: "20px" }} onClick={toggleDrawer}>
            {!open && isTransitionEnd ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            sx={{ flexGrow: 1 }}
          >
            Dashboard
          </Typography>
          <Box sx={{ flexGrow: 0 }} spacing={2}>
            <IconButton color="inherit">
              <Badge badgeContent={4} color="info">
                <Avatar
                  size="small"
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: "rgba(0,0,0,0)",
                  }}
                >
                  <EmailIcon color="secondary" />
                </Avatar>
              </Badge>
            </IconButton>

            <IconButton
              onClick={handleClick}
              aria-controls={open ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
            >
              <Avatar
                size="small"
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: "#1976d2",
                }}
              >
                {dataManager && dataManager.userData.nome
                  ? dataManager.userData.nome[0].toUpperCase()
                  : ""}
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              id="account-menu"
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem
                onClick={() => {
                  handleClose();
                }}
              >
                <ListItemIcon sx={{ marginRight: "10px" }}>
                  <Avatar sx={{ bgcolor: "#1976d2" }}>
                    {dataManager && dataManager.userData.nome
                      ? dataManager.userData.nome[0].toUpperCase()
                      : ""}
                  </Avatar>
                </ListItemIcon>
                <Typography variant="body1">
                  {dataManager && dataManager.userData.nome
                    ? `Bem vindo, ${dataManager.userData.nome}!`
                    : "Bem vindo"}
                  <Typography variant="body2" color="textSecondary">
                    Perfil administrativo
                  </Typography>
                </Typography>
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                Sair
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
        <Divider />
      </AppBar>
      <Drawer
        variant="permanent"
        open={open}
        onTransitionEnd={handleDrawerTransitionEnd}
      >
        <Toolbar
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            maxHeight: "10vh",
          }}
        >
          Goiania Runners
        </Toolbar>
        <Divider />
        <List
          component="nav"
          style={{
            maxHeight: "89vh",
            overflowY: "auto",
          }}
        >
          <MainListItems opened={open} onItemClick={handleListItemClick} />
          <Divider sx={{ my: 1 }} />
          {SecondaryListItems()}
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === "light" ? "#fff" : theme.palette.grey[900],
          flexGrow: 1,
          height: "100vh",
          overflow: "auto",
        }}
      >
        <Toolbar />
        <Container maxWidth="lg" sx={{ padding: "10px", minWidth: "300px" }}>
          <Grid container>
            {selectedComponent in componentMap &&
              componentMap[selectedComponent]}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}
