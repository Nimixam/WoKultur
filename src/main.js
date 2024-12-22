import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './assets/main.css';
import './assets/tailwind.css';

// Erstelle und konfiguriere die Vue-App
const app = createApp(App);

app.use(router);
app.mount('#app');
