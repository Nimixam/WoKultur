<script setup>
<<<<<<< HEAD
import Navbar from "./components/Navbar.vue";
import Hero from "./components/Hero.vue";
import TimeLine from "./components/TimeLine.vue";
import FilterView from "./components/FilterView.vue";
import MapView from "./components/MapView.vue";
import Contact from "./components/Contact.vue";
import About from "./components/About.vue";
=======
import Filter from "./components/Filter.vue"
import FilterView from "./components/FilterView.vue";
import EventsMap from "./components/EventsMap.vue";
import Navbar from "./components/Navbar.vue";
import Contact from "./components/Contact.vue";
import About from "./components/About.vue";
import Hero from "./components/Hero.vue";
>>>>>>> david
import Footer from "./components/Footer.vue";
import { ref } from "vue";

// Dark Mode
const darkMode = ref(false);
const toggleDarkMode = () => {
  darkMode.value = !darkMode.value;
  document.documentElement.classList.toggle("dark", darkMode.value);
};

// Reaktive Zustände für Filter
const currentCity = ref("14");
const showFlexzones = ref(true);

// Event-Handler für Filter
const handleCityChange = (newCity) => {
  currentCity.value = newCity;
};

const handleToggleFlexzones = (isVisible) => {
  showFlexzones.value = isVisible;
};
</script>

<template>
  <div
    class="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white"
  >
    <Navbar :darkMode="darkMode" @toggleDarkMode="toggleDarkMode" />

    <Hero />

<<<<<<< HEAD
    <TimeLine />
=======
    <Filter />
>>>>>>> david

    <div class="mt-10">
      <FilterView
        :currentCity="currentCity"
        :flexzonesVisible="showFlexzones"
        @updateCity="handleCityChange"
        @toggleFlexzones="handleToggleFlexzones"
      />
    </div>

<<<<<<< HEAD
    <div class="mt-10">
      <MapView :currentCity="currentCity" :showFlexzones="showFlexzones" />
    </div>
=======
    <EventsMap />
>>>>>>> david

    <About />

    <Contact />

    <Footer />

  </div>
</template>
