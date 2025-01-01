<template>
  <div id="map"></div>
</template>

<script setup>
// Leaflet
import L from "leaflet";
import "leaflet-draw";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";

// Vue
import { onMounted, ref, shallowRef, watchEffect } from "vue";

// External libs
import { buffer } from "@turf/turf";
import { stringify } from "wellknown";

// Draw config
import drawConfig from "./MapConfig";

const props = defineProps({
  radius: {
    type: Number,
    default: 10,
  },
});

// Component Attributes
const map = shallowRef(); // to store the Leaflet map
const geometry = shallowRef(new L.FeatureGroup()); // to store the displayed geometry
const radius = ref(props.radius); // in km

watchEffect(() => {
  radius.value = props.radius;
});

// Component Events
const emit = defineEmits(["wkt", "geojson"]);

// Component Lifecycle
onMounted(() => {
  // Initialize map
  map.value = L.map("map").setView([51.505, -0.09], 13);

  // Add tile layer
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map.value);

  // if existing value in geometry
  map.value.addLayer(geometry.value);

  // Add draw control
  map.value.addControl(new L.Control.Draw(drawConfig(geometry.value)));

  // On Geometry change
  map.value.on(L.Draw.Event.CREATED, function (event) {
    // Retrieve the drawn layer
    let layer = event.layer;

    // Display the new geometry
    geometry.value.clearLayers();
    geometry.value.addLayer(layer);

    // Convert to WKT
    let WKT = stringify(layer.toGeoJSON());

    // If point or line, we buffer the geometry since API does not support them
    if (event.layerType == "marker" || event.layerType == "polyline") {
      var buffered = buffer(layer.toGeoJSON(), radius.value);
      WKT = stringify(buffered);
      let tmp = L.geoJSON().addTo(geometry.value);
      tmp.addData(buffered);
    }

    // send geometry to parent
    emit("geojson", layer.toGeoJSON());
    emit("wkt", WKT);
  });
});
</script>

<style scoped>
#map {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}
</style>
