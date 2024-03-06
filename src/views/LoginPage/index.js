import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import LoadingButton from "@mui/lab/LoadingButton";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import VerificationCodeInput from "./ChangePass.js";
import axios from "../../utils/configAxios";
import { FormControlLabel, Checkbox, CardMedia } from "@mui/material";
import Button from "@mui/material/Button";
import {
  phoneMask,
  validateEmail,
  cpfMask,
} from "../../utils/formatFunctions.js";

const REACT_APP_URL_BIBLIOTECA_RUNNERS =
  process.env.REACT_APP_URL_BIBLIOTECA_RUNNERS;

export default function SignInSide(props) {
  const { styles, alertCustom, fetchData } = props;
  const navigate = useNavigate();
  const inputCpfRef = useRef(null);
  const inputTelRef = useRef(null);
  const inputEmailRef = useRef(null);

  const [nome, setNome] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [cpf, setCpf] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const [senhasVisiveis, setSenhasVisiveis] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [recuperacao, setRecuperacao] = useState(false);
  const [login, setLogin] = useState(true);
  const [newPass, setNewPass] = useState(false);

  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loginCpf, setLoginCpf] = useState(false);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState({
    title: "Acesse sua conta",
    subtitle: "",
  });

  const [nomeError, setNomeError] = useState(false);
  const [nomeHelperText, setNomeHelperText] = useState("");

  const [lastNameError, setLastNameError] = useState(false);
  const [lastNameHelperText, setLastNameHelperText] = useState("");

  const [emailError, setEmailError] = useState(false);
  const [emailHelperText, setEmailHelperText] = useState("");

  const [phoneError, setPhoneError] = useState(false);
  const [phoneHelperText, setPhoneHelperText] = useState("");

  const [cpfError, setCpfError] = useState(false);
  const [cpfHelperText, setCpfHelperText] = useState("");

  const [senhaError, setSenhaError] = useState(false);
  const [senhaHelperText, setSenhaHelperText] = useState("");

  const [externalTitle, setExternalTitle] = useState("");
  const [externalSubtitle, setExternalSubtitle] = useState("");
  const [passwordConfirmError, setPasswordConfirmError] = useState(false);
  const [passwordConfirmHelperText, setPasswordConfirmHelperText] =
    useState("");

  const renderInput = (tela, link) => {
    switch (tela) {
      case "link":
        return (
          <Grid item xs={12} md={12}>
            <Button
              size="small"
              item
              fullWidth
              disableElevation
              variant="text"
              onClick={() => {
                link.setFunction(!link.value);
                link.proxFunction(true);
                setTitle(link.title);
              }}
            >
              {link.text}
            </Button>
          </Grid>
        );
      case "email":
        return (
          <TextField
            fullWidth
            id="email"
            label="Endereço de Email"
            name="email"
            autoComplete="email"
            variant="standard"
            value={email}
            error={emailError}
            helperText={emailHelperText}
            onBlur={(e) => validateField("email", e.target.value)}
            onInput={(event) => setEmail(event.target.value)}
            sx={styles.inputField}
          />
        );
      case "senha":
        return (
          <TextField
            fullWidth
            name="password"
            label="Senha"
            type={senhasVisiveis ? "text" : "password"}
            autoComplete="current-password"
            variant="standard"
            value={senha}
            error={senhaError}
            helperText={senhaHelperText}
            onBlur={(e) => validateField("senha", e.target.value)}
            onInput={(event) => setSenha(event.target.value)}
            sx={styles.inputField}
          />
        );
      case "confirmSenha":
        return (
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
            onBlur={(e) => validateField("confirmSenha", e.target.value)}
            sx={styles.inputField}
          />
        );
      case "telefone":
        return (
          <TextField
            fullWidth
            name="phone"
            label="Telefone"
            autoComplete="current-phone"
            variant="standard"
            value={phoneMask(telefone)}
            error={phoneError}
            helperText={phoneHelperText}
            onInput={(event) => {
              event.target.value = phoneMask(event.target.value);
              setTelefone(event.target.value);
            }}
            inputRef={inputTelRef}
            inputProps={{ maxLength: 15 }}
            onBlur={(e) => validateField("telefone", e.target.value)}
            sx={styles.inputField}
          />
        );
      case "cpf":
        return (
          <TextField
            fullWidth
            name="cpf"
            label="CPF"
            autoComplete="current-cpf"
            variant="standard"
            value={cpfMask(cpf)}
            error={cpfError}
            helperText={cpfHelperText}
            onInput={(event) => {
              event.target.value = cpfMask(event.target.value);
              setCpf(event.target.value);
            }}
            inputRef={inputCpfRef}
            inputProps={{ maxLength: 14 }}
            onBlur={(e) => validateField("cpf", e.target.value)}
            sx={styles.inputField}
          />
        );
      case "termos":
        return (
          <FormControlLabel
            control={
              <Checkbox checked={agreedToTerms} value="terms" color="primary" />
            }
            label={
              <Typography color="textSecondary" variant="body1">
                Concordo com os termos e condições
              </Typography>
            }
            variant="body2"
            sx={styles.labelText}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
          />
        );
      case "loginCpf":
        return (
          <FormControlLabel
            control={
              <Checkbox checked={loginCpf} value="cpfLogin" color="primary" />
            }
            label={
              <Typography color="textSecondary" variant="body1">
                Logar usando CPF
              </Typography>
            }
            variant="body2"
            sx={styles.labelText}
            onChange={(e) => {
              setLoginCpf(e.target.checked);
            }}
          />
        );
      case "nome":
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={6}>
              <TextField
                fullWidth
                id="firstName"
                label="Nome"
                value={nome}
                name="firstName"
                autoComplete="given-name"
                autoFocus
                variant="standard"
                error={nomeError}
                helperText={nomeHelperText}
                onInput={(e) => setNome(e.target.value)}
                onBlur={(e) => validateField("nome", e.target.value)}
                sx={styles.inputField}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <TextField
                fullWidth
                id="lastName"
                label="Sobrenome"
                value={lastName}
                name="lastName"
                autoComplete="family-name"
                variant="standard"
                error={lastNameError}
                helperText={lastNameHelperText}
                onInput={(e) => setLastName(e.target.value)}
                onBlur={(e) => validateField("lastName", e.target.value)}
                sx={styles.inputField}
              />
            </Grid>
          </Grid>
        );
      case "senhasVisiveis":
        return (
          <FormControlLabel
            control={
              <Checkbox
                checked={senhasVisiveis}
                value="passView"
                color="primary"
              />
            }
            label={
              <Typography color="textSecondary" variant="body1">
                Mostar senhas
              </Typography>
            }
            sx={styles.labelText}
            onChange={(e) => setSenhasVisiveis(e.target.checked)}
          />
        );
      case "codigoVerificacao":
        return (
          <VerificationCodeInput
            setNewPass={setNewPass}
            newPass={newPass}
            titleSeted={title}
            setTitle={setExternalTitle}
            setSubtitle={setExternalSubtitle}
            email={email}
            length={4}
            alertMain={alertCustom}
            reset={reset}
            styles={styles}
          />
        );
      case "image":
        return (
          <CardMedia
            sx={{
              minHeight: 150,
              position: "relative",
            }}
            image={`${REACT_APP_URL_BIBLIOTECA_RUNNERS}/images?file=Eventos/`}
            elevation={0}
          />
        );
      default:
        break;
    }
  };

  const reset = (force) => {
    setNome("");
    setLastName("");
    setEmail("");
    setTelefone("");
    setSenha("");
    setPasswordConfirm("");

    setNomeError(false);
    setNomeHelperText("");

    setLastNameError(false);
    setLastNameHelperText("");

    setEmailError(false);
    setEmailHelperText("");

    setPasswordConfirmError(false);
    setPasswordConfirmHelperText("");

    setSenhaError(false);
    setSenhaHelperText("");

    setPhoneError(false);
    setPhoneHelperText("");

    setRecuperacao(false);

    setExternalTitle("");
    setExternalSubtitle("");

    if (force) {
      setTitle({
        title: "Acesse sua conta",
        subtitle: "",
      });
      setIsForgotPassword(false);
      setIsSignUp(false);
      setLogin(true);
      setLoginCpf(false);
      setRecuperacao(false);
      axios.defaults.headers.common["Authorization"] = `Bearer `;
    }
  };

  useEffect(() => {
    if (loginCpf) {
      inputCpfRef.current && inputCpfRef.current.focus();
    } else {
      inputEmailRef.current && inputEmailRef.current.focus();
    }
  }, [loginCpf]);

  useEffect(() => {
    reset();
  }, [login, isForgotPassword, isSignUp, loginCpf]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (isForgotPassword) {
        validateEmail(email);
        if (emailError || email.length === 0) {
          return;
        }
        if (!agreedToTerms) {
          alertCustom("Para prosseguir, aceite os termos!");
          return;
        }

        setLoading(true);
        const data = {
          email: email,
        };
        const response = await axios.post(
          `${REACT_APP_URL_BIBLIOTECA_RUNNERS}/v1/user/recuperar`,
          data
        );
        alertCustom(response.data.message);
        setRecuperacao(true);
      } else if (isSignUp) {
        //criar
        if (!agreedToTerms) {
          alertCustom("Para prosseguir, aceite os termos!");
          return;
        }

        if (
          nomeError ||
          nome.length === 0 ||
          cpfError ||
          cpf.length === 0 ||
          lastNameError ||
          lastName.length === 0 ||
          emailError ||
          email.length === 0 ||
          // phoneError ||
          // telefone.length === 0 ||
          senhaError ||
          senha.length === 0 ||
          passwordConfirmError
        ) {
          return;
        }

        setLoading(true);
        const data = {
          nome: nome + " " + lastName,
          telefone: "não informado", //telefone,
          foto: "default",
          endereco: "não informado",
          auth: {
            email: email,
            senha: senha,
            cpf: cpf,
          },
        };

        const response = await axios.post(
          `${REACT_APP_URL_BIBLIOTECA_RUNNERS}/v1/user/cadastrar`,
          data
        );
        alertCustom(response.data.message);
        localStorage.setItem("userData", JSON.stringify(response.data.user));
        localStorage.setItem("token", response.data.token);
        response.data.authorizationKey === "@adm"
          ? navigate("/dash")
          : navigate("/home");
      } else {
        //login
        if (loginCpf) {
          if (cpf.length === 0 || cpfError) {
            return;
          }
        } else if (email.length === 0 || emailError) {
          return;
        }

        if (senha.length === 0 || senhaError) {
          return;
        }

        setLoading(true);
        const data = {
          email: email,
          senha: senha,
          cpf: cpf,
        };
        const response = await axios.post(
          `${REACT_APP_URL_BIBLIOTECA_RUNNERS}/v1/user/login`,
          data
        );
        if (response.data.token) {
          alertCustom("Autenticação bem sucedida!");
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("userData", JSON.stringify(response.data.user));

          fetchData().then(() => {
            response.data.authorizationKey === "@adm"
              ? navigate("/dash")
              : navigate("/home");
          });
        } else {
          alertCustom(
            "Credenciais inválidas, por favor, verifique seus dados e tente novamente."
          );
        }
      }
    } catch (error) {
      alertCustom(error.response?.data?.error || error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const validateField = (fieldName, value) => {
    switch (fieldName) {
      case "nome":
        if (!value) {
          setNomeError(true);
          setNomeHelperText("Campo obrigatório");
        } else {
          setNomeError(false);
          setNomeHelperText("");
        }
        break;
      case "lastName":
        if (!value) {
          setLastNameError(true);
          setLastNameHelperText("Campo obrigatório");
        } else {
          setLastNameError(false);
          setLastNameHelperText("");
        }
        break;

      case "email":
        if (!value) {
          setEmailError(true);
          setEmailHelperText("Campo obrigatório");
        } else if (!validateEmail(value)) {
          setEmailError(true);
          setEmailHelperText("Formato de e-mail inválido");
        } else {
          setEmailError(false);
          setEmailHelperText("");
        }
        break;
      case "telefone":
        if (!value) {
          setPhoneError(true);
          setPhoneHelperText("Campo obrigatório");
        } else if (value.length < 14) {
          setPhoneError(true);
          setPhoneHelperText("Telefone inválido");
        } else {
          setPhoneError(false);
          setPhoneHelperText("");
        }
        break;
      case "cpf":
        if (!value) {
          setCpfError(true);
          setCpfHelperText("Campo obrigatório");
        } else if (value.length < 14) {
          setCpfError(true);
          setCpfHelperText("Cpf inválido");
        } else {
          setCpfError(false);
          setCpfHelperText("");
        }
        break;
      case "senha":
        if (!value) {
          setSenhaError(true);
          setSenhaHelperText("Campo obrigatório");
        } else if (value.length < 5) {
          setSenhaError(true);
          setSenhaHelperText("Senha deve ter pelo menos 5 caracteres");
        } else {
          setSenhaError(false);
          setSenhaHelperText("");
        }
        break;
      case "confirmSenha":
        if (!value) {
          setPasswordConfirmError(true);
          setPasswordConfirmHelperText("Campo obrigatório");
        } else if (value.length < 5) {
          setPasswordConfirmError(true);
          setPasswordConfirmHelperText(
            "Senha deve ter pelo menos 5 caracteres"
          );
        } else if (value !== senha) {
          setPasswordConfirmError(true);
          setPasswordConfirmHelperText("Senhas não coincidem");
        } else {
          setPasswordConfirmError(false);
          setPasswordConfirmHelperText("");
        }
        break;
      default:
        break;
    }
  };

  return (
    <Grid container sx={styles.subContainerLogin}>
      <Grid
        container
        sx={{
          maxWidth: { md: "1400px", xs: "100vh" },
          maxHeight: "600px",
          width: { md: "90vw", xs: "99vw" },
          overflow: "hidden",
          justifyContent: "center",
          borderRadius: "5px",
        }}
      >
        <Grid item xs={12} sm={6} md={6} lg={4} sx={styles.formContainer}>
          <Box sx={styles.formBox}>
            {title.title && (
              <Typography component="h1" variant="h5" sx={styles.formTitle}>
                {externalTitle || title.title}
              </Typography>
            )}
            <Grid
              container
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={styles.contentForm}
            >
              {styles.formTitle && (
                <Grid item xs={12} sm={12} md={12}>
                  <Typography
                    variant="body2"
                    sx={styles.formTitle}
                    color="textSecondary"
                  >
                    {externalSubtitle || title.subtitle}
                  </Typography>
                </Grid>
              )}
              {/*login*/}
              {login && (loginCpf ? renderInput("cpf") : renderInput("email"))}
              {login && renderInput("senha")}
              {login && renderInput("loginCpf")}
              {login && renderInput("senhasVisiveis")}

              {/*recuperar*/}
              {isForgotPassword &&
                (recuperacao
                  ? renderInput("codigoVerificacao")
                  : renderInput("email"))}
              {isForgotPassword && (recuperacao ? null : renderInput("termos"))}

              {/*criar conta*/}
              {isSignUp && renderInput("nome")}
              {isSignUp && renderInput("email")}

              {isSignUp && renderInput("cpf")}
              {isSignUp && renderInput("senha")}
              {isSignUp && renderInput("confirmSenha")}
              {isSignUp && renderInput("termos")}
              {isSignUp && renderInput("senhasVisiveis")}
              <Grid item xs={12} md={12}>
                <Grid container spacing={1}>
                  {recuperacao ? null : (
                    <>
                      <Grid item xs={12} md={12}>
                        <LoadingButton
                          disableElevation
                          size="large"
                          type="submit"
                          fullWidth
                          onClick={handleSubmit}
                          loading={loading}
                          loadingPosition="end"
                          variant="contained"
                          color="primary"
                        >
                          {isSignUp && "Criar conta"}
                          {login && "Entrar"}
                          {isForgotPassword && !recuperacao && "Recuperar"}
                        </LoadingButton>
                      </Grid>
                      {isSignUp &&
                        renderInput("link", {
                          text: "Possui um conta? Entre agora!",
                          setFunction: setIsSignUp,
                          proxFunction: setLogin,
                          value: isSignUp,
                          title: {
                            title: "Acesse sua conta",
                            subtitle: "",
                          },
                        })}
                      {login &&
                        renderInput("link", {
                          text: "Não tem uma conta? Crie uma!",
                          proxFunction: setIsSignUp,
                          setFunction: setLogin,
                          value: login,
                          title: {
                            title: "Crie sua conta",
                            subtitle: "",
                          },
                        })}

                      {isForgotPassword &&
                        !recuperacao &&
                        renderInput("link", {
                          text: "Possui um conta? Entre agora!",
                          proxFunction: setLogin,
                          setFunction: setIsForgotPassword,
                          value: isForgotPassword,
                          title: {
                            title: "Acesse sua conta",
                            subtitle: "",
                          },
                        })}

                      {login &&
                        renderInput("link", {
                          text: "Esqueceu a senha?",
                          proxFunction: setIsForgotPassword,
                          setFunction: setLogin,
                          value: login,
                          title: {
                            title: "Recupere sua conta",
                            subtitle: "Informe seu e-mail cadastrado",
                          },
                        })}
                    </>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Grid>
        <Grid item xs={false} sm={12} md={6} lg={8} sx={styles.imageLabel} />
      </Grid>
      <Grid
        item
        xs={12}
        sx={{ textAlign: "center", height: "1vh", marginTop: "-100px" }}
      >
        <Typography variant="body2" color="textSecondary">
          @teste
        </Typography>
      </Grid>
    </Grid>
  );
}
