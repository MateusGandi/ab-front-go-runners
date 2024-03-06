import React, { useState, useEffect } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import { Grid, Tooltip, Typography } from "@mui/material";
import Modalidades from "../../components/Cards/RenderModalidades";
import axios from "axios";

const REACT_APP_URL_BIBLIOTECA_RUNNERS =
  process.env.REACT_APP_URL_BIBLIOTECA_RUNNERS;

const SearchAutocomplete = ({
  alertCustom,
  eventosList,
  setFiltredEventos,
  setEventosList,
}) => {
  const [formatedOptions, setFormatedOptions] = useState([]);
  const [sugestions, setSugestions] = useState([]);
  const [searchValue, setSearchValue] = useState(""); // Novo estado para o valor do campo de pesquisa

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const response = await axios.get(
          `${REACT_APP_URL_BIBLIOTECA_RUNNERS}/v1/evento/listar-eventos`
        );
        if (Array.isArray(response.data)) {
          // Verificar se response.data é um array
          setEventosList(response.data);
          setFiltredEventos(response.data);
          const options = response.data.map((item, index) => ({
            key: index,
            title: item.titulo,
            value: item,
          }));
          setFormatedOptions(options);
        } else {
          alertCustom(
            "Os dados recebidos da API não estão em um formato esperado."
          );
        }
      } catch (error) {
        alertCustom("Erro ao carregar feed de eventos, verifique sua conexão!");
        console.error("Erro ao buscar eventos:", error);
      }
    };
    fetchEventos();
  }, []);

  useEffect(() => {
    handleSearch(null);
  }, [sugestions]);

  const handleSearch = (value) => {
    if (value && value.length > 0) {
      setSearchValue(value);
      const filteredEventos = eventosList.filter((evento) => {
        return evento.titulo.toLowerCase().includes(value.toLowerCase());
      });

      if (filteredEventos.length === 0) {
        alertCustom("Nenhum resultado encontrado!");
      } else {
        setFiltredEventos(filteredEventos);
      }
    } else if (sugestions && sugestions.length > 0) {
      const filteredEventos = eventosList.filter((evento) => {
        return sugestions.includes(evento.id);
      });

      if (filteredEventos.length === 0) {
        alertCustom("Nenhum resultado encontrado!");
      } else {
        setFiltredEventos(filteredEventos);
      }
    } else {
      setFiltredEventos(eventosList);
    }
  };

  const handleInputChange = (event, value) => {
    // Remove as sugestões se o campo de pesquisa estiver vazio
    if (value === "") {
      setSugestions([]);
    }
  };

  return (
    <Grid
      container
      sx={{
        justifyContent: "center",
        alignItems: "center",
        padding: "20px 10px",
      }}
      spacing={1}
    >
      <Grid xs={12} item md={6}>
        <Autocomplete
          freeSolo
          size="small"
          id="free-solo-2-demo"
          disableClearable
          options={formatedOptions.map((option) => option.title)}
          value={searchValue} // Define o valor do campo de pesquisa
          onInputChange={handleInputChange} // Manipula a mudança no campo de pesquisa
          renderInput={(params) => (
            <TextField
              placeholder="Pesquisar por eventos..."
              {...params}
              clearOnEscape={false}
              InputProps={{
                ...params.InputProps,
                type: "search",
                endAdornment: (
                  <Tooltip title="Pesquisar">
                    <IconButton
                      onClick={() => handleSearch(params.inputProps.value)}
                      size="small"
                    >
                      <SearchIcon />
                    </IconButton>
                  </Tooltip>
                ),
              }}
            />
          )}
        />
      </Grid>

      <Grid xs={12} item md={12}>
        <Modalidades sugestions={sugestions} setSugestions={setSugestions} />
      </Grid>
    </Grid>
  );
};

export default SearchAutocomplete;
