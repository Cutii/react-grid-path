import pathFinding from 'pathfinding';

// Example of pathfinding
export default request => {
  const GRID_WIDTH = (request.grid || {}).width || 50;
  const GRID_HEIGHT = (request.grid || {}).height || 50;
  // Start point
  const start = request.start || {
    x : 0,
    y : 0,
  };
  // Target point
  const end = request.end || {
    x : 30,
    y : 17,
  };
  // Obstacles indexed by row then column
  const obstacles = (request.obstacles || []).reduce((map, item) => {
    const x = parseFloat(item.x);
    const y = parseFloat(item.y);
    map[y][x] = true;
    return map;
  }, new Array(GRID_HEIGHT).fill().map(() => new Array(GRID_WIDTH).fill(false)));
  // Generate path
  return getPath({
    grid : getGrid({ width : GRID_WIDTH, height : GRID_HEIGHT, obstacles }),
    startPoint : start,
    endPoint : end,
  });
};

// Get optimal path
function getPath({ grid, startPoint, endPoint }) {
  // Path finder
  const finder = new pathFinding.AStarFinder({
    diagonalMovement : pathFinding.DiagonalMovement.Never,
    weight : 2,
  });
  // Setup grid
  const pfGrid = new pathFinding.Grid(grid);
  // Path finding
  const pfPath = finder.findPath(startPoint.x, startPoint.y, endPoint.x, endPoint.y, pfGrid);
  // Smooth path
  return pathFinding.Util.compressPath(pfPath);
}

// Generate grid with obstacles
function getGrid({ width, height, obstacles }) {
  const grid = [];
  for (let y = 0; y < height; y++) {
    const row = [];
    const rowObstacles = obstacles[y] || [];
    for (let x = 0; x < width; x++) {
      row.push(rowObstacles[x] ? 1 : 0);
    }
    grid.push(row);
  }
  return grid;
}
