import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import Grid from "@mui/material/Grid";

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

export default function PrimarySearchAppBar() {
  return (
    <Grid container justifyContent="center">
      <Grid item xs={12} md={4.6} margin="0 10px">
        <Search
          style={{
            margin: "10px 0",
            backgroundColor: "#F9F9FB",
          }}
        >
          <SearchIcon />
          <StyledInputBase
            id="inputSeach"
            style={{ width: "100%" }}
            placeholder="Digite para pesquisar..."
            inputProps={{ "aria-label": "search" }}
          />
        </Search>
      </Grid>
    </Grid>
  );
}
