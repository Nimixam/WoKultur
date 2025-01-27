<script setup>
import { ref } from 'vue'

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
const filteredEvents = ref([])
const allEvents = ref([])

// Filter-Sidebar
const isFilterOpen = ref(false)
const toggleFilter = () => {
  isFilterOpen.value = !isFilterOpen.value
}

// Events laden (z.B. nächste 14 Tage)
async function loadEvents() {
  try {
    const response = await fetch('http://localhost:3000/api/events')
    const data = await response.json()

    // data => { success: true, items: [...], count: NN }
    if (data.success && Array.isArray(data.items)) {
      // Wir mappen es auf ein internes Format: parseFloat für latitude/longitude
      const mapped = data.items.map((item, index) => ({
        // Falls die API kein "id" hat, erstellen wir eine pseudo-ID via index
        kategorie_id: item.kategorie_id,
        id: index,
        title: item.title,
        description: item.description,
        begin: item.beginndatum,
        end: item.endedatum,
        lat: parseFloat(item.latitude),
        lng: parseFloat(item.longitude),
      }));

      // Filtern wir optional nach gültigen lat/lng
      const valid = mapped.filter(ev => !isNaN(ev.lat) && !isNaN(ev.lng))
      allEvents.value = valid
      filteredEvents.value = valid
    } else {
      console.error('Unerwartetes Format für Events:', data)
    }
  } catch (error) {
    console.error('Fehler beim Laden der Events:', error)
  }
}

// Callback vom Filter, um das gefilterte Array zu setzen
const updateFilteredEvents = (arr) => {
  filteredEvents.value = arr
}

// Lade die Events, sobald App gemountet ist
loadEvents()
</script>

<template>
  <div class="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white">
    <Navbar :darkMode="darkMode" @toggleDarkMode="toggleDarkMode" />
    <Hero />

    <div class="flex justify-end mt-4 mr-4">
      <button
        class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none"
        @click="toggleFilter"
      >
        Filter anzeigen
      </button>
    </div>

    <div class="relative flex transition-all duration-300 mt-4" style="height: 60vh;">
      <div
        class="flex-none transition-all duration-300"
        :class="isFilterOpen ? 'w-3/4' : 'w-full'"
      >
        <!-- Übergebe gefilterte Events an die Kartenkomponente -->
        <EventsMap :filteredEvents="filteredEvents" />
      </div>

      <transition
        enter-active-class="transition ease-out duration-300"
        enter-from-class="opacity-0 translate-x-full"
        enter-to-class="opacity-100 translate-x-0"
        leave-active-class="transition ease-in duration-200"
        leave-from-class="opacity-100 translate-x-0"
        leave-to-class="opacity-0 translate-x-full"
      >
        <div
          v-if="isFilterOpen"
          class="flex-none w-1/4 bg-gray-50 dark:bg-gray-800 text-black dark:text-white p-4 overflow-y-auto shadow-lg"
        >
          <h2 class="text-lg font-bold mb-2">Filter</h2>
          <Filter
            :allEvents="allEvents"
            @updateFilteredEvents="updateFilteredEvents"
          />
        </div>
      </transition>
    </div>

    <About />
    <Contact />
    <Footer />
  </div>
</template>
