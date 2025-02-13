import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './assets/main.css';
import './assets/tailwind.css';
import 'leaflet-extra-markers/dist/css/leaflet.extra-markers.min.css';
import '@fortawesome/fontawesome-free/css/all.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

// Erstelle und konfiguriere die Vue-App
const app = createApp(App);

app.use(router);
app.mount('#app');