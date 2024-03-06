import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import Grid from "@mui/material/Grid";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";

const Search = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  paddingLeft: "10px",
  marginRight: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  [theme.breakpoints.up("sm")]: {
    marginRight: theme.spacing(3),
    width: "100%",
  },
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1),
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

const suggestions = [
  "Suggestion 1",
  "Suggestion 2",
  "Suggestion 3",
  // Add more suggestions as needed
];

export default function SearchAutocomplete() {
  return (
    <Grid container justifyContent="center" sx={{ height: "500px" }}>
      <Grid item xs={12} md={4.6} margin="0 10px">
        <Autocomplete
          id="search-autocomplete"
          freeSolo
          options={suggestions}
          renderInput={(params) => (
            <Search
              style={{
                margin: "10px 0",
                backgroundColor: "#F9F9FB",
              }}
            >
              <SearchIcon />
              <StyledInputBase
                {...params}
                placeholder="Digite para pesquisar..."
                inputProps={{ "aria-label": "search" }}
              />
            </Search>
          )}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                label={option}
                {...getTagProps({ index })}
                sx={{ backgroundColor: "#F9F9FB", marginRight: 1 }}
              />
            ))
          }
        />
      </Grid>
    </Grid>
  );
}
