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
          v-for="(event, index) in filteredEvents"
          :key="event.id"
          @click="focusOnEvent(event)"
          class="mb-2 p-3 bg-white shadow rounded hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 cursor-pointer"
        >
          <h3 class="font-semibold">{{ event.title }}</h3>
          <p class="text-sm text-gray-700 dark:text-gray-200">
            {{ event.description || 'Keine Beschreibung verfügbar' }}
          </p>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            {{ formatDate(event.begin) }} - {{ formatDate(event.end) }}, {{ event.time || "" }}
          </p>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Ort: {{ event.location || "" }}, {{ event.address || "" }} {{ event.district || "" }}
          </p>

          <!-- Button: mehr/weniger anzeigen -->
          <button
            @click.stop="toggleDetails(index)"
            class="mt-2 px-2 py-1 bg-gray-400 text-white text-sm rounded hover:bg-gray-500 focus:outline-none"
          >
            {{ expandedIndices.includes(index) ? 'Weniger anzeigen' : 'Mehr anzeigen' }}
          </button>

          <!-- Zusätzliche Informationen (Link & Preis) -->
          <div v-if="expandedIndices.includes(index)" class="mt-2">
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Link: <i>{{ event.link || 'Keine Informationen verfügbar' }}</i>
            </p>
            <p class="text-sm text-orange-500 dark:text-orange-400">
              Preis: {{ event.price.replace(/<br\s*\/?>/gi, '') || 'Keine Angaben' }}
            </p>
          </div>
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
      markers: new Map(),
      expandedIndices: [] // Array, um zu verfolgen, welche Events erweitert sind
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
      this.markers.forEach(marker => this.map.removeLayer(marker));
      this.markers.clear();

      // Neue Marker hinzufügen
      this.filteredEvents.forEach(event => {
        const imageUrl = event.img ? `https://www.stadt-koeln.de${event.img}` : null;

        const popupContent = `
          <div class="text-left space-y-1">
            ${
              imageUrl
                ? `<img src="${imageUrl}" alt="Teaserbild" class="w-32 h-20 rounded object-cover">`
                : ''
            }
            <h3 class="font-semibold text-base">${event.title}</h3>
            <p class="text-sm text-gray-700">${event.description || 'Keine Beschreibung verfügbar'}</p>
            <p class="text-sm text-gray-500">
              ${this.formatDate(event.begin)} - ${this.formatDate(event.end)}, ${event.time
                ? event.time.replace(/<br\s*\/?>|&lt;br\s*\/?&gt;|\s*<br>\s*/gi, '')
                : ''
              }
            </p>
            <p class="text-sm text-gray-500">
              <b>Ort:</b> ${event.location || ''}, ${event.address || ''} ${event.district || ''}
            </p>
            <p class="text-sm text-gray-500">
              <b>Preis:</b> ${event.price?.replace(/<br\s*\/?>/gi, '') || 'Keine Angaben'}
            </p>
            ${
              event.link
                ? `<p class="text-sm text-blue-600"><b>Link:</b> <a href="${event.link}" target="_blank" class="underline">Mehr erfahren</a></p>`
                : ''
            }
          </div>
        `;

        const marker = L.marker([event.lat, event.lng])
          .bindPopup(popupContent);

        marker.addTo(this.map);
        this.markers.set(event.id, marker);
      });
    },

    focusOnEvent(event) {
      const marker = this.markers.get(event.id)
      if (marker) {
        this.map.flyTo(marker.getLatLng(), 15)
        marker.openPopup()
      }
    },
    toggleDetails(index) {
      if (this.expandedIndices.includes(index)) {
        this.expandedIndices = this.expandedIndices.filter(i => i !== index)
      } else {
        this.expandedIndices.push(index)
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
