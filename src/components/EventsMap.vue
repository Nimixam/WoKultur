<!-- EventsMap.vue -->
<template>
  <!-- Haupt-Container (Map, Event-Liste und Side-Panel) -->
  <section class="flex flex-row w-full h-[600px]">
    <!-- Side-Panel -->
    <transition name="slide-fade">
      <div
        v-if="selectedEvent"
        class="bg-white dark:bg-gray-700 text-black dark:text-white p-4 overflow-y-auto w-1/4 h-full"
      >
        <!-- Schließen-Button -->
        <div class="flex justify-end mb-2">
          <button
            @click="closeSidePanel"
            class="inline-flex items-center justify-center w-10 h-10 rounded text-gray-600 hover:text-gray-900 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <!-- Bild -->
        <div v-if="selectedEvent.img" class="mb-2">
          <img
            :src="selectedEvent.img"
            alt="Teaserbild"
            class="w-full h-auto rounded object-cover"
          />
        </div>
        <!-- Titel -->
        <h3 class="text-xl font-semibold mb-2">{{ selectedEvent.title }}</h3>
        <!-- Beschreibung -->
        <p class="mb-2">
          {{ selectedEvent.description || "Keine Beschreibung verfügbar" }}
        </p>
        <!-- Zeitraum -->
        <p class="mb-1 text-sm text-gray-700 dark:text-gray-300">
          <strong>Zeitraum:</strong>
          {{ formatDate(selectedEvent.begin) }} -
          {{ formatDate(selectedEvent.end) }}
          <span v-if="selectedEvent.time"
            >, {{ selectedEvent.time.replace(/<br\s*\/?>/gi, "") }}</span
          >
        </p>
        <!-- Ort -->
        <p class="mb-1 text-sm text-gray-700 dark:text-gray-300">
          <strong>Ort:</strong>
          {{ selectedEvent.location }}, {{ selectedEvent.address }}
          {{ selectedEvent.district }}
        </p>
        <!-- Preis -->
        <p class="mb-1 text-sm text-gray-700 dark:text-gray-300">
          <strong>Preis:</strong>
          {{ selectedEvent.price }}
        </p>
        <!-- Link -->
        <p
          v-if="selectedEvent.link"
          class="mb-4 text-sm text-blue-600 dark:text-blue-400"
        >
          <strong>Link:</strong>
          <a :href="selectedEvent.link" target="_blank" class="underline"
            >Mehr erfahren</a
          >
        </p>
        <!-- Route anzeigen -->
        <button
          @click="showRoute(selectedEvent.lat, selectedEvent.lng)"
          class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Route anzeigen
        </button>
      </div>
    </transition>

    <!-- Karte -->
    <div
      :class="[
        'h-full',
        selectedEvent ? 'w-1/2' : 'w-2/3',
        'rounded-xl',
        'overflow-hidden',
      ]"
    >
      <div id="map" class="w-full h-full"></div>
    </div>

    <!-- Event-Liste -->
    <div
      :class="[
        'bg-gray-100 rounded-lg dark:bg-gray-800 text-black dark:text-white overflow-y-auto',
        selectedEvent ? 'w-1/4' : 'w-1/3',
      ]"
    >
      <h2 class="text-lg font-bold mb-4 text-center p-2">
        Liste der Events (Stadt Köln)
      </h2>
      <ul class="px-4">
        <li
          v-for="(event, index) in filteredEvents"
          :key="event.id"
          :id="'event-' + event.id"
          @click="focusOnEvent(event)"
          class="mb-2 p-3 bg-white shadow rounded hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 cursor-pointer"
        >
          <h3 class="font-semibold">{{ event.title }}</h3>
          <p class="text-sm text-gray-700 dark:text-gray-200">
            {{ event.description || "Keine Beschreibung verfügbar" }}
          </p>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            {{ formatDate(event.begin) }} - {{ formatDate(event.end) }},
            {{ event.time || "" }}
          </p>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Ort: {{ event.location || "" }}, {{ event.address || "" }}
            {{ event.district || "" }}
          </p>
          <button
            @click.stop="toggleDetails(index)"
            class="mt-2 px-2 py-1 bg-gray-400 text-white text-sm rounded hover:bg-gray-500 focus:outline-none"
          >
            {{
              expandedIndices.includes(index)
                ? "Weniger anzeigen"
                : "Mehr anzeigen"
            }}
          </button>
          <div v-if="expandedIndices.includes(index)" class="mt-2">
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Link: <i>{{ event.link || "Keine Informationen verfügbar" }}</i>
            </p>
            <p class="text-sm text-orange-500 dark:text-orange-400">
              Preis:
              {{
                event.price
                  ? event.price.replace(/<br\s*\/?>/gi, "")
                  : "Keine Angaben"
              }}
            </p>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<script>
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

export default {
  name: "EventsMap",
  props: {
    filteredEvents: { type: Array, default: () => [] },
    filteredTicketmasterEvents: { type: Array, default: () => [] },
    showHeatmap: { type: Boolean, default: false },
    showSights: { type: Boolean, default: false },
    showTicketmasterEvents: { type: Boolean, default: false },
    showCologneEvents: { type: Boolean, default: true },
    showVeedel: { type: Boolean, default: false },
  },
  data() {
    return {
      map: null,
      eventFeatures: [],
      startMarker: null,
      endMarker: null,
      userLocation: { lat: 50.9375, lng: 6.9603 },
      expandedIndices: [],
      selectedEvent: null,
    };
  },
  methods: {
    formatDate(dateString) {
      if (!dateString) return "Unbekannt";
      const [year, month, day] = dateString.split("-");
      return `${day}.${month}.${year}`;
    },
    initializeMap() {
      const MAPTILER_API_KEY = "3n5o3DZeRN1onPtXPw0i";
      this.map = new maplibregl.Map({
        container: "map",
        style: `https://api.maptiler.com/maps/streets/style.json?key=${MAPTILER_API_KEY}`,
        center: [6.9603, 50.9375],
        zoom: 12,
      });
      this.map.addControl(new maplibregl.NavigationControl());
      this.map.addControl(new maplibregl.ScaleControl());
      this.map.on("load", () => {
        if (this.showCologneEvents) this.addMarkersToMap();
        if (this.showHeatmap) this.addHeatmap();
        if (this.showSights) this.addSightsMarkers();
        if (this.showTicketmasterEvents) this.addTicketmasterMarkers();
        if (this.showVeedel) this.addVeedelLayer();
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              this.userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              };
            },
            (error) => {
              console.log("Geolocation error:", error);
            }
          );
        }
      });
    },
    addMarkersToMap() {
      if (this.map.getSource("cologne-events")) {
        this.map.removeLayer("cologne-events-layer");
        this.map.removeSource("cologne-events");
      }
      this.eventFeatures = this.filteredEvents.map((event) => ({
        type: "Feature",
        geometry: { type: "Point", coordinates: [event.lng, event.lat] },
        properties: {
          id: event.id,
          title: event.title,
          description: event.description || "Keine Beschreibung verfügbar",
          begin: event.begin,
          end: event.end,
          time: event.time || "",
          location: event.location || "",
          address: event.address || "",
          district: event.district || "",
          price: event.price
            ? event.price.replace(/<br\s*\/?>/gi, "")
            : "Keine Angaben",
          link: event.link || "",
          img: event.img ? `https://www.stadt-koeln.de${event.img}` : null,
          lat: event.lat,
          lng: event.lng,
        },
      }));
      this.map.addSource("cologne-events", {
        type: "geojson",
        data: { type: "FeatureCollection", features: this.eventFeatures },
      });
      this.map.addLayer({
        id: "cologne-events-layer",
        type: "circle",
        source: "cologne-events",
        paint: {
          "circle-radius": 8,
          "circle-color": "#3FB1CE",
          "circle-stroke-width": 2,
          "circle-stroke-color": "#ffffff",
        },
      });
      this.map.on("click", "cologne-events-layer", (e) => {
        const feature = e.features[0];
        const coordinates = feature.geometry.coordinates.slice();
        const props = feature.properties;
        this.map.flyTo({
          center: coordinates,
          zoom: Math.max(this.map.getZoom() - 0.3, 10),
          duration: 300,
        });
        setTimeout(() => {
          this.selectedEvent = {
            title: props.title,
            description: props.description,
            begin: props.begin,
            end: props.end,
            time: props.time,
            location: props.location,
            address: props.address,
            district: props.district,
            price: props.price,
            link: props.link,
            img: props.img,
            lat: props.lat,
            lng: props.lng,
          };
        }, 350);
      });
      this.map.on("mouseenter", "cologne-events-layer", () => {
        this.map.getCanvas().style.cursor = "pointer";
      });
      this.map.on("mouseleave", "cologne-events-layer", () => {
        this.map.getCanvas().style.cursor = "";
      });
    },
    addHeatmap() {
      if (!this.filteredEvents.length) return;
      if (this.map.getSource("heatmap-data")) {
        this.map.removeLayer("heatmap-layer");
        this.map.removeSource("heatmap-data");
      }
      const heatmapPoints = this.filteredEvents.map((event) => ({
        type: "Feature",
        geometry: { type: "Point", coordinates: [event.lng, event.lat] },
        properties: { intensity: 0.2 },
      }));
      this.map.addSource("heatmap-data", {
        type: "geojson",
        data: { type: "FeatureCollection", features: heatmapPoints },
      });
      this.map.addLayer({
        id: "heatmap-layer",
        type: "heatmap",
        source: "heatmap-data",
        maxzoom: 15,
        paint: {
          "heatmap-weight": ["get", "intensity"],
          "heatmap-intensity": 1,
          "heatmap-color": [
            "interpolate",
            ["linear"],
            ["heatmap-density"],
            0,
            "rgba(0, 0, 255, 0)",
            0.2,
            "rgb(0, 0, 255)",
            0.4,
            "rgb(128, 0, 255)",
            0.6,
            "rgb(255, 0, 255)",
            0.8,
            "rgb(255, 0, 0)",
            1,
            "rgb(255, 0, 0)",
          ],
          "heatmap-radius": 30,
          "heatmap-opacity": 0.7,
        },
      });
    },
    removeHeatmap() {
      if (this.map.getSource("heatmap-data")) {
        this.map.removeLayer("heatmap-layer");
        this.map.removeSource("heatmap-data");
      }
    },
    addTicketmasterMarkers() {
      if (this.map.getSource("ticketmaster-events")) {
        this.map.removeLayer("ticketmaster-clusters");
        this.map.removeLayer("ticketmaster-cluster-count");
        this.map.removeLayer("ticketmaster-unclustered-point");
        this.map.removeSource("ticketmaster-events");
      }
      const features = this.filteredTicketmasterEvents.map((event) => {
        const venue = event._embedded.venues[0];
        const lat = parseFloat(venue.location.latitude);
        const lng = parseFloat(venue.location.longitude);
        return {
          type: "Feature",
          geometry: { type: "Point", coordinates: [lng, lat] },
          properties: {
            id: event.id,
            name: event.name,
            date: event.dates.start.localDate || "kein Datum verfügbar",
            time: event.dates.start.localTime || "",
            address: venue.address
              ? venue.address.line1
              : "keine Adresse verfügbar",
            city: venue.city ? venue.city.name : "",
            eventUrl: event.url || "",
            image:
              event.images && event.images.length > 0
                ? event.images[0].url
                : "",
            description: event.description || "",
          },
        };
      });
      this.map.addSource("ticketmaster-events", {
        type: "geojson",
        data: { type: "FeatureCollection", features: features },
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50,
      });
      this.map.addLayer({
        id: "ticketmaster-clusters",
        type: "circle",
        source: "ticketmaster-events",
        filter: ["has", "point_count"],
        paint: {
          "circle-color": [
            "step",
            ["get", "point_count"],
            "#ff4d4d",
            5,
            "#ff1a1a",
            10,
            "#cc0000",
          ],
          "circle-radius": ["step", ["get", "point_count"], 20, 5, 25, 10, 30],
        },
      });
      this.map.addLayer({
        id: "ticketmaster-cluster-count",
        type: "symbol",
        source: "ticketmaster-events",
        filter: ["has", "point_count"],
        layout: {
          "text-field": "{point_count_abbreviated}",
          "text-font": ["Open Sans Bold"],
          "text-size": 12,
        },
        paint: { "text-color": "#ffffff" },
      });
      this.map.addLayer({
        id: "ticketmaster-unclustered-point",
        type: "circle",
        source: "ticketmaster-events",
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-color": "#ff4d4d",
          "circle-radius": 8,
          "circle-stroke-width": 2,
          "circle-stroke-color": "#ffffff",
        },
      });
      this.map.on("click", "ticketmaster-unclustered-point", (e) => {
        const properties = e.features[0].properties;
        const coordinates = e.features[0].geometry.coordinates.slice();
        this.map.flyTo({
          center: coordinates,
          zoom: Math.max(this.map.getZoom() - 0.3, 10),
          duration: 300,
        });
        setTimeout(() => {
          this.selectedEvent = {
            title: properties.name,
            description:
              properties.description || "Keine Beschreibung verfügbar",
            begin: properties.date || "",
            end: properties.date || "",
            time: properties.time || "",
            location: properties.address + ", " + (properties.city || ""),
            address: properties.address || "",
            district: "",
            price: "",
            link: properties.eventUrl || "",
            img: properties.image || "",
            lat: coordinates[1],
            lng: coordinates[0],
          };
        }, 350);
      });
      this.map.on("mouseenter", "ticketmaster-unclustered-point", () => {
        this.map.getCanvas().style.cursor = "pointer";
      });
      this.map.on("mouseleave", "ticketmaster-unclustered-point", () => {
        this.map.getCanvas().style.cursor = "";
      });
      this.map.on("click", "ticketmaster-clusters", (e) => {
        const features = this.map.queryRenderedFeatures(e.point, {
          layers: ["ticketmaster-clusters"],
        });
        const clusterId = features[0].properties.cluster_id;
        this.map
          .getSource("ticketmaster-events")
          .getClusterExpansionZoom(clusterId, (err, zoom) => {
            if (err) return;
            this.map.easeTo({
              center: features[0].geometry.coordinates,
              zoom: zoom,
            });
          });
      });
      this.map.on("mouseenter", "ticketmaster-clusters", () => {
        this.map.getCanvas().style.cursor = "pointer";
      });
      this.map.on("mouseleave", "ticketmaster-clusters", () => {
        this.map.getCanvas().style.cursor = "";
      });
    },
    addSightsMarkers() {
      if (this.map.getSource("sights-data")) {
        this.map.removeLayer("sights-layer");
        this.map.removeSource("sights-data");
      }
      fetch("http://localhost:3000/api/sehenswuerdigkeiten")
        .then((response) => response.json())
        .then((data) => {
          const features = data.features.map((feature) => ({
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [feature.geometry.x, feature.geometry.y],
            },
            properties: {
              name: feature.attributes.name || "Kein Name",
              address: feature.attributes.adresse || "Keine Adresse",
              district: feature.attributes.stadtteil || "",
              description: feature.attributes.description || "",
            },
          }));
          this.map.addSource("sights-data", {
            type: "geojson",
            data: { type: "FeatureCollection", features: features },
          });
          this.map.addLayer({
            id: "sights-layer",
            type: "circle",
            source: "sights-data",
            paint: {
              "circle-radius": 8,
              "circle-color": "#4CAF50",
              "circle-stroke-width": 2,
              "circle-stroke-color": "#ffffff",
            },
          });
          this.map.on("click", "sights-layer", (e) => {
            const feature = e.features[0];
            const coordinates = feature.geometry.coordinates.slice();
            const properties = feature.properties;
            this.map.flyTo({
              center: coordinates,
              zoom: Math.max(this.map.getZoom() - 0.3, 10),
              duration: 300,
            });
            setTimeout(() => {
              this.selectedEvent = {
                title: properties.name,
                description:
                  properties.description || "Keine Beschreibung verfügbar",
                begin: "",
                end: "",
                time: "",
                location: properties.address || "",
                address: properties.address || "",
                district: properties.district || "",
                price: "",
                link: "",
                img: "",
                lat: coordinates[1],
                lng: coordinates[0],
              };
            }, 350);
          });
          this.map.on("mouseenter", "sights-layer", () => {
            this.map.getCanvas().style.cursor = "pointer";
          });
          this.map.on("mouseleave", "sights-layer", () => {
            this.map.getCanvas().style.cursor = "";
          });
        })
        .catch((error) =>
          console.error("Fehler beim Laden der Sehenswürdigkeiten:", error)
        );
    },
    removeSightsMarkers() {
      if (this.map.getSource("sights-data")) {
        this.map.removeLayer("sights-layer");
        this.map.removeSource("sights-data");
      }
    },
    addVeedelLayer() {
      if (this.map.getSource("veedel-data")) {
        this.map.removeLayer("veedel-layer");
        if (this.map.getLayer("veedel-labels")) {
          this.map.removeLayer("veedel-labels");
        }
        this.map.removeSource("veedel-data");
      }
      fetch("http://localhost:3000/api/veedel")
        .then((response) => response.json())
        .then((data) => {
          this.map.addSource("veedel-data", {
            type: "geojson",
            data: data,
          });
          this.map.addLayer({
            id: "veedel-layer",
            type: "fill",
            source: "veedel-data",
            paint: {
              "fill-color": "#888888",
              "fill-opacity": 0.4,
              "fill-outline-color": "#000000",
            },
          });
          this.map.addLayer({
            id: "veedel-labels",
            type: "symbol",
            source: "veedel-data",
            layout: {
              "text-field": ["get", "name"],
              "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
              "text-size": 14,
              "text-anchor": "center",
              "text-allow-overlap": true,
            },
            paint: {
              "text-color": "#008000",
              "text-halo-color": "#ffffff",
              "text-halo-width": 1.5,
            },
          });
        })
        .catch((error) =>
          console.error("Fehler beim Laden der Veedel-Daten:", error)
        );
    },
    removeVeedelLayer() {
      if (this.map.getSource("veedel-data")) {
        if (this.map.getLayer("veedel-labels")) {
          this.map.removeLayer("veedel-labels");
        }
        this.map.removeLayer("veedel-layer");
        this.map.removeSource("veedel-data");
      }
    },
    showRoute(destinationLat, destinationLng) {
      const origin = [this.userLocation.lng, this.userLocation.lat];
      const destination = [destinationLng, destinationLat];
      if (this.map.getSource("route")) {
        this.map.removeLayer("route-layer");
        this.map.removeSource("route");
      }
      if (this.startMarker) this.startMarker.remove();
      if (this.endMarker) this.endMarker.remove();
      // Erstelle verschiebbare Marker
      this.startMarker = new maplibregl.Marker({
        color: "#00FF00",
        draggable: true,
      })
        .setLngLat(origin)
        .addTo(this.map);
      this.endMarker = new maplibregl.Marker({
        color: "#FF0000",
        draggable: true,
      })
        .setLngLat(destination)
        .addTo(this.map);
      // Bei Verschiebung der Marker wird die Route neu berechnet
      this.startMarker.on("dragend", this.updateRoute);
      this.endMarker.on("dragend", this.updateRoute);
      // Initiale Routenberechnung
      this.updateRoute();
    },
    updateRoute() {
      const origin = this.startMarker.getLngLat();
      const destination = this.endMarker.getLngLat();
      if (this.map.getSource("route")) {
        this.map.removeLayer("route-layer");
        this.map.removeSource("route");
      }
      fetch(
        `https://router.project-osrm.org/route/v1/driving/${origin.lng},${origin.lat};${destination.lng},${destination.lat}?overview=full&geometries=geojson`
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.code !== "Ok") {
            console.error("Error fetching route:", data.message);
            return;
          }
          const route = data.routes[0];
          const routeGeometry = route.geometry;
          this.map.addSource("route", {
            type: "geojson",
            data: { type: "Feature", properties: {}, geometry: routeGeometry },
          });
          this.map.addLayer({
            id: "route-layer",
            type: "line",
            source: "route",
            layout: { "line-join": "round", "line-cap": "round" },
            paint: {
              "line-color": "#0000FF",
              "line-width": 4,
              "line-opacity": 0.7,
            },
          });
          const bounds = new maplibregl.LngLatBounds();
          routeGeometry.coordinates.forEach((coord) => {
            bounds.extend(coord);
          });
          this.map.fitBounds(bounds, { padding: 50 });
        })
        .catch((error) => console.error("Error fetching route:", error));
    },
    focusOnEvent(event) {
      if (!this.map) return;
      this.map.flyTo({
        center: [event.lng, event.lat],
        zoom: 15,
        duration: 300,
      });
      setTimeout(() => {
        this.selectedEvent = {
          title: event.title,
          description: event.description || "Keine Beschreibung verfügbar",
          begin: event.begin,
          end: event.end,
          time: event.time,
          location: event.location,
          address: event.address,
          district: event.district,
          price: event.price
            ? event.price.replace(/<br\s*\/?>/gi, "")
            : "Keine Angaben",
          link: event.link,
          img: event.img ? `https://www.stadt-koeln.de${event.img}` : null,
          lat: event.lat,
          lng: event.lng,
        };
      }, 350);
    },
    scrollToList(eventId) {
      const safeId = `event-${eventId}`;
      const listItem = document.getElementById(safeId);
      if (listItem) {
        listItem.scrollIntoView({ behavior: "smooth", block: "center" });
        listItem.classList.add("highlight");
        setTimeout(() => {
          listItem.classList.remove("highlight");
        }, 2000);
      }
    },
    toggleDetails(index) {
      if (this.expandedIndices.includes(index)) {
        this.expandedIndices = this.expandedIndices.filter((i) => i !== index);
      } else {
        this.expandedIndices.push(index);
      }
    },
    closeSidePanel() {
      this.selectedEvent = null;
    },
  },
  watch: {
    filteredEvents: {
      handler() {
        if (this.showCologneEvents && this.map) {
          this.addMarkersToMap();
        }
        if (this.showHeatmap && this.map) {
          this.removeHeatmap();
          this.addHeatmap();
        }
      },
      immediate: true,
    },
    filteredTicketmasterEvents: {
      handler() {
        if (this.showTicketmasterEvents && this.map) {
          this.addTicketmasterMarkers();
        }
      },
      immediate: true,
    },
    showHeatmap: {
      handler(newVal) {
        if (!this.map) return;
        newVal ? this.addHeatmap() : this.removeHeatmap();
      },
      immediate: true,
    },
    showSights: {
      handler(newVal) {
        if (!this.map) return;
        newVal ? this.addSightsMarkers() : this.removeSightsMarkers();
      },
      immediate: true,
    },
    showCologneEvents: {
      handler(newVal) {
        if (!this.map) return;
        if (newVal) {
          this.addMarkersToMap();
        } else if (this.map.getSource("cologne-events")) {
          this.map.removeLayer("cologne-events-layer");
          this.map.removeSource("cologne-events");
        }
      },
    },
    showTicketmasterEvents: {
      handler(newVal) {
        if (!this.map) return;
        if (newVal) {
          this.addTicketmasterMarkers();
        } else if (this.map.getSource("ticketmaster-events")) {
          this.map.removeLayer("ticketmaster-clusters");
          this.map.removeLayer("ticketmaster-cluster-count");
          this.map.removeLayer("ticketmaster-unclustered-point");
          this.map.removeSource("ticketmaster-events");
        }
      },
    },
    showVeedel: {
      handler(newVal) {
        if (!this.map) return;
        newVal ? this.addVeedelLayer() : this.removeVeedelLayer();
      },
      immediate: true,
    },
  },
  mounted() {
    this.initializeMap();
  },
};
</script>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.3s ease;
}
.slide-fade-enter {
  transform: translateX(-20px);
  opacity: 0;
}
.slide-fade-leave-to {
  transform: translateX(-20px);
  opacity: 0;
}
.highlight {
  background-color: #f0f0f0;
  transition: background-color 0.3s ease;
}
:global(.maplibregl-popup) {
  z-index: 9999 !important;
}
:global(.maplibregl-popup-content) {
  max-width: 350px;
  max-height: 400px;
  overflow-y: auto;
  padding: 15px;
}
</style>
