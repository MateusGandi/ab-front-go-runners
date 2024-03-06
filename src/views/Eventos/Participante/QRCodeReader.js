import React, { useState } from "react";
import { QrReader } from "react-qr-reader";
import { Button, Grid, Typography } from "@mui/material";

const QRCodeReader = () => {
  const [result, setResult] = useState("");

  const handleScan = (data) => {
    if (data) {
      setResult(data);
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  return (
    <Grid container spacing={2} justifyContent="center" alignItems="center">
      <Grid item xs={12}>
        <Typography variant="h4" align="center" gutterBottom>
          QR Code Reader
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <QrReader
          delay={300}
          onError={handleError}
          onScan={handleScan}
          style={{ maxWidth: "100%" }}
        />
      </Grid>
      <Grid item xs={12} align="center">
        {result && (
          <Typography variant="body1" gutterBottom>
            Result: {result}
          </Typography>
        )}
      </Grid>
      <Grid item xs={12} align="center">
        <Button
          variant="contained"
          color="primary"
          onClick={() => setResult("")}
        >
          Clear
        </Button>
      </Grid>
    </Grid>
  );
};

export default QRCodeReader;
