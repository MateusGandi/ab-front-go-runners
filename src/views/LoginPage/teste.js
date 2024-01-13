import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import Snackbar from "@mui/material/Snackbar";
import Slide from "@mui/material/Slide";
import LoadingButton from "@mui/lab/LoadingButton";
import axios from "../../axiosConfig.js";

function SlideTransition(props) {
  return <Slide {...props} direction="up" />;
}

const VerificationCodeInput = ({ email, length }) => {
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

  const [loading, setLoading] = React.useState(false);
  const [code, setCode] = useState(Array(length).fill(""));

  const handleSubmitTeste = async (event) => {
    event.preventDefault();
    setLoading(true);
    const codigo = code.join("");
    if (code.length === length) {
      const data = {
        email: email,
        codigo: codigo,
      };
      try {
        const response = await axios.post(
          "http://localhost:3000/v1/user/verificar-codigo",
          data
        );
        alertCustom(response.data.message);
      } catch (error) {
        alertCustom(error);
      }
      setLoading(false);
    }
  };

  const handleInput = (event, index) => {
    event.preventDefault();
    const newNumber = event.target.value;

    if (!isNaN(newNumber) && index < length) {
      if (code[index] === "") {
        setCode((prevCode) => {
          const newCode = [...prevCode];
          newCode[index] = newNumber;
          return newCode;
        });
      } else {
      }
      const proxInput = event.target.nextSibling;
      if (proxInput) {
        proxInput.focus();
      }
    }
  };

  const handleKeyDown = (event, index) => {
    event.preventDefault();
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

  return (
    <>
      <Snackbar
        open={state.open}
        onClose={handleClose}
        TransitionComponent={state.Transition}
        message={state.message}
        key={state.Transition.name}
      />
      <Grid container style={{ justifyContent: "space-around" }}>
        {code.map((digit, index) => (
          <input
            key={index}
            type="text"
            value={digit}
            maxLength="1"
            style={{
              width: `${100 / (length + 1)}%`,
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
          />
        ))}
      </Grid>
      <LoadingButton
        size="small"
        fullWidth
        onClick={handleSubmitTeste}
        loadingPosition="end"
        variant="contained"
        loading={loading}
      >
        {" "}
        Verificar
      </LoadingButton>
    </>
  );
};

export default VerificationCodeInput;
