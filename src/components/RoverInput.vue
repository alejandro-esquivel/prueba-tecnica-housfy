<script setup>
import { defineModel }
  from 'vue';
const instruccion = defineModel();

const sendInstruccion = (e) => {
  console.log(e.target.value && instruccion.value);
};

</script>

<template>
  <div class="w-10/12 mx-auto mt-10 relative">
    <input type="text" name="instruccion" id="instruccion"
      class="font-lato font-bold relative w-full px-4 py-2 text-xl transition duration-150 border-none rounded-lg pr-44 lg:pr-52 focus:ring-lime-200 focus:ring-4 focus:outline-none text-slate-800 bg-lime-400 "
      v-model="instruccion" @keyup.enter="sendInstruccion">
  </div>
</template>
