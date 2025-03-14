<template>
  <section
    id="map-section"
    class="w-full h-[600px] flex bg-green-600 text-white dark:bg-gray-700"
  >
    <!-- Map container -->
    <div class="map-container w-2/3 h-[200px]">
      <div id="map" class="h-full w-full"></div>
    </div>

    <!-- Events list -->
    <div
      class="list-container w-1/3 h-full bg-gray-100 text-black p-4 overflow-y-auto dark:bg-gray-800 dark:text-white"
    >
      <h2 class="text-lg font-bold mb-4 text-center">
        Liste der Events (Stadt Köln)
      </h2>
      <ul>
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

          <!-- Button: mehr/weniger anzeigen -->
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

          <!-- Zusätzliche Informationen (Link & Preis) -->
          <div v-if="expandedIndices.includes(index)" class="mt-2">
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Link: <i>{{ event.link || "Keine Informationen verfügbar" }}</i>
            </p>
            <p class="text-sm text-orange-500 dark:text-orange-400">
              Preis:
              {{
                event.price
                  ? event.price.replace(/<br\s*\/?>/g, "")
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
    filteredEvents: {
      type: Array,
      default: () => [],
    },
    filteredTicketmasterEvents: {
      type: Array,
      default: () => [],
    },
    showHeatmap: {
      type: Boolean,
      default: false,
    },
    showSights: {
      type: Boolean,
      default: false,
    },
    showTicketmasterEvents: {
      type: Boolean,
      default: false,
    },
    showCologneEvents: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      map: null,
      eventFeatures: [],
      startMarker: null,
      endMarker: null,
      userLocation: {
        lat: 50.9375,
        lng: 6.9603,
      },
      expandedIndices: [], // Array to track expanded events
    };
  },
  methods: {
    formatDate(dateString) {
      if (!dateString) return "Unbekannt";
      const [year, month, day] = dateString.split("-");
      return `${day}.${month}.${year}`;
    },

    initializeMap() {
      // Initialize MapLibre map
      this.map = new maplibregl.Map({
        container: "map",
        style: "https://demotiles.maplibre.org/style.json", // Default OSM style
        center: [6.9603, 50.9375], // Note: MapLibre uses [lng, lat] format!
        zoom: 12,
      });

      // Add navigation controls
      this.map.addControl(new maplibregl.NavigationControl());

      // Add scale control
      this.map.addControl(new maplibregl.ScaleControl());

      // Wait for map to load before adding data
      this.map.on("load", () => {
        if (this.showCologneEvents) this.addMarkersToMap();
        if (this.showHeatmap) this.addHeatmap();
        if (this.showSights) this.addSightsMarkers();
        if (this.showTicketmasterEvents) this.addTicketmasterMarkers();

        // Try to get user's location
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
      // Remove existing markers if they exist
      if (this.map.getSource("cologne-events")) {
        this.map.removeLayer("cologne-events-layer");
        this.map.removeSource("cologne-events");
      }

      // Create GeoJSON features for events
      this.eventFeatures = this.filteredEvents.map((event) => {
        return {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [event.lng, event.lat],
          },
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
              ? event.price.replace(/<br\s*\ /, "")
              : "Keine Angaben",
            link: event.link || "",
            img: event.img ? `https://www.stadt-koeln.de${event.img}` : null,
          },
        };
      });

      // Add GeoJSON source
      this.map.addSource("cologne-events", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: this.eventFeatures,
        },
      });

      // Add circle layer for event markers
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

      // Handle click events on markers
      this.map.on("click", "cologne-events-layer", (e) => {
        const feature = e.features[0];
        const coordinates = feature.geometry.coordinates.slice();
        const properties = feature.properties;

        // Create popup HTML content
        const imageUrl = properties.img;
        const popupContent = `
          <div class="text-left space-y-1">
            ${
              imageUrl
                ? `<img src="${imageUrl}" alt="Teaserbild" class="w-32 h-20 rounded object-cover">`
                : ""
            }
            <h3 class="font-semibold text-base">${properties.title}</h3>
            <p class="text-sm text-gray-700">${properties.description}</p>
            <p class="text-sm text-gray-500">
              ${this.formatDate(properties.begin)} - ${this.formatDate(
          properties.end
        )}, ${
          properties.time
            ? properties.time.replace(
                /<br\s*\/?>|&lt;br\s*\/?&gt;|\s*<br>\s*/gi,
                ""
              )
            : ""
        }
            </p>
            <p class="text-sm text-gray-500">
              <b>Ort:</b> ${properties.location}, ${properties.address} ${
          properties.district
        }
            </p>
            <p class="text-sm text-gray-500">
              <b>Preis:</b> ${properties.price}
            </p>
            ${
              properties.link
                ? `<p class="text-sm text-blue-600"><b>Link:</b> <a href="${properties.link}" target="_blank" class="underline">Mehr erfahren</a></p>`
                : ""
            }
            <button class="route-link" style="color:blue; text-decoration: underline;">Route anzeigen</button>
            <button 
              class="flex items-center justify-end text-gray-500 font-bold mt-2 cursor-pointer w-full"
              title="Zur Liste springen"
              id="jump-to-list-${properties.id}">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        `;

        // Create and display popup
        const popup = new maplibregl.Popup()
          .setLngLat(coordinates)
          .setHTML(popupContent)
          .addTo(this.map);

        // Add event listeners once popup is added to DOM
        popup.on("open", () => {
          setTimeout(() => {
            const jumpBtn = document.getElementById(
              `jump-to-list-${properties.id}`
            );
            if (jumpBtn) {
              jumpBtn.addEventListener("click", () =>
                this.scrollToList(properties.id)
              );
            }

            const routeBtn = document.querySelector(".route-link");
            if (routeBtn) {
              routeBtn.addEventListener("click", () => {
                this.showRoute(coordinates[1], coordinates[0]);
              });
            }
          }, 100);
        });
      });

      // Change cursor on hover
      this.map.on("mouseenter", "cologne-events-layer", () => {
        this.map.getCanvas().style.cursor = "pointer";
      });

      this.map.on("mouseleave", "cologne-events-layer", () => {
        this.map.getCanvas().style.cursor = "";
      });
    },

    addHeatmap() {
      if (!this.filteredEvents.length) return;

      // Remove existing heatmap if it exists
      if (this.map.getSource("heatmap-data")) {
        this.map.removeLayer("heatmap-layer");
        this.map.removeSource("heatmap-data");
      }

      // Create GeoJSON for heatmap
      const heatmapPoints = this.filteredEvents.map((event) => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [event.lng, event.lat],
        },
        properties: {
          intensity: 0.2,
        },
      }));

      // Add GeoJSON source for heatmap
      this.map.addSource("heatmap-data", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: heatmapPoints,
        },
      });

      // Add heatmap layer
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
      // Remove existing Ticketmaster markers
      if (this.map.getSource("ticketmaster-events")) {
        this.map.removeLayer("ticketmaster-clusters");
        this.map.removeLayer("ticketmaster-cluster-count");
        this.map.removeLayer("ticketmaster-unclustered-point");
        this.map.removeSource("ticketmaster-events");
      }

      // Create GeoJSON data for Ticketmaster events
      const features = this.filteredTicketmasterEvents.map((event) => {
        const venue = event._embedded.venues[0];
        const lat = parseFloat(venue.location.latitude);
        const lng = parseFloat(venue.location.longitude);

        return {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [lng, lat],
          },
          properties: {
            id: event.id,
            name: event.name,
            date: event.dates.start.localDate || "kein Datum verfügbar",
            time: event.dates.start.localTime || "",
            address: venue.address
              ? venue.address.line1
              : "keine Adresse verfügbar",
            city: venue.city ? venue.city.name : "",
            eventUrl: event.url || "kein Link verfügbar",
            image:
              event.images && event.images.length > 0
                ? event.images[0].url
                : "",
          },
        };
      });

      // Add clustered GeoJSON source
      this.map.addSource("ticketmaster-events", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: features,
        },
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50,
      });

      // Add a layer for the clusters
      this.map.addLayer({
        id: "ticketmaster-clusters",
        type: "circle",
        source: "ticketmaster-events",
        filter: ["has", "point_count"],
        paint: {
          "circle-color": [
            "step",
            ["get", "point_count"],
            "#ff4d4d", // Red for small clusters
            5,
            "#ff1a1a", // Darker red for medium clusters
            10,
            "#cc0000", // Very dark red for large clusters
          ],
          "circle-radius": [
            "step",
            ["get", "point_count"],
            20, // Size for small clusters
            5,
            25, // Size for medium clusters
            10,
            30, // Size for large clusters
          ],
        },
      });

      // Add a layer for the cluster counts
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
        paint: {
          "text-color": "#ffffff",
        },
      });

      // Add a layer for individual points (non-clustered)
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

      // Add click handler for individual points
      this.map.on("click", "ticketmaster-unclustered-point", (e) => {
        const properties = e.features[0].properties;
        const coordinates = e.features[0].geometry.coordinates.slice();

        // Generate popup content
        const popupContent = `
          <div class="text-left space-y-1">
            ${
              properties.image
                ? `<img src="${properties.image}" alt="Teaserbild" class="w-32 h-20 rounded object-cover">`
                : ""
            }
            <h3 class="font-semibold text-base">${properties.name}</h3>
            <p class="text-sm text-gray-500">${this.formatDate(
              properties.date
            )}, ${
          properties.time
            ? properties.time.slice(0, 5) + " Uhr"
            : properties.time
        }</p>
            <p class="text-sm text-gray-500"><b>Ort</b>: ${
              properties.address
            }, ${properties.city}</p>
            <p class="text-sm text-blue-600"><b>Link</b>: <a href="${
              properties.eventUrl
            }" target="_blank" class="underline">Zu Ticketmaster</a></p>
          </div>
        `;

        // Create and display popup
        new maplibregl.Popup()
          .setLngLat(coordinates)
          .setHTML(popupContent)
          .addTo(this.map);
      });

      // Handle clicks on clusters to zoom in
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

      // Change cursor on hover
      this.map.on("mouseenter", "ticketmaster-unclustered-point", () => {
        this.map.getCanvas().style.cursor = "pointer";
      });

      this.map.on("mouseleave", "ticketmaster-unclustered-point", () => {
        this.map.getCanvas().style.cursor = "";
      });

      this.map.on("mouseenter", "ticketmaster-clusters", () => {
        this.map.getCanvas().style.cursor = "pointer";
      });

      this.map.on("mouseleave", "ticketmaster-clusters", () => {
        this.map.getCanvas().style.cursor = "";
      });
    },

    addSightsMarkers() {
      // Remove existing sights markers
      if (this.map.getSource("sights-data")) {
        this.map.removeLayer("sights-layer");
        this.map.removeSource("sights-data");
      }

      // Fetch sights data
      fetch("http://localhost:3000/api/sehenswuerdigkeiten")
        .then((response) => response.json())
        .then((data) => {
          // Create GeoJSON features
          const features = data.features.map((feature) => {
            return {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [feature.geometry.x, feature.geometry.y],
              },
              properties: {
                name: feature.attributes.name || "Kein Name",
                address: feature.attributes.adresse || "Keine Adresse",
                district: feature.attributes.stadtteil || "",
              },
            };
          });

          // Add GeoJSON source
          this.map.addSource("sights-data", {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: features,
            },
          });

          // Add a layer for the sights as circles with green color
          this.map.addLayer({
            id: "sights-layer",
            type: "circle",
            source: "sights-data",
            paint: {
              "circle-radius": 8,
              "circle-color": "#4CAF50", // Green color
              "circle-stroke-width": 2,
              "circle-stroke-color": "#ffffff",
            },
          });

          // Add click event for popups
          this.map.on("click", "sights-layer", (e) => {
            const feature = e.features[0];
            const coordinates = feature.geometry.coordinates.slice();
            const properties = feature.properties;

            // Create popup content
            const popupContent = `
              <strong>${properties.name}</strong><br>${properties.address}, ${properties.district}<br>
              <button class="route-link" style="color:blue; text-decoration: underline;">Route anzeigen</button>
            `;

            // Create and display popup
            const popup = new maplibregl.Popup()
              .setLngLat(coordinates)
              .setHTML(popupContent)
              .addTo(this.map);

            // Add event listener for route button
            popup.on("open", () => {
              setTimeout(() => {
                const routeBtn = document.querySelector(".route-link");
                if (routeBtn) {
                  routeBtn.addEventListener("click", () => {
                    this.showRoute(coordinates[1], coordinates[0]);
                  });
                }
              }, 100);
            });
          });

          // Change cursor on hover
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

    showRoute(destinationLat, destinationLng) {
      // Define user location and destination in [long, lat] format
      const origin = [this.userLocation.lng, this.userLocation.lat];
      const destination = [destinationLng, destinationLat];

      // Remove previous route if it exists
      if (this.map.getSource("route")) {
        this.map.removeLayer("route-layer");
        this.map.removeSource("route");
      }

      // Remove previous markers if they exist
      if (this.startMarker) this.startMarker.remove();
      if (this.endMarker) this.endMarker.remove();

      // Add start and end markers
      this.startMarker = new maplibregl.Marker({ color: "#00FF00" })
        .setLngLat(origin)
        .addTo(this.map);

      this.endMarker = new maplibregl.Marker({ color: "#FF0000" })
        .setLngLat(destination)
        .addTo(this.map);

      // Call the OSRM API to get the route
      fetch(
        `https://router.project-osrm.org/route/v1/driving/${origin[0]},${origin[1]};${destination[0]},${destination[1]}?overview=full&geometries=geojson`
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.code !== "Ok") {
            console.error("Error fetching route:", data.message);
            return;
          }

          const route = data.routes[0];
          const routeGeometry = route.geometry;

          // Add the route to the map
          this.map.addSource("route", {
            type: "geojson",
            data: {
              type: "Feature",
              properties: {},
              geometry: routeGeometry,
            },
          });

          this.map.addLayer({
            id: "route-layer",
            type: "line",
            source: "route",
            layout: {
              "line-join": "round",
              "line-cap": "round",
            },
            paint: {
              "line-color": "#0000FF",
              "line-width": 4,
              "line-opacity": 0.7,
            },
          });

          // Fit the map to the route
          const bounds = new maplibregl.LngLatBounds();
          routeGeometry.coordinates.forEach((coord) => {
            bounds.extend(coord);
          });

          this.map.fitBounds(bounds, {
            padding: 50,
          });
        })
        .catch((error) => console.error("Error fetching route:", error));
    },

    focusOnEvent(event) {
      if (!this.map) return;

      this.map.flyTo({
        center: [event.lng, event.lat],
        zoom: 15,
      });

      // Create a popup for the event
      const popupContent = `
        <div class="text-left space-y-1">
          ${
            event.img
              ? `<img src="https://www.stadt-koeln.de${event.img}" alt="Teaserbild" class="w-32 h-20 rounded object-cover">`
              : ""
          }
          <h3 class="font-semibold text-base">${event.title}</h3>
          <p class="text-sm text-gray-700">${
            event.description || "Keine Beschreibung verfügbar"
          }</p>
          <p class="text-sm text-gray-500">
            ${this.formatDate(event.begin)} - ${this.formatDate(event.end)}, ${
        event.time
          ? event.time.replace(/<br\s*\/?>|&lt;br\s*\/?&gt;|\s*<br>\s*/gi, "")
          : ""
      }
          </p>
          <p class="text-sm text-gray-500">
            <b>Ort:</b> ${event.location || ""}, ${event.address || ""} ${
        event.district || ""
      }
          </p>
          <p class="text-sm text-gray-500">
            <b>Preis:</b> ${
              event.price?.replace(/<br\s*\/?>/gi, "") || "Keine Angaben"
            }
          </p>
          ${
            event.link
              ? `<p class="text-sm text-blue-600"><b>Link:</b> <a href="${event.link}" target="_blank" class="underline">Mehr erfahren</a></p>`
              : ""
          }
          <button class="route-link" style="color:blue; text-decoration: underline;">Route anzeigen</button>
        </div>
      `;

      const popup = new maplibregl.Popup()
        .setLngLat([event.lng, event.lat])
        .setHTML(popupContent)
        .addTo(this.map);

      popup.on("open", () => {
        setTimeout(() => {
          const routeBtn = document.querySelector(".route-link");
          if (routeBtn) {
            routeBtn.addEventListener("click", () => {
              this.showRoute(event.lat, event.lng);
            });
          }
        }, 100);
      });
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

        if (newVal) {
          this.addHeatmap();
        } else {
          this.removeHeatmap();
        }
      },
      immediate: true,
    },

    showSights: {
      handler(newVal) {
        if (!this.map) return;

        if (newVal) {
          this.addSightsMarkers();
        } else {
          this.removeSightsMarkers();
        }
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
  },
  mounted() {
    this.initializeMap();
  },
};
</script>

<style scoped>
#map-section {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 65vh;
}

.map-container {
  width: 66.6667%;
  height: 100%;
}

.list-container {
  width: 33.3333%;
  height: 100%;
}

.highlight {
  background-color: #f0f0f0;
  transition: background-color 0.3s ease;
}

/* Custom styles for MapLibre popups */
:global(.maplibregl-popup-content) {
  padding: 15px;
  max-width: 300px;
}

:global(.maplibregl-popup-close-button) {
  font-size: 16px;
}
</style>
