import React, { useState } from "react";
import {
  Typography,
  CardHeader,
  Avatar,
  Grid,
  CardMedia,
  IconButton,
  Button,
  Link,
  Checkbox,
  FormControlLabel,
  Paper,
  Tooltip,
} from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";
import InsertLinkIcon from "@mui/icons-material/InsertLink";
import TodayOutlinedIcon from "@mui/icons-material/TodayOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import SportsScoreOutlinedIcon from "@mui/icons-material/SportsScoreOutlined";
import XIcon from "@mui/icons-material/X";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import FacebookOutlinedIcon from "@mui/icons-material/FacebookOutlined";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import CloseIcon from "@mui/icons-material/Close";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

const REACT_APP_URL_BIBLIOTECA_RUNNERS =
  process.env.REACT_APP_URL_BIBLIOTECA_RUNNERS;

const RenderHTML = ({ text, setTextReg }) => {
  return (
    <Typography
      variant="body2"
      color="textSecondary"
      className="show-box"
      sx={{ textAlign: "justify", whiteSpace: "pre-wrap" }}
    >
      <Typography variant="h6" color="textPrimary">
        Regulamento
      </Typography>
      {text}
    </Typography>
  );
};

const SimpleComponent = ({ alertCustom, EventoData, handleClose }) => {
  const navigate = useNavigate();

  const [isChecked, setIsChecked] = useState(false);
  const [textReg, setTextReg] = useState(EventoData.regulamento);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const closeModal = () => {
    handleClose();
  };

  const shareOnWhatsApp = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(
      `Confira este evento: ${EventoData.titulo} - ${EventoData.subTitulo}`
    );
    window.open(`https://wa.me/?text=${text}%20${url}`);
  };

  const shareOnFacebook = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      "_blank"
    );
  };

  const shareOnLinkedIn = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      "_blank"
    );
  };

  const shareOnTwitter = () => {
    const text = encodeURIComponent(
      `Confira este evento: ${EventoData.titulo} - ${EventoData.subTitulo}`
    );
    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
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
                sx={{
                  minHeight: 150,
                  position: "relative",
                }}
                image={`${REACT_APP_URL_BIBLIOTECA_RUNNERS}/images?file=Eventos/${EventoData.bannerImage}`}
                elevation={0}
              />
              <CardMedia
                sx={{
                  height: 150,
                  width: 150,
                  borderRadius: "5px",
                  position: "absolute",
                  top: "20px",
                  left: "20px",
                }}
                image={`${REACT_APP_URL_BIBLIOTECA_RUNNERS}/images?file=Eventos/${EventoData.perfilImage}`}
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
              <Grid container padding={2} spacing={3}>
                <Grid item xs={12} md={8} sx={{ marginTop: "10px" }}>
                  <Typography variant="h6" sx={{ margin: "10px" }}>
                    {EventoData.titulo}
                    <Typography variant="body1" color="textSecondary">
                      {EventoData.subTitulo}
                    </Typography>
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    className="show-box"
                  >
                    <span style={{ fontWeight: "bold" }}>Localização: </span>
                    {EventoData.localizacao}

                    <Typography variant="body2" color="textSecondary">
                      <span style={{ fontWeight: "bold" }}>Largada: </span>
                      {format(
                        new Date(EventoData.dataFinal),
                        "'Largada no dia 'dd/MM/yyyy' às 'HH:hh' horas"
                      )}
                    </Typography>
                  </Typography>
                  <RenderHTML setTextReg={setTextReg} text={textReg} />
                  <Typography
                    variant="h6"
                    color="textPrimary"
                    className="show-box"
                    sx={{ marginTop: "15px" }}
                  >
                    Percurso
                    <Typography variant="body2" color="textSecondary">
                      <Link
                        target="_blank"
                        color="textSecondary"
                        href={EventoData.percurso}
                      >
                        Clique aqui para visualizar o percurso
                      </Link>
                    </Typography>
                  </Typography>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Paper
                    variant="outlined"
                    sx={{
                      padding: 1,
                      minHeight: "500px",
                      display: "flex",
                      justifyContent: "space-between",
                      flexDirection: "column",
                    }}
                  >
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
                      action={
                        EventoData.organizador.telefone && (
                          <Tooltip title="Contatar organizador">
                            <IconButton
                              className="blue-hover"
                              onClick={() => {
                                window.open(
                                  `https://wa.me/${EventoData.organizador.telefone.replace(
                                    /\D/g,
                                    ""
                                  )}`,
                                  "_blank"
                                );
                              }}
                            >
                              <QuestionAnswerIcon />
                            </IconButton>
                          </Tooltip>
                        )
                      }
                    />

                    <Grid
                      container
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        flexWrap: "wrap",
                      }}
                    >
                      <FormControlLabel
                        color="secondaryText"
                        control={
                          <Checkbox
                            checked={isChecked}
                            onChange={handleCheckboxChange}
                          />
                        }
                        label={
                          <Typography variant="body2" color="secondaryText">
                            Li e concordo com o regulamento
                          </Typography>
                        }
                      />
                      <Button
                        fullWidth
                        sx={{ margin: "5px 10px" }}
                        disableElevation
                        disabled={!isChecked}
                        variant="contained"
                        onClick={() => {
                          navigate(`/cadastro/${EventoData.id}`);
                        }}
                      >
                        Inscreva-se
                      </Button>
                      <Button
                        fullWidth
                        sx={{ margin: "5px 10px" }}
                        disableElevation
                        disabled={!isChecked}
                        variant="text"
                        onClick={() => {
                          navigate(`/cadastro/${EventoData.id}`);
                        }}
                      >
                        Quero fazer várias inscrições
                      </Button>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        className="show-box"
                        sx={{
                          margin: "10px 0",
                          textAlign: "center",
                        }}
                      >
                        {format(
                          new Date(EventoData.dataFinal),
                          "'Inscrições até' dd/MM/yyyy '23:59 ou até o limite de vagas"
                        )}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{
                          width: "100%",
                          marginTop: "20px",
                          textAlign: "center",
                        }}
                      >
                        Compartilhe esse evento
                      </Typography>
                      <IconButton onClick={shareOnLinkedIn}>
                        <LinkedInIcon className="blue-hover" />
                      </IconButton>
                      <IconButton onClick={shareOnTwitter}>
                        <XIcon className="blue-hover" />
                      </IconButton>
                      <IconButton onClick={shareOnWhatsApp}>
                        <WhatsAppIcon className="green-hover" />
                      </IconButton>
                      <IconButton onClick={shareOnFacebook}>
                        <FacebookOutlinedIcon className="blue-hover" />
                      </IconButton>
                    </Grid>
                  </Paper>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SimpleComponent;
