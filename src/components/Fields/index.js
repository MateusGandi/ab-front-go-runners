import React from "react";
import Button from "@mui/material/Button";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

const CustomTextField = ({ label, image, children, style }) => {
  const wrapperStyle = {
    borderRadius: "5px",
    border: "1px solid #C4C4C4",
    position: "relative",
    margin: "20px 10px",
    ...style,
  };

  const labelStyle = {
    position: "absolute",
    top: "-13px",
    left: "8px",
    backgroundColor: "#f5f5f5",
    padding: "0 5px",
  };

  const imageStyle = {
    width: "100%",
    margin: "0 0 20px 0",
    display: "block",
    borderRadius: "5px 5px 0 0",
  };

  const goBackStyle = {
    position: "absolute",
    margin: "5px",
    backgroundColor: "rgba(256,256,256,0.1)",
    color: "#f0f0f0",
  };

  return (
    <div style={{ ...wrapperStyle, ...style }}>
      {image && (
        <Button startIcon={<ChevronLeftIcon />} style={goBackStyle}>
          VOLTAR À PÁGINA ANTERIOR
        </Button>
      )}
      {label && <label style={labelStyle}>{label}</label>}
      {image && <img src={image} alt="Imagem" style={imageStyle} />}
      {children}
    </div>
  );
};

export default CustomTextField;
