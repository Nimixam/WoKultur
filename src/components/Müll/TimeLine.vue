<template id="time">
  <section>
    <div class="w-full px-4">
      <!-- Titel oder Überschrift -->
      <h1 class="text-2xl font-bold mb-4">Meine Timeline</h1>
  
      <!-- Slider-Regler -->
      <input
        type="range"
        class="w-full accent-blue-500"
        min="1"
        max="14"
        step="1"
        v-model="sliderValue"
      />
  
      <!-- Ausgabe des aktuellen Werts (Debug und Datum) -->
      <p class="mt-4">Aktueller Slider-Wert: {{ sliderValue }}</p>
      <p class="mt-2">Datum: {{ currentDate }}</p>
    </div>
  </section>
</template>

<script>
export default {
  name: "Time",
  data() {
    return {
      sliderValue: 1, // Standardwert: Heute
    };
  },
  computed: {
    currentDate() {
      // Heutiges Datum ermitteln
      const today = new Date();
      // Slider-Wert als Offset in Tagen verwenden
      const offsetInDays = this.sliderValue - 1; // Wert 1 = heute
      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() + offsetInDays); // Tage hinzufügen
      // Datum formatieren
      return targetDate.toLocaleDateString("de-DE", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },
  },
};
</script>