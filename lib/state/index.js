const grid = {};

export function get() {
  return grid;
}

export function update({ x, y, type, previousType }) {
  if (previousType === 'OBSTACLE') {
    grid.obstacles = grid.obstacles.filter(obstacle => obstacle.x !== x || obstacle.y !== y);
  }
  switch (type) {
    case 'START':
      grid.start = { x, y };
      break;
    case 'TARGET':
      grid.end = { x, y };
      break;
    case 'OBSTACLE':
      grid.obstacles.push({ x, y });
      break;
    default:
      break;
  }
  grid.onUpdate({ ...grid });
}

export function init({ start, end, obstacles, onGridUpdate }) {
  grid.start = { ...start };
  grid.end = { ...end };
  grid.obstacles = [...obstacles];
  grid.onUpdate = onGridUpdate;
}
