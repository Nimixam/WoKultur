<template>
  <section id="map" class="w-full py-20 px-6 bg-green-600 text-white dark:bg-gray-700">
    <h1 class="text-center text-2xl font-bold mb-4">Kulturveranstaltungen in Köln</h1>
    <div id="map" style="height: 500px; width: 100%;"></div>
  </section>
</template>

<script>
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default {
  name: "EventsMap",
  data() {
    return {
      map: null,
      eventLayer: null,
    };
  },
  methods: {
    initializeMap() {
      // Initialisiere die Karte
      this.map = L.map("map").setView([50.9375, 6.9603], 12);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(this.map);

      this.eventLayer = L.layerGroup().addTo(this.map);
      this.loadEvents();
    },
    loadEvents() {
      // Lade Veranstaltungen von der API
      // console.log(fetch("https://api.allorigins.win/raw?url=https://www.stadt-koeln.de/externe-dienste/open-data/events-od.php").then((response) => response.json()));
      fetch("https://api.allorigins.win/raw?url=https://www.stadt-koeln.de/externe-dienste/open-data/events-od.php?ndays=30")
        .then((response) => response.json())
        .then(data => {
          const events = data.items;
          events.forEach((event) => {
            if (event.latitude && event.longitude) {
              // Füge Marker hinzu
              L.marker([event.latitude, event.longitude])
                .addTo(this.eventLayer)
                .bindPopup(`
                  <strong>${event.title}</strong><br>
                  <em>${event.beginndatum} bis ${event.endedatum}</em><br>
                  <p>${event.description || "Keine Beschreibung verfügbar"}</p>
                  <strong>Ort:</strong> ${event.veranstaltungsort || "Unbekannt"}<br>
                  <strong>Adresse:</strong> ${event.strasse || ""} ${event.hausnummer || ""}, ${event.plz || ""} ${event.ort || ""}<br>
                  <a href="${event.link}" target="_blank">Weitere Informationen</a>
                `);
            }
          });
        })
        .catch((error) => console.error("Fehler beim Abrufen der Veranstaltungen:", error));
    },
  },
  mounted() {
    this.initializeMap();
  },
};
</script>

<style scoped>
#map {
  height: 500px;
}
.leaflet-container {
  z-index: 0 !important;
}
</style>