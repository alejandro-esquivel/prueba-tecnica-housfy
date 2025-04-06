export const generarPlaneta = (mapa) => {
  const planeta = Array.from({ length: mapa.h }, () => Array.from({ length: mapa.w }));

  return planeta
}

export const generarPosicionesObstaculos = (numObstaculos, mapa, roverPosition) => {
  const obstaculos = [];

  for (let i = 0; i < numObstaculos; i++) {
    let x, y;
    let posicionValida;

    do {
      x = Math.floor(Math.random() * mapa.w);
      y = Math.floor(Math.random() * mapa.h);

      // Verificamos que el nuevo obstáculo generado no coincida con el rover o con otro obstáculo
      posicionValida = !(roverPosition.x === x && roverPosition.y === y) && !obstaculos.some(obs => obs.x === x && obs.y === y);

    } while (!posicionValida);

    obstaculos.push({ x, y })
  }

  return obstaculos;
}
