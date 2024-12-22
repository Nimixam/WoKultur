<script setup>
import MapView from './components/MapView.vue';
import FeaturesSection from './components/FeaturesSection.vue';
</script>

<template>
    <h1 class="text-4xl font-bold text-blue-500 mb-8">Hallo Tailwind mit Vue!</h1>
    <FeaturesSection />
    <MapView /> <!-- MapView wird innerhalb des Layouts eingefügt -->
</template>

<style>
html, body, #app {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
}
</style>
