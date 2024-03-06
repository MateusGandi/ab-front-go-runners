import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import { useDropzone } from "react-dropzone";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Slide from "@mui/material/Slide";
import axios from "../../../utils/configAxios";
import LoadingButton from "@mui/lab/LoadingButton";
import Snackbar from "@mui/material/Snackbar";
import { Typography, Card, CardHeader } from "@mui/material";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import Paper from "@mui/material/Paper";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import NewCategoria from "./newCategoria";
import RenderCategoria from "./renderCategoria";
import SimplePaper from "../../../components/Paper";
import UploadDialog from "./UploadDialog";
import BannerDefault from "../../../images/banner.png";
import PerfilDefault from "../../../images/perfil.png";

import Location from "../../../components/Mapa/location"; //
import Autocomplete from "../../../components/AutoComplete/";

const REACT_APP_URL_BIBLIOTECA_RUNNERS =
  process.env.REACT_APP_URL_BIBLIOTECA_RUNNERS;

export default function CriarEvento() {
  const [state, setState] = useState({
    open: false,
    Transition: Slide,
    message: "",
  });
  const [categoriaOptions, setCategoriaOptions] = useState([]);
  const [tabelasProdutos, setTabelasProdutos] = useState([]);
  const [formularios, setFormularios] = useState([]);
  const [organizadores, setOrganizadores] = useState([]);
  const [location, setLocation] = useState("");
  const [uploadFilesExtras, setUploadFilesExtras] = useState([]);
  const [open, setOpen] = useState(false);
  const [eventoData, setEventoData] = useState({
    status: true,
    titulo: "",
    subTitulo: "",
    regulamento: "",
    bannerImage: "",
    perfilImage: "",
    tabelaPreco: "",
    data: "",
    dataFinal: "",
    percurso: "",
    formularioId: "",
    cupomPromocional: "",
    localizacao: "",
  });

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handleOpenDialog = () => {
    setOpen(true);
  };

  useEffect(() => {
    try {
      axios
        .get(
          `${REACT_APP_URL_BIBLIOTECA_RUNNERS}/v1/evento/listar-nome-categorias`
        )
        .then((response) => {
          setCategoriaOptions(response.data);
        })
        .catch((error) => {
          console.log(error);
        });

      axios
        .get(`${REACT_APP_URL_BIBLIOTECA_RUNNERS}/v1/produto/listar-tabelas`)
        .then((response) => setTabelasProdutos(response.data))
        .catch((error) => {
          console.log(error);
        });

      axios
        .get(`${REACT_APP_URL_BIBLIOTECA_RUNNERS}/v1/formulario/listar`)
        .then((response) => setFormularios(response.data))
        .catch((error) => {
          console.log(error);
        });

      axios
        .get(
          `${REACT_APP_URL_BIBLIOTECA_RUNNERS}/v1/evento/listar-organizadores`
        )
        .then((response) => setOrganizadores(response.data))
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      alertCustom(
        "Erro ao buscar dados, verifique sua conexão antes de prosseguir!"
      );
    }
  }, []);

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

  const [loading, setLoading] = useState(false);
  const [perfilLoading, setPerfilLoading] = useState(PerfilDefault);
  const [bannerLoading, setBannerLoading] = useState(BannerDefault);
  const [selectedFormulario, setSelectedFormulario] = useState("");
  const [selectedOrganizador, setSelectedOrganizador] = useState("");
  const [arquivos, setArquivos] = useState([]);
  const [isHovered, setIsHovered] = useState(false);

  const handleUploadFilesExtras = async () => {
    try {
      if (uploadFilesExtras.length === 0) {
        return { regulamentoPdfURL: "", circuitoURL: "", kitURL: "" };
      }

      let regulamentoPdfURL = "";
      let circuitoURL = "";
      let kitURL = "";

      for (const file of uploadFilesExtras) {
        const formData = new FormData();
        const newName = `${file.name}-${file.file.name}`;
        const novoArquivo = new File([file.file], newName, {
          type: file.file.type,
        });
        formData.append("fotos", novoArquivo);
        try {
          const response = await axios.post(
            `${REACT_APP_URL_BIBLIOTECA_RUNNERS}/v1/upload/${file.name}`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          switch (file.name) {
            case "regulamento":
              regulamentoPdfURL = response.data.fileNames[0];
              break;
            case "percurso":
              circuitoURL = response.data.fileNames[0];
              break;
            case "kit":
              kitURL = response.data.fileNames[0];
              break;
            default:
              break;
          }
        } catch (err) {
          throw new Error(err.response.data.error);
        }
      }

      alertCustom("Arquivos adicionais enviados com sucesso!");
      return { regulamentoPdfURL, circuitoURL, kitURL };
    } catch (error) {
      alertCustom("Erro no envio dos arquivos adicionais!");
      throw new Error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (arquivos.length === 0) {
      alertCustom("Nenhuma imagem selecionada!");
      return;
    }
    if (
      !eventoData.titulo ||
      !eventoData.subTitulo ||
      !eventoData.regulamento ||
      !eventoData.data ||
      !eventoData.dataFinal ||
      !eventoData.tabelaPreco ||
      !selectedFormulario ||
      !selectedOrganizador ||
      !eventoData.cupomPromocional ||
      categorias.length === 0
    ) {
      alertCustom("Por favor, preencha todos os campos obrigatórios!");
      return;
    }

    const formData = new FormData();
    arquivos.forEach((file) => {
      const novoNome = `${file.inputName}-${file.file.name}`;
      const novoArquivo = new File([file.file], novoNome, {
        type: file.file.type,
      });
      formData.append("fotos", novoArquivo);
    });

    try {
      const { circuitoURL, regulamentoPdfURL, kitURL } =
        await handleUploadFilesExtras();

      const response = await axios.post(
        `${REACT_APP_URL_BIBLIOTECA_RUNNERS}/v1/upload/Eventos`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alertCustom(response.data.message);

      const files = response.data.fileNames;
      let fotoBanner = "";
      let fotoPerfil = "";
      for (const file of files) {
        if (file.includes("Banner")) {
          fotoBanner = file;
        } else if (file.includes("Perfil")) {
          fotoPerfil = file;
        }
      }
      const data = {
        evento: {
          ...eventoData,
          bannerImage: fotoBanner,
          perfilImage: fotoPerfil,
          formularioId: selectedFormulario.id,
          categoriaName: groupCategoria.title,
          localizacao: location.description,
          circuitoURL: circuitoURL,
          regulamentoPdfURL: regulamentoPdfURL,
          kitURL: kitURL,
        },
        categorias: categorias,
        organizador: selectedOrganizador,
      };
      const response2 = await axios.post(
        `${REACT_APP_URL_BIBLIOTECA_RUNNERS}/v1/evento/cadastrar`,
        data
      );

      alertCustom(response2.data.message);
      console.log(response2.data);
      window.location.reload();
    } catch (error) {
      alertCustom(
        `Erro no cadastro, ${error
          .toString()
          .toLowerCase()
          .replaceAll("error:", "")}!`
      );
      console.error("Erro:", error);
    }
  };

  const onDrop = (acceptedFiles, inputName) => {
    const filteredFiles = arquivos.filter(
      (file) => file.inputName !== inputName
    );

    if (inputName === "Perfil") {
      setPerfilLoading(URL.createObjectURL(acceptedFiles[0]));
    } else if (inputName === "Banner") {
      setBannerLoading(URL.createObjectURL(acceptedFiles[0]));
    }

    setArquivos([
      ...filteredFiles,
      ...acceptedFiles.map((file) => ({ inputName, file })),
    ]);
  };

  const dropzonePerfil = useDropzone({
    onDrop: (acceptedFiles) => onDrop(acceptedFiles, "Perfil"),
    onDragEnter: () => setIsHovered(true),
    onDragLeave: () => setIsHovered(false),
    onDropAccepted: () => setIsHovered(false),
    onDropRejected: () => setIsHovered(false),
  });

  const dropzoneBanner = useDropzone({
    onDrop: (acceptedFiles) => onDrop(acceptedFiles, "Banner"),
    onDragEnter: () => setIsHovered(true),
    onDragLeave: () => setIsHovered(false),
    onDropAccepted: () => setIsHovered(false),
    onDropRejected: () => setIsHovered(false),
  });

  const {
    getRootProps: getPerfilRootProps,
    getInputProps: getPerfilInputProps,
  } = dropzonePerfil;

  const {
    getRootProps: getBannerRootProps,
    getInputProps: getBannerInputProps,
  } = dropzoneBanner;

  const handleDelete = (file) => {
    const filteredFiles = arquivos.filter(
      (f) => f.inputName !== file.inputName
    );
    setArquivos(filteredFiles);

    if (file.inputName === "Perfil") {
      setPerfilLoading(PerfilDefault);
    } else if (file.inputName === "Banner") {
      setBannerLoading(BannerDefault);
    }
  };

  const [categoriaModalOpen, setCategoriaModalOpen] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [groupCategoria, setGroupCategoria] = useState("");
  const [categoriaAtual, setCategoriaAtual] = useState(null);

  useEffect(() => {
    if (groupCategoria && !groupCategoria.created) {
      axios
        .get(
          `${REACT_APP_URL_BIBLIOTECA_RUNNERS}/v1/evento/listar-categorias/${groupCategoria.title}`
        )
        .then((response) => {
          const categoriasData = response.data;

          if (Array.isArray(categoriasData)) {
            setCategorias(
              categoriasData.map((categoria) => ({
                valorIngresso: categoria.valorIngresso || 0,
                numVagasDisponiveis: categoria.numVagas,
                numVagas: categoria.numVagas,
                titulo: categoria.titulo,
                criterio: categoria.criterio,
                grupo: categoria.grupo,
              }))
            );
          } else {
            console.error(
              "A resposta do servidor não é um array:",
              categoriasData
            );
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      setCategorias([]);
    }
  }, [groupCategoria]);

  const handleSalvarCategoria = (novaCategoria, update, categoriaToUpdate) => {
    if (update) {
      const index = categorias.indexOf(categoriaToUpdate);
      categorias[index] = novaCategoria;
      setCategorias(categorias);
    } else {
      setCategorias([...categorias, novaCategoria]);
    }

    setCategoriaAtual(null);
    setCategoriaModalOpen(false);
  };

  const handleEditarCategoria = (categoria) => {
    setCategoriaAtual(categoria);
    setCategoriaModalOpen(true);
  };

  const handleDeleteCategoria = (categoriaToDelete) => {
    const updatedCategorias = categorias.filter(
      (categoria) => categoria !== categoriaToDelete
    );
    setCategorias(updatedCategorias);
    setCategoriaModalOpen(false);
  };

  return (
    <Grid container style={{ position: "relative" }}>
      <Snackbar
        open={state.open}
        onClose={handleClose}
        TransitionComponent={state.Transition}
        message={state.message}
      />
      <Grid
        item
        xs={12}
        md={12}
        style={{
          maxHeight: "150px",
          height: "100%",
          display: "flex",
          justifyContent: "end",
          alignItems: "start",
          position: "relative",
        }}
      >
        <img
          src={bannerLoading}
          alt="Banner"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: -5,
            right: 0,
          }}
        >
          <Button
            disableElevation
            variant="contained"
            size="small"
            className="no-round"
            onClick={() =>
              setEventoData({ ...eventoData, status: !eventoData.status })
            }
            color={eventoData.status ? "success" : "secondary"}
            sx={{
              borderRadius: "0 0 5px 5px",
            }}
          >
            {eventoData.status ? "Ativo" : "Inativo"}
          </Button>
          <IconButton {...getBannerRootProps()} name="banner">
            <AddPhotoAlternateIcon />
          </IconButton>
        </div>
      </Grid>
      <div
        className="arquives"
        style={{
          display: "flex",
          justifyContent: "end",
          overflow: "hidden",
          width: "100%",
          minHeight: "60px",
        }}
      >
        {arquivos.map((file, index) => (
          <Chip
            style={{
              backgroundColor: "transparent",
              maxWidth: "calc(25% - 5px)",
              margin: "0px 0px 5px 5px",
              borderRadius: " 0 0  10px 10px",
            }}
            key={index}
            label={file.file.name}
            onDelete={() => handleDelete(file)}
          />
        ))}
      </div>
      <Grid
        item
        xs={12}
        md={12}
        style={{
          height: "150px",
          width: "150px",
          display: "flex",
          justifyContent: "end",
          alignItems: "start",
          position: "absolute",
          left: "30px",
          top: "30px",
        }}
      >
        <img
          src={perfilLoading}
          alt="Perfil"
          elevation={1}
          style={{
            borderRadius: "5px",
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        <IconButton
          style={{ position: "absolute" }}
          {...getPerfilRootProps()}
          name="perfil"
        >
          <AddPhotoAlternateIcon />
        </IconButton>
      </Grid>
      <Grid item xs={12} md={12}>
        <Grid container spacing={1}>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              id="standard-basic"
              label="Nome do evento"
              variant="standard"
              value={eventoData.titulo}
              onChange={(e) =>
                setEventoData({ ...eventoData, titulo: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              id="standard-basic"
              label="Subtitulo do evento"
              variant="standard"
              value={eventoData.subTitulo}
              onChange={(e) =>
                setEventoData({ ...eventoData, subTitulo: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <TextField
              fullWidth
              id="outlined-basic"
              type="date"
              label="Data de início"
              variant="standard"
              InputLabelProps={{
                shrink: true,
              }}
              value={eventoData.data}
              onChange={(e) =>
                setEventoData({ ...eventoData, data: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <TextField
              fullWidth
              id="outlined-basic"
              type="date"
              label="Data final"
              variant="standard"
              InputLabelProps={{
                shrink: true,
              }}
              value={eventoData.dataFinal}
              onChange={(e) =>
                setEventoData({ ...eventoData, dataFinal: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              id="outlined-basic"
              type="text"
              label="Cupom promocional"
              variant="outlined"
              value={eventoData.cupomPromocional.toUpperCase()}
              onChange={(e) =>
                setEventoData({
                  ...eventoData,
                  cupomPromocional: e.target.value.toUpperCase(),
                })
              }
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel className="input-type" id="formulario-label">
                Formulário
              </InputLabel>
              <Select
                labelId="formulario-label"
                id="formulario"
                value={selectedFormulario}
                label="Formulário"
                onChange={(e) => setSelectedFormulario(e.target.value)}
              >
                {formularios.map((item, index) => (
                  <MenuItem key={index} value={item} title={item.titulo}>
                    {item.nome}
                  </MenuItem>
                )) || <MenuItem>Não há dados cadastrados</MenuItem>}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel className="input-type" id="organizador-label">
                Organizador
              </InputLabel>
              <Select
                labelId="organizador-label"
                id="organizador"
                value={selectedOrganizador}
                label="Organizador"
                onChange={(e) => setSelectedOrganizador(e.target.value)}
              >
                {organizadores.map((item, index) => (
                  <MenuItem key={index} value={item}>
                    {item.nome}
                  </MenuItem>
                )) || <MenuItem>Não há dados cadastrados</MenuItem>}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel className="input-type" id="configurar-valores-label">
                Configurar valores
              </InputLabel>
              <Select
                labelId="configurar-valores-label"
                id="configurar-valores"
                value={eventoData.tabelaPreco}
                label="Configurar valores"
                onChange={(e) =>
                  setEventoData({ ...eventoData, tabelaPreco: e.target.value })
                }
              >
                {tabelasProdutos.map((item, index) => (
                  <MenuItem key={index} value={item}>
                    {item}
                  </MenuItem>
                )) || <MenuItem>Não há dados cadastrados</MenuItem>}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={12}>
            <TextField
              fullWidth
              id="outlined-mult
              outlined-static"
              value={eventoData.regulamento}
              label="Regulamento"
              placeholder="Adicione tags usando '#' para facilitar a pesquisa do evento, exemplo: '#CorridaAcimaDos5km' "
              multiline
              rows={12}
              onInput={(e) =>
                setEventoData({ ...eventoData, regulamento: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <Button
              fullWidth
              disableElevation
              onClick={handleOpenDialog}
              variant="text"
            >
              Upload de arquivos adicionais
            </Button>
          </Grid>
          <Grid item xs={12} md={12}>
            <Paper elevation={0} variant="outlined" sx={{ padding: 2 }}>
              <Grid
                container
                xs={12}
                md={12}
                style={{
                  marginBottom: "10px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Grid item>
                  <Typography variant="h6">
                    Configurar Categorias
                    <Typography variant="body2" color="textSecondary">
                      Informe categorias personalizadas para o evento
                    </Typography>
                  </Typography>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Autocomplete
                    options={categoriaOptions.map((categoria) => ({
                      title: categoria,
                    }))}
                    setValue={setGroupCategoria}
                    value={groupCategoria}
                    label={"Pesquisar grupo de categorias"}
                    variant="standard"
                  />
                </Grid>
              </Grid>
              <Grid container spacing={1}>
                <Grid item md={3} xs={12}>
                  <Button
                    fullWidth
                    disableElevation
                    variant="contained"
                    onClick={() => {
                      setCategoriaAtual(null);
                      setCategoriaModalOpen(true);
                    }}
                  >
                    Nova Categoria
                  </Button>
                </Grid>
                <Grid item xs={12} md={12}>
                  <Grid container spacing={1}>
                    {categorias &&
                      categorias.map((item, index) => (
                        <Grid item xs={12} md={3} key={index}>
                          <SimplePaper
                            edit={true}
                            setFunction={handleEditarCategoria}
                            data={item}
                          />
                        </Grid>
                      ))}
                  </Grid>
                </Grid>
                <Grid item xs={12} md={12}>
                  <CardHeader
                    className="show-box"
                    avatar={<ReportProblemIcon fontSize="small" />}
                    title={
                      <Typography color="textSecondary" variant="body2">
                        Você pode selecionar um grupo de categorias existente e
                        editar ou criar uma nova, mas é obrigatóro informar um
                        nome.
                      </Typography>
                    }
                  />
                </Grid>
              </Grid>
              {/*modais*/}
              {categoriaAtual ? (
                <RenderCategoria
                  nameGroup={groupCategoria?.title || ""}
                  alertCustom={alertCustom}
                  open={categoriaModalOpen}
                  onClose={() => setCategoriaModalOpen(false)}
                  categoriaEditar={categoriaAtual}
                  onSave={handleSalvarCategoria}
                  onDelete={handleDeleteCategoria}
                />
              ) : (
                <NewCategoria
                  nameGroup={groupCategoria?.title || ""}
                  alertCustom={alertCustom}
                  open={categoriaModalOpen}
                  onClose={() => setCategoriaModalOpen(false)}
                  onSave={handleSalvarCategoria}
                />
              )}
            </Paper>
          </Grid>

          <Grid item xs={6} md={6}>
            <Location
              label="Pesquise pela localização"
              setLocation={setLocation}
            />
          </Grid>
          <Grid item xs={3} md={6}>
            <TextField
              fullWidth
              id="outlined-mult
              outlined-static"
              value={eventoData.percurso}
              label="Link Percurso"
              placeholder="Informe o link do percurso"
              onInput={(e) =>
                setEventoData({ ...eventoData, percurso: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <Grid
              container
              style={{
                marginBottom: "100px",
                justifyContent: "end",
              }}
            >
              <Grid item xs={12} md={3}>
                <LoadingButton
                  fullWidth
                  disableElevation
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
            <UploadDialog
              setUploadFilesExtras={setUploadFilesExtras}
              alertCustom={alertCustom}
              handleCloseDialog={handleCloseDialog}
              open={open}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
