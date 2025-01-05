<script setup>
import MapView from "./components/MapView.vue";
import { ref } from "vue";

const darkMode = ref(false);

const toggleDarkMode = () => {
  darkMode.value = !darkMode.value;
  document.documentElement.classList.toggle("dark", darkMode.value);
};
</script>

<template>
  <div
    class="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white"
  >
    <!-- Navbar -->
    <nav
      class="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600"
    >
      <div
        class="w-full max-w-screen-2xl mx-auto flex flex-wrap items-center justify-between p-4"
      >
        <a
          href="http://localhost:5176/"
          class="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <img
            src="D:\Programmieren\escooter_map\logo\logo.png"
            class="h-8"
            alt="Flowbite Logo"
          />
          <span
            class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white"
          >
            e-Scooter Map
          </span>
        </a>

        <!-- Dark Mode Button und Menü-Toggle -->
        <div class="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          <button
            type="button"
            @click="toggleDarkMode"
            class="px-4 py-2 bg-gray-500 text-white rounded dark:bg-gray-700 dark:text-white"
          >
            {{ darkMode ? "Light Mode" : "Dark Mode" }}
          </button>
        </div>

        <!-- Navigation Links -->
        <div
          class="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
        >
          <ul
            class="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700"
          >
            <li>
              <a
                href="#"
                class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-green-700 md:p-0 dark:text-white dark:hover:text-green-400"
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="#about"
                class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-green-700 md:p-0 dark:text-white dark:hover:text-green-400"
              >
                Über uns
              </a>
            </li>
            <li>
              <a
                href="#"
                class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-green-700 md:p-0 dark:text-white dark:hover:text-green-400"
              >
                Services
              </a>
            </li>
            <li>
              <a
                href="#contact"
                class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-green-700 md:p-0 dark:text-white dark:hover:text-green-400"
              >
                Kontakt
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section id="hero" class="w-full p-10 bg-green-500 text-white dark:bg-gray-800">
      <h1 class="text-5xl font-bold text-center">
        Map!!! 🚀
      </h1>
    </section>

    <!-- Map Section -->
    <section
      id="map"
      class="w-full py-20 px-6 bg-green-600 text-white dark:bg-gray-700"
    >
      <div class="mt-10">
        <MapView />
      </div>
    </section>

    <!-- About Section -->
    <section id="about" class="w-full py-20 px-6 bg-gray-100 dark:bg-gray-800">
      <div class="max-w-3xl mx-auto">
        <h2 class="text-4xl font-semibold text-center mb-6">
          Über uns – WoKultur
        </h2>
        <p class="text-lg text-center">
          Wir sind zwei Studenten, die gemeinsam das Projekt WoKultur ins Leben
          gerufen haben. Unsere Vision ist es, eine interaktive Karte zu
          entwickeln, die kulturelle Angebote und Veranstaltungen in Köln auf
          einen Blick sichtbar macht. Von Museen und Theatern bis hin zu
          Konzerten, Festivals und Ausstellungen – unser Ziel ist es, die
          vielfältige Kulturszene Kölns zugänglicher und erlebbarer zu machen.
          Mit WoKultur möchten wir: Aktuelle Veranstaltungen und kulturelle
          Angebote auf einer Karte übersichtlich darstellen. Die kulturelle
          Vielfalt Kölns für alle sichtbar machen – egal ob für Einheimische
          oder Besucher. Inspiration und Entdeckung fördern und Kultur für alle
          greifbar machen. WoKultur ist ein Herzensprojekt, das aus unserer
          Leidenschaft für Kultur und unserer Liebe zu Köln entstanden ist. Wir
          hoffen, mit unserer Plattform die Kölner Kulturszene noch näher zu den
          Menschen zu bringen. Vielen Dank für euer Interesse und eure
          Unterstützung! 😊
        </p>
      </div>
    </section>

    <!-- Contact Section -->
    <section
      id="contact"
      class="w-full py-20 px-6 bg-green-600 text-white dark:bg-gray-700"
    >
      <h2 class="text-4xl font-semibold text-center mb-6">Kontakt</h2>
      <p class="text-lg text-center">
        Finden Sie uns auf der Karte oder schreiben Sie uns eine Nachricht.
      </p>
    </section>
  </div>
</template>
