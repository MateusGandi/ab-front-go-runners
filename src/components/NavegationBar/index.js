import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Settings from "@mui/icons-material/Settings";
import ListItemIcon from "@mui/material/ListItemIcon";
import Logout from "@mui/icons-material/Logout";
import Divider from "@mui/material/Divider";
import PersonAdd from "@mui/icons-material/PersonAdd";
import Logo from "../../images/logo.png";
import AdbIcon from "@mui/icons-material/Adb";
import axios from "../../utils/configAxios";
import DataAttemp from "../../utils/DataAttemp";
const REACT_APP_URL_BIBLIOTECA_RUNNERS =
  process.env.REACT_APP_URL_BIBLIOTECA_RUNNERS;
const pages = [
  { name: "HOME", path: "/home" },
  { name: "BLOG", loc: "https://goianiarunners.com.br" },
  { name: "POLÍTICAS E TERMOS DE USO", path: "/termos" },
];
function ResponsiveAppBar() {
  const dataMaganer = DataAttemp();
  const navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  const open = Boolean(anchorEl);

  const handleScroll = () => {
    const position = window.scrollY;
    setScrollPosition(position);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

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

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };
  return (
    <AppBar
      sx={{
        minHeight: "60px",
        position: "fixed",
        background:
          scrollPosition > 0
            ? {
                xs: "linear-gradient(0deg, transparent, rgba(0,0,0,0.5) 100%)",
                md: "#0C8CE9",
              }
            : {
                xs: "#0C8CE9",
                md: "linear-gradient(0deg, transparent, rgba(0,0,0,0.5) 100%)",
              },
        transition: "background-color 0.3s ease-out",
      }}
      elevation={0}
    >
      <Container sx={{ padding: "0 5vw" }}>
        <Toolbar disableGutters>
          <Typography
            variant="h5"
            noWrap
            component="a"
            sx={{ cursor: "pointer", display: { md: "flex", xs: "none" } }}
            onClick={() => {
              navigate("/home");
            }}
          >
            <img
              style={{
                pointerEvents: "none",
                marginTop: "5px",
                width: "70px",
                filter:
                  scrollPosition > 0
                    ? {
                        sx: "drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.5))",
                        md: "none",
                      }
                    : "none",
              }}
              src={Logo}
            />
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MoreVertIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: "visible",
                  filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                  mt: 1.5,
                  "& .MuiAvatar-root": {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  "&:before": {
                    content: '""',
                    display: "block",
                    position: "absolute",
                    top: 0,
                    left: 14,
                    width: 10,
                    height: 10,
                    bgcolor: "background.paper",
                    transform: "translateY(-50%) rotate(45deg)",
                    zIndex: 6,
                  },
                },
              }}
            >
              {pages.map((page, index) => (
                <MenuItem key={index} onClick={handleCloseNavMenu}>
                  <Typography
                    style={{ fontFamily: "Roboto Condensed" }}
                    textAlign="center"
                    onClick={() => {
                      page.loc
                        ? window.open(page.loc, "_blank")
                        : navigate(page.path);
                    }}
                  >
                    {page.name}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "Roboto Condensed, sans-serif",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            <img
              style={{
                pointerEvents: "none",
                width: "60px",
                filter:
                  scrollPosition > 0
                    ? "drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.5))"
                    : "none",
              }}
              src={Logo}
            />
          </Typography>
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              width: "100%",
              justifyContent: "space-around",
            }}
          >
            {pages.map((page, index) => (
              <Button
                key={index}
                sx={{ color: "white", display: "block" }}
                onClick={() => {
                  page.loc
                    ? window.open(page.loc, "_blank")
                    : navigate(page.path);
                }}
              >
                {page.name}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Sua conta">
              <IconButton
                onClick={handleClick}
                size="small"
                sx={{ ml: 2 }}
                aria-controls={open ? "account-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
              >
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    backgroundColor: "rgba(256,256,256,0.3)",
                  }}
                >
                  {dataMaganer &&
                    dataMaganer.userData.nome &&
                    dataMaganer.userData.nome[0].toLocaleUpperCase()}
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={anchorEl}
              id="account-menu"
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: "visible",
                  filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                  mt: 1.5,
                  "& .MuiAvatar-root": {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  "&:before": {
                    content: '""',
                    display: "block",
                    position: "absolute",
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: "background.paper",
                    transform: "translateY(-50%) rotate(45deg)",
                    zIndex: 6,
                  },
                },
              }}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <MenuItem
                onClick={() => {
                  navigate("/perfil");
                }}
              >
                <Avatar />
                <Typography variant="body1">
                  {dataMaganer && dataMaganer.userData.nome
                    ? `Bem vindo, ${dataMaganer.userData.nome}!`
                    : "Bem vindo"}
                  <Typography variant="body2" color="textSecondary">
                    Acesse seu perfil
                  </Typography>
                </Typography>
              </MenuItem>
              <Divider />
              {dataMaganer && dataMaganer.userData.nome && (
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <Logout fontSize="small" />
                  </ListItemIcon>
                  Sair
                </MenuItem>
              )}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;
