import * as React from "react";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import NightsStayIcon from "@mui/icons-material/NightsStay";
import ArrowDropLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowDropRightIcon from "@mui/icons-material/ArrowRight";

export default function ThemeToggleButtons({
  handleClose,
  visibility,
  toggleTheme,
}) {
  const [selectedTheme, setSelectedTheme] = React.useState("light");

  const handleThemeChange = (event, newTheme) => {
    if (newTheme != "hidden" && newTheme !== null) {
      setSelectedTheme(newTheme);
      toggleTheme(); // Chame a função para trocar o tema
    }
  };

  return (
    <ToggleButtonGroup
      value={selectedTheme}
      exclusive
      onChange={handleThemeChange}
    >
      <ToggleButton
        onClick={handleClose}
        value="hidden"
        aria-label="more-options"
      >
        {visibility ? <ArrowDropRightIcon /> : <ArrowDropLeftIcon />}
      </ToggleButton>
      <ToggleButton value="light" aria-label="light">
        <WbSunnyIcon />
      </ToggleButton>
      <ToggleButton value="dark" aria-label="dark">
        <NightsStayIcon />
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
