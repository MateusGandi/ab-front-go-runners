import * as React from "react";
import Grid from "@mui/material/Grid";
import Search from "../../../components/Search/";
import Card from "../../../components/Cards/CardEvento";
export default function BasicGrid() {
  return (
    <>
      <Search></Search>
      <Grid
        container
        justifyContent={{
          xs: "center",
          md: "start",
          backgroundColor: "#ECECEC",
        }}
      >
        <Grid item xs={11} md={2}>
          <Card />
        </Grid>
        <Grid item xs={11} md={2}>
          <Card />
        </Grid>
        <Grid item xs={11} md={2}>
          <Card />
        </Grid>
        <Grid item xs={11} md={2}>
          <Card />
        </Grid>
        <Grid item xs={11} md={2}>
          <Card />
        </Grid>
        <Grid item xs={11} md={2}>
          <Card />
        </Grid>
        <Grid item xs={11} md={2}>
          <Card />
        </Grid>
        <Grid item xs={11} md={2}>
          <Card />
        </Grid>
        <Grid item xs={11} md={2}>
          <Card />
        </Grid>
      </Grid>
    </>
  );
}
