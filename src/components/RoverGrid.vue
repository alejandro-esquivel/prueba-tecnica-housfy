<script setup>
import { computed, ref } from 'vue'
import { generarPosicionesObstaculos, generarPlaneta } from '@/helpers/helpers';
import RoverIcon from '../icons/RoverIcon.vue';
import ObstacleIcon from '../icons/ObstacleIcon.vue';
import Swal from 'sweetalert2';



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
    default: () => ({ x: 2, y: 3, direction: 'E' }) // Direction sólo puede ser N, S, E o W,
  },
  orders: {
    type: String,
    required: false,
    validator: (value) => {
      // Si la órden contiene carácteres que no estén en el array, fallará la validación de props
      const caracteres = ['F', 'L', 'R'];

      for (let caracter of value.toUpperCase()) {
        if (!caracteres.includes(caracter)) {
          Swal.fire({
            icon: "error",
            title: "Orden inválida...",
            text: "Se ha introducido un carácter erróneo en la orden!",
          })
        }
      }
    }
  },
  numObstaculos: {
    type: Number,
    required: false,
    default: 3,
    validator: (value) => {
      if (isNaN(value)) {
        return 0;
      }

      return value;
    }
  }
});

const NUM_OBSTACULOS = props.numObstaculos;

function checkPosition(pos) {
  const caracteres = ['N', 'S', 'W', 'W'];

  return caracteres.includes(pos.toUpperCase());
}

// Creamos un mapa del planeta a partir del tamaño proporcionado en los props
const planetMap = generarPlaneta(props.size);

const roverPosition = {
  ...props.startingPosition,
  direction: ('direction' in props.startingPosition && checkPosition(props.startingPosition.direction)) ? props.startingPosition.direction : 'N'
};

// Generamos los obstáculos
const posicionObstaculos = ref({ x: 0, y: 0 });

posicionObstaculos.value = generarPosicionesObstaculos(NUM_OBSTACULOS, props.size, roverPosition);

console.log(roverPosition, posicionObstaculos.value);

</script>

<template>
  <div>
    <table class="min-w-10/12 mx-auto table-auto border-collapse text-sm rounded-lg bg-white outline outline-white/5">
      <tr v-for="col, i in planetMap" :key="i" class="table-row">
        <td v-for="row, j in planetMap[i]" :key="j" class="w-10 h-24 text-center border-2 border-slate-600"
          :id="`map-x${i}-y${j}`">
          <RoverIcon v-if="roverPosition.y == i && roverPosition.x == j" />
          <span v-for="obs, o in posicionObstaculos" :key="o">
            <ObstacleIcon v-if="obs.y == i && obs.x == j" />
          </span>
        </td>
      </tr>
    </table>
  </div>
</template>
