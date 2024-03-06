// Carrossel.js
import React, { useRef } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { Carousel } from "react-bootstrap";
import { Grid } from "@mui/material";
export default function Carrossel(props) {
  const { ArrayItems, onSelectCard } = props;
  const carouselRef = useRef(null);

  const novoItem = (bloco, index) => {
    return (
      <img
        xs={12}
        md={12}
        src={bloco.image}
        item
        alt="banner"
        style={{ width: "100%", maxHeight: "70vh" }}
        onClick={() => onSelectCard(index)}
      />
    );
  };

  return (
    <Grid container sx={{ borderRadius: "5px", overflow: "hidden" }}>
      <Carousel
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
        }}
        ref={carouselRef}
      >
        {ArrayItems.map((group, index) => (
          <Carousel.Item
            key={index}
            style={{
              padding: group.type === "image" ? "50px 10px" : "",
            }}
          >
            {novoItem(group, index)}
          </Carousel.Item>
        ))}
      </Carousel>
    </Grid>
  );
}
