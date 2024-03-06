import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Chip from "@mui/material/Chip";

const ChipInput = ({ label, value, setValue }) => {
  const [inputValue, setInputValue] = useState("");
  const [digit, setDigit] = useState(false);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
    setDigit(event.target.value.length > 0 || value.length > 0);
  };

  const handleInputKeyDown = (event) => {
    if (event.key === "Enter" && inputValue.trim() !== "") {
      // Verifica se o valor já existe antes de adicionar como um chip
      if (!value.includes(inputValue.trim())) {
        // Adiciona o valor como um chip
        setValue((prevItems) => [...prevItems, inputValue.trim()]);
      }
      // Limpa o valor do campo de texto
      setInputValue("");
      setDigit(false);
    }
  };

  const handleChipDelete = (chipToDelete) => {
    // Remove o chip correspondente do array de itens
    setValue((prevItems) => prevItems.filter((item) => item !== chipToDelete));
    setDigit(value.length > 1); // Atualiza o estado digit quando todos os chips forem excluídos
  };

  return (
    <TextField
      fullWidth
      label={label}
      value={inputValue}
      onChange={handleInputChange}
      onKeyDown={handleInputKeyDown}
      placeholder="Digite uma opção e tecle enter"
      InputProps={
        value.length > 0 && {
          startAdornment: (
            <InputAdornment position="start">
              {value.map((item, index) => (
                <Chip
                  key={index}
                  label={item}
                  onDelete={() => handleChipDelete(item)}
                  style={{ margin: "4px", marginLeft: "0" }}
                />
              ))}
            </InputAdornment>
          ),
        }
      }
    />
  );
};

export default ChipInput;
