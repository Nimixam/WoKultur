<template>
  <section id="map-section" class="w-full h-[600px] flex bg-green-600 text-white dark:bg-gray-700">
    <!-- Karte links -->
    <div class="map-container w-2/3 h-[200px]">
      <div id="map" class="h-full w-full"></div>
    </div>

    <!-- Liste rechts -->
    <div class="list-container w-1/3 h-full bg-gray-100 text-black p-4 overflow-y-auto dark:bg-gray-800 dark:text-white">
      <h2 class="text-lg font-bold mb-4 text-center">Liste der Veranstaltungen</h2>
      <ul>
        <li
          v-for="event in filteredEvents"
          :key="event.id"
          @click="focusOnEvent(event)"
          class="mb-2 p-3 bg-white shadow rounded cursor-pointer hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
          >
          <h3 class="font-semibold">{{ event.title }}</h3>
          <p class="text-sm text-gray-700 dark:text-gray-200">{{ event.description || 'Keine Beschreibung verfügbar' }}</p>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            {{ formatDate(event.start_date) }} - {{ formatDate(event.end_date) }}
          </p>
        </li>
      </ul>
    </div>
  </section>
</template>

<script>
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default {
  props: {
    filteredEvents: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      map: null,
      markers: {}, // Speichert Marker-Referenzen mit der Event-ID
    };
  },
  methods: {
    initializeMap() {
      if (this.map) return;

      this.map = L.map("map").setView([50.9375, 6.9603], 12);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(this.map);
    },
    addMarkersToMap() {
      if (!this.map) return;
      Object.values(this.markers).forEach((marker) => this.map.removeLayer(marker));
      this.markers = {};

      this.filteredEvents.forEach((event) => {
        if (event.location.latitude && event.location.longitude) {
          const marker = L.marker([event.location.latitude, event.location.longitude])
            .addTo(this.map)
            .bindPopup(`
              <strong>${event.title}</strong><br>
              <p>${event.description || 'Keine Beschreibung verfügbar'}</p>
              <em>${event.start_date} bis ${event.end_date}</em>
            `);
          this.markers[event.id] = marker;
        }
      });
    },
    formatDate(dateString) {
      if (!dateString) return "Unbekanntes Datum";
      const date = new Date(dateString);
      return date.toLocaleDateString("de-DE", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },
    focusOnEvent(event) {
      const marker = this.markers[event.id];
      if (marker) {
        this.map.setView(marker.getLatLng(), 13);
        marker.openPopup();
      }
    },
  },
  watch: {
    filteredEvents: {
      handler() {
        this.addMarkersToMap();
      },
      immediate: true,
    },
  },
  mounted() {
    this.initializeMap();
    this.addMarkersToMap();
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
.list-container {
  width: 33.3333%; /* 1/3 */
  height: 100%;
}
.leaflet-container {
  z-index: 0 !important;
}
</style>
