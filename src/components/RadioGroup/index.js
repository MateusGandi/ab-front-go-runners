import React, { useState } from "react";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Checkbox from "@mui/material/Checkbox";

export default function BasicCheckbox({ options, defaultValue, label }) {
  const [selectedOption, setSelectedOption] = useState(defaultValue);

  const handleChange = (value) => {
    setSelectedOption(value);
    console.log("Checkbox selecionado:", value);
  };

  return (
    <FormControl>
      <FormLabel id="basic-checkbox-label">{label}</FormLabel>
      {options.map((option, index) => (
        <div key={index}>
          <Checkbox
            checked={selectedOption === option.value}
            onChange={() => handleChange(option.value)}
          />
          <span>{option.label}</span>
        </div>
      ))}
    </FormControl>
  );
}
