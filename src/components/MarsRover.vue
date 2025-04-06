<script setup>
import RoverGrid from './RoverGrid.vue';
import RoverInput from './RoverInput.vue';

const NUM_OBSTACULOS = 1;

</script>

<template>
  <section>
    <header class="m-4 rounded-md w-11/12 mx-auto p-4 bg-slate-800">
      <h1 class="text-3xl text-slate-100 font-bold text-center">Mars Rover Mission</h1>
    </header>
    <RoverGrid :numObstaculos="NUM_OBSTACULOS" />
    <RoverInput />
  </section>
</template>
