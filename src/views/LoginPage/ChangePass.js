import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Snackbar from "@mui/material/Snackbar";
import { useNavigate } from "react-router-dom";
import Slide from "@mui/material/Slide";
import LoadingButton from "@mui/lab/LoadingButton";
import axios from "../../utils/configAxios";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

const REACT_APP_URL_BIBLIOTECA_RUNNERS =
  process.env.REACT_APP_URL_BIBLIOTECA_RUNNERS;

function SlideTransition(props) {
  return <Slide {...props} direction="up" />;
}

const VerificationCodeInput = (props) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingResend, setLoadingResend] = useState(false);
  const [state, setState] = useState({
    open: false,
    Transition: Slide,
    message: "",
  });

  const [code, setCode] = useState(Array(props.length).fill(""));
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [passwordHelperText, setPasswordHelperText] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [passwordConfirmError, setPasswordConfirmError] = useState(false);
  const [passwordConfirmHelperText, setPasswordConfirmHelperText] =
    useState("");
  const [senhasVisiveis, setSenhasVisiveis] = useState(false);

  const handleSubmitTeste = async (event) => {
    event.preventDefault();
    if (!props.newPass) {
      const codigo = code.join("");
      if (code.length === props.length) {
        const data = {
          email: props.email,
          codigo: codigo,
        };
        if (!codigo) {
          alertCustom("Informe um código!");
          return;
        }
        try {
          setLoading(true);
          const response = await axios.post(
            `${REACT_APP_URL_BIBLIOTECA_RUNNERS}/v1/user/verificar-codigo`,
            data
          );
          if (response.data && response.data.token) {
            localStorage.setItem("token", response.data.token);
            localStorage.setItem(
              "userData",
              JSON.stringify(response.data.user)
            );
            props.setTitle("Atualize sua senha");
            props.setSubtitle(
              "Informe uma nova senha para acessar a plataforma"
            );

            props.setNewPass(true);
            alertCustom(response.data.message);
          } else {
            alertCustom(response.data.message);
          }
        } catch (error) {
          console.log(error);
          alertCustom("Ocorreu um erro, favor, volte novamente mais tarde!");
        }

        setLoading(false);
      }
    } else {
      const data = {
        email: props.email,
        senha: password,
      };
      if (
        (!password && !passwordConfirm) ||
        passwordConfirmError ||
        passwordError
      ) {
        return;
      }
      setLoading(true);
      try {
        const response = await axios.post(
          `${REACT_APP_URL_BIBLIOTECA_RUNNERS}/v1/user/trocar-senha`,
          data
        );
        if (response.data) {
          props.alertMain(response.data.message);
          props.reset(true);
          response.data.authorizationKey === "@adm"
            ? navigate("/dash")
            : navigate("/home");
        }
      } catch (error) {
        if (error.response.data) {
          alertCustom(error.response.data.message);
          setLoading(false);
        }
      }
      setLoading(false);
    }
  };

  const validatePassword = (passwordValue) => {
    if (passwordValue.length === 0) {
      setPasswordError(true);
      setPasswordHelperText("Informe uma senha para prosseguir!");
    } else if (passwordValue.length < 5) {
      setPasswordError(true);
      setPasswordHelperText("A senha deve ter pelo menos 5 caracteres!");
    } else {
      setPassword(passwordValue);
      setPasswordError(false);
      setPasswordHelperText("");
    }
    if (passwordConfirm.length > 0 && passwordConfirm !== passwordValue) {
      setPasswordConfirmError(true);
      setPasswordConfirmHelperText("Senhas não coincidem!");
    } else {
      setPasswordConfirmError(false);
      setPasswordConfirmHelperText("");
    }
  };

  const validateConfirmPassword = (passwordConfirmValue) => {
    if (passwordConfirmValue.length === 0) {
      setPasswordConfirmError(true);
      setPasswordConfirmHelperText("Confirme a senha para prosseguir!");
    } else if (passwordConfirmValue !== password) {
      setPasswordConfirmError(true);
      setPasswordConfirmHelperText("Senhas não coincidem!");
    } else {
      setPasswordConfirm(passwordConfirmValue);
      setPasswordConfirmError(false);
      setPasswordConfirmHelperText("");
    }
  };

  const handleInput = (event, index) => {
    const newNumber = event.target.value;
    if (!isNaN(newNumber) && index < props.length) {
      if (code[index] === "") {
        setCode((prevCode) => {
          const newCode = [...prevCode];
          newCode[index] = newNumber;
          return newCode;
        });
        const proxInput = event.target.nextSibling;
        if (proxInput) {
          proxInput.focus();
        }
      }
    }
  };
  const handleResendCod = async () => {
    setLoadingResend(true);
    try {
      // Faz uma requisição ao servidor para reenviar o código de verificação
      const response = await axios.post(
        `${REACT_APP_URL_BIBLIOTECA_RUNNERS}/v1/user/recuperar`,
        { email: props.email }
      );
      // Exibe uma mensagem para o usuário informando que o código foi reenviado com sucesso
      props.alertMain(response.data.message);
    } catch (error) {
      // Em caso de erro, exibe uma mensagem de erro para o usuário
      props.alertMain(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Ocorreu um erro de acesso à plataforma, favor, volte mais tarde!"
      );
    }
    setLoadingResend(false);
  };
  const handleKeyDown = (event, index) => {
    if (event.key === "Backspace" && index >= 0) {
      const prevInput = event.target.previousSibling;
      if (prevInput) {
        prevInput.focus();
      }
      setCode((prevCode) => {
        const newCode = [...prevCode];
        newCode[index] = "";
        return newCode;
      });
    }
  };

  const handlePaste = (event) => {
    event.preventDefault();
    const clipboardData = event.clipboardData;
    const pastedData = clipboardData.getData("Text").trim();
    if (pastedData.length === props.length && !isNaN(pastedData)) {
      pastedData.split("").map((value, index) => {
        setCode((prevCode) => {
          if (index < props.length) {
            const newCode = [...prevCode];
            newCode[index] = value;
            return newCode;
          }
        });
      });
    }
  };

  const alertCustom = (message) => {
    setState({
      open: true,
      Transition: SlideTransition,
      message,
    });
  };

  return (
    <>
      <Snackbar
        open={state.open}
        onClose={() => setState({ ...state, open: false })}
        TransitionComponent={state.Transition}
        message={state.message}
      />
      <Grid container style={{ justifyContent: "space-around" }}>
        {!props.newPass ? (
          <>
            {code.map((digit, index) => (
              <input
                key={index}
                type="text"
                value={digit}
                maxLength="1"
                style={{
                  width: `${100 / (props.length + 1)}%`,
                  height: "60px",
                  borderRadius: "5px",
                  textAlign: "center",
                  border: "none",
                  margin: "20px 0",
                  outlineColor: "#2196F3",
                  backgroundColor: "#EAEEEF",
                  caretColor: "transparent",
                  fontSize: "20px",
                }}
                onInput={(e) => handleInput(e, index)}
                onKeyDown={(e) =>
                  e.key === "Backspace" ? handleKeyDown(e, index) : ""
                }
                onPaste={handlePaste}
              />
            ))}
          </>
        ) : (
          <Grid item>
            <Grid container>
              <TextField
                fullWidth
                name="password"
                label="Senha"
                type={senhasVisiveis ? "text" : "password"}
                autoComplete="current-password"
                variant="standard"
                error={passwordError}
                value={password}
                helperText={passwordHelperText}
                onBlur={(e) => validatePassword(e.target.value)}
                onInput={(event) => setPassword(event.target.value)}
                sx={props.styles.inputField}
              />
              <TextField
                fullWidth
                name="confirmPassword"
                label="Confirme a Senha"
                id="confirmPassword"
                type={senhasVisiveis ? "text" : "password"}
                autoComplete="new-password"
                variant="standard"
                error={passwordConfirmError}
                value={passwordConfirm}
                helperText={passwordConfirmHelperText}
                onInput={(event) => setPasswordConfirm(event.target.value)}
                onBlur={(e) => validateConfirmPassword(e.target.value)}
                sx={props.styles.inputField}
              />
            </Grid>
            <FormControlLabel
              control={
                <Checkbox
                  checked={senhasVisiveis}
                  value="passView"
                  color="primary"
                />
              }
              label={"Mostrar senhas"}
              variant="body2"
              onChange={(e) => setSenhasVisiveis(e.target.checked)}
            />
          </Grid>
        )}
      </Grid>
      <Grid container spacing={1}>
        <Grid item xs={12} md={12}>
          <LoadingButton
            disableElevation
            size="large"
            fullWidth
            onClick={handleSubmitTeste}
            loadingPosition="end"
            variant="contained"
            loading={loading}
          >
            {props.newPass ? "Trocar senha" : "Verificar"}
          </LoadingButton>
        </Grid>
        <Grid item xs={12} md={12}>
          <LoadingButton
            size="large"
            fullWidth
            variant="text"
            onClick={() => props.reset(true)}
          >
            Cancelar
          </LoadingButton>
        </Grid>
        <Grid item xs={12} md={12}>
          {!props.newPass && (
            <LoadingButton
              disableElevation
              size="large"
              fullWidth
              variant="text"
              onClick={handleResendCod}
              loadingPosition="end"
              loading={loadingResend}
            >
              Novo código
            </LoadingButton>
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default VerificationCodeInput;
