<script setup>
import { ref } from "vue";

import Navbar from "./components/Navbar.vue";
import Hero from "./components/Hero.vue";
import EventsMap from "./components/EventsMap.vue";
import Filter from "./components/Filter.vue";
import About from "./components/About.vue";
import Contact from "./components/Contact.vue";
import Footer from "./components/Footer.vue";

// Dark Mode
const darkMode = ref(false);
const toggleDarkMode = () => {
  darkMode.value = !darkMode.value;
  document.documentElement.classList.toggle("dark", darkMode.value);
};

// Event-Daten
const filteredEvents = ref([]);
const allEvents = ref([]); // Originaldaten für das Filtern

// Filter-Sidebar
const isFilterOpen = ref(false);
const toggleFilter = () => {
  isFilterOpen.value = !isFilterOpen.value;
};

// Lade die Events (z. B. von einer API)
async function loadEvents() {
  try {
    const response = await fetch("http://localhost:3000/events");
    const data = await response.json();
    if (Array.isArray(data.events)) {
      allEvents.value = data.events; // Speichere Originaldaten
      filteredEvents.value = data.events; // Zeige standardmäßig alle Events
    }
  } catch (error) {
    console.error("Fehler beim Laden der Events:", error);
  }
}

// Filterlogik
const updateFilteredEvents = (filtered) => {
  filteredEvents.value = filtered;
};

// Events laden, wenn die App startet
loadEvents();
</script>


<template>
  <div class="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white">
    <!-- Navbar & Hero -->
    <Navbar :darkMode="darkMode" @toggleDarkMode="toggleDarkMode" />
    <Hero />

    <!-- Toggle-Button zum Ein-/Ausklappen des Filters -->
    <div class="flex justify-end mt-4 mr-4">
      <button
        class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none"
        @click="toggleFilter"
      >
        Filter anzeigen
      </button>
    </div>

    <!-- Hauptbereich mit Map + Liste (links) und ausklappbarem Filter (rechts) -->
    <div class="relative flex transition-all duration-300 mt-4" style="height: 60vh;">
      <!-- Links: Map und Liste zusammen -->
      <div
        class="flex-none transition-all duration-300"
        :class="isFilterOpen ? 'w-3/4' : 'w-full'"
      >
        <EventsMap :filtered-events="filteredEvents" />
      </div>

      <!-- Rechts: Filter-Sidebar mit sanfter Transition -->
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
          <Filter @updateFilteredEvents="updateFilteredEvents" />
        </div>
      </transition>
    </div>

    <!-- Weitere Sektionen -->
    <About />
    <Contact />
    <Footer />
  </div>
</template>

<style scoped>
/* Zusätzliche Transition-Effekte bei Bedarf */
</style>
