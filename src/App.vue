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

// Gemäß deinem bestehenden Code
const filteredEvents = ref([]);

// Wird von <Filter> aufgerufen, um gefilterte Events zurückzugeben
const updateFilteredEvents = (events) => {
  filteredEvents.value = events;
};

// Steuert, ob die Filter-Sidebar offen oder geschlossen ist
const isFilterOpen = ref(false);

// Klick-Handler für den Button
const toggleFilter = () => {
  isFilterOpen.value = !isFilterOpen.value;
};
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
    <div
      class="relative flex transition-all duration-300 mt-4"
      style="height: 60vh;"
    >
      <!-- Links: Map und Liste zusammen -->
      <!-- Bei ausgeklapptem Filter geben wir etwas Platz ab, z. B. 3/4 statt voll -->
      <div
        class="flex-none transition-all duration-300"
        :class="isFilterOpen ? 'w-3/4' : 'w-full'"
      >
        <!-- Hier binden wir deine Map-Komponente ein,
             die auch die Liste anzeigt (EventsMap).
             Achte darauf, dass du das Prop richtig benennst:
             :filtered-events="filteredEvents"
        -->
        <EventsMap :filtered-events="filteredEvents" />
      </div>

      <!-- Rechts: Filter-Sidebar (nur sichtbar, wenn isFilterOpen true ist).
           Wir verwenden hier v-if + Transition für ein sanftes Ein-/Ausfahren. 
      -->
      <transition name="slide">
        <div
          v-if="isFilterOpen"
          class="flex-none w-1/4 bg-gray-50 dark:bg-gray-800 text-black dark:text-white p-4 overflow-y-auto"
        >
          <h2 class="text-lg font-bold mb-2">Filter</h2>
          <!-- Unsere Filter-Komponente -->
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

<!-- Optional: CSS-Transition-Klassen für sanftes Ein-/Ausfahren -->
<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>
