<script setup>
const props = defineProps({
  name: String,
  imageUrl: String,
  description: String,
  observationDate: String,
  count: Number,
});
</script>

<template>
  <div class="col">
    <div class="card">
      <img :src="props.imageUrl" class="card-img-top" :alt="props.imageUrl" />
      <div class="card-body">
        <h5 class="card-title">{{ props.name }}</h5>
        <p class="description card-text">{{ props.description }}</p>
        <p class="card-text">Nombre d'observations : {{ props.count }}</p>
      </div>
      <div class="card-footer">
        <small class="text-body-secondary"
          >Observé le : {{ props.observationDate }}</small
        >
      </div>
    </div>
  </div>
</template>

<style>
img {
  height: 20vh;
}
.description {
  height: 10vh;
}
.card {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
}
</style>
