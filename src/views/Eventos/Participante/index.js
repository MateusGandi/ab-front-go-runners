import React, { useState, useEffect } from "react";
import {
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Typography,
} from "@mui/material";
import axios from "axios";
import Autocomplete from "../../../components/AutoComplete/";
import DataTable from "./RenderParticipantes"; // Importe o componente DataTable
import { format } from "date-fns";
import ExcelButton from "../../../utils/excel";
import ExcelReader from "./excelReader";
import QRCodeReader from "./QRCodeReader";

const REACT_APP_URL_BIBLIOTECA_RUNNERS =
  process.env.REACT_APP_URL_BIBLIOTECA_RUNNERS;

const BuscaDadosComponente = () => {
  const [eventos, setEventos] = useState([]);
  const [eventoSelecionado, setEventoSelecionado] = useState("");
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("");
  const [status, setStatus] = useState("");
  const [dados, setDados] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const response = await axios.get(
          `${REACT_APP_URL_BIBLIOTECA_RUNNERS}/v1/evento/listar-eventos-parcial`
        );
        setEventos(response.data);
      } catch (error) {
        console.error("Erro ao buscar eventos:", error);
      }
    };
    fetchEventos();
  }, []);

  const buscarDados = async () => {
    setLoading(true);
    try {
      const params = {
        idEvento: eventoSelecionado,
      };

      if (status && categoriaSelecionada) {
        params.idCategoria = categoriaSelecionada.id;
      }

      if (status) {
        params.status = status.id;
      }

      const response = await axios.post(
        `${REACT_APP_URL_BIBLIOTECA_RUNNERS}/v1/evento/buscar-filtro-participantes`,
        params
      );

      const participantesRemapeados = response.data.map((participante) => {
        // Mapear os kits do participante
        const kitsArray = participante.produtos.map((produto, index) => ({
          [`KIT_${index}`]: `${produto.quantidade} x ${produto.nome} ${produto.variacao}`,
        }));

        return {
          TRANSACAO: participante.transacao,
          NOME: participante.nome,
          DOCUMENTO: participante.documento,
          CATEGORIANAME: participante.categoriaName,
          VALORINGRESSO: `R$ ${Number(participante.valorIngresso).toFixed(2)}`,
          EMAIL: participante.email,
          DATANASC: format(new Date(participante.dataNascimento), "dd/MM/yyyy"),
          SEXO: participante.sexo,
          ...Object.assign({}, ...kitsArray), // Adicionar os kits ao objeto do participante
          DATAINSCRICAO: format(
            new Date(participante.dataInscricao),
            "dd/MM/yyyy"
          ),
          KITS: participante.produtos,
          STATUS: participante.status,
          VALORTOTAL: `R$ ${Number(participante.valorTotal).toFixed(2)}`,
        };
      });

      setDados(participantesRemapeados);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid container spacing={2} sx={{ display: "flex", alignItems: "center" }}>
      <Grid item xs={12} md={3}>
        <FormControl fullWidth variant="standard">
          <InputLabel>Evento</InputLabel>
          <Select
            label="Evento"
            placeholder="Selecione um evento"
            value={eventoSelecionado}
            onChange={(e) => setEventoSelecionado(e.target.value)}
          >
            {eventos.map((evento, index) => (
              <MenuItem key={index} value={evento.id}>
                {evento.titulo}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} md={3}>
        <Autocomplete
          options={eventos.flatMap((evento) =>
            evento.categorias.map((categoria) => ({
              id: categoria.id,
              title: categoria.titulo,
            }))
          )}
          setValue={setCategoriaSelecionada}
          value={categoriaSelecionada}
          label={"Categoria"}
          variant="standard"
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <Autocomplete
          options={[
            {
              id: "approved",
              title: "Pagos",
            },
            {
              id: "pending",
              title: "Pendentes de pagamento",
            },
            {
              id: "cancelled",
              title: "Cancelados",
            },
            {
              id: "signing_up",
              title: "Em processo de inscrição",
            },
          ]}
          setValue={setStatus}
          value={status}
          label="Status"
          variant="standard"
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <Button
          fullWidth
          variant="contained"
          disableElevation
          color="primary"
          onClick={buscarDados}
        >
          Buscar Dados
        </Button>
      </Grid>
      <Grid item xs={12} md={12}>
        {dados.length > 0 ? (
          !loading && <DataTable dados={dados} />
        ) : (
          <div>
            <Typography
              variant="body2"
              color="textSecondary"
              className="show-box"
            >
              Nenhum resultado encontrado!
            </Typography>
          </div>
        )}
      </Grid>
      {dados.length > 0 && (
        <Grid item xs={12} md={3}>
          <ExcelButton data={dados} filename="relatorio.xlsx" />
        </Grid>
      )}
      <Grid item xs={12} md={3}>
        <ExcelReader />
      </Grid>
      <Grid item xs={12} md={3}>
        <QRCodeReader />
      </Grid>
    </Grid>
  );
};

export default BuscaDadosComponente;
