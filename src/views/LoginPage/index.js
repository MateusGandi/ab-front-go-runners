import * as React from "react";
import { useNavigate } from "react-router-dom";
import LoadingButton from "@mui/lab/LoadingButton";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Snackbar from "@mui/material/Snackbar";
import Slide from "@mui/material/Slide";
import axios from "../../axiosConfig.js";
import VerificationCodeInput from "./teste";

const styles = {
  container: {
    padding: { md: "2vh", xs: "10px", sm: "10px" },
    minHeight: "100vh",
    backgroundColor: "#EAEEEF",
    overflow: "hidden",
  },
  formContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: { md: "5px 0 0 5px", sm: "5px 0 0 5px", xs: "5px" },
  },

  formBox: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    minWidth: "350px",
    width: "80%",
    minHeight: "80vh",
  },

  formTitle: {
    marginTop: "5px",
    position: "absolute",
  },

  contentForm: {
    marginTop: "50px",
    paddingBottom: "50px",
    position: "relative",
    alignSelf: "center",
    width: "100%",
  },

  labelText: {
    height: "40px",
    color: "text.disabled",
  },
  inputField: {
    width: "100%",
    height: "70px",
  },
  imageLabel: {
    backgroundImage: "url(https://source.unsplash.com/random?wallpapers)",
    backgroundRepeat: "no-repeat",
    backgroundColor: "#000",
    borderRadius: "0 5px 5px 0",
  },
};

function SlideTransition(props) {
  return <Slide {...props} direction="up" />;
}

export default function SignInSide(props) {
  const navigate = useNavigate();
  const [state, setState] = React.useState({
    open: false,
    Transition: Slide,
  });

  const alertCustom = (message) => {
    setState({
      open: true,
      Transition: SlideTransition,
      message,
    });
  };

  const handleClose = () => {
    setState({
      ...state,
      open: false,
    });
  };
  const [senhasVisiveis, setSenhasVisiveis] = React.useState(false);

  const [isSignUp, setIsSignUp] = React.useState(false);
  const [isForgotPassword, setIsForgotPassword] = React.useState(false);
  const [passo1recuperacao, setPasso1recuperacao] = React.useState(false);

  const [emailError, setEmailError] = React.useState(false);
  const [emailHelperText, setEmailHelperText] = React.useState("");
  const [email, setEmail] = React.useState("");

  const [phoneError, setPhoneError] = React.useState(false);
  const [phoneHelperText, setPhoneHelperText] = React.useState("");
  const [phone, setPhone] = React.useState("");

  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordHelperText, setPasswordHelperText] = React.useState("");
  const [password, setPassword] = React.useState("");

  const [passwordConfirmError, setPasswordConfirmError] = React.useState(false);
  const [passwordConfirmHelperText, setPasswordConfirmHelperText] =
    React.useState("");
  const [passwordConfirm, setPasswordConfirm] = React.useState("");

  const [firstNameError, setFirstNameError] = React.useState(false);
  const [firstNameHelperText, setFirstNameHelperText] = React.useState("");
  const [firstName, setFirstName] = React.useState("");

  const [lastNameError, setLastNameError] = React.useState(false);
  const [lastNameHelperText, setLastNameHelperText] = React.useState("");
  const [lastName, setLastName] = React.useState("");

  const [agreedToTerms, setAgreedToTerms] = React.useState(false);
  const [loginTelefone, setLoginTelefone] = React.useState(false);

  const [loading, setLoading] = React.useState(false);

  const reset = () => {
    setEmailError(false);
    setEmailHelperText("");
    setEmail("");

    setPhoneError(false);
    setPhoneHelperText("");
    setPhone("");

    setPasswordError(false);
    setPasswordHelperText("");
    setPassword("");

    setPasswordConfirmError(false);
    setPasswordConfirmHelperText("");
    setPasswordConfirm("");

    setFirstNameError(false);
    setFirstNameHelperText("");

    setLastNameError(false);
    setLastNameHelperText("");

    setPasso1recuperacao(false);
  };

  React.useEffect(() => {
    reset();
  }, [isForgotPassword, isSignUp, loginTelefone]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isForgotPassword) {
      validateEmail(email);
      if (emailError) {
        return;
      }
      if (!agreedToTerms) {
        alertCustom("Para prosseguir, aceite os termos!");
        return;
      }

      try {
        const data = {
          email: email,
        };
        setLoading(true);
        const response = await axios.post(
          `http://localhost:3000/v1/user/recuperar`,
          data
        );
        alertCustom(response.data.message);
        setPasso1recuperacao(true);
      } catch (error) {
        alertCustom(error.response.data.message);
      }
      setLoading(false);
    } else if (isSignUp) {
      validateFirstName(firstName);
      validateLastName(lastName);
      validateEmail(email);
      validatePhone(phone);
      validatePassword(password);
      validateConfirmPassword(passwordConfirm);
      if (!agreedToTerms) {
        alertCustom("Para prosseguir, aceite os termos!");
        return;
      }

      if (
        firstNameError ||
        lastNameError ||
        emailError ||
        phoneError ||
        passwordError ||
        passwordConfirmError
      ) {
        return;
      }

      try {
        const data = {
          nome: firstName + " " + lastName,
          idade: 0,
          foto: "default",
          endereco: "não informado",
          auth: {
            email: email,
            senha: password,
            telefone: phone,
          },
        };

        const response = await axios.post(
          `http://localhost:3000/v1/user/cadastrar`,
          data
        );
        //alertCustom(response.data.message);
        setLoading(false);
      } catch (error) {
        //alertCustom(error.response.data.error);
      }
    } else {
      if (emailError || passwordError) {
        return;
      }
      try {
        const data = {
          email: email,
          senha: password,
          telefone: phone,
        };
        const response = await axios.post(
          `http://192.168.1.8:3000/v1/user/login`,
          data
        );
        if (response.data.token) {
          axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${response.data.token}`;

          alertCustom(response.data.message);
          //navigate("/home");
        } else {
          alertCustom(response.data.message);
        }

        setLoading(false);
      } catch (error) {
        alertCustom(error.response.data.error);
        setLoading(false);
      }
    }
  };

  const toggleSignUp = () => {
    setIsSignUp(!isSignUp);
    setIsForgotPassword(false);
  };

  const toggleForgotPassword = () => {
    setIsForgotPassword(!isForgotPassword);
    setIsSignUp(false);
  };

  const phoneMask = (value) => {
    if (!value) return "";

    value = value.replace(/\D/g, "");
    value = value.replace(/(\d{2})(\d)/, "($1) $2");
    value = value.replace(/(\d)(\d{4})$/, "$1-$2");
    return value;
  };

  const isValidEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const validateEmail = (email) => {
    if (email.length === 0) {
      setEmailError(true);
      setEmailHelperText("E-mail não informado!");
    } else if (!isValidEmail(email)) {
      setEmailError(true);
      setEmailHelperText("Formato de e-mail inválido!");
    } else {
      setEmailError(false);
      setEmailHelperText("");
    }
  };

  function maskEmail(email) {
    if (email) {
      const [username, domain] = email.split("@");
      const maskedUsername =
        username.charAt(0) + "*".repeat(username.length - 1);
      return maskedUsername + "@" + domain;
    }
    return "";
  }

  const validatePhone = (phone) => {
    if (!phone) {
      setPhoneError(true);
      setPhoneHelperText("Telefone não informado!");
    } else if (phone.length < 14) {
      setPhoneError(true);
      setPhoneHelperText("Telefone inválido!");
    } else {
      setPhoneError(false);
      setPhoneHelperText("");
    }
  };

  const validateFirstName = (firstName) => {
    if (!firstName) {
      setFirstNameError(true);
      setFirstNameHelperText("Nome não informado!");
    } else {
      setFirstNameError(false);
      setFirstNameHelperText("");
    }
  };

  const validateLastName = (lastName) => {
    if (!lastName) {
      setLastNameError(true);
      setLastNameHelperText("Sobrenome não informado!");
    } else {
      setLastNameError(false);
      setLastNameHelperText("");
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

  return (
    <Grid container component="main" sx={styles.container}>
      <Snackbar
        open={state.open}
        onClose={handleClose}
        TransitionComponent={state.Transition}
        message={state.message}
        key={state.Transition.name}
      />
      <Grid item xs={12} sm={6} md={4} elevation={1} sx={styles.formContainer}>
        <Box sx={styles.formBox}>
          <Typography component="h1" variant="h5" sx={styles.formTitle}>
            {isSignUp
              ? "Cadastre-se"
              : isForgotPassword
              ? "Esqueceu a senha?"
              : "Acesse sua conta"}
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={styles.contentForm}
          >
            {isForgotPassword ? (
              <>
                <Typography variant="body1" sx={styles.labelText}>
                  {passo1recuperacao
                    ? `Enviamos um código de verificação a ${maskEmail(
                        email ?? ""
                      )}!`
                    : "Informe seu email para recuperar seu acesso"}
                </Typography>
                {passo1recuperacao ? (
                  <VerificationCodeInput email={email} length={4} />
                ) : (
                  <TextField
                    fullWidth
                    id="email"
                    label="Endereço de Email"
                    name="email"
                    autoComplete="email"
                    variant="standard"
                    error={emailError}
                    helperText={emailHelperText}
                    onBlur={(e) => validateEmail(e.target.value)}
                    onInput={(event) => setEmail(event.target.value)}
                    sx={styles.inputField}
                  />
                )}
              </>
            ) : isSignUp ? (
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={6}>
                  <TextField
                    fullWidth
                    id="firstName"
                    label="Nome"
                    value={firstName}
                    name="firstName"
                    autoComplete="given-name"
                    autoFocus
                    variant="standard"
                    error={firstNameError}
                    helperText={firstNameHelperText}
                    onInput={(e) => setFirstName(e.target.value)}
                    onBlur={(e) => validateFirstName(e.target.value)}
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
                    onBlur={(e) => validateLastName(e.target.value)}
                    sx={styles.inputField}
                  />
                </Grid>
              </Grid>
            ) : (
              <>
                {loginTelefone ? (
                  <TextField
                    fullWidth
                    id="phone"
                    label="Telefone"
                    name="phone"
                    autoComplete="current-phone"
                    variant="standard"
                    value={phone}
                    error={phoneError}
                    helperText={phoneHelperText}
                    onInput={(event) => {
                      event.target.value = phoneMask(event.target.value);
                      setPhone(event.target.value);
                    }}
                    inputProps={{ maxLength: 15 }}
                    onBlur={(e) => validatePhone(e.target.value)}
                    sx={styles.inputField}
                  />
                ) : (
                  <TextField
                    fullWidth
                    id="email"
                    label="Endereço de Email"
                    name="email"
                    autoFocus
                    autoComplete="email"
                    variant="standard"
                    error={emailError}
                    value={email}
                    helperText={emailHelperText}
                    onBlur={(e) => validateEmail(e.target.value)}
                    onInput={(event) => setEmail(event.target.value)}
                    sx={styles.inputField}
                  />
                )}
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
                  onInput={(e) => setPassword(e.target.value)}
                  onBlur={(e) => validatePassword(e.target.value)}
                  sx={styles.inputField}
                />
              </>
            )}
            {isSignUp && (
              <>
                <TextField
                  fullWidth
                  id="phone"
                  label="Telefone"
                  name="phone"
                  autoComplete="current-phone"
                  variant="standard"
                  error={phoneError}
                  value={phone}
                  helperText={phoneHelperText}
                  onInput={(event) => {
                    event.target.value = phoneMask(event.target.value);
                    setPhone(event.target.value);
                  }}
                  inputProps={{ maxLength: 15 }}
                  onBlur={(e) => validatePhone(e.target.value)}
                  sx={styles.inputField}
                />
                <TextField
                  fullWidth
                  id="email"
                  label="Endereço de Email"
                  name="email"
                  autoComplete="email"
                  variant="standard"
                  error={emailError}
                  value={email}
                  helperText={emailHelperText}
                  onBlur={(e) => validateEmail(e.target.value)}
                  onInput={(event) => setEmail(event.target.value)}
                  sx={styles.inputField}
                />
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
                  sx={styles.inputField}
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
                  sx={styles.inputField}
                />
              </>
            )}
            {isSignUp || (isForgotPassword && !passo1recuperacao) ? (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={agreedToTerms}
                    value="terms"
                    color="primary"
                  />
                }
                label={"Concordo com os termos e condições"}
                variant="body2"
                sx={styles.labelText}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
              />
            ) : !passo1recuperacao ? (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={loginTelefone}
                    value="telefoneLogin"
                    color="primary"
                  />
                }
                label={"Logar usando telefone"}
                variant="body2"
                sx={styles.labelText}
                onChange={(e) => setLoginTelefone(e.target.checked)}
              />
            ) : null}
            {!isForgotPassword ? (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={senhasVisiveis}
                    value="passView"
                    color="primary"
                  />
                }
                label={"Mostar Senhas"}
                variant="body2"
                sx={styles.labelText}
                onChange={(e) => setSenhasVisiveis(e.target.checked)}
              />
            ) : null}
            {!passo1recuperacao ? (
              <LoadingButton
                size="small"
                type="submit"
                fullWidth
                onClick={handleSubmit}
                loading={loading}
                loadingPosition="end"
                variant="contained"
              >
                {isSignUp
                  ? "Cadastrar"
                  : isForgotPassword
                  ? "Recuperar"
                  : "Acessar"}
              </LoadingButton>
            ) : null}
            <Grid container>
              <Grid item xs>
                {!isForgotPassword && (
                  <Link href="#" variant="body2" onClick={toggleForgotPassword}>
                    Esqueceu a senha?
                  </Link>
                )}
              </Grid>
              <Grid item>
                <Link href="#" variant="body2" onClick={toggleSignUp}>
                  {isSignUp
                    ? "Já tem uma conta? Faça o login"
                    : "Não tem uma conta? Cadastre-se"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Grid>
      <Grid item xs={false} sm={6} md={8} sx={styles.imageLabel} />
    </Grid>
  );
}
