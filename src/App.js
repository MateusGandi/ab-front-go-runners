import React, { useEffect, useState } from "react";
import {
  BrowserRouter, // Alterado para HashRouter
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./views/HomePage/";
import CadastroPage from "./views/CadastroPage/";
import LoginPage from "./views/LoginPage/";
import PaymentPage from "./views/CadastroPage/Steps/Pagamentos";
import PerfilPage from "./views/PerfilPage/";
import Dashboard from "./views/Eventos/dashboard";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import ToggleButtons from "./components/ToggleGroupTheme/";
import Snackbar from "@mui/material/Snackbar";
import Slide from "@mui/material/Slide";
import axios from "./utils/configAxios";
import DataAttemp from "./utils/DataAttemp";
import path from "path-browserify";
import { Grid, CircularProgress } from "@mui/material";
const REACT_APP_URL_BIBLIOTECA_RUNNERS =
  process.env.REACT_APP_URL_BIBLIOTECA_RUNNERS;

function SlideTransition(props) {
  return <Slide {...props} direction="up" />;
}

function App() {
  const [currentTheme, setCurrentTheme] = useState("light");
  const [isToggleButtonsVisible, setIsToggleButtonsVisible] = useState(false);
  const [state, setState] = useState({
    open: false,
    Transition: Slide,
  });
  const [loading, setLoading] = useState(true);
  const [paths, setPaths] = useState(["/login", "/home"]);
  const dataManager = DataAttemp();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${REACT_APP_URL_BIBLIOTECA_RUNNERS}/v1/user/verificar-cadastro`,
        {
          userData: JSON.parse(localStorage.getItem("userData")), //dataManager.userData,
          token: localStorage.getItem("token"), //dataManager.token,
        }
      );
      setPaths(response.data);
    } catch (error) {
      setPaths(["/login", "/home"]);
      console.error("Error", error);
    }
    setLoading(false);
  };

  const alertCustom = (message) => {
    if (!state.open) {
      setState({
        open: true,
        Transition: SlideTransition,
        message,
      });
    } else {
      handleClose();
    }
  };

  const handleClose = () => {
    if (state.open) {
      setState({
        ...state,
        open: false,
      });
    }
  };

  const toggleTheme = () => {
    setCurrentTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const toggleButtonsVisibility = () => {
    setIsToggleButtonsVisible((prevVisibility) => !prevVisibility);
  };

  const darkTheme = createTheme({
    palette: {
      mode: "dark",
      primary: {
        main: "#13BCE5",
        contrastText: "#000",
      },
      secondary: {
        main: "rgba(256,256,256,0.1)",
        contrastText: "#fff",
      },
      success: {
        main: "#2E7D32",
        contrastText: "#fff",
      },
      terciary: {
        main: "#212121",
        contrastText: "#fff",
      },
      transitions: {
        duration: {
          enteringScreen: 500,
          leavingScreen: 500,
        },
      },
      error: {
        main: "#ff0000",
      },
    },
  });

  const lightTheme = createTheme({
    palette: {
      mode: "light",
      primary: {
        main: "#13BCE5",
        contrastText: "#fff",
      },
      secondary: {
        main: "rgba(0,0,0,0.2)",
        contrastText: "#fff",
      },
      terciary: {
        main: "#fff",
        contrastText: "#000",
      },
    },
  });

  const styles = {
    container: {
      backgroundColor: currentTheme === "dark" ? "#121212" : "#fff",
      height: "100vh",
    },
    formContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: currentTheme === "dark" ? "#454545" : "#f5f5f5",
    },
    formBox: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "center",
      maxWidth: "350px",
      minHeight: "600px",
      width: "80%",
      color: currentTheme === "dark" ? "#f5f5f5" : "#000",
    },
    formTitle: {
      width: "100%",
      marginTop: "20px",
      textAlign: "center",
    },
    contentForm: {
      paddingBottom: "20px",
      alignSelf: "center",
      height: "100%",
    },
    subContainerLogin: {
      backgroundColor: currentTheme === "light" ? "#f0f0f0" : "#212121",
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    labelText: {
      width: "100%",
      height: "50px",
    },
    inputField: {
      width: "100%",
      height: "70px",
    },
    imageLabel: {
      backgroundImage: `url(${REACT_APP_URL_BIBLIOTECA_RUNNERS}/images?file=Source/goianiarunners-home.png)`, //
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
      alignItems: "center",
    },
    toggleButtons: {
      position: "fixed",
      bottom: "20px",
      right: isToggleButtonsVisible ? "20px" : "-95px",
      transition: "right 0.3s ease-in-out",
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-end",
      zIndex: 120,
      borderRadius: "5px",
      backgroundColor: currentTheme === "light" ? "#fff" : "#212121",
    },
  };

  const selectedTheme = currentTheme === "light" ? lightTheme : darkTheme;

  return (
    <ThemeProvider theme={selectedTheme}>
      {loading ? (
        <div
          style={{
            width: "100vw",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress />
        </div>
      ) : (
        <Grid container>
          <Grid item xs={12} md={12} style={styles.container}>
            <BrowserRouter>
              <Routes>
                {paths.map((path, index) => (
                  <Route
                    key={index}
                    path={path}
                    element={
                      <RouteElement
                        fetchData={fetchData}
                        path={path}
                        alertCustom={alertCustom}
                        styles={styles}
                      />
                    }
                  />
                ))}
                <Route path="*" element={<Navigate to="/login" />} />
              </Routes>
            </BrowserRouter>
          </Grid>
        </Grid>
      )}

      <div style={styles.toggleButtons}>
        <ToggleButtons
          toggleTheme={toggleTheme}
          handleClose={toggleButtonsVisibility}
          visibility={isToggleButtonsVisible}
        />
      </div>

      <Snackbar
        open={state.open}
        onClose={handleClose}
        TransitionComponent={state.Transition}
        message={state.message}
      />
    </ThemeProvider>
  );
}

function RouteElement({ path, alertCustom, styles, fetchData }) {
  switch (path) {
    case "/login":
      return (
        <LoginPage
          fetchData={fetchData}
          styles={styles}
          alertCustom={alertCustom}
        />
      );
    case "/home":
      return <Home alertCustom={alertCustom} />;
    case "/cadastro/:id":
      return <CadastroPage alertCustom={alertCustom} />;
    case "/perfil":
      return <PerfilPage alertCustom={alertCustom} />;
    case "/pagamento":
      return <PaymentPage alertCustom={alertCustom} />;
    case "/dash":
      return <Dashboard alertCustom={alertCustom} />;
    default:
      return null;
  }
}

export default App;
