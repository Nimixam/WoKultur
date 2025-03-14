<template>
  <nav
    class="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600"
  >
    <div
      class="w-full max-w-screen-2xl mx-auto flex flex-wrap items-center justify-start p-4"
    >
      <!-- Logo und Name -->
      <a
        href="#"
        onclick="window.scrollTo(0, 0); return false;"
        class="flex items-center space-x-3 rtl:space-x-reverse"
      >
        <img src="@/assets/images/logo.png" class="h-12" alt="Logo" />
        <span
          class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white"
        >
          WoKultur
        </span>
      </a>

      <!-- Navigation Links (links ausgerichtet) -->
      <div
        class="items-center justify-start hidden w-full md:flex md:w-auto md:order-1 md:ml-8"
      >
        <ul
          class="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700"
        >
          <li>
            <a
              href="javascript:void(0)"
              @click="scrollToSection('hero')"
              class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-green-700 dark:text-white dark:hover:text-green-400"
            >
              Karte
            </a>
          </li>
          <li>
            <a
              href="javascript:void(0)"
              @click="scrollToSection('about')"
              class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-green-700 dark:text-white dark:hover:text-green-400"
            >
              Über uns
            </a>
          </li>
          <li>
            <a
              href="javascript:void(0)"
              @click="scrollToSection('contact')"
              class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-green-700 dark:text-white dark:hover:text-green-400"
            >
              Kontakt
            </a>
          </li>
        </ul>
      </div>

      <!-- Dark Mode Button (bleibt rechts) -->
      <div class="flex md:order-2 ml-auto">
        <button
          type="button"
          @click="$emit('toggleDarkMode')"
          class="px-4 py-2 bg-gray-500 text-white rounded dark:bg-gray-700 dark:text-white"
        >
          {{ darkMode ? "Light Mode" : "Dark Mode" }}
        </button>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: "Navbar",
  props: {
    darkMode: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    // Scrollt zur gewünschten Section, wobei die Navbar-Höhe berücksichtigt wird
    scrollToSection(sectionId) {
      const section = document.getElementById(sectionId);
      const navHeight = 100;
      const sectionTop =
        section.getBoundingClientRect().top + window.scrollY - navHeight;

      window.scrollTo({
        top: sectionTop,
        behavior: "smooth",
      });
    },
  },
};
</script>

<style scoped>
nav {
  @apply z-20 shadow-lg fixed w-full bg-white dark:bg-gray-900;
}
</style>
