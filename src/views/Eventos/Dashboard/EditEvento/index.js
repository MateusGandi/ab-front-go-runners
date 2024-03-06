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
import axios from "../../../../utils/configAxios";
import LoadingButton from "@mui/lab/LoadingButton";
import Snackbar from "@mui/material/Snackbar";
import { Typography, Card, CardHeader } from "@mui/material";
import Paper from "@mui/material/Paper";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import NewCategoria from "./newCategoria";
import RenderCategoria from "./renderCategoria";
import SimplePaper from "../../../../components/Paper/";
import ConfirmDeleteModal from "../../../../components/Modais/confirmModal";
import BannerDefault from "../../../../images/banner.png";
import PerfilDefault from "../../../../images/perfil.png";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import Location from "../../../../components/Mapa/location";
import Autocomplete from "../../../../components/AutoComplete/";
import Tooltip from "@mui/material/Tooltip";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import UploadDialog from "./UploadDialog";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
const REACT_APP_URL_BIBLIOTECA_RUNNERS =
  process.env.REACT_APP_URL_BIBLIOTECA_RUNNERS;

export default function CriarEvento({ setEventoToEdit, eventoData }) {
  const [eventoToPut, setEventoToPut] = useState(eventoData);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [uploadFilesExtras, setUploadFilesExtras] = useState([]);
  const [state, setState] = useState({
    open: false,
    Transition: Slide,
    message: "",
  });
  const [categoriaOptions, setCategoriaOptions] = useState([]);
  const [tabelasProdutos, setTabelasProdutos] = useState([]);
  const [formularios, setFormularios] = useState([]);
  const [organizadores, setOrganizadores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedFormulario, setSelectedFormulario] = useState(null);
  const [selectedOrganizador, setSelectedOrganizador] = useState(null);
  const [location, setLocation] = useState(eventoData.localizacao);
  const [tabelaPrecoSelecionada, setTabelaPrecoSelecionada] = useState(null);
  const [arquivos, setArquivos] = useState([]);

  const [categoriaModalOpen, setCategoriaModalOpen] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [groupCategoria, setGroupCategoria] = useState({
    title: eventoToPut.categoriaName,
  });
  const [categoriaAtual, setCategoriaAtual] = useState(null);

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

  const [perfilLoading, setPerfilLoading] = useState(PerfilDefault);
  const [bannerLoading, setBannerLoading] = useState(BannerDefault);

  useEffect(() => {
    if (eventoToPut) {
      setEventoToPut({
        id: eventoData.id,
        status: eventoData.status || false,
        titulo: eventoData.titulo || "",
        subTitulo: eventoData.subTitulo || "",
        bannerImage: eventoData.bannerImage || "",
        perfilImage: eventoData.perfilImage || "",
        tabelaPreco: eventoData.tabelaPreco || "",
        data: eventoData.data || "",
        dataFinal: eventoData.dataFinal || "",
        categoriaName: eventoData.categoriaName,
        organizador: eventoData.organizador,
        dataFinal: eventoData.dataFinal || "",
        percurso: eventoData.percurso || "",
        formulario: eventoData.formulario || "",
        regulamento: eventoData.regulamento || "",
        cupomPromocional: eventoData.cupomPromocional || "",
        localizacao: eventoData.localizacao || "A definir",
        circuitoURL: eventoData.circuitoURL || "",
        regulamentoPdfURL: eventoData.regulamentoPdfURL || "",
        kitURL: eventoData.kitURL || "",
      });

      setPerfilLoading(
        `${REACT_APP_URL_BIBLIOTECA_RUNNERS}/images?file=Eventos/` +
          eventoData.perfilImage || PerfilDefault
      );
      setBannerLoading(
        `${REACT_APP_URL_BIBLIOTECA_RUNNERS}/images?file=Eventos/` +
          eventoData.bannerImage || BannerDefault
      );
      setGroupCategoria({ title: eventoData.categoriaName });
      setLocation(eventoData.localizacao);
      setSelectedFormulario(eventoData.formulario);
      setSelectedOrganizador(eventoData.organizador);
      setTabelaPrecoSelecionada(eventoData.tabelaPreco || "");
      setArquivos([]);
    }
  }, [eventoData]);

  const handleDeleteEvento = () => {
    setConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await axios.delete(
        `${REACT_APP_URL_BIBLIOTECA_RUNNERS}/v1/evento/deletar-evento/${eventoData.id}`,
        {
          categoriaName: eventoData.categoriaName,
        }
      );

      alertCustom(response.data.message);
      console.log(response.data);
    } catch (error) {
      alertCustom("Erro ao deletar evento!");
      console.error("Erro:", error);
    } finally {
      setConfirmDeleteOpen(false);
    }
  };

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

    setLoading(true);

    if (arquivos.length === 0 && (!bannerLoading || !perfilLoading)) {
      return;
    }
    if (
      !eventoToPut.titulo ||
      !eventoToPut.subTitulo ||
      !eventoToPut.regulamento ||
      !eventoToPut.data ||
      !eventoToPut.dataFinal ||
      !eventoToPut.tabelaPreco ||
      !selectedFormulario ||
      !selectedOrganizador ||
      !eventoToPut.cupomPromocional ||
      categorias.length === 0
    ) {
      alertCustom("Por favor, preencha todos os campos obrigatórios!");
      return;
    }
    try {
      let fotoBanner = eventoToPut.bannerImage;
      let fotoPerfil = eventoToPut.perfilImage;

      const { circuitoURL, regulamentoPdfURL, kitURL } =
        await handleUploadFilesExtras();

      if (arquivos.length > 0) {
        const formData = new FormData();
        arquivos.forEach((file) => {
          const novoNome = `${file.inputName}-${file.file.name}`;
          const novoArquivo = new File([file.file], novoNome, {
            type: file.file.type,
          });
          formData.append("fotos", novoArquivo);
        });

        try {
          const response = await axios.post(
            `${REACT_APP_URL_BIBLIOTECA_RUNNERS}/v1/upload/Eventos`,
            {
              arquivosAnteriores: [
                eventoData.bannerImage,
                eventoData.perfilImage,
              ],
            },
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          alertCustom(response.data.message);

          const files = response.data.fileNames;

          for (const file of files) {
            if (file.includes("Banner")) {
              fotoBanner = file;
            } else if (file.includes("Perfil")) {
              fotoPerfil = file;
            }
          }
        } catch (error) {
          alertCustom("Erro no cadastro das imagens!");
          console.error("Erro:", error);
        }
      }

      const data = {
        evento: {
          ...eventoToPut,
          bannerImage: fotoBanner,
          perfilImage: fotoPerfil,
          formularioId: selectedFormulario.id,
          categoriaName: groupCategoria.title,
          localizacao: location?.description || location,
          circuitoURL: circuitoURL || eventoData.circuitoURL || "",
          regulamentoPdfURL:
            regulamentoPdfURL || eventoData.regulamentoPdfURL || "",
          kitURL: kitURL || eventoData.kitURL || "",
        },
        categorias: categorias,
        organizador: selectedOrganizador,
      };
      const response2 = await axios.put(
        `${REACT_APP_URL_BIBLIOTECA_RUNNERS}/v1/evento/atualizar-evento/${eventoData.id}`,
        data
      );

      alertCustom(response2.data.message);
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

    setLoading(false);
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
  });

  const dropzoneBanner = useDropzone({
    onDrop: (acceptedFiles) => onDrop(acceptedFiles, "Banner"),
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

  function encontrarValorIngressoPorId(categoriasDoEvento, id) {
    for (var i = 0; i < categoriasDoEvento.length; i++) {
      if (categoriasDoEvento[i].categoria.id === id) {
        return {
          valorIngresso: categoriasDoEvento[i].valorIngresso,
          vagasDisponiveis: categoriasDoEvento[i].numVagas,
        };
      }
    }
    return { valorIngresso: 0, vagasDisponiveis: 0 };
  }

  useEffect(() => {
    const fetchData = async () => {
      if (groupCategoria && !groupCategoria.created) {
        await axios
          .get(
            `${REACT_APP_URL_BIBLIOTECA_RUNNERS}/v1/evento/listar-categorias/${groupCategoria.title}`
          )
          .then((response) => {
            const categoriasData = response.data;
            if (Array.isArray(categoriasData)) {
              // Filtrar as categorias que existem em eventoData.categorias
              const categoriasExistentes = categoriasData.filter((categoria) =>
                eventoData.categorias.some(
                  (categoriaExistente) =>
                    categoriaExistente.categoria.titulo === categoria.titulo &&
                    categoriaExistente.categoria.criterio === categoria.criterio
                )
              );
              const categoriaRemaped = [];
              for (const categoria of categoriasExistentes) {
                const dadosExternos = encontrarValorIngressoPorId(
                  eventoData.categorias,
                  categoria.id
                );

                categoriaRemaped.push({
                  numVagasDisponiveis:
                    dadosExternos.vagasDisponiveis === 0
                      ? categoria.numVagas
                      : dadosExternos.vagasDisponiveis,
                  numVagas: categoria.numVagas,
                  titulo: categoria.titulo,
                  criterio: categoria.criterio,
                  grupo: categoria.grupo,
                  valorIngresso: dadosExternos.valorIngresso,
                });
              }
              setCategorias(categoriaRemaped);
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
    };
    fetchData();
  }, [groupCategoria]);

  const handleSalvarCategoria = (novaCategoria, update, categoriaToUpdate) => {
    if (update) {
      const index = categorias.indexOf(categoriaToUpdate);
      categorias[index] = novaCategoria;
      setCategorias(categorias);
    } else {
      eventoToPut.categoriaName = groupCategoria;
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
          height: "150px",
          backgroundColor: "#f5f5f5",
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
        <Grid
          container
          style={{ position: "absolute", justifyContent: "end" }}
          spacing={1}
        >
          <Grid item>
            <Button
              size="small"
              disableElevation
              variant="contained"
              color="secondary"
              style={{ borderRadius: "0 0 5px 5px" }}
              onClick={() => {
                setEventoToEdit(null);
              }}
            >
              Cancelar edição
            </Button>
          </Grid>
          <Grid item sx={{ marginTop: "-5px" }}>
            <Button
              size="small"
              disableElevation
              variant="contained"
              className="no-round"
              onClick={() =>
                setEventoToEdit({ ...eventoData, status: !eventoData.status })
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
          </Grid>
        </Grid>
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
            label={file.name}
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
          backgroundColor: "#f0f0f0",
          borderRadius: "5px",
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
              value={eventoToPut.titulo}
              onChange={(e) =>
                setEventoToPut({ ...eventoToPut, titulo: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              id="standard-basic"
              label="Subtitulo do evento"
              variant="standard"
              value={eventoToPut.subTitulo}
              onChange={(e) =>
                setEventoToPut({ ...eventoToPut, subTitulo: e.target.value })
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
              value={eventoToPut.data}
              onChange={(e) =>
                setEventoToPut({ ...eventoToPut, data: e.target.value })
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
              value={eventoToPut.dataFinal}
              onChange={(e) =>
                setEventoToPut({ ...eventoToPut, dataFinal: e.target.value })
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
              value={eventoToPut.cupomPromocional.toUpperCase()}
              onChange={(e) =>
                setEventoToPut({
                  ...eventoToPut,
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
                value={selectedFormulario ? selectedFormulario.id : ""}
                label="Formulário"
                onChange={(e) => {
                  const selectedFormulario = formularios.find(
                    (item) => item.id === e.target.value
                  );
                  setSelectedFormulario(selectedFormulario);
                }}
              >
                {formularios.map((item, index) => (
                  <MenuItem key={index} value={item.id} title={item.titulo}>
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
                value={selectedOrganizador ? selectedOrganizador.id : ""}
                label="Organizador"
                onChange={(e) => {
                  const selectedOrganizador = organizadores.find(
                    (item) => item.id === e.target.value
                  );
                  setSelectedOrganizador(selectedOrganizador);
                }}
              >
                {organizadores.map((item, index) => (
                  <MenuItem key={index} value={item.id}>
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
                value={eventoToPut.tabelaPreco}
                label="Configurar valores"
                onChange={(e) =>
                  setEventoToPut({
                    ...eventoToPut,
                    tabelaPreco: e.target.value,
                  })
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
              value={eventoToPut.regulamento}
              label="Regulamento"
              multiline
              rows={12}
              onInput={(e) =>
                setEventoToPut({ ...eventoToPut, regulamento: e.target.value })
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
                <Grid item xs={12} md={3}>
                  <Button
                    fullWidth
                    disableElevation
                    variant="contained"
                    onClick={() => {
                      setCategoriaAtual(null);
                      setCategoriaModalOpen(true);
                    }}
                  >
                    Adicionar Nova Categoria
                  </Button>
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
              {categoriaAtual && groupCategoria && groupCategoria.title ? (
                <RenderCategoria
                  nameGroup={groupCategoria.title}
                  alertCustom={alertCustom}
                  open={categoriaModalOpen}
                  onClose={() => setCategoriaModalOpen(false)}
                  categoriaEditar={categoriaAtual}
                  onSave={handleSalvarCategoria}
                  onDelete={handleDeleteCategoria}
                />
              ) : groupCategoria && groupCategoria.title ? (
                <NewCategoria
                  nameGroup={groupCategoria.title}
                  alertCustom={alertCustom}
                  open={categoriaModalOpen}
                  onClose={() => setCategoriaModalOpen(false)}
                  onSave={handleSalvarCategoria}
                />
              ) : null}
            </Paper>
          </Grid>
          <Grid item xs={6} md={6}>
            <Location
              valor={{ description: location }}
              label="Pesquise pela localização"
              setLocation={setLocation}
            />
          </Grid>
          <Grid item xs={6} md={6}>
            <TextField
              fullWidth
              id="outlined-mult
              outlined-static"
              value={eventoToPut.percurso}
              label="Link Percurso"
              placeholder="Informe o link do percurso"
              onInput={(e) =>
                setEventoToPut({ ...eventoToPut, percurso: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <Grid
              container
              style={{
                marginBottom: "100px",
                justifyContent: "space-between",
              }}
            >
              <Grid item xs={12} md={3}>
                <LoadingButton
                  fullWidth
                  disableElevation
                  type="submit"
                  onClick={handleDeleteEvento}
                  loadingPosition="end"
                  variant="text"
                >
                  Excluir evento
                </LoadingButton>
              </Grid>
              <Grid item xs={12} md={3}>
                <LoadingButton
                  disableElevation
                  fullWidth
                  color="primary"
                  onClick={handleSubmit}
                  loading={loading}
                  loadingPosition="end"
                  variant="contained"
                >
                  <span>Atualizar informações</span>
                </LoadingButton>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <UploadDialog
        setUploadFilesExtras={setUploadFilesExtras}
        alertCustom={alertCustom}
        handleCloseDialog={handleCloseDialog}
        open={open}
      />
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <ConfirmDeleteModal
        open={confirmDeleteOpen}
        title="Tem certeza que deseja excluir este evento?"
        onCancel={() => setConfirmDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </Grid>
  );
}
