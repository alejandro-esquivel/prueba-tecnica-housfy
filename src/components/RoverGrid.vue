<script setup>
import { computed, ref, watch } from 'vue'
import { generarPosicionesObstaculos, generarPlaneta, validarCaracteres } from '@/helpers/helpers';
import RoverIcon from '../icons/RoverIcon.vue';
import ObstacleIcon from '../icons/ObstacleIcon.vue';
import Swal from 'sweetalert2'



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
    default: () => ({ x: 2, y: 3, direction: 'N' }) // Direction sólo puede ser N, S, E o W,
  },
  orders: {
    type: String,
    required: false,
    validator: (value) => {
      // Si la órden contiene carácteres que no estén en el array, fallará la validación de props y se mostrará un mensaje de alerta.

      if (!value) return true;
      const caracteres = ['F', 'L', 'R'];
      return validarCaracteres(value, caracteres);
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
  const caracteres = ['N', 'S', 'E', 'W'];

  return caracteres.includes(pos.toUpperCase());
}

// Creamos un mapa del planeta a partir del tamaño proporcionado en los props
const planetMap = generarPlaneta(props.size);

const roverPosition = {
  ...props.startingPosition,
  direction: ('direction' in props.startingPosition && checkPosition(props.startingPosition.direction)) ? props.startingPosition.direction : 'N'
};

// Generamos los obstáculos
const posicionObstaculos = ref([]);

posicionObstaculos.value = generarPosicionesObstaculos(NUM_OBSTACULOS, props.size, roverPosition);

const posicionActual = ref(roverPosition);
const obstaculoEncontrado = ref(false);

// Definimos las direcciones de movimiento en función de la rotación del rover
const DIRECCIONES = {
  N: { x: 0, y: -1, left: 'W', right: 'E' },
  S: { x: 0, y: 1, left: 'E', right: 'W' },
  E: { x: 1, y: 0, left: 'N', right: 'S' },
  W: { x: -1, y: 0, left: 'S', right: 'N' }
}

const moverse = () => {
  const direccion = DIRECCIONES[posicionActual.value.direction];
  let nuevoX = posicionActual.value.x + direccion.x;
  let nuevoY = posicionActual.value.y + direccion.y;

  // Si nos pasamos del borde, volvemos al inicio
  nuevoX = ((nuevoX % props.size.w) + props.size.w) % props.size.w;
  nuevoY = ((nuevoY % props.size.h) + props.size.h) % props.size.h;

  // Detección de obstáculos
  const tieneObstaculo = posicionObstaculos.value.some((obs) => {
    return obs.x === nuevoX && obs.y === nuevoY;
  });

  // Si existe un obstáculo en la siguiente celda, el rover parará y no podrá seguir en esa dirección.
  if (tieneObstaculo) {
    obstaculoEncontrado.value = true;
    return false;
  }

  // Actualizamos la posición si no hay obstáculos
  posicionActual.value.x = nuevoX;
  posicionActual.value.y = nuevoY;

  return true;
};

const rotar = (direccion) => {
  const direccionActual = posicionActual.value.direction;
  posicionActual.value.direction = DIRECCIONES[direccionActual][direccion];
};

// Ejecutamos las órdenes.
const ejecutarOrdenes = (ordenes) => {
  if (!ordenes || typeof ordenes !== 'string') {
    return;
  }

  obstaculoEncontrado.value = false;
  const ordenesArr = ordenes.toUpperCase().split('');

  for (const orden of ordenesArr) {
    if (obstaculoEncontrado.value) {
      break;
    }

    switch (orden) {
      case 'F':
        moverse();
        break;
      case 'L':
        rotar('left');
        break;
      case 'R':
        rotar('right');
        break;
    }
  }

  return !obstaculoEncontrado.value;
};

watch(
  () => props.orders,
  (nuevasOrdenes, ordenesAnteriores) => {
    if (nuevasOrdenes) {
      const exito = ejecutarOrdenes(nuevasOrdenes);

      if (!exito) {
        const direccionObs = DIRECCIONES[posicionActual.value.direction];

        const obsX = posicionActual.value.x + + direccionObs.x;
        const obsY = posicionActual.value.y + + direccionObs.y;
        Swal.fire({
          icon: 'warning',
          title: 'Obstáculo encontrado',
          text: `Se ha detectado un obstáculo en la posición [${obsX}, ${obsY}]. No se puede continuar en esa dirección.`
        })
      }
    }
  },
  { immediate: true }
);

</script>

<template>
  <div>
    <table class="min-w-10/12 mx-auto table-auto border-collapse text-sm rounded-lg bg-white outline outline-white/5">
      <tr v-for="col, i in planetMap" :key="i" class="table-row">
        <td v-for="row, j in planetMap[i]" :key="j" class="w-10 h-24 text-center border-2 border-slate-600"
          :id="`map-x${i}-y${j}`">
          <RoverIcon v-if="posicionActual.y == i && posicionActual.x == j" :direccion="posicionActual.direction" />
          <span v-for="obs, o in posicionObstaculos" :key="o">
            <ObstacleIcon v-if="obs.y == i && obs.x == j" />
          </span>
        </td>
      </tr>
    </table>
  </div>
</template>
