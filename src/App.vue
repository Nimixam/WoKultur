<template>
  <div
    class="mx-40 min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white"
  >
    <Navbar :darkMode="darkMode" @toggleDarkMode="toggleDarkMode" />
    <Hero />

    <!-- Container für Suchleiste, Filter-Button und Button-Gruppe -->
    <div
      class="flex flex-col md:flex-row items-center justify-between mt-4 px-4 space-y-4 md:space-y-0 md:space-x-4"
    >
      <!-- Suchleiste -->
      <form class="relative flex-1 min-w-[200px]" @submit.prevent>
        <label
          for="default-search"
          class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
          >Suche</label
        >
        <div class="relative">
          <!-- Lupe-Icon -->
          <div
            class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none"
          >
            <svg
              class="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="search"
            id="default-search"
            v-model="searchQuery"
            @input="onSearchInput"
            class="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Events durchsuchen..."
          />
          <!-- Spinner -->
          <div v-if="isSearching" class="absolute end-20 bottom-3">
            <svg
              class="animate-spin h-5 w-5 text-green-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
          </div>
        </div>
      </form>

      <!-- Button-Gruppe -->
      <div class="w-full md:w-auto">
        <ul
          class="gap-x-2 items-center w-full text-sm font-medium rounded-lg sm:flex"
        >
          <!-- Events (Stadt Köln) -->
          <li class="w-full">
            <button
              type="button"
              @click="showCologneEvents = !showCologneEvents"
              :class="[
                'w-full px-5 py-2.5 focus:outline-none font-medium rounded-lg text-sm me-2 mb-2',
                showCologneEvents
                  ? 'bg-green-700 text-white border border-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800'
                  : 'bg-green-100 text-green-600 border border-green-200 hover:bg-green-200',
              ]"
            >
              Events (Stadt Köln)
            </button>
          </li>
          <!-- Großevents (Ticketmaster) -->
          <li class="w-full">
            <button
              type="button"
              @click="showTicketmasterEvents = !showTicketmasterEvents"
              :class="[
                'w-full px-5 py-2.5 focus:outline-none font-medium rounded-lg text-sm me-2 mb-2',
                showTicketmasterEvents
                  ? 'bg-green-700 text-white border border-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800'
                  : 'bg-green-100 text-green-600 border border-green-200 hover:bg-green-200',
              ]"
            >
              Großevents (Ticketmaster)
            </button>
          </li>
          <!-- Sehenswürdigkeiten -->
          <li class="w-full">
            <button
              type="button"
              @click="showSights = !showSights"
              :class="[
                'w-full px-5 py-2.5 focus:outline-none font-medium rounded-lg text-sm me-2 mb-2',
                showSights
                  ? 'bg-green-700 text-white border border-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800'
                  : 'bg-green-100 text-green-600 border border-green-200 hover:bg-green-200',
              ]"
            >
              Sehenswürdigkeiten
            </button>
          </li>
          <!-- Heatmap -->
          <li class="w-full">
            <button
              type="button"
              @click="showHeatmap = !showHeatmap"
              :class="[
                'w-full px-5 py-2.5 focus:outline-none font-medium rounded-lg text-sm me-2 mb-2',
                showHeatmap
                  ? 'bg-green-700 text-white border border-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800'
                  : 'bg-green-100 text-green-600 border border-green-200 hover:bg-green-200',
              ]"
            >
              Heatmap
            </button>
          </li>
          <!-- Veedel -->
          <li class="w-full">
            <button
              type="button"
              @click="showVeedel = !showVeedel"
              :class="[
                'w-full px-5 py-2.5 focus:outline-none font-medium rounded-lg text-sm me-2 mb-2',
                showVeedel
                  ? 'bg-green-700 text-white border border-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800'
                  : 'bg-green-100 text-green-600 border border-green-200 hover:bg-green-200',
              ]"
            >
              Veedel
            </button>
          </li>
        </ul>
      </div>

      <!-- Filter-Button -->
      <button
        class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none"
        @click="toggleFilter"
      >
        {{ isFilterOpen ? "Filter ausblenden" : "Filter einblenden" }}
      </button>
    </div>

    <!-- Map, Liste und Filter -->
    <div
      class="relative flex transition-all duration-300 mt-4"
      style="height: 60vh"
    >
      <div
        class="flex-none transition-all duration-300"
        :class="isFilterOpen ? 'w-3/4' : 'w-full'"
      >
        <EventsMap
          :filteredEvents="filteredEvents"
          :filteredTicketmasterEvents="filteredTicketmasterEvents"
          :showHeatmap="showHeatmap"
          :showSights="showSights"
          :showTicketmasterEvents="showTicketmasterEvents"
          :showCologneEvents="showCologneEvents"
          :showVeedel="showVeedel"
        />
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
            :filterCatMessage="filterCatMessage"
            v-model:daysToFilter="daysToFilter"
            v-model:selectedCategory="selectedCategory"
            @reloadEvents="debounceLoadEvents"
          />
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

<script setup>
import { ref, watch } from "vue";
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

// Event-Daten und Filter
const allEvents = ref([]);
const filteredEvents = ref([]);
const filteredTicketmasterEvents = ref([]);
const selectedCategory = ref("");
const isFilterOpen = ref(false);
const toggleFilter = () => {
  isFilterOpen.value = !isFilterOpen.value;
};
const filterCatMessage = ref("");
const daysToFilter = ref(14);

// Button-States
const showHeatmap = ref(false);
const showSights = ref(false);
const showTicketmasterEvents = ref(false);
const showCologneEvents = ref(true);
const showVeedel = ref(false);

// Suche
const searchQuery = ref("");
const isSearching = ref(false);
let searchTimeout;
const onSearchInput = () => {
  isSearching.value = true;
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    loadEvents();
    isSearching.value = false;
  }, 1000);
};

const eventsCache = new Map();
let ticketmasterCache = [];
let loadTimeout = null;
function debounceLoadEvents() {
  if (loadTimeout) clearTimeout(loadTimeout);
  loadTimeout = setTimeout(() => {
    loadEvents();
    loadTimeout = null;
  }, 500);
}

async function loadEvents() {
  try {
    const cacheKey = `${selectedCategory.value}-${
      daysToFilter.value
    }-${searchQuery.value.trim().toLowerCase()}`;
    if (eventsCache.has(cacheKey)) {
      filteredEvents.value = eventsCache.get(cacheKey);
      loadTicketmasterEvents();
      return;
    }
    let result;
    if (selectedCategory.value) {
      result = await filterByCategory();
    } else {
      result = await filterByDate();
      allEvents.value = result;
    }
    const query = searchQuery.value.trim().toLowerCase();
    if (query) {
      result = filterBySearchQuery(result);
    }
    eventsCache.set(cacheKey, result);
    filteredEvents.value = result;
    loadTicketmasterEvents();
  } catch (error) {
    filterCatMessage.value = "Fehler beim Laden der Events";
    console.error("Fehler beim Laden der Events:", error);
  }
}

async function loadTicketmasterEvents() {
  try {
    if (ticketmasterCache.length === 0) {
      const response = await fetch("http://localhost:3000/ticketmaster");
      const data = await response.json();
      if (
        data &&
        data._embedded &&
        data._embedded.events &&
        Array.isArray(data._embedded.events)
      ) {
        ticketmasterCache = data._embedded.events;
      } else {
        console.error("Keine Ticketmaster Events gefunden");
      }
    }
    let result = ticketmasterCache;
    const today = new Date();
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + daysToFilter.value);
    result = result.filter((event) => {
      const eventDate = new Date(event?.dates?.start?.localDate) || maxDate;
      return eventDate <= maxDate;
    });
    const query = searchQuery.value.trim().toLowerCase();
    if (query) {
      result = result.filter((event) =>
        event.name.toLowerCase().includes(query)
      );
    }
    filteredTicketmasterEvents.value = result;
  } catch (error) {
    console.error("Fehler beim Laden der Ticketmaster-Events:", error);
  }
}

async function filterByDate(days = daysToFilter.value) {
  const response = await fetch(
    `http://localhost:3000/api/events?ndays=${days}`
  );
  const data = await response.json();
  let valid;
  if (data.success && Array.isArray(data.items)) {
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
      img: item.teaserbild,
    }));
    valid = mapped.filter((ev) => !isNaN(ev.lat) && !isNaN(ev.lng));
  } else {
    filterCatMessage.value = "Es gibt keine Events mit dem Filter";
    console.error("Unerwartetes Format für Events:", data);
  }
  return valid;
}

async function filterByCategory() {
  const response = await fetch(
    `http://localhost:3000/api/eventsByCategory?kat=${selectedCategory.value}&ndays=${daysToFilter.value}`
  );
  const data = await response.json();
  let valid;
  if (data.success && Array.isArray(data.items)) {
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
      img: item.teaserbild,
    }));
    valid = mapped.filter((ev) => !isNaN(ev.lat) && !isNaN(ev.lng));
  } else {
    filterCatMessage.value = "Es gibt keine Events mit dem Filter";
    console.error("Unerwartetes Format für Events:", data);
  }
  return valid;
}

function filterBySearchQuery(eventsData) {
  isSearching.value = false;
  const query = searchQuery.value.trim().toLowerCase();
  return eventsData.filter(
    (event) =>
      event.title?.toLowerCase().includes(query) ||
      event.description?.toLowerCase().includes(query)
  );
}

loadEvents();

watch([allEvents, filteredEvents], ([newAllEvents, newFilteredEvents]) => {
  if (newAllEvents.length === 0 || newFilteredEvents.length === 0) {
    filterCatMessage.value = "Es gibt keine Stadt Köln Events mit dem Filter";
  } else {
    filterCatMessage.value = "";
  }
});
</script>
