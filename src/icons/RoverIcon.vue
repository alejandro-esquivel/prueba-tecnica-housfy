<script setup>
defineProps({
  direccion: {
    type: String,
    required: true,
    validator: (value) => ['N', 'S', 'E', 'W'].includes(value)
  }
});

const clasesRotaciones = {
  N: 'rotate-0',
  E: 'rotate-90',
  S: 'rotate-180',
  W: '-rotate-90'
};


</script>

<template>
  <img src="@/assets/rover.svg" alt="Obstacle Icon" :class="`w-4/12 mx-auto my-auto ${clasesRotaciones[direccion]}`" />
</template>
