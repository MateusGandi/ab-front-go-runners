import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import Autocomplete from "../../../components/AutoComplete";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";

const REACT_APP_URL_BIBLIOTECA_RUNNERS =
  process.env.REACT_APP_URL_BIBLIOTECA_RUNNERS;

export default function UploadDialog({
  alertCustom,
  open,
  handleCloseDialog,
  setUploadFilesExtras,
}) {
  const [uploadFiles, setUploadFiles] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedName, setSelectedName] = useState("");
  const [fileToUpload, setFileToUpload] = useState(null);

  const handleDeleteFile = (index) => {
    const newFiles = [...uploadFiles];
    newFiles.splice(index, 1);
    setUploadFiles(newFiles);
  };

  const closeAndReset = () => {
    setUploadFiles([]);
    setSelectedName("");
    setFileToUpload(null);
    handleCloseDialog();
  };

  useEffect(() => {
    if (uploadFiles && uploadFiles.length > 0) {
      setUploadFilesExtras(uploadFiles);
    }
  }, [uploadFiles]);

  const onDrop = (acceptedFiles) => {
    setModalOpen(true);
    setFileToUpload(acceptedFiles[0]);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedName("");
    setFileToUpload(null);
  };

  const handleFileUpload = () => {
    if (!selectedName) {
      alertCustom("Por favor, selecione um destino válido para o arquivo.");
      return;
    }

    setUploadFiles([
      ...uploadFiles,
      { file: fileToUpload, name: selectedName.title },
    ]);
    handleModalClose();
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*, application/pdf",
  });

  return (
    <div>
      <Grid container style={{ position: "relative" }}>
        <Dialog open={modalOpen} onClose={handleModalClose}>
          <DialogTitle>
            <Typography variant="body1">
              Escolha o destino do arquivo
              <Typography variant="body2" color="textSecondary">
                Será exibido conforme sua escolha
              </Typography>
            </Typography>
          </DialogTitle>
          <DialogContent sx={{ width: "300px" }}>
            <Grid item xs={12} md={12} sx={{ padding: "16px 0" }}>
              <Autocomplete
                options={[
                  { title: "regulamento" },
                  { title: "kit" },
                  { title: "percurso" },
                ]}
                setValue={setSelectedName}
                value={selectedName}
                label={"Destino do arquivo"}
                variant="outlined"
              />
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleModalClose}>Cancelar</Button>
            <Button onClick={handleFileUpload} color="primary">
              Confirmar
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={open} onClose={handleCloseDialog}>
          <DialogTitle
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
            Upload de Arquivos
            <IconButton onClick={handleCloseDialog}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <div {...getRootProps()} style={{ cursor: "pointer" }}>
                  <input {...getInputProps()} />
                  <Typography variant="body1" className="show-box-dash">
                    Arraste e solte os arquivos aqui ou clique para selecionar
                    <Typography variant="body2" color="textSecondary">
                      Formatos aceitos: .pdf, .png, .jpeg, .jpg
                    </Typography>
                  </Typography>
                </div>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={1}>
                  {uploadFiles.map((file, index) => (
                    <Grid item key={index}>
                      <Chip
                        label={`${file.name} - ${file.file.name}`}
                        onDelete={() => handleDeleteFile(index)}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
            <Button onClick={closeAndReset}>Cancelar Tudo</Button>
            <Button
              onClick={handleCloseDialog}
              color="primary"
              disabled={uploadFiles.length === 0}
            >
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
    </div>
  );
}
