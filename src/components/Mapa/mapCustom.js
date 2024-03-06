import React, { useState, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Button from "@mui/material/Button";
import { Typography, TextField, CircularProgress } from "@mui/material";
import Grid from "@mui/material/Grid";
import imageIcon from "./icons/marker-icon.png";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";

export default function Mapa({
  percurso,
  setPercurso,
  setLocationName,
  alertCustom,
}) {
  const [searchAddress, setSearchAddress] = useState("");
  const [markers, setMarkers] = useState([]);
  const [routePolyline, setRoutePolyline] = useState(null);
  const [routeHistory, setRouteHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [locationName, setLocationNameState] = useState("a definir:"); // Default value

  const mapRef = useRef(null);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${searchAddress}&limit=1`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const result = data[0];
        const { lat, lon } = result;

        const newLocation = [parseFloat(lat), parseFloat(lon)];

        mapRef.current.setView(newLocation, 18, { animate: true });
      } else {
        alertCustom("Endereço não encontrado.");
      }
    } catch (error) {
      console.error("Erro ao buscar endereço:", error);
    }
    setLoading(false);
  };

  const handleUseCurrentLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newLocation = [latitude, longitude];

          mapRef.current.setView(newLocation, 18, { animate: true });
        },
        (error) => {
          console.error("Erro ao obter a localização:", error);
        }
      );
    } else {
      alertCustom("Geolocalização não suportada pelo navegador.");
    }
  };

  const handleRemoveLastMarker = () => {
    if (markers.length > 0) {
      const updatedMarkers = [...markers];
      const removedMarker = updatedMarkers.pop();

      mapRef.current.removeLayer(removedMarker.leafletMarker);

      const updatedRoutePolyline = L.polyline(
        updatedMarkers.map((marker) => marker.geocode),
        {
          color: "blue",
          weight: 10,
        }
      );

      mapRef.current.removeLayer(routePolyline);
      updatedRoutePolyline.addTo(mapRef.current);

      setMarkers(updatedMarkers);
      setRoutePolyline(updatedRoutePolyline);
      setRouteHistory((prevHistory) => [
        ...prevHistory,
        { markers: updatedMarkers, routePolyline: updatedRoutePolyline },
      ]);

      // Atualize o estado percurso
      const updatedPercurso = updatedMarkers.map((marker) => marker.geocode);
      setPercurso(updatedPercurso);
    }
  };

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map("map").setView(
        percurso[0] || [-16.826606184107792, -49.294677972793586],
        30
      );

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(
        mapRef.current
      );

      mapRef.current.on("click", function (e) {
        const latlng = e.latlng;

        const newMarker = {
          geocode: [latlng.lat, latlng.lng],
          popUp: "Novo marcador",
        };

        const icon = new L.Icon({
          iconUrl: imageIcon,
          iconSize: [10, 10],
        });

        const leafletMarker = L.marker(newMarker.geocode, { icon });
        leafletMarker.bindPopup(newMarker.popUp);

        leafletMarker.addTo(mapRef.current);

        setRouteHistory((prevHistory) => [
          ...prevHistory,
          {
            markers: [...markers, { ...newMarker, leafletMarker }],
            routePolyline,
          },
        ]);

        setMarkers((prevMarkers) => [
          ...prevMarkers,
          { ...newMarker, leafletMarker },
        ]);

        // Update location name if it's the first marker
        if (markers.length === 0) {
          updateLocationName(newMarker.geocode);
        }
      });
    }
  }, [routePolyline, markers]);

  useEffect(() => {
    function updateRoute() {
      if (routePolyline) {
        mapRef.current.removeLayer(routePolyline);
      }

      const routePoints = markers.map((marker) => marker.geocode);

      const newRoutePolyline = L.polyline(routePoints, {
        color: "blue",
        weight: 10,
      });

      if (mapRef.current.hasLayer(newRoutePolyline)) {
        mapRef.current.removeLayer(newRoutePolyline);
      }

      newRoutePolyline.addTo(mapRef.current);

      setRoutePolyline(newRoutePolyline);

      // Atualize o estado percurso
      const updatedPercurso = routePoints;
      setPercurso(updatedPercurso);
    }

    updateRoute();
  }, [markers]);

  const updateLocationName = async (coordinates) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coordinates[0]}&lon=${coordinates[1]}&zoom=18&addressdetails=1`
      );
      const data = await response.json();

      if (data && data.display_name) {
        const locationName = data.display_name;
        setLocationNameState(locationName);
        setLocationName(locationName);
      } else {
        console.log("Location name not found.");
      }
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  };

  useEffect(() => {
    if (percurso.length > 0) {
      const newMarkers = percurso.map((coord) => {
        const [lat, lon] = coord;

        const newMarker = {
          geocode: [lat, lon],
          popUp: "Marcador existente",
        };

        const icon = new L.Icon({
          iconUrl: imageIcon,
          iconSize: [0, 0],
        });

        const leafletMarker = L.marker(newMarker.geocode, { icon });
        leafletMarker.bindPopup(newMarker.popUp);

        leafletMarker.addTo(mapRef.current);

        return { ...newMarker, leafletMarker };
      });

      const newRoutePolyline = L.polyline(
        newMarkers.map((marker) => marker.geocode),
        {
          color: "blue",
          weight: 10,
        }
      );

      newRoutePolyline.addTo(mapRef.current);

      setMarkers(newMarkers);
      setRoutePolyline(newRoutePolyline);
      const updatedPercurso = newMarkers.map((marker) => marker.geocode);
      setPercurso(updatedPercurso);

      updateLocationName(newMarkers[0].geocode);
    }
  }, []);

  useEffect(() => {
    if (markers.length === 0) {
      setLocationName("A definir");
    }
  }, [markers]);

  return (
    <Paper elevation={0} variant="outlined" style={{ padding: 20 }}>
      <Typography variant="h6">
        Configurar Circuito
        <Typography variant="body2" color="textSecondary">
          Trace o circuito do evento dinamicamente
        </Typography>
      </Typography>
      <Grid container style={{ position: "relative" }} spacing={2}>
        <Grid item xs={12} md={12}>
          <TextField
            label="Pesquisar localização"
            placeholder="Rua, Bairro, Cidade, Estado, País..."
            variant="outlined"
            fullWidth
            margin="normal"
            value={searchAddress}
            onChange={(e) => setSearchAddress(e.target.value)}
            InputProps={{
              endAdornment: (
                <IconButton onClick={handleSearch}>
                  <SearchIcon />
                </IconButton>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12} md={12}>
          <Grid container spacing={1}>
            <Grid item>
              <Button
                disableElevation
                variant="contained"
                onClick={handleUseCurrentLocation}
              >
                Usar minha localização
              </Button>
            </Grid>
            <Grid item>
              <Button
                disableElevation
                variant="text"
                onClick={handleRemoveLastMarker}
                disabled={markers.length === 0}
              >
                Remover Último Marcador
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={12}>
          <Grid container style={{ position: "relative" }}>
            {loading && (
              <Grid
                item
                xs={12}
                style={{
                  position: "absolute",
                  height: "100%", // Ajuste para cobrir completamente a altura
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "rgba(0, 0, 0, 0.1)", // Cor de fundo com opacidade
                  zIndex: 10,
                }}
              >
                <CircularProgress />
              </Grid>
            )}
            <Grid item xs={12} md={12}>
              <div
                id="map"
                style={{
                  zIndex: 1,
                  minHeight: "300px",
                  cursor: "crosshair",
                }}
              ></div>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}
