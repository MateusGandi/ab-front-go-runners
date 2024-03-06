import React, { useState } from "react";
import {
  Paper,
  Typography,
  CardHeader,
  Avatar,
  Grid,
  CardMedia,
  IconButton,
  Modal,
  Button,
  Link,
  Checkbox,
  FormControlLabel,
  Divider,
} from "@mui/material";
import TextField from "@mui/material/TextField";
import CloseIcon from "@mui/icons-material/Close";
import { red } from "@mui/material/colors";
import axios from "../../../utils/configAxios";
import ConfirmDeleteModal from "../../../components/Modais/confirmModal";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

const REACT_APP_URL_BIBLIOTECA_RUNNERS =
  process.env.REACT_APP_URL_BIBLIOTECA_RUNNERS;

const RenderHTML = ({ text, setTextReg }) => {
  return (
    <Typography
      variant="body2"
      color="textSecondary"
      className="show-box"
      sx={{
        marginTop: "20px",
        overflowX: "scroll",
        textAlign: "justify",
        whiteSpace: "pre-wrap",
      }}
    >
      <Typography variant="h6" color="textPrimary">
        Regulamento
      </Typography>
      {text}
    </Typography>
  );
};

const SimpleComponent = ({
  alertCustom,
  EventoData,
  handleClose,
  setEventoToEdit,
}) => {
  const [regulamento, setRegulamento] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [textReg, setTextReg] = useState(EventoData.regulamento);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const closeModal = () => {
    handleClose();
  };

  const handleDeleteEvento = () => {
    setConfirmDeleteOpen(true);
  };

  const handleCancelDelete = () => {
    setConfirmDeleteOpen(false);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await axios.delete(
        `${REACT_APP_URL_BIBLIOTECA_RUNNERS}/v1/evento/deletar-evento/${EventoData.id}`,
        {
          categoriaName: EventoData.categoriaName,
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

  return (
    <>
      <Dialog
        open={true}
        onClose={closeModal}
        PaperProps={{
          sx: {
            margin: 1,
            maxWidth: "100vw",
            overflowY: "scroll",
            maxHeight: "90vh",
            width: { md: "1200px", xs: "99vh" },
          },
        }}
      >
        <DialogContent sx={{ padding: 0 }}>
          <Grid container>
            <Grid item xs={12} md={12} sx={{ position: "relative" }}>
              <CardMedia
                sx={{ minHeight: 150 }}
                image={`${REACT_APP_URL_BIBLIOTECA_RUNNERS}/images?file=Eventos/${EventoData.bannerImage}`}
                elevation={0}
              />
              <IconButton
                onClick={closeModal}
                sx={{
                  position: "absolute",
                  right: 15,
                  top: 15,
                }}
              >
                <CloseIcon />
              </IconButton>
            </Grid>

            <Grid item xs={12} md={12}>
              <Grid
                container
                sx={{
                  display: "flex",
                  alignItems: "center",
                  padding: 1,
                }}
              >
                <Grid item xs={12} md={6}>
                  <CardHeader
                    sx={{
                      height: 70,
                    }}
                    avatar={
                      <Avatar sx={{ bgcolor: "#0C8CE9" }} aria-label="recipe">
                        {EventoData.organizador.nome[0]}
                      </Avatar>
                    }
                    title={EventoData.organizador.nome}
                    subheader={
                      <Link
                        href={EventoData.organizador.site}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {EventoData.organizador.site.replace(
                          /^https?:\/\//,
                          ""
                        )}
                      </Link>
                    }
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <Button
                    fullWidth
                    disableElevation
                    onClick={handleDeleteEvento}
                  >
                    Excluir
                  </Button>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Button
                    fullWidth
                    variant="contained"
                    disableElevation
                    onClick={() => {
                      setEventoToEdit(EventoData);
                      closeModal();
                    }}
                  >
                    Editar
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid container>
            <Grid item xs={12} md={12} sx={{ padding: 2 }}>
              <Typography variant="h6">
                {EventoData.titulo}
                <Typography variant="body1" color="textSecondary">
                  {EventoData.subTitulo}
                </Typography>
              </Typography>

              <RenderHTML setTextReg={setTextReg} text={textReg} />
            </Grid>
            <Grid item xs={12} md={12} sx={{ padding: 2 }}>
              <Typography variant="h6" className="show-box">
                Circuito
                <Typography variant="body1" color="textSecondary">
                  Rota prevista para o evento:
                  <Link
                    color="textSecondary"
                    href={EventoData.percurso}
                    target="_blank"
                  >
                    Link
                  </Link>
                </Typography>
              </Typography>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
      <ConfirmDeleteModal
        title={"Tem certeza que deseja excluir este evento?"}
        open={confirmDeleteOpen}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};

export default SimpleComponent;
