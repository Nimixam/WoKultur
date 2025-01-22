<template>
  <section id="map-section" class="w-full h-[600px] flex bg-green-600 text-white dark:bg-gray-700">
    <!-- Karte links -->
    <div class="map-container w-2/3 h-[200px]">
      <div id="map" class="h-full w-full"></div>
    </div>

    <!-- Liste rechts -->
    <div class="list-container w-1/3 h-full bg-gray-100 text-black p-4 overflow-y-auto">
      <h2 class="text-lg font-bold mb-4 text-center">Liste der Veranstaltungen</h2>
      <ul>
        <li
          v-for="event in events"
          :key="event.id"
          @click="focusOnEvent(event)"
          class="mb-2 p-3 bg-white shadow rounded cursor-pointer hover:bg-gray-200"
        >
          <h3 class="font-semibold">{{ event.title }}</h3>
          <p class="text-sm">{{ event.beginndatum }} - {{ event.endedatum }}</p>
        </li>
      </ul>
    </div>
  </section>
</template>

<script>
import L from "leaflet";
import "leaflet/dist/leaflet.css";

let eventLayer = null;

export const loadEvents = (id) => {
  fetch(`http://localhost:3000/events?id=${id}&ndays=${7}`)
    .then((response) => response.json())
    .then((data) => {
      if (data && Array.isArray(data.items)) {
        if (eventLayer) eventLayer.clearLayers(); // Entferne alte Marker
        data.items.forEach((event) => {
          if (event.latitude && event.longitude) {
            // Füge Marker hinzu
            L.marker([event.latitude, event.longitude])
              .addTo(eventLayer)
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
      } else {
        console.error("Datenformat nicht korrekt oder keine Veranstaltungen gefunden:", data);
      }
    })
    .catch((error) => console.error("Fehler beim Abrufen der Veranstaltungen:", error));
};

export default {
  name: "EventsMap",
  data() {
    return {
      map: null,
      events: [],
      markers: {}, // Speichert Marker-Referenzen mit der Event-ID
    };
  },
  methods: {
    async initializeMap() {
      if (this.map) {
        console.warn("Map already initialized!");
        return;
      }

      this.map = L.map("map").setView([50.9375, 6.9603], 12);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(this.map);

      eventLayer = L.layerGroup().addTo(this.map);
      this.events = await loadEvents();
      this.addMarkersToMap();
    },
    addMarkersToMap() {
      this.events.forEach((event) => {
        if (event.latitude && event.longitude) {
          const marker = L.marker([event.latitude, event.longitude])
            .addTo(eventLayer)
            .bindPopup(`
              <strong>${event.title}</strong><br>
              <em>${event.beginndatum} bis ${event.endedatum}</em><br>
              <p>${event.description || "Keine Beschreibung verfügbar"}</p>
              <strong>Ort:</strong> ${event.veranstaltungsort || "Unbekannt"}<br>
              <strong>Adresse:</strong> ${event.strasse || ""} ${event.hausnummer || ""}, ${event.plz || ""} ${event.ort || ""}<br>
              <a href="${event.link}" target="_blank">Weitere Informationen</a>
            `);
          this.markers[event.id] = marker; // Marker mit der Event-ID speichern
        }
      });
    },
    focusOnEvent(event) {
      const marker = this.markers[event.id];
      if (marker) {
        this.map.setView(marker.getLatLng(), 13); // Karte auf den Marker zentrieren
        marker.openPopup(); // Popup öffnen
      }
    },
  },
  mounted() {
    this.initializeMap();
    loadEvents();
  },
};
</script>

<style scoped>
#map-section {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 65vh;
}
.map-container {
  width: 66.6667%; /* 2/3 */
  height: 100%;
}
#map {
  height: 100%;
  width: 100%;
}
.list-container {
  width: 33.3333%; /* 1/3 */
  height: 100%;
}
.leaflet-container {
  z-index: 0 !important;
}
</style>
