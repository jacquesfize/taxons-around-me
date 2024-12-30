<script setup>
import { computed, ref, watch } from "vue";
import { getMedias } from "../lib/api/media";
import Loading from "./commons/Loading.vue";
import { getGbifTaxon } from "../lib/api/taxon";
import Taxon from "./Taxon.vue";
import Pagination from "./commons/Pagination.vue";

const props = defineProps({
  wkt: String,
  itemPerPage: Number,
});

const WKT = ref(null);

const speciesList = ref([]);
const loadingObservations = ref(false);

const pageIndex = ref(0);
const itemsPerPage = ref(props.itemPerPage ? props.itemPerPage : 10);

const speciesListShowed = computed(() => {
  return speciesList.value
    .sort((a, b) => b.occCount - a.occCount)
    .slice(
      pageIndex.value * itemsPerPage.value,
      (pageIndex.value + 1) * itemsPerPage.value
    );
});

function refreshSpeciesList(wkt) {
  loadingObservations.value = true;
  speciesList.value = [];
  getGbifTaxon(wkt, 10, { maxPage: 2, limit: 300 }).then((response) => {
    Object.values(response).forEach((observation) => {
      getMedias(observation.taxonKey).then((url) => {
        observation["media"] = url;
        speciesList.value.push(observation);
      });
    });
    loadingObservations.value = false;
  });
}

watch(props, () => {
  WKT.value = props.wkt;
});

watch(WKT, () => {
  if (WKT.value) {
    refreshSpeciesList(WKT.value);
  }
});
</script>
<template>
  <div id="liste-taxons">
    <Loading :loadingStatus="loadingObservations" />
    <div class="row row-cols-3 row-cols-md-4 g-4">
      <Taxon
        v-for="observation in speciesListShowed"
        :name="observation.acceptedScientificName"
        :imageUrl="observation.media"
        :description="observation.acceptedScientificName"
        :observationDate="observation.eventDate"
        :count="observation.occCount"
      />
    </div>

    <div class="d-flex justify-content-center m-3">
      <Pagination
        v-if="speciesListShowed.length > 0"
        :pageIndex="pageIndex"
        :total-items="speciesList.length"
        :itemPerPage="itemsPerPage"
        @page="(index) => (pageIndex = index)"
      />
    </div>
  </div>
</template>
