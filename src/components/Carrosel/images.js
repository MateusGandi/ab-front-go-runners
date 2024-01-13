// Carrossel.js
import React, { useRef } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { Carousel } from "react-bootstrap";
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
        style={{ width: "100%" }}
        onClick={() => onSelectCard(index)}
      />
    );
  };

  return (
    <Carousel
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        backgroundColor: "#534FA2",
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
  );
}
