import * as React from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import { useDropzone } from "react-dropzone";
import Checkbox from "@mui/material/Checkbox";
import OutlinedInput from "@mui/material/OutlinedInput";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import Banner from "../../../images/banner.png";
import Perfil from "../../../images/perfil.png";
import axios from "axios";
import LoadingButton from "@mui/lab/LoadingButton";
import Snackbar from "@mui/material/Snackbar";
import Slide from "@mui/material/Slide";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import IconButton from "@mui/material/IconButton";

export default function CriarEvento() {
  const [state, setState] = React.useState({
    open: false,
    Transition: Slide,
  });

  const alertCustom = (message) => {
    setState({
      open: true,
      Transition: SlideTransition,
      message,
    });
  };

  const handleClose = () => {
    setState({
      ...state,
      open: false,
    });
  };
  function SlideTransition(props) {
    return <Slide {...props} direction="up" />;
  }
  const [loading, setLoading] = React.useState(false);
  const tagOptions = ["Pix", "Boleto", "Cartão", "Sem contribuição"];
  const tableasPreco = ["Tabela 1", "Tabela 2", "Tabela 3", "Tabela 4"];
  const [color, setColor] = React.useState("");
  const [dataEvento, setDataEvento] = React.useState("");
  const [selectedTags, setSelectedTags] = React.useState([]);
  const [selectedItems, setSelectedItems] = React.useState([]);
  const [tabelaPrecoSelecionada, setTabelaPrecoSelecionada] =
    React.useState("");
  const [arquivos, setArquivos] = React.useState([]);
  const [isHovered, setIsHovered] = React.useState(false);

  const handleChange = (event) => {
    console.log(event.target.value, tagOptions[3]);
    if (event.target.value.includes(tagOptions[3])) {
      setSelectedItems([tagOptions[3]]);
    } else {
      setSelectedItems(event.target.value);
    }
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    if (arquivos.length == 0) {
      alertCustom("Nenhuma imagem selecionada!");
    } else {
      const formData = new FormData();
      for (let i = 0; i < arquivos.length; i++) {
        formData.append("fotos", arquivos[i]);
      }

      axios
        .post("http://localhost:3000/v1/user/upload", formData)
        .then((response) => {
          alertCustom("imagens enviadas com sucesso!");
          console.log(response.data);
        })
        .catch((error) => {
          alertCustom("Erro ao enviar imagens!");
          console.error("Erro:", error);
        });
    }
    setLoading(false);
  };

  const onDrop = (acceptedFiles) => {
    // Adiciona os arquivos selecionados ao estado
    setArquivos([...arquivos, ...acceptedFiles]);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    onDragEnter: () => setIsHovered(true),
    onDragLeave: () => setIsHovered(false),
    onDropAccepted: () => setIsHovered(false),
    onDropRejected: () => setIsHovered(false),
  });

  const handleDelete = (file) => {
    // Remove o arquivo do estado
    setArquivos(arquivos.filter((f) => f !== file));
  };

  return (
    <Grid container spacing={2} style={{ margin: "1px", position: "relative" }}>
      <Snackbar
        open={state.open}
        onClose={handleClose}
        TransitionComponent={state.Transition}
        message={state.message}
        key={state.Transition.name}
      />
      <Grid item xs={12} md={12}>
        <Grid container xs={12} md={12} style={{ marginBottom: "20px" }}>
          <Grid
            item
            xs={12}
            md={12}
            style={{
              background: `url(${Banner})`,
              minHeight: "100px",
              display: "flex",
              justifyContent: "end",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              alignItems: "start",
            }}
          >
            <IconButton {...getRootProps()}>
              <AddPhotoAlternateIcon />
            </IconButton>
          </Grid>
          <Grid
            item
            xs={12}
            md={12}
            style={{
              height: "100px",
              width: "100px",
              display: "flex",
              justifyContent: "end",
              alignItems: "start",
              position: "absolute",
              left: "30px",
              top: "30px",
              background: `url(${Perfil})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
            }}
          >
            <IconButton {...getRootProps()}>
              <AddPhotoAlternateIcon />
            </IconButton>
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12} md={12}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              id="standard-basic"
              label="Nome do evento"
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              id="outlined-basic"
              type="date"
              label="Data do evento"
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
              value={dataEvento}
              onChange={(e) => setDataEvento(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel className="input-type" id="demo-simple-select-label">
                Configurar valores
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={tabelaPrecoSelecionada}
                label="Configurar valores"
                onChange={(e) => {
                  setTabelaPrecoSelecionada(e.target.value);
                }}
              >
                {tableasPreco.map((item, index) => {
                  return <MenuItem value={item}>{item}</MenuItem>;
                })}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel className="input-type" id="demo-simple-select-label">
                Configurar valores
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={tabelaPrecoSelecionada}
                label="Configurar valores"
                onChange={(e) => {
                  setTabelaPrecoSelecionada(e.target.value);
                }}
              >
                {tableasPreco.map((item, index) => {
                  return <MenuItem value={item}>{item}</MenuItem>;
                })}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={12}>
            <TextField
              fullWidth
              id="outlined-multiline-static"
              label="Observações"
              multiline
              rows={4}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel className="input-type" id="demo-simple-select-label">
                Cor
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={color}
                label="Cor"
                onChange={(e) => {
                  setColor(e.target.value);
                }}
              >
                {["Vermelho", "Verde", "Azul"].map((item, index) => {
                  return <MenuItem value={item}>{item}</MenuItem>;
                })}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth variant="outlined">
              <InputLabel htmlFor="meios-pag-label" className="input-type">
                Meios de pagamento
              </InputLabel>
              <Select
                labelId="meios-pag-label"
                id="meios-pag-label"
                label="Meios de pagamento"
                multiple
                value={selectedItems}
                onChange={handleChange}
                input={
                  <OutlinedInput
                    label="Meios de pagamento"
                    id="meios-pag-label"
                  />
                }
                renderValue={(selected) => selected.join(", ")}
              >
                {tagOptions.map((name) => (
                  <MenuItem key={name} value={name}>
                    <Checkbox checked={selectedItems.indexOf(name) > -1} />
                    <ListItemText primary={name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={12}>
            <div className="arquives">
              {arquivos.map((file, index) => (
                <Chip
                  style={{ margin: "5px" }}
                  key={index}
                  label={file.name}
                  onDelete={() => handleDelete(file)}
                />
              ))}
            </div>
          </Grid>
          <Grid
            item
            xs={12}
            md={12}
            style={{ display: "flex", justifyContent: "end" }}
          >
            <LoadingButton
              size="small"
              type="submit"
              onClick={handleSubmit}
              loading={loading}
              loadingPosition="end"
              variant="contained"
            >
              Criar novo evento
            </LoadingButton>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
