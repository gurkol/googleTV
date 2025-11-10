// Vlak - Train Puzzle Game
// JavaScript implementation of the classic Czech game by Miroslav Němeček (1993)
// Collect wagons with your locomotive and create a train!

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Game constants
const GAME_WIDTH = 640;
const GAME_HEIGHT = 480;
const TILE_SIZE = 24;
const MOVE_DELAY = 150; // ms between moves

// Set canvas size
canvas.width = GAME_WIDTH;
canvas.height = GAME_HEIGHT;

// Colors
const COLORS = {
  background: '#000',
  wall: '#C44',
  floor: '#222',
  goal: '#484',
  locomotive: '#E66',
  wagonBlue: '#4AF',
  wagonGreen: '#4F4',
  wagonYellow: '#FF4',
  wagonRed: '#F44',
  text: '#FFF',
  trainWheel: '#333'
};

// Direction vectors
const DIRS = {
  UP: { dx: 0, dy: -1 },
  DOWN: { dx: 0, dy: 1 },
  LEFT: { dx: -1, dy: 0 },
  RIGHT: { dx: 1, dy: 0 }
};

// Game state
const game = {
  state: 'menu', // 'menu', 'playing', 'levelComplete', 'passwordEntry'
  currentLevel: 0,
  moves: 0,
  wagonsCollected: 0,
  totalWagons: 0,
  passwordInput: '',
  showPassword: false,
  lastMoveTime: 0
};

// Level state
let level = null;
let locomotive = { x: 0, y: 0, dir: 'RIGHT' };
let trainCars = []; // Array of {x, y, type} following the locomotive
let wagons = []; // Wagons to collect
let walls = [];
let goal = null; // Exit goal
let moveHistory = [];

// Input state
const keys = {
  up: false,
  down: false,
  left: false,
  right: false
};

// Initialize level
function initLevel(levelIndex) {
  const levelData = getLevel(levelIndex);
  if (!levelData) return false;

  level = levelData;
  game.currentLevel = levelIndex;
  game.moves = 0;
  game.wagonsCollected = 0;
  moveHistory = [];
  trainCars = [];

  // Parse level data
  wagons = [];
  walls = [];
  goal = null;

  for (let y = 0; y < level.data.length; y++) {
    const row = level.data[y];
    for (let x = 0; x < row.length; x++) {
      const char = row[x];

      switch (char) {
        case '@': // Locomotive (player)
          locomotive.x = x;
          locomotive.y = y;
          locomotive.dir = 'RIGHT';
          break;
        case '$': // Wagon (blue)
          wagons.push({ x, y, type: 'blue' });
          break;
        case 'B': // Wagon type 2 (green)
          wagons.push({ x, y, type: 'green' });
          break;
        case 'Y': // Wagon type 3 (yellow)
          wagons.push({ x, y, type: 'yellow' });
          break;
        case 'R': // Wagon type 4 (red)
          wagons.push({ x, y, type: 'red' });
          break;
        case '.': // Goal (exit)
          goal = { x, y };
          break;
        case '#': // Wall
          walls.push({ x, y });
          break;
      }
    }
  }

  game.totalWagons = wagons.length;
  game.state = 'playing';
  return true;
}

// Check if position is a wall
function isWall(x, y) {
  return walls.some(wall => wall.x === x && wall.y === y);
}

// Check if position has a wagon
function getWagonAt(x, y) {
  return wagons.find(wagon => wagon.x === x && wagon.y === y);
}

// Check if position is occupied by train
function isTrainAt(x, y) {
  if (locomotive.x === x && locomotive.y === y) return true;
  return trainCars.some(car => car.x === x && car.y === y);
}

// Check if level is complete (all wagons collected and at goal)
function isLevelComplete() {
  if (game.wagonsCollected < game.totalWagons) return false;
  return locomotive.x === goal.x && locomotive.y === goal.y;
}

// Move locomotive
function moveLocomotive(direction) {
  if (game.state !== 'playing') return;

  const now = Date.now();
  if (now - game.lastMoveTime < MOVE_DELAY) return;
  game.lastMoveTime = now;

  const dir = DIRS[direction];
  if (!dir) return;

  const newX = locomotive.x + dir.dx;
  const newY = locomotive.y + dir.dy;

  // Check bounds
  if (newX < 0 || newY < 0 || newX >= level.width || newY >= level.height) return;

  // Check wall
  if (isWall(newX, newY)) return;

  // Check if hitting own train
  if (isTrainAt(newX, newY)) return;

  // Save state for undo
  moveHistory.push({
    locomotiveX: locomotive.x,
    locomotiveY: locomotive.y,
    locomotiveDir: locomotive.dir,
    trainCars: JSON.parse(JSON.stringify(trainCars)),
    wagons: JSON.parse(JSON.stringify(wagons)),
    wagonsCollected: game.wagonsCollected
  });

  // Move train cars (each car moves to previous position)
  if (trainCars.length > 0) {
    for (let i = trainCars.length - 1; i > 0; i--) {
      trainCars[i].x = trainCars[i - 1].x;
      trainCars[i].y = trainCars[i - 1].y;
    }
    // First car moves to locomotive's old position
    trainCars[0].x = locomotive.x;
    trainCars[0].y = locomotive.y;
  }

  // Update locomotive direction
  locomotive.dir = direction;

  // Move locomotive
  locomotive.x = newX;
  locomotive.y = newY;
  game.moves++;

  // Check if collected a wagon
  const wagon = getWagonAt(newX, newY);
  if (wagon) {
    // Remove wagon from board
    wagons = wagons.filter(w => w !== wagon);

    // Add wagon to train
    trainCars.push({
      x: locomotive.x,
      y: locomotive.y,
      type: wagon.type
    });

    game.wagonsCollected++;
  }

  // Check if level is complete
  if (isLevelComplete()) {
    game.state = 'levelComplete';
  }
}

// Undo last move
function undoMove() {
  if (moveHistory.length === 0) return;

  const lastMove = moveHistory.pop();

  locomotive.x = lastMove.locomotiveX;
  locomotive.y = lastMove.locomotiveY;
  locomotive.dir = lastMove.locomotiveDir;
  trainCars = lastMove.trainCars;
  wagons = lastMove.wagons;
  game.wagonsCollected = lastMove.wagonsCollected;
  game.moves--;

  if (game.state === 'levelComplete') {
    game.state = 'playing';
  }
}

// Calculate level offset for centering
function getLevelOffset() {
  const levelPixelWidth = level.width * TILE_SIZE;
  const levelPixelHeight = level.height * TILE_SIZE;
  const offsetX = Math.max(0, (GAME_WIDTH - levelPixelWidth) / 2);
  const offsetY = Math.max(0, (GAME_HEIGHT - levelPixelHeight - 40) / 2) + 30;
  return { x: offsetX, y: offsetY };
}

// Draw tile at position
function drawTile(x, y, color, offsetX, offsetY) {
  const pixelX = offsetX + x * TILE_SIZE;
  const pixelY = offsetY + y * TILE_SIZE;

  ctx.fillStyle = color;
  ctx.fillRect(pixelX, pixelY, TILE_SIZE, TILE_SIZE);
}

// Draw game
function draw() {
  // Clear screen
  ctx.fillStyle = COLORS.background;
  ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  if (game.state === 'menu') {
    drawMenu();
  } else if (game.state === 'passwordEntry') {
    drawPasswordEntry();
  } else if (game.state === 'playing' || game.state === 'levelComplete') {
    drawLevel();
    drawHUD();
    if (game.state === 'levelComplete') {
      drawLevelComplete();
    }
  }
}

// Draw menu
function drawMenu() {
  ctx.fillStyle = '#FFD700';
  ctx.font = 'bold 48px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('VLAK', GAME_WIDTH / 2, 100);

  ctx.fillStyle = COLORS.text;
  ctx.font = '20px Arial';
  ctx.fillText('Train Collection Game', GAME_WIDTH / 2, 140);

  ctx.font = '16px Arial';
  ctx.fillText('Based on the classic game by Miroslav Němeček (1993)', GAME_WIDTH / 2, 170);

  // Draw mini locomotive
  drawMiniLocomotive(GAME_WIDTH / 2 - 40, 200);

  ctx.font = '20px Arial';
  ctx.fillStyle = '#FFD700';
  ctx.fillText('Drive your locomotive and collect all wagons!', GAME_WIDTH / 2, 280);
  ctx.fillText('Then return to the goal to complete the level.', GAME_WIDTH / 2, 310);

  ctx.font = '22px Arial';
  ctx.fillStyle = '#4F4';
  ctx.fillText('Press SPACE to start', GAME_WIDTH / 2, 360);
  ctx.fillText('Press P for password', GAME_WIDTH / 2, 395);

  ctx.font = '14px Arial';
  ctx.fillStyle = '#AAA';
  ctx.fillText('Controls: Arrow keys to move | U = Undo | R = Restart', GAME_WIDTH / 2, 440);
}

// Draw mini locomotive
function drawMiniLocomotive(x, y) {
  // Body
  ctx.fillStyle = COLORS.locomotive;
  ctx.fillRect(x, y, 80, 40);

  // Cabin
  ctx.fillStyle = '#F88';
  ctx.fillRect(x + 50, y - 10, 25, 15);

  // Window
  ctx.fillStyle = '#333';
  ctx.fillRect(x + 55, y - 7, 8, 10);
  ctx.fillRect(x + 65, y - 7, 8, 10);

  // Wheels
  ctx.fillStyle = COLORS.trainWheel;
  ctx.beginPath();
  ctx.arc(x + 15, y + 40, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x + 35, y + 40, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x + 60, y + 40, 6, 0, Math.PI * 2);
  ctx.fill();

  // Smokestack
  ctx.fillStyle = '#555';
  ctx.fillRect(x + 10, y - 8, 6, 8);

  // Smoke
  ctx.fillStyle = 'rgba(200, 200, 200, 0.5)';
  ctx.beginPath();
  ctx.arc(x + 13, y - 12, 4, 0, Math.PI * 2);
  ctx.fill();
}

// Draw password entry screen
function drawPasswordEntry() {
  ctx.fillStyle = '#FFD700';
  ctx.font = 'bold 36px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Enter Password', GAME_WIDTH / 2, 150);

  ctx.fillStyle = COLORS.text;
  ctx.font = '24px Arial';
  ctx.fillText('Level password (5 letters):', GAME_WIDTH / 2, 220);

  // Draw input box
  ctx.fillStyle = '#333';
  ctx.fillRect(GAME_WIDTH / 2 - 100, 250, 200, 50);
  ctx.strokeStyle = '#FFD700';
  ctx.lineWidth = 3;
  ctx.strokeRect(GAME_WIDTH / 2 - 100, 250, 200, 50);

  // Draw password
  ctx.fillStyle = '#FFD700';
  ctx.font = 'bold 32px monospace';
  ctx.fillText(game.passwordInput.toUpperCase(), GAME_WIDTH / 2, 285);

  ctx.font = '16px Arial';
  ctx.fillStyle = '#AAA';
  ctx.fillText('Type password and press ENTER', GAME_WIDTH / 2, 340);
  ctx.fillText('Press ESC to cancel', GAME_WIDTH / 2, 365);

  if (game.showPassword) {
    ctx.fillStyle = '#F44';
    ctx.font = '18px Arial';
    ctx.fillText('Invalid password!', GAME_WIDTH / 2, 400);
  }
}

// Draw level
function drawLevel() {
  if (!level) return;

  const offset = getLevelOffset();

  // Draw floor
  for (let y = 0; y < level.height; y++) {
    for (let x = 0; x < level.width; x++) {
      drawTile(x, y, COLORS.floor, offset.x, offset.y);
    }
  }

  // Draw goal
  if (goal) {
    const pixelX = offset.x + goal.x * TILE_SIZE;
    const pixelY = offset.y + goal.y * TILE_SIZE;

    ctx.fillStyle = COLORS.goal;
    ctx.fillRect(pixelX + 2, pixelY + 2, TILE_SIZE - 4, TILE_SIZE - 4);

    // Draw flag
    ctx.fillStyle = '#4F4';
    ctx.fillRect(pixelX + TILE_SIZE / 2, pixelY + 4, 2, TILE_SIZE - 8);
    ctx.fillStyle = '#FF4';
    ctx.beginPath();
    ctx.moveTo(pixelX + TILE_SIZE / 2, pixelY + 4);
    ctx.lineTo(pixelX + TILE_SIZE / 2 + 10, pixelY + 9);
    ctx.lineTo(pixelX + TILE_SIZE / 2, pixelY + 14);
    ctx.fill();
  }

  // Draw walls
  walls.forEach(wall => {
    const pixelX = offset.x + wall.x * TILE_SIZE;
    const pixelY = offset.y + wall.y * TILE_SIZE;

    ctx.fillStyle = COLORS.wall;
    ctx.fillRect(pixelX, pixelY, TILE_SIZE, TILE_SIZE);

    // 3D effect
    ctx.fillStyle = '#F66';
    ctx.fillRect(pixelX + 2, pixelY + 2, TILE_SIZE - 4, 3);
    ctx.fillStyle = '#822';
    ctx.fillRect(pixelX + 2, pixelY + TILE_SIZE - 5, TILE_SIZE - 4, 3);
  });

  // Draw wagons
  wagons.forEach(wagon => {
    const pixelX = offset.x + wagon.x * TILE_SIZE;
    const pixelY = offset.y + wagon.y * TILE_SIZE;

    let color = COLORS.wagonBlue;
    if (wagon.type === 'green') color = COLORS.wagonGreen;
    else if (wagon.type === 'yellow') color = COLORS.wagonYellow;
    else if (wagon.type === 'red') color = COLORS.wagonRed;

    // Wagon body
    ctx.fillStyle = color;
    ctx.fillRect(pixelX + 4, pixelY + 6, TILE_SIZE - 8, TILE_SIZE - 10);

    // Wheels
    ctx.fillStyle = COLORS.trainWheel;
    ctx.beginPath();
    ctx.arc(pixelX + 8, pixelY + TILE_SIZE - 3, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(pixelX + TILE_SIZE - 8, pixelY + TILE_SIZE - 3, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    ctx.strokeRect(pixelX + 4, pixelY + 6, TILE_SIZE - 8, TILE_SIZE - 10);
  });

  // Draw train cars
  trainCars.forEach(car => {
    const pixelX = offset.x + car.x * TILE_SIZE;
    const pixelY = offset.y + car.y * TILE_SIZE;

    let color = COLORS.wagonBlue;
    if (car.type === 'green') color = COLORS.wagonGreen;
    else if (car.type === 'yellow') color = COLORS.wagonYellow;
    else if (car.type === 'red') color = COLORS.wagonRed;

    // Wagon body
    ctx.fillStyle = color;
    ctx.fillRect(pixelX + 4, pixelY + 6, TILE_SIZE - 8, TILE_SIZE - 10);

    // Connection link
    ctx.fillStyle = '#666';
    ctx.fillRect(pixelX + TILE_SIZE / 2 - 1, pixelY + TILE_SIZE / 2 - 1, 2, 6);

    // Wheels
    ctx.fillStyle = COLORS.trainWheel;
    ctx.beginPath();
    ctx.arc(pixelX + 8, pixelY + TILE_SIZE - 3, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(pixelX + TILE_SIZE - 8, pixelY + TILE_SIZE - 3, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    ctx.strokeRect(pixelX + 4, pixelY + 6, TILE_SIZE - 8, TILE_SIZE - 10);
  });

  // Draw locomotive
  const pixelX = offset.x + locomotive.x * TILE_SIZE;
  const pixelY = offset.y + locomotive.y * TILE_SIZE;

  // Locomotive body
  ctx.fillStyle = COLORS.locomotive;
  ctx.fillRect(pixelX + 3, pixelY + 5, TILE_SIZE - 6, TILE_SIZE - 8);

  // Cabin
  ctx.fillStyle = '#F88';
  let cabinX = pixelX + 12;
  if (locomotive.dir === 'LEFT') cabinX = pixelX + 3;
  ctx.fillRect(cabinX, pixelY + 2, 8, 6);

  // Smokestack
  ctx.fillStyle = '#555';
  let stackX = pixelX + 6;
  if (locomotive.dir === 'LEFT') stackX = pixelX + 14;
  ctx.fillRect(stackX, pixelY, 3, 5);

  // Wheels
  ctx.fillStyle = COLORS.trainWheel;
  ctx.beginPath();
  ctx.arc(pixelX + 7, pixelY + TILE_SIZE - 2, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(pixelX + TILE_SIZE - 7, pixelY + TILE_SIZE - 2, 3, 0, Math.PI * 2);
  ctx.fill();
}

// Draw HUD
function drawHUD() {
  ctx.fillStyle = COLORS.text;
  ctx.font = '16px Arial';
  ctx.textAlign = 'left';

  // Level info
  ctx.fillText(`Level: ${game.currentLevel + 1}/${getTotalLevels()}`, 10, 20);
  ctx.fillText(`Password: ${level.password}`, 150, 20);

  // Stats
  ctx.fillText(`Moves: ${game.moves}`, 10, GAME_HEIGHT - 10);
  ctx.fillText(`Wagons: ${game.wagonsCollected}/${game.totalWagons}`, 120, GAME_HEIGHT - 10);

  // Train length indicator
  if (trainCars.length > 0) {
    ctx.fillText(`Train: ${trainCars.length + 1} cars`, 280, GAME_HEIGHT - 10);
  }

  // Controls hint
  ctx.textAlign = 'right';
  ctx.font = '12px Arial';
  ctx.fillStyle = '#AAA';
  ctx.fillText('U=Undo R=Restart P=Password', GAME_WIDTH - 10, GAME_HEIGHT - 10);
}

// Draw level complete
function drawLevelComplete() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  ctx.fillStyle = '#FFD700';
  ctx.font = 'bold 48px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Level Complete!', GAME_WIDTH / 2, GAME_HEIGHT / 2 - 60);

  ctx.fillStyle = COLORS.text;
  ctx.font = '24px Arial';
  ctx.fillText(`Moves: ${game.moves}`, GAME_WIDTH / 2, GAME_HEIGHT / 2 - 10);
  ctx.fillText(`Train length: ${trainCars.length + 1} cars`, GAME_WIDTH / 2, GAME_HEIGHT / 2 + 20);

  ctx.font = '20px Arial';
  ctx.fillStyle = '#FFD700';
  if (game.currentLevel < getTotalLevels() - 1) {
    ctx.fillText('Press SPACE for next level', GAME_WIDTH / 2, GAME_HEIGHT / 2 + 60);
  } else {
    ctx.fillText('Congratulations! All levels completed!', GAME_WIDTH / 2, GAME_HEIGHT / 2 + 60);
  }
  ctx.fillText('Press R to restart', GAME_WIDTH / 2, GAME_HEIGHT / 2 + 90);
}

// Game loop
function gameLoop() {
  draw();
  requestAnimationFrame(gameLoop);
}

// Input handling
document.addEventListener('keydown', (e) => {
  if (game.state === 'menu') {
    if (e.key === ' ') {
      initLevel(0);
      e.preventDefault();
    } else if (e.key.toLowerCase() === 'p') {
      game.state = 'passwordEntry';
      game.passwordInput = '';
      game.showPassword = false;
      e.preventDefault();
    }
  } else if (game.state === 'passwordEntry') {
    if (e.key === 'Escape') {
      game.state = 'menu';
      e.preventDefault();
    } else if (e.key === 'Enter') {
      const result = getLevelByPassword(game.passwordInput);
      if (result) {
        initLevel(result.index);
      } else {
        game.showPassword = true;
        setTimeout(() => { game.showPassword = false; }, 2000);
      }
      e.preventDefault();
    } else if (e.key === 'Backspace') {
      game.passwordInput = game.passwordInput.slice(0, -1);
      e.preventDefault();
    } else if (e.key.length === 1 && game.passwordInput.length < 5) {
      game.passwordInput += e.key;
      e.preventDefault();
    }
  } else if (game.state === 'playing') {
    switch(e.key) {
      case 'ArrowUp':
        moveLocomotive('UP');
        e.preventDefault();
        break;
      case 'ArrowDown':
        moveLocomotive('DOWN');
        e.preventDefault();
        break;
      case 'ArrowLeft':
        moveLocomotive('LEFT');
        e.preventDefault();
        break;
      case 'ArrowRight':
        moveLocomotive('RIGHT');
        e.preventDefault();
        break;
      case 'u':
      case 'U':
        undoMove();
        e.preventDefault();
        break;
      case 'r':
      case 'R':
        initLevel(game.currentLevel);
        e.preventDefault();
        break;
      case 'p':
      case 'P':
        game.state = 'passwordEntry';
        game.passwordInput = '';
        game.showPassword = false;
        e.preventDefault();
        break;
    }
  } else if (game.state === 'levelComplete') {
    if (e.key === ' ') {
      if (game.currentLevel < getTotalLevels() - 1) {
        initLevel(game.currentLevel + 1);
      }
      e.preventDefault();
    } else if (e.key.toLowerCase() === 'r') {
      initLevel(game.currentLevel);
      e.preventDefault();
    }
  }
});

// Start game
gameLoop();
