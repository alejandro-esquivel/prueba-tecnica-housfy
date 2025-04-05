<script setup>
import { computed } from 'vue'
import RoverIcon from '../icons/RoverIcon.vue';

// Se definen valores por defecto para el tamaño del mapa y la posición inicial del rover, que también podrán ser pasados al componente como props
const props = defineProps({
  size: {
    type: Object,
    required: false,
    default: () => ({ w: 5, h: 7 })
  },
  startingPosition: {
    type: Object,
    required: false,
    default: () => ({ x: 2, y: 3, direction: 'N' })
  },
});

// Creamos un mapa del planeta a partir del tamaño proporcionado en los props
const planetMap = computed(() => {
  const arr = Array.from({ length: props.size.h }, () => Array.from({ length: props.size.l }));

  arr.forEach((_, i) => {
    arr[i] = Array.from({ length: props.size.w });
  });

  return arr;
});

const roverPosition = { ...props.startingPosition };

</script>

<template>
  <div>
    <table class="min-w-10/12 mx-auto table-auto border-collapse text-sm rounded-lg bg-white outline outline-white/5">
      <tr v-for="col, i in planetMap" :key="i" class="table-row">
        <td v-for="row, j in planetMap[i]" :key="j" class="w-10 h-24 text-center border-2 border-slate-600"
          :id="`map-x${i}-y${j}`">
          <RoverIcon v-if="roverPosition.y == i && roverPosition.x == j" />
        </td>
      </tr>
    </table>
  </div>
</template>
