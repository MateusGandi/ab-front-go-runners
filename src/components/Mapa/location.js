import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { debounce } from "@mui/material/utils";

const NOMINATIM_API_URL =
  "https://nominatim.openstreetmap.org/search?format=json&limit=5&q=";

function fetchLocations(input, callback) {
  fetch(NOMINATIM_API_URL + input)
    .then((response) => response.json())
    .then((data) => {
      const locations = data.map((item) => ({
        description: item.display_name,
        structured_formatting: {
          main_text: item.display_name,
          secondary_text: "",
        },
      }));
      callback(locations);
    })
    .catch((error) => {
      console.error("Error fetching locations:", error);
      callback([]);
    });
}

export default function NominatimAutocomplete({
  valor,
  setLocation,
  label,
  variant,
}) {
  const [value, setValue] = React.useState(valor || null);
  const [inputValue, setInputValue] = React.useState("");
  const [options, setOptions] = React.useState([]);

  const fetch = React.useMemo(
    () =>
      debounce((input, callback) => {
        fetchLocations(input, callback);
      }, 400),
    []
  );

  React.useEffect(() => {
    let active = true;

    if (inputValue === "") {
      setOptions(value ? [value] : []);
      return undefined;
    }

    fetch(inputValue, (results) => {
      if (active) {
        setOptions(results);
      }
    });

    return () => {
      active = false;
    };
  }, [value, inputValue, fetch]);

  return (
    <Autocomplete
      id="nominatim-autocomplete"
      fullWidth
      getOptionLabel={(option) =>
        typeof option === "string" ? option : option.description
      }
      filterOptions={(x) => x}
      options={options}
      autoComplete
      includeInputInList
      filterSelectedOptions
      value={value}
      onChange={(event, newValue) => {
        setOptions(newValue ? [newValue, ...options] : options);
        setLocation(newValue);
        setValue(newValue);
      }}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      renderInput={(params) => (
        <TextField
          variant={variant || "outlined"}
          {...params}
          label={label}
          placeholder="Comece a digitar"
          fullWidth
        />
      )}
      renderOption={(props, option) => (
        <li {...props}>
          <Grid container alignItems="center">
            <Grid item sx={{ display: "flex", width: 44 }}>
              <LocationOnIcon sx={{ color: "text.secondary" }} />
            </Grid>
            <Grid
              item
              sx={{ width: "calc(100% - 44px)", wordWrap: "break-word" }}
            >
              <Typography variant="body2">{option.description}</Typography>
            </Grid>
          </Grid>
        </li>
      )}
    />
  );
}
