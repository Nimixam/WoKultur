<template>
    <section id="about" class="w-full py-20 px-6 bg-gray-100 dark:bg-gray-800">
  <!-- Grid erstellen damit Bild links und Text rechts stehen kann -->
  <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
    <!-- Left Column: Image -->
    <div class="flex justify-center">
      <img src="../assets/images/CologneCulture.png" alt="WoKultur Illustration" class="rounded-lg shadow-lg">
    </div>

    <!-- Right Column: Text -->
    <div>
      <h2 class="text-4xl font-extrabold text-center md:text-left mb-6 text-gray-900 dark:text-white">
        Über uns – WoKultur
      </h2>
      <p class="text-lg text-center md:text-left mb-6 text-gray-700 dark:text-gray-300">
        Wir sind zwei Studenten, die gemeinsam das Projekt <span class="text-green-500 font-bold">WoKultur</span> ins Leben
        gerufen haben. Unsere Vision ist es, eine interaktive Karte zu entwickeln, die kulturelle Angebote und Veranstaltungen in
        Köln auf einen Blick sichtbar macht.
      </p>
      <ul class="space-y-4">
        <li class="flex items-center">
          <svg class="w-6 h-6 text-green-500 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <span>Aktuelle Veranstaltungen und kulturelle Angebote übersichtlich darstellen.</span>
        </li>
        <li class="flex items-center">
          <svg class="w-6 h-6 text-green-500 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <span>Die kulturelle Vielfalt Kölns für alle sichtbar machen.</span>
        </li>
        <li class="flex items-center">
          <svg class="w-6 h-6 text-green-500 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <span>Inspiration und Entdeckung fördern.</span>
        </li>
      </ul>
    </div>
  </div>
</section>
</template>

<script>
export default {
  name: "About",
};
</script>