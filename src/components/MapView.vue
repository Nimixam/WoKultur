<template>
    <div>
      <h2>Filtere die Karte</h2>
      <label for="city-filter">Stadt wählen:</label>
      <select id="city-filter" v-model="currentCity" @change="updateBikeData">
        <option value="14">Köln</option>
        <option value="50">Düsseldorf</option>
      </select>
  
      <label for="flexzone-toggle">Flexzonen anzeigen:</label>
      <input type="checkbox" id="flexzone-toggle" v-model="showFlexzones" @change="toggleFlexzones">
  
      <div id="map" style="height: 500px; width: 100%;"></div>
    </div>
  </template>
  
  <script>
  import L from 'leaflet';
  import 'leaflet/dist/leaflet.css';
  import 'leaflet.markercluster/dist/MarkerCluster.css';
  import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
  
  export default {
    name: "MapView",
    data() {
      return {
        map: null,
        bikeLayer: null,
        flexzoneLayer: null,
        currentCity: "14",
        showFlexzones: true,
      };
    },
    methods: {
      initializeMap() {
        this.map = L.map('map').setView([50.9375, 6.9603], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
        }).addTo(this.map);
  
        this.bikeLayer = L.layerGroup().addTo(this.map);
        this.flexzoneLayer = L.layerGroup().addTo(this.map);
        this.updateBikeData();
        this.loadFlexzones();
  
        L.control
          .layers(
            { OpenStreetMap: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png') },
            { Fahrradstationen: this.bikeLayer, Flexzonen: this.flexzoneLayer }
          )
          .addTo(this.map);
      },
      updateBikeData() {
        this.bikeLayer.clearLayers();
        fetch(`https://api.nextbike.net/maps/nextbike-live.json?city=${this.currentCity}`)
          .then((response) => response.json())
          .then((data) => {
            const stations = data.countries[0].cities[0].places;
            stations.forEach((station) => {
              L.marker([station.lat, station.lng])
                .addTo(this.bikeLayer)
                .bindPopup(`<strong>${station.name}</strong><br>Fahrräder verfügbar: ${station.bikes}`);
            });
          })
          .catch((error) => console.error("Fehler beim Abrufen der Daten:", error));
      },
      loadFlexzones() {
        fetch("https://api.nextbike.net/reservation/geojson/flexzone_all.json")
          .then((response) => response.json())
          .then((geojson) => {
            L.geoJSON(geojson, {
              style: {
                color: "blue",
                weight: 2,
                fillOpacity: 0.1,
              },
            }).addTo(this.flexzoneLayer);
          })
          .catch((error) => console.error("Fehler beim Abrufen der Flexzone:", error));
      },
      toggleFlexzones() {
        if (this.showFlexzones) {
          this.map.addLayer(this.flexzoneLayer);
        } else {
          this.map.removeLayer(this.flexzoneLayer);
        }
      },
    },
    mounted() {
      this.initializeMap();
      setInterval(this.updateBikeData, 50000);
    },
  };
  </script>
  
  <style scoped>
  #map {
    height: 100vh;
    width: 100%;
  }
  </style>
  