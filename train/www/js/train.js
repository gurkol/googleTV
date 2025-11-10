// Vlak - Train Puzzle Game
// JavaScript implementation of the classic Czech game by Miroslav Němeček (1993)
// Collect wagons with your locomotive!

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Game constants
const GAME_WIDTH = 640;
const GAME_HEIGHT = 480;
const TILE_SIZE = 24;

// Set canvas size
canvas.width = GAME_WIDTH;
canvas.height = GAME_HEIGHT;

// Colors
const COLORS = {
  background: '#000',
  wall: '#C44',
  floor: '#333',
  goal: '#484',
  player: '#FFD700',
  boxBlue: '#4AF',
  boxGreen: '#4F4',
  boxYellow: '#FF4',
  boxRed: '#F44',
  text: '#FFF',
  trainBg: '#C44',
  trainBody: '#E66',
  trainWheel: '#333'
};

// Game state
const game = {
  state: 'menu', // 'menu', 'playing', 'levelComplete', 'passwordEntry'
  currentLevel: 0,
  moves: 0,
  pushes: 0,
  passwordInput: '',
  showPassword: false
};

// Level state
let level = null;
let player = { x: 0, y: 0 };
let boxes = [];
let goals = [];
let walls = [];
let moveHistory = [];

// Input state
const keys = {
  up: false,
  down: false,
  left: false,
  right: false,
  undo: false,
  restart: false,
  password: false
};

// Initialize level
function initLevel(levelIndex) {
  const levelData = getLevel(levelIndex);
  if (!levelData) return false;

  level = levelData;
  game.currentLevel = levelIndex;
  game.moves = 0;
  game.pushes = 0;
  moveHistory = [];

  // Parse level data
  boxes = [];
  goals = [];
  walls = [];

  for (let y = 0; y < level.data.length; y++) {
    const row = level.data[y];
    for (let x = 0; x < row.length; x++) {
      const char = row[x];

      switch (char) {
        case '@': // Player
          player.x = x;
          player.y = y;
          break;
        case '+': // Player on goal
          player.x = x;
          player.y = y;
          goals.push({ x, y });
          break;
        case '$': // Box (blue)
          boxes.push({ x, y, type: 'blue', onGoal: false });
          break;
        case 'B': // Box type 2 (green)
          boxes.push({ x, y, type: 'green', onGoal: false });
          break;
        case 'Y': // Box type 3 (yellow)
          boxes.push({ x, y, type: 'yellow', onGoal: false });
          break;
        case 'R': // Box type 4 (red)
          boxes.push({ x, y, type: 'red', onGoal: false });
          break;
        case '*': // Box on goal
          boxes.push({ x, y, type: 'blue', onGoal: true });
          goals.push({ x, y });
          break;
        case '.': // Goal
          goals.push({ x, y });
          break;
        case '#': // Wall
          walls.push({ x, y });
          break;
      }
    }
  }

  // Update box onGoal status
  updateBoxGoalStatus();

  game.state = 'playing';
  return true;
}

// Update which boxes are on goals
function updateBoxGoalStatus() {
  boxes.forEach(box => {
    box.onGoal = goals.some(goal => goal.x === box.x && goal.y === box.y);
  });
}

// Check if position is a wall
function isWall(x, y) {
  return walls.some(wall => wall.x === x && wall.y === y);
}

// Get box at position
function getBoxAt(x, y) {
  return boxes.find(box => box.x === x && box.y === y);
}

// Check if all boxes are on goals
function isLevelComplete() {
  return boxes.every(box => box.onGoal);
}

// Move player
function movePlayer(dx, dy) {
  if (game.state !== 'playing') return;

  const newX = player.x + dx;
  const newY = player.y + dy;

  // Check bounds
  if (newX < 0 || newY < 0 || newX >= level.width || newY >= level.height) return;

  // Check wall
  if (isWall(newX, newY)) return;

  // Check box
  const box = getBoxAt(newX, newY);
  if (box) {
    // Try to push box
    const boxNewX = newX + dx;
    const boxNewY = newY + dy;

    // Check if box can be pushed
    if (boxNewX < 0 || boxNewY < 0 || boxNewX >= level.width || boxNewY >= level.height) return;
    if (isWall(boxNewX, boxNewY)) return;
    if (getBoxAt(boxNewX, boxNewY)) return; // Another box

    // Save state for undo
    moveHistory.push({
      playerX: player.x,
      playerY: player.y,
      boxX: box.x,
      boxY: box.y,
      boxIndex: boxes.indexOf(box),
      isPush: true
    });

    // Push box
    box.x = boxNewX;
    box.y = boxNewY;
    game.pushes++;
  } else {
    // Save state for undo (just player movement)
    moveHistory.push({
      playerX: player.x,
      playerY: player.y,
      isPush: false
    });
  }

  // Move player
  player.x = newX;
  player.y = newY;
  game.moves++;

  // Update box goal status
  updateBoxGoalStatus();

  // Check if level is complete
  if (isLevelComplete()) {
    game.state = 'levelComplete';
  }
}

// Undo last move
function undoMove() {
  if (moveHistory.length === 0) return;

  const lastMove = moveHistory.pop();

  // Restore player position
  player.x = lastMove.playerX;
  player.y = lastMove.playerY;

  // Restore box if it was pushed
  if (lastMove.isPush) {
    const box = boxes[lastMove.boxIndex];
    box.x = lastMove.boxX;
    box.y = lastMove.boxY;
    game.pushes--;
  }

  game.moves--;
  updateBoxGoalStatus();

  if (game.state === 'levelComplete') {
    game.state = 'playing';
  }
}

// Calculate level offset for centering
function getLevelOffset() {
  const levelPixelWidth = level.width * TILE_SIZE;
  const levelPixelHeight = level.height * TILE_SIZE;
  const offsetX = Math.max(0, (GAME_WIDTH - levelPixelWidth) / 2);
  const offsetY = Math.max(0, (canvas.height - levelPixelHeight - 60) / 2) + 30;
  return { x: offsetX, y: offsetY };
}

// Draw tile at position
function drawTile(x, y, color, offsetX, offsetY) {
  const pixelX = offsetX + x * TILE_SIZE;
  const pixelY = offsetY + y * TILE_SIZE;

  ctx.fillStyle = color;
  ctx.fillRect(pixelX, pixelY, TILE_SIZE, TILE_SIZE);
  ctx.strokeStyle = '#222';
  ctx.strokeRect(pixelX, pixelY, TILE_SIZE, TILE_SIZE);
}

// Draw game
function draw() {
  // Clear screen
  ctx.fillStyle = COLORS.background;
  ctx.fillRect(0, 0, GAME_WIDTH, canvas.height);

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
  ctx.fillText('VLAK', GAME_WIDTH / 2, 120);

  ctx.fillStyle = COLORS.text;
  ctx.font = '24px Arial';
  ctx.fillText('Train Puzzle Game', GAME_WIDTH / 2, 160);

  ctx.font = '16px Arial';
  ctx.fillText('Based on the classic game by Miroslav Němeček (1993)', GAME_WIDTH / 2, 190);

  // Draw train
  drawTrain(GAME_WIDTH / 2 - 60, 220);

  ctx.font = '20px Arial';
  ctx.fillStyle = '#FFD700';
  ctx.fillText('Press SPACE to start', GAME_WIDTH / 2, 320);
  ctx.fillText('Press P for password', GAME_WIDTH / 2, 360);

  ctx.font = '16px Arial';
  ctx.fillStyle = '#AAA';
  ctx.fillText('Controls: Arrow keys to move', GAME_WIDTH / 2, 400);
  ctx.fillText('U = Undo, R = Restart, P = Password', GAME_WIDTH / 2, 420);
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

  // Draw goals
  ctx.fillStyle = COLORS.goal;
  goals.forEach(goal => {
    const pixelX = offset.x + goal.x * TILE_SIZE;
    const pixelY = offset.y + goal.y * TILE_SIZE;
    ctx.fillRect(pixelX + 4, pixelY + 4, TILE_SIZE - 8, TILE_SIZE - 8);
  });

  // Draw walls
  walls.forEach(wall => {
    drawTile(wall.x, wall.y, COLORS.wall, offset.x, offset.y);
    // Add 3D effect
    const pixelX = offset.x + wall.x * TILE_SIZE;
    const pixelY = offset.y + wall.y * TILE_SIZE;
    ctx.fillStyle = '#F66';
    ctx.fillRect(pixelX + 2, pixelY + 2, TILE_SIZE - 4, 4);
    ctx.fillStyle = '#822';
    ctx.fillRect(pixelX + 2, pixelY + TILE_SIZE - 6, TILE_SIZE - 4, 4);
  });

  // Draw boxes
  boxes.forEach(box => {
    const pixelX = offset.x + box.x * TILE_SIZE;
    const pixelY = offset.y + box.y * TILE_SIZE;

    let color = COLORS.boxBlue;
    if (box.type === 'green') color = COLORS.boxGreen;
    else if (box.type === 'yellow') color = COLORS.boxYellow;
    else if (box.type === 'red') color = COLORS.boxRed;

    // Box body
    ctx.fillStyle = color;
    ctx.fillRect(pixelX + 3, pixelY + 3, TILE_SIZE - 6, TILE_SIZE - 6);

    // Box highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fillRect(pixelX + 5, pixelY + 5, TILE_SIZE - 14, TILE_SIZE - 14);

    // Box shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(pixelX + 15, pixelY + 15, TILE_SIZE - 17, TILE_SIZE - 17);

    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.strokeRect(pixelX + 3, pixelY + 3, TILE_SIZE - 6, TILE_SIZE - 6);
  });

  // Draw player (Golem)
  const pixelX = offset.x + player.x * TILE_SIZE;
  const pixelY = offset.y + player.y * TILE_SIZE;

  // Body
  ctx.fillStyle = COLORS.player;
  ctx.fillRect(pixelX + 6, pixelY + 8, TILE_SIZE - 12, TILE_SIZE - 10);

  // Head
  ctx.beginPath();
  ctx.arc(pixelX + TILE_SIZE / 2, pixelY + 8, 6, 0, Math.PI * 2);
  ctx.fill();

  // Eyes
  ctx.fillStyle = '#000';
  ctx.fillRect(pixelX + 9, pixelY + 6, 2, 2);
  ctx.fillRect(pixelX + 13, pixelY + 6, 2, 2);

  // Arms
  ctx.fillStyle = COLORS.player;
  ctx.fillRect(pixelX + 4, pixelY + 12, 3, 6);
  ctx.fillRect(pixelX + TILE_SIZE - 7, pixelY + 12, 3, 6);
}

// Draw train at bottom
function drawTrain(x, y) {
  // Locomotive body
  ctx.fillStyle = COLORS.trainBody;
  ctx.fillRect(x, y, 120, 30);

  // Cabin
  ctx.fillStyle = '#F88';
  ctx.fillRect(x + 70, y - 15, 40, 15);

  // Window
  ctx.fillStyle = '#333';
  ctx.fillRect(x + 75, y - 12, 12, 10);
  ctx.fillRect(x + 92, y - 12, 12, 10);

  // Wheels
  ctx.fillStyle = COLORS.trainWheel;
  ctx.beginPath();
  ctx.arc(x + 20, y + 30, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x + 45, y + 30, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x + 85, y + 30, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x + 105, y + 30, 8, 0, Math.PI * 2);
  ctx.fill();

  // Smokestack
  ctx.fillStyle = '#555';
  ctx.fillRect(x + 15, y - 10, 8, 10);

  // Smoke
  ctx.fillStyle = 'rgba(200, 200, 200, 0.5)';
  ctx.beginPath();
  ctx.arc(x + 19, y - 15, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x + 15, y - 22, 6, 0, Math.PI * 2);
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
  ctx.fillText(`Moves: ${game.moves}`, 10, canvas.height - 10);
  ctx.fillText(`Pushes: ${game.pushes}`, 120, canvas.height - 10);

  // Controls hint
  ctx.textAlign = 'right';
  ctx.font = '12px Arial';
  ctx.fillStyle = '#AAA';
  ctx.fillText('U=Undo R=Restart P=Password', GAME_WIDTH - 10, canvas.height - 10);
}

// Draw level complete
function drawLevelComplete() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(0, 0, GAME_WIDTH, canvas.height);

  ctx.fillStyle = '#FFD700';
  ctx.font = 'bold 48px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Level Complete!', GAME_WIDTH / 2, canvas.height / 2 - 50);

  ctx.fillStyle = COLORS.text;
  ctx.font = '24px Arial';
  ctx.fillText(`Moves: ${game.moves}  Pushes: ${game.pushes}`, GAME_WIDTH / 2, canvas.height / 2);

  ctx.font = '20px Arial';
  ctx.fillStyle = '#FFD700';
  if (game.currentLevel < getTotalLevels() - 1) {
    ctx.fillText('Press SPACE for next level', GAME_WIDTH / 2, canvas.height / 2 + 50);
  } else {
    ctx.fillText('Congratulations! All levels completed!', GAME_WIDTH / 2, canvas.height / 2 + 50);
  }
  ctx.fillText('Press R to restart', GAME_WIDTH / 2, canvas.height / 2 + 80);
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
        movePlayer(0, -1);
        e.preventDefault();
        break;
      case 'ArrowDown':
        movePlayer(0, 1);
        e.preventDefault();
        break;
      case 'ArrowLeft':
        movePlayer(-1, 0);
        e.preventDefault();
        break;
      case 'ArrowRight':
        movePlayer(1, 0);
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
