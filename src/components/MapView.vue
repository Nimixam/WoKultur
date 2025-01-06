<template>
  <section id="map" class="w-full py-20 px-6 bg-green-600 text-white dark:bg-gray-700">
    <div id="map" style="height: 250px; width: 100%;"></div>
  </section>
</template>

<script>
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default {
  name: "MapView",
  props: {
    currentCity: {
      type: String,
      required: true,
    },
    showFlexzones: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      map: null,
      bikeLayer: null,
      flexzoneLayer: null,
    };
  },
  watch: {
    currentCity: "updateBikeData",
    showFlexzones: "toggleFlexzones",
  },
  methods: {
    initializeMap() {
      this.map = L.map("map").setView([50.9375, 6.9603], 13);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(this.map);

      this.bikeLayer = L.layerGroup().addTo(this.map);
      this.flexzoneLayer = L.layerGroup().addTo(this.map);
      this.updateBikeData();
      this.loadFlexzones();
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
              .bindPopup(
                `<strong>${station.name}</strong><br>Fahrräder verfügbar: ${station.bikes}`
              );
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
  },
};
</script>

<style scoped>
.leaflet-container {
  z-index: 0 !important;
}
</style>
