<script setup>
import { ref, watch } from 'vue'

import Navbar from './components/Navbar.vue'
import Hero from './components/Hero.vue'
import EventsMap from './components/EventsMap.vue'
import Filter from './components/Filter.vue'
import About from './components/About.vue'
import Contact from './components/Contact.vue'
import Footer from './components/Footer.vue'

// Dark Mode
const darkMode = ref(false)
const toggleDarkMode = () => {
  darkMode.value = !darkMode.value
  document.documentElement.classList.toggle('dark', darkMode.value)
}

// Event-Daten
const allEvents = ref([])

// Verwende das Composable für die zentrale Filterlogik
const filteredEvents = ref([])

const selectedCategory = ref(''); // Aktuell ausgewählte Kategorie

// Filter-Sidebar
const isFilterOpen = ref(false)
const toggleFilter = () => {
  isFilterOpen.value = !isFilterOpen.value
}

const filterCatMessage = ref('') // Nachricht für fehlende Events
const daysToFilter = ref(14) // Standardwert für den Slider

const showHeatmap = ref(false);
const showSights = ref(false); // Neue Variable für Sehenswürdigkeiten

const searchQuery = ref(''); // Suchbegriff
const isSearching = ref(false); // Lade-Status
let searchTimeout; // Timeout für das Debouncing

const onSearchInput = () => {
  isSearching.value = true;
  clearTimeout(searchTimeout);

  searchTimeout = setTimeout(() => {

    loadEvents();

    isSearching.value = false;
  }, 1000); // 1 Sekunde warten
};

const eventsCache = new Map();

let loadTimeout = null;

function debounceLoadEvents() {
  // Vorherigen Timeout abbrechen, falls vorhanden
  if (loadTimeout) {
    clearTimeout(loadTimeout);
  }
  // Neuen Timeout starten, der nach 500ms loadEvents() aufruft
  loadTimeout = setTimeout(() => {
    loadEvents();
    loadTimeout = null; // Zurücksetzen
  }, 500);
}

// Events laden (z.B. nächste 14 Tage)
async function loadEvents() {
  try {

    const cacheKey = `${selectedCategory.value}-${daysToFilter.value}-${searchQuery.value.trim().toLowerCase()}`;

    // Falls Daten bereits im Cache sind, nutze diese:
    if (eventsCache.has(cacheKey)) {
      filteredEvents.value = eventsCache.get(cacheKey);
      return;
    }

    let result;

    if (selectedCategory.value) {
      result = await filterByCategory();
    }
    else {
      result = await filterByDate();
      allEvents.value = result;
    }

    const query = searchQuery.value.trim().toLowerCase();
    if (query) {
      result = filterBySearchQuery(result);
    }

    eventsCache.set(cacheKey, result);
    filteredEvents.value = result;

  } catch (error) {
    filterCatMessage.value = 'Fehler beim Laden der Events'
    console.error('Fehler beim Laden der Events:', error)
  }
}

async function filterByDate(days = daysToFilter.value) {
  const response = await fetch(`http://localhost:3000/api/events?ndays=${days}`)
  const data = await response.json()
  let valid;

  // data => { success: true, items: [...], count: NN }
  if (data.success && Array.isArray(data.items)) {
    // Wir mappen es auf ein internes Format: parseFloat für latitude/longitude
    const mapped = data.items.map((item, index) => ({
      // Falls die API kein "id" hat, erstellen wir eine pseudo-ID via index
      id: index,
      title: item.title,
      description: item.description,
      begin: item.beginndatum,
      end: item.endedatum,
      time: item.uhrzeit,
      lat: parseFloat(item.latitude),
      lng: parseFloat(item.longitude),
      location: item.veranstaltungsort,
      address: `${item.strasse} ${item.hausnummer}`,
      district: item.stadtteil,
      price: item.preis,
      link: item.link,
      img: item.teaserbild
    }));

    // Filtern wir optional nach gültigen lat/lng
    valid = mapped.filter(ev => !isNaN(ev.lat) && !isNaN(ev.lng))


  } else {
    filterCatMessage.value = 'Es gibt keine Events mit dem Filter'
    console.error('Unerwartetes Format für Events:', data)
  }

  return valid;
}

async function filterByCategory() {
  const response = await fetch(`http://localhost:3000/api/eventsByCategory?kat=${selectedCategory.value}&ndays=${daysToFilter.value}`)
  const data = await response.json()
  let valid;

  if (data.success && Array.isArray(data.items)) {
    // Mappen wie in App.vue
    const mapped = data.items.map((item, index) => ({
      id: index,
      title: item.title,
      description: item.description,
      begin: item.beginndatum,
      end: item.endedatum,
      time: item.uhrzeit,
      lat: parseFloat(item.latitude),
      lng: parseFloat(item.longitude),
      location: item.veranstaltungsort,
      address: `${item.strasse} ${item.hausnummer}`,
      district: item.stadtteil,
      price: item.preis,
      link: item.link,
      img: item.teaserbild
    }))

    valid = mapped.filter(ev => !isNaN(ev.lat) && !isNaN(ev.lng))

  } else {
    filterCatMessage.value = 'Es gibt keine Events mit dem Filter'
    console.error('Unerwartetes Format für Events:', data)
  }

  return valid;
}


function filterBySearchQuery(eventsData) {
  isSearching.value = false;

  const query = searchQuery.value.trim().toLowerCase();

  return eventsData.filter(event =>
  (event.title?.toLowerCase().includes(query) ||
    event.description?.toLowerCase().includes(query))
  );
}


// Lade die Events, sobald App gemountet ist
loadEvents()

// Überwache die Events-Arrays
watch([allEvents, filteredEvents], ([newAllEvents, newFilteredEvents]) => {
  if (newAllEvents.length === 0 || newFilteredEvents.length === 0) {
    filterCatMessage.value = 'Es gibt keine Events mit dem Filter'
  } else {
    filterCatMessage.value = '' // Nachricht zurücksetzen, wenn es Events gibt
  }
})
</script>

<template>
  <div class="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white">
    <Navbar :darkMode="darkMode" @toggleDarkMode="toggleDarkMode" />
    <Hero />

    <!-- Suchleiste -->
    <div class="flex justify-center items-center mt-4">
      <div class="relative w-1/2">
        <input type="text" v-model="searchQuery" @input="onSearchInput" placeholder="Events durchsuchen"
          class="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" />
        <div v-if="isSearching" class="absolute right-2 top-2">
          <svg class="animate-spin h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none"
            viewBox="0 0 24 24" stroke="currentColor">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
          </svg>
        </div>
      </div>
    </div>

    <!-- Filter Button & Heatmap Checkbox -->
    <div class="flex flex-col items-end mt-4 mr-4 space-y-2">
      <!-- Filter-Button -->
      <button class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none"
        @click="toggleFilter">
        {{ isFilterOpen ? 'Filter ausblenden' : 'Filter einblenden' }}
      </button>

      <!-- Heatmap-Checkbox -->
      <div class="flex items-center">
        <input type="checkbox" id="heatmap-toggle" v-model="showHeatmap" class="mr-2 cursor-pointer" />
        <label for="heatmap-toggle" class="text-sm font-medium text-gray-900 dark:text-white">
          Heatmap anzeigen
        </label>
      </div>
      <!-- Sehenswürdigkeiten Checkbox -->
      <div class="flex items-center">
        <input type="checkbox" id="sights-toggle" v-model="showSights" class="mr-2 cursor-pointer" />
        <label for="sights-toggle" class="text-sm font-medium text-gray-900 dark:text-white">
          Sehenswürdigkeiten anzeigen
        </label>
      </div>
    </div>

    <!-- Map, Liste, Filter -->
    <div class="relative flex transition-all duration-300 mt-4" style="height: 60vh;">
      <div class="flex-none transition-all duration-300" :class="isFilterOpen ? 'w-3/4' : 'w-full'">
        <!-- Übergebe gefilterte Events an die Kartenkomponente -->
        <EventsMap :filteredEvents="filteredEvents" :showHeatmap="showHeatmap" :showSights="showSights" />
      </div>

      <transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0 translate-x-full"
        enter-to-class="opacity-100 translate-x-0" leave-active-class="transition ease-in duration-200"
        leave-from-class="opacity-100 translate-x-0" leave-to-class="opacity-0 translate-x-full">
        <div v-if="isFilterOpen"
          class="flex-none w-1/4 bg-gray-50 dark:bg-gray-800 text-black dark:text-white p-4 overflow-y-auto shadow-lg">
          <h2 class="text-lg font-bold mb-2">Filter</h2>
          <Filter :allEvents="allEvents" :filterCatMessage="filterCatMessage" v-model:daysToFilter="daysToFilter"
            v-model:selectedCategory="selectedCategory" @reloadEvents="debounceLoadEvents" />
          <p v-if="filterCatMessage" class="text-red-600 dark:text-red-400">
            {{ filterCatMessage }}
          </p>
        </div>
      </transition>
    </div>

    <About />
    <Contact />
    <Footer />
  </div>
</template>
