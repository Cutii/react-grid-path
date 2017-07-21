const grid = {};

export function get() {
  return grid;
}

export function update({ x, y, type, previousType }) {
  if (previousType === 'OBSTACLE') {
    grid.obstacles = grid.obstacles.filter(obstacle => obstacle.x !== x || obstacle.y !== y);
    grid.onUpdate('obstacles', grid.obstacles);
  }
  switch (type) {
    case 'START':
      grid.start = { x, y };
      grid.onUpdate('start', grid.start);
      break;
    case 'TARGET':
      grid.end = { x, y };
      grid.onUpdate('end', grid.end);
      break;
    case 'OBSTACLE':
      grid.obstacles = grid.obstacles.concat([{ x, y }]);
      grid.onUpdate('obstacles', grid.obstacles);
      break;
    default:
      break;
  }
}

export function init({ start, end, obstacles, onGridUpdate }) {
  grid.start = { ...start };
  grid.end = { ...end };
  grid.obstacles = [...obstacles];
  grid.onUpdate = onGridUpdate;
}
