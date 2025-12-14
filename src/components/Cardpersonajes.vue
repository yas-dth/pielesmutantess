<template>
  <button
    class="card-personaje"
    @click="$emit('click')"
    @keydown.enter.prevent="$emit('click')"
    @keydown.space.prevent="$emit('click')"
    :aria-label="alt || 'Personaje'"
  >
    <img :src="img" :alt="alt" class="card-img" />
  </button>
</template>


<script>
export default {
  props: ["img", "alt"]
}
</script>

<style scoped>
.card-personaje {
  background: transparent;
  border: none;
  cursor: pointer;
}
</style>