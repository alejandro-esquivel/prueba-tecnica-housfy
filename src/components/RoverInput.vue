<script setup>
import { defineModel, watch, defineEmits } from 'vue';
import { validarCaracteres } from '@/helpers/helpers';

const instruccion = defineModel();

const emit = defineEmits(['sendInput']);

let isValidInput = false;

const sendInstruccion = () => {
  if (isValidInput) {
    emit('sendInput', instruccion.value);
    instruccion.value = "";
  }
};

watch(instruccion, (val) => {
  instruccion.value = val;
  const caracteres = ['F', 'L', 'R'];

  isValidInput = validarCaracteres(val, caracteres);
});
</script>

<template>
  <div class="w-10/12 mx-auto mt-10 relative">
    <input type="text" name="instruccion" id="instruccion" v-model="instruccion"
      class="font-lato font-bold relative w-full px-4 py-6 text-xl transition duration-150 border-none rounded-lg focus:ring-4 focus:outline-none text-slate-100 ring-1 ring-cyan-500 bg-slate-800 placeholder-slate-50/40"
      placeholder="Escribe una instrucción...">
    <button @click="sendInstruccion"
      class="rounded-lg uppercase hover:ring-cyan-400 active:bg-cyan-800 transition-all duration-150 hover:ring-4 font-bold absolute right-5 bottom-4 text-lg cursor-pointer bg-cyan-500 px-4 py-2 text-slate-50">
      Enviar Instrucciones
    </button>
    <p class="text-xl text-orange-600/90 text-shadow font-bold absolute mt-1 ml-2" v-if="instruccion && !isValidInput">
      Las instrucciones contienen caraceres no permitidos.
    </p>
  </div>
</template>
