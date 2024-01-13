import * as React from "react";
import CheckIcon from "@mui/icons-material/Check";
import ToggleButton from "@mui/material/ToggleButton";

export default function StandaloneToggleButton({ icon: Icon }) {
  const [selected, setSelected] = React.useState(false);

  return (
    <ToggleButton
      style={{ margin: "0" }}
      value="check"
      selected={selected}
      onChange={() => {
        setSelected(!selected);
      }}
    >
      {Icon && <Icon />}
    </ToggleButton>
  );
}
