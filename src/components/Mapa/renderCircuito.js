import React, { useState, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Paper from "@mui/material/Paper";
import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid";

export default function Mapa({ coord }) {
  const [coordinates, setCoordinates] = useState(coord);

  const mapRef = useRef(null);
  const mapLayerRef = useRef(null);
  const routePolylineRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map("map").setView([48.8566, 2.3522], 13, {
        attributionControl: false, // Remove a atribuição no canto inferior direito
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
      }).addTo(mapRef.current);
    }

    if (coordinates.length > 0) {
      if (!routePolylineRef.current) {
        routePolylineRef.current = L.polyline(coordinates, {
          color: "blue",
          weight: 5,
        }).addTo(mapRef.current);
      } else {
        // Atualizar coordenadas da polilinha
        routePolylineRef.current.setLatLngs(coordinates);
      }
    }
  }, [coordinates]);

  useEffect(() => {
    if (!mapLayerRef.current) {
      mapLayerRef.current = L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          maxZoom: 18,
        }
      ).addTo(mapRef.current);
    }

    // Aplica o efeito de escala de cinza apenas à camada de mapa
    if (mapLayerRef.current) {
      mapLayerRef.current.getContainer().style.filter = "grayscale(100%)";
    }
  }, []);

  useEffect(() => {
    if (coordinates.length > 0) {
      mapRef.current.fitBounds(routePolylineRef.current.getBounds());
    }
  }, [coordinates]);

  return (
    <Paper elevation={0}>
      <Grid container style={{ position: "relative" }}>
        <Grid item xs={12} md={12}>
          <div id="map" style={{ height: "75vh", opacity: "0.4" }}></div>
        </Grid>
      </Grid>
    </Paper>
  );
}
