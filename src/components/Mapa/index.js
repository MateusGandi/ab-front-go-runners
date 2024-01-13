//versão para melhores direções

import React, { useEffect, useState, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";

import imageIcon from "./icons/placeholder.png";

export default function Mapa() {
  const [markers, setMarkers] = useState([]);
  const mapRef = useRef(null);
  const routingControlRef = useRef(null);

  useEffect(() => {
    // Criar o mapa apenas se não existir
    if (!mapRef.current) {
      const icon = new L.Icon({
        iconUrl: imageIcon,
        iconSize: [38, 38],
      });

      mapRef.current = L.map("map").setView([48.8566, 2.3522], 13);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(mapRef.current);

      mapRef.current.on("click", function (e) {
        const latlng = e.latlng;

        console.log(
          `Coordenadas clicadas: ${latlng.lat}, ${latlng.lng}\nDeseja adicionar este ponto ao circuito?`
        );

        const newMarker = {
          geocode: [latlng.lat, latlng.lng],
          popUp: "Novo marcador",
        };

        const leafletMarker = L.marker(newMarker.geocode, { icon });
        leafletMarker.bindPopup(newMarker.popUp);

        // Adicionar novo marcador sem recriar o cluster
        leafletMarker.addTo(mapRef.current);

        // Atualizar o estado dos marcadores
        setMarkers((prevMarkers) => [...prevMarkers, newMarker]);
      });

      routingControlRef.current = L.Routing.control({
        waypoints: markers.map((marker) => L.latLng(marker.geocode)),
        routeWhileDragging: true,
      }).addTo(mapRef.current);
    } else {
      // Atualizar a rota quando os marcadores mudarem
      routingControlRef.current.setWaypoints(
        markers.map((marker) => L.latLng(marker.geocode))
      );
    }
  }, [markers]);

  // Renderizar o componente
  return <div id="map" style={{ height: "500px" }}></div>;
}
