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
          <p class="text-sm text-gray-700 dark:text-gray-200">
            {{ event.description || 'Keine Beschreibung verfügbar' }}
          </p>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            {{ formatDate(event.begin) }} - {{ formatDate(event.end) }}
          </p>
        </li>
      </ul>
    </div>
  </section>
</template>

<script>
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

export default {
  name: 'EventsMap',
  props: {
    filteredEvents: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      map: null,
      markers: new Map()
    }
  },
  methods: {
    formatDate(dateString) {
      if (!dateString) return 'Unbekannt'
      // "YYYY-MM-DD" => [YYYY, MM, DD]
      const [year, month, day] = dateString.split('-')
      return `${day}.${month}.${year}`
    },

    initializeMap() {
      // Mittelpunkt Köln
      this.map = L.map('map').setView([50.9375, 6.9603], 12)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map)
    },

    addMarkersToMap() {
      // Vorherige Marker entfernen
      this.markers.forEach(marker => this.map.removeLayer(marker))
      this.markers.clear()

      // Neue Marker hinzufügen
      this.filteredEvents.forEach(event => {
        // event.lat, event.lng sind Zahlen
        const marker = L.marker([event.lat, event.lng])
          .bindPopup(`<b>${event.title}</b><br>${event.description || ''}`)
        marker.addTo(this.map)
        this.markers.set(event.id, marker)
      })
    },

    focusOnEvent(event) {
      const marker = this.markers.get(event.id)
      if (marker) {
        this.map.flyTo(marker.getLatLng(), 15)
        marker.openPopup()
      }
    }
  },
  watch: {
    filteredEvents: {
      handler() {
        if (this.map) {
          this.addMarkersToMap()
        }
      },
      immediate: true
    }
  },
  mounted() {
    this.initializeMap()
  }
}
</script>

<style scoped>
#map-section {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 65vh;
}
.map-container {
  width: 66.6667%;
  height: 100%;
}
.list-container {
  width: 33.3333%;
  height: 100%;
}
.leaflet-container {
  z-index: 0 !important;
}
</style>
