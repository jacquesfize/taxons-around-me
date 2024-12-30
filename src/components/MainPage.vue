<script setup>
import "leaflet/dist/leaflet.css";
import Map from "./Map.vue";
import { ref } from "vue";
import ListeTaxon from "./ListeTaxon.vue";

const selectedCoordinates = ref({});
const wktSelected = ref("");
</script>

<template>
  <h1 id="title" class="col-12 text-center mb-3 mt-0 p-3">
    🐦Taxons around me🐛
  </h1>
  <div class="container">
    <Map
      :radius="1"
      @wkt="(drawGeometryWKT) => (wktSelected = drawGeometryWKT)"
    />
    <ListeTaxon :wkt="wktSelected" :itemPerPage="10" />
  </div>
</template>

<script type="module"></script>

<style scoped>
#map {
  height: 50vh;
}
#title {
  background-color: white;
  box-shadow: 0px 0px 5px #666;
}
#liste-taxons {
  padding: 1em;
}
</style>
