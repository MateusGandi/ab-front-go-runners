import React, { useEffect, useState } from "react";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Grid } from "@mui/material";
import axios from "../../utils/configAxios";
const REACT_APP_URL_BIBLIOTECA_RUNNERS =
  process.env.REACT_APP_URL_BIBLIOTECA_RUNNERS;

export default function ClickableChips({ sugestions, setSugestions }) {
  const [sugestionsOptions, setSugestionsOptions] = useState([]);

  function intersecaoArrays(arrays) {
    // Verifica se há pelo menos dois arrays para fazer a interseção
    if (arrays.length < 2) return arrays[0];

    // Interseção começa com todos os elementos do primeiro array
    let intersecao = arrays[0];

    // Itera sobre os outros arrays
    for (let i = 1; i < arrays.length; i++) {
      // Filtra os elementos que estão presentes em ambos os arrays
      intersecao = intersecao.filter((elemento) =>
        arrays[i].includes(elemento)
      );
    }

    return intersecao;
  }

  useEffect(() => {
    setSugestions(intersecaoArrays(sugestionsOptions));
  }, [sugestionsOptions]);

  const [tags, setTags] = useState([]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axios.get(
          `${REACT_APP_URL_BIBLIOTECA_RUNNERS}/v1/evento/listar-tags`
        );
        setTags(response.data);
      } catch (error) {
        console.error("Erro ao buscar tags:", error);
      }
    };
    fetchTags();
  }, []);

  const handleScroll = (direction) => {
    const container = containerRef.current;
    if (!container) return;

    const startScroll = container.scrollLeft;
    const targetScroll =
      direction === "left"
        ? startScroll - scrollAmount
        : startScroll + scrollAmount;

    cancelAnimationFrame(animationRef.current);

    const animateScroll = () => {
      const currentScroll = container.scrollLeft;
      const distance = targetScroll - currentScroll;
      const ease = 0.1;

      container.scrollLeft += distance * ease;

      if (Math.abs(targetScroll - container.scrollLeft) > 1) {
        animationRef.current = requestAnimationFrame(animateScroll);
      }
    };

    animateScroll();
  };

  const handleClick = (tagIds) => {
    console.info("Você clicou na tag:", tagIds, sugestionsOptions);
    const index = sugestionsOptions.indexOf(tagIds);
    if (index === -1) {
      // Adiciona o ID à sugestão se não estiver presente
      setSugestionsOptions([...sugestionsOptions, tagIds]);
    } else {
      // Remove o ID da sugestão se estiver presente
      setSugestionsOptions(sugestionsOptions.filter((id) => id !== tagIds));
    }
  };

  const containerRef = React.useRef(null);
  const scrollAmount = 100;
  const animationRef = React.useRef(null);

  return (
    <Grid container style={{ position: "relative" }}>
      <Grid item sx={{ display: { xs: "none", md: "block" }, width: "5%" }}>
        <IconButton onClick={() => handleScroll("left")} color="textSecondary">
          <ArrowBackIosIcon />
        </IconButton>
      </Grid>
      <Grid item sx={{ width: { xs: "100%", md: "90%" } }}>
        <Stack
          direction="row"
          spacing={1}
          style={{
            overflow: "hidden",
            overflowX: "scroll",
            height: "100%",
            alignItems: "center",
          }}
          ref={containerRef}
        >
          {Array.isArray(tags) &&
            tags.length > 0 &&
            tags.map((tag, index) => (
              <Chip
                key={index}
                label={tag.tagName.replace("#", "")}
                color={
                  sugestionsOptions.includes(tag.tags) ? "primary" : "default"
                }
                variant="outlined"
                onClick={() => handleClick(tag.tags)}
              />
            ))}
        </Stack>
      </Grid>
      <Grid
        item
        sx={{
          display: { xs: "none", md: "flex" },
          width: "5%",
          justifyContent: "end",
        }}
      >
        <IconButton onClick={() => handleScroll("right")} color="textSecondary">
          <ArrowForwardIosIcon />
        </IconButton>
      </Grid>
    </Grid>
  );
}
