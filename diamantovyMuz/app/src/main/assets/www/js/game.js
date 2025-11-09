// Diamantový Muž - Boulder Dash Clone
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Constants
const TILE_SIZE = 32;
const GRID_WIDTH = 20;
const GRID_HEIGHT = 20;

// Audio Context for sound effects
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContext();

// Sound effects
const sounds = {
    dig: () => {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.connect(gain);
        gain.connect(audioContext.destination);
        osc.frequency.setValueAtTime(200, audioContext.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.05);
        gain.gain.setValueAtTime(0.2, audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
        osc.start(audioContext.currentTime);
        osc.stop(audioContext.currentTime + 0.05);
    },

    diamond: () => {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.connect(gain);
        gain.connect(audioContext.destination);
        osc.frequency.setValueAtTime(800, audioContext.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.1);
        gain.gain.setValueAtTime(0.3, audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        osc.start(audioContext.currentTime);
        osc.stop(audioContext.currentTime + 0.1);
    },

    death: () => {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.connect(gain);
        gain.connect(audioContext.destination);
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(400, audioContext.currentTime);
        osc.frequency.exponentialRampToValueAtTime(50, audioContext.currentTime + 0.5);
        gain.gain.setValueAtTime(0.4, audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        osc.start(audioContext.currentTime);
        osc.stop(audioContext.currentTime + 0.5);
    },

    exit: () => {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.connect(gain);
        gain.connect(audioContext.destination);
        osc.frequency.setValueAtTime(400, audioContext.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1600, audioContext.currentTime + 0.3);
        gain.gain.setValueAtTime(0.3, audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        osc.start(audioContext.currentTime);
        osc.stop(audioContext.currentTime + 0.3);
    },

    rockFall: () => {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.connect(gain);
        gain.connect(audioContext.destination);
        osc.type = 'square';
        osc.frequency.setValueAtTime(100, audioContext.currentTime);
        gain.gain.setValueAtTime(0.15, audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        osc.start(audioContext.currentTime);
        osc.stop(audioContext.currentTime + 0.1);
    }
};

// Tile types
const TILES = {
    EMPTY: 0,
    DIRT: 1,
    WALL: 2,
    ROCK: 3,
    DIAMOND: 4,
    PLAYER: 5,
    EXIT_CLOSED: 6,
    EXIT_OPEN: 7
};

// Colors for tiles
const COLORS = {
    [TILES.EMPTY]: '#000000',
    [TILES.DIRT]: '#8B4513',
    [TILES.WALL]: '#808080',
    [TILES.ROCK]: '#696969',
    [TILES.DIAMOND]: '#00CED1',
    [TILES.PLAYER]: '#FFD700',
    [TILES.EXIT_CLOSED]: '#FF4500',
    [TILES.EXIT_OPEN]: '#00FF00'
};

// Game state
const game = {
    running: false,
    level: 1,
    score: 0,
    lives: 3,
    diamonds: 0,
    diamondsNeeded: 10,
    frame: 0,
    playerX: 1,
    playerY: 1,
    playerAlive: true,
    exitOpen: false
};

// Grid
let grid = [];
let nextGrid = [];

// Movement and update tracking
let fallingRocks = new Set();

// Keyboard state
const keys = {};

// Initialize grid
function initGrid() {
    grid = [];
    nextGrid = [];

    for (let y = 0; y < GRID_HEIGHT; y++) {
        grid[y] = [];
        nextGrid[y] = [];
        for (let x = 0; x < GRID_WIDTH; x++) {
            grid[y][x] = TILES.EMPTY;
            nextGrid[y][x] = TILES.EMPTY;
        }
    }
}

// Generate level
function generateLevel() {
    initGrid();

    // Create walls around border
    for (let y = 0; y < GRID_HEIGHT; y++) {
        for (let x = 0; x < GRID_WIDTH; x++) {
            if (x === 0 || x === GRID_WIDTH - 1 || y === 0 || y === GRID_HEIGHT - 1) {
                grid[y][x] = TILES.WALL;
            }
        }
    }

    // Fill with dirt and randomly place rocks and diamonds
    for (let y = 1; y < GRID_HEIGHT - 1; y++) {
        for (let x = 1; x < GRID_WIDTH - 1; x++) {
            const rand = Math.random();
            if (rand < 0.6) {
                grid[y][x] = TILES.DIRT;
            } else if (rand < 0.75) {
                grid[y][x] = TILES.ROCK;
            } else if (rand < 0.85) {
                grid[y][x] = TILES.DIAMOND;
            }
        }
    }

    // Place player in top-left area
    game.playerX = 2;
    game.playerY = 2;
    clearArea(game.playerX, game.playerY, 2);
    grid[game.playerY][game.playerX] = TILES.PLAYER;

    // Place exit in bottom-right area
    const exitX = GRID_WIDTH - 3;
    const exitY = GRID_HEIGHT - 3;
    clearArea(exitX, exitY, 1);
    grid[exitY][exitX] = TILES.EXIT_CLOSED;

    // Reset game state
    game.diamonds = 0;
    game.diamondsNeeded = 10 + game.level * 2;
    game.exitOpen = false;
    game.playerAlive = true;
    fallingRocks.clear();
}

// Clear area around position
function clearArea(x, y, radius) {
    for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx > 0 && nx < GRID_WIDTH - 1 && ny > 0 && ny < GRID_HEIGHT - 1) {
                grid[ny][nx] = TILES.EMPTY;
            }
        }
    }
}

// Copy grid
function copyGrid() {
    for (let y = 0; y < GRID_HEIGHT; y++) {
        for (let x = 0; x < GRID_WIDTH; x++) {
            nextGrid[y][x] = grid[y][x];
        }
    }
}

// Draw tile
function drawTile(x, y, type) {
    const px = x * TILE_SIZE;
    const py = y * TILE_SIZE;

    ctx.fillStyle = COLORS[type];
    ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);

    // Add details based on type
    if (type === TILES.DIRT) {
        ctx.fillStyle = '#A0522D';
        for (let i = 0; i < 3; i++) {
            const dx = (x * 7 + i * 11) % TILE_SIZE;
            const dy = (y * 13 + i * 7) % TILE_SIZE;
            ctx.fillRect(px + dx, py + dy, 3, 3);
        }
    } else if (type === TILES.WALL) {
        ctx.strokeStyle = '#606060';
        ctx.lineWidth = 2;
        ctx.strokeRect(px + 2, py + 2, TILE_SIZE - 4, TILE_SIZE - 4);
    } else if (type === TILES.ROCK) {
        ctx.fillStyle = '#505050';
        ctx.fillRect(px + 4, py + 4, TILE_SIZE - 8, TILE_SIZE - 8);
        ctx.fillStyle = '#808080';
        ctx.fillRect(px + 6, py + 6, 8, 8);
    } else if (type === TILES.DIAMOND) {
        const pulse = Math.sin(game.frame * 0.1) * 0.2 + 0.8;
        ctx.globalAlpha = pulse;
        ctx.fillStyle = '#00FFFF';
        ctx.beginPath();
        ctx.moveTo(px + TILE_SIZE / 2, py + 6);
        ctx.lineTo(px + TILE_SIZE - 6, py + TILE_SIZE / 2);
        ctx.lineTo(px + TILE_SIZE / 2, py + TILE_SIZE - 6);
        ctx.lineTo(px + 6, py + TILE_SIZE / 2);
        ctx.closePath();
        ctx.fill();
        ctx.globalAlpha = 1;
    } else if (type === TILES.PLAYER) {
        // Draw player (Rockford-like character)
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(px + 8, py + 6, 16, 10); // body
        ctx.fillRect(px + 10, py + 16, 4, 10); // left leg
        ctx.fillRect(px + 18, py + 16, 4, 10); // right leg
        ctx.fillRect(px + 6, py + 8, 4, 8); // left arm
        ctx.fillRect(px + 22, py + 8, 4, 8); // right arm
        // head
        ctx.fillStyle = '#FFE4B5';
        ctx.fillRect(px + 12, py + 2, 8, 8);
        // eyes
        ctx.fillStyle = '#000';
        ctx.fillRect(px + 13, py + 4, 2, 2);
        ctx.fillRect(px + 17, py + 4, 2, 2);
    } else if (type === TILES.EXIT_CLOSED) {
        ctx.fillStyle = '#FF4500';
        ctx.fillRect(px + 4, py + 4, TILE_SIZE - 8, TILE_SIZE - 8);
        ctx.fillStyle = '#FF6347';
        ctx.fillRect(px + 8, py + 8, TILE_SIZE - 16, TILE_SIZE - 16);
    } else if (type === TILES.EXIT_OPEN) {
        const pulse = Math.sin(game.frame * 0.15) * 0.3 + 0.7;
        ctx.globalAlpha = pulse;
        ctx.fillStyle = '#00FF00';
        ctx.fillRect(px + 4, py + 4, TILE_SIZE - 8, TILE_SIZE - 8);
        ctx.fillStyle = '#00FF7F';
        ctx.fillRect(px + 8, py + 8, TILE_SIZE - 16, TILE_SIZE - 16);
        ctx.globalAlpha = 1;
    }
}

// Draw grid
function drawGrid() {
    for (let y = 0; y < GRID_HEIGHT; y++) {
        for (let x = 0; x < GRID_WIDTH; x++) {
            drawTile(x, y, grid[y][x]);
        }
    }
}

// Check if position is valid
function isValid(x, y) {
    return x >= 0 && x < GRID_WIDTH && y >= 0 && y < GRID_HEIGHT;
}

// Check if tile is empty
function isEmpty(x, y) {
    return isValid(x, y) && grid[y][x] === TILES.EMPTY;
}

// Check if tile is rounded (can roll off)
function isRounded(x, y) {
    if (!isValid(x, y)) return false;
    const tile = grid[y][x];
    return tile === TILES.ROCK || tile === TILES.DIAMOND || tile === TILES.WALL;
}

// Move player
function movePlayer(dx, dy) {
    if (!game.playerAlive) return;

    const newX = game.playerX + dx;
    const newY = game.playerY + dy;

    if (!isValid(newX, newY)) return;

    const targetTile = grid[newY][newX];

    // Check what's at target position
    if (targetTile === TILES.EMPTY) {
        // Move to empty space
        grid[game.playerY][game.playerX] = TILES.EMPTY;
        game.playerX = newX;
        game.playerY = newY;
        grid[newY][newX] = TILES.PLAYER;
    } else if (targetTile === TILES.DIRT) {
        // Dig dirt
        sounds.dig();
        grid[game.playerY][game.playerX] = TILES.EMPTY;
        game.playerX = newX;
        game.playerY = newY;
        grid[newY][newX] = TILES.PLAYER;
        game.score += 1;
    } else if (targetTile === TILES.DIAMOND) {
        // Collect diamond
        sounds.diamond();
        grid[game.playerY][game.playerX] = TILES.EMPTY;
        game.playerX = newX;
        game.playerY = newY;
        grid[newY][newX] = TILES.PLAYER;
        game.diamonds++;
        game.score += 10;

        // Open exit if enough diamonds collected
        if (game.diamonds >= game.diamondsNeeded && !game.exitOpen) {
            openExit();
        }

        updateHUD();
    } else if (targetTile === TILES.ROCK && dy === 0) {
        // Try to push rock horizontally
        const pushX = newX + dx;
        if (isValid(pushX, newY) && grid[newY][pushX] === TILES.EMPTY) {
            grid[newY][pushX] = TILES.ROCK;
            grid[game.playerY][game.playerX] = TILES.EMPTY;
            game.playerX = newX;
            game.playerY = newY;
            grid[newY][newX] = TILES.PLAYER;
        }
    } else if (targetTile === TILES.EXIT_OPEN) {
        // Complete level
        sounds.exit();
        completeLevel();
    }
}

// Open exit
function openExit() {
    for (let y = 0; y < GRID_HEIGHT; y++) {
        for (let x = 0; x < GRID_WIDTH; x++) {
            if (grid[y][x] === TILES.EXIT_CLOSED) {
                grid[y][x] = TILES.EXIT_OPEN;
                game.exitOpen = true;
                sounds.exit();
            }
        }
    }
}

// Update physics (falling objects)
function updatePhysics() {
    copyGrid();
    const newFallingRocks = new Set();

    // Process from bottom to top for falling objects
    for (let y = GRID_HEIGHT - 2; y >= 1; y--) {
        for (let x = 1; x < GRID_WIDTH - 1; x++) {
            const tile = grid[y][x];

            if (tile === TILES.ROCK || tile === TILES.DIAMOND) {
                const below = grid[y + 1][x];
                const wasFalling = fallingRocks.has(`${x},${y}`);

                // Check if can fall straight down
                if (below === TILES.EMPTY) {
                    nextGrid[y][x] = TILES.EMPTY;
                    nextGrid[y + 1][x] = tile;
                    newFallingRocks.add(`${x},${y + 1}`);

                    // Check if falling onto player
                    if (wasFalling && grid[y + 1][x] === TILES.PLAYER) {
                        killPlayer();
                    }
                }
                // Check if can roll off to the side
                else if (isRounded(x, y + 1)) {
                    const left = grid[y][x - 1];
                    const belowLeft = grid[y + 1][x - 1];
                    const right = grid[y][x + 1];
                    const belowRight = grid[y + 1][x + 1];

                    // Try rolling left
                    if (left === TILES.EMPTY && belowLeft === TILES.EMPTY) {
                        if (Math.random() < 0.5 || right !== TILES.EMPTY || belowRight !== TILES.EMPTY) {
                            nextGrid[y][x] = TILES.EMPTY;
                            nextGrid[y][x - 1] = tile;
                            newFallingRocks.add(`${x - 1},${y}`);
                        }
                    }
                    // Try rolling right
                    else if (right === TILES.EMPTY && belowRight === TILES.EMPTY) {
                        nextGrid[y][x] = TILES.EMPTY;
                        nextGrid[y][x + 1] = tile;
                        newFallingRocks.add(`${x + 1},${y}`);
                    }
                }
            }
        }
    }

    // Copy next grid to current grid
    for (let y = 0; y < GRID_HEIGHT; y++) {
        for (let x = 0; x < GRID_WIDTH; x++) {
            grid[y][x] = nextGrid[y][x];
        }
    }

    fallingRocks = newFallingRocks;

    // Play rock fall sound if any rocks are falling
    if (fallingRocks.size > 0 && game.frame % 10 === 0) {
        sounds.rockFall();
    }
}

// Kill player
function killPlayer() {
    if (!game.playerAlive) return;

    game.playerAlive = false;
    sounds.death();
    grid[game.playerY][game.playerX] = TILES.EMPTY;

    setTimeout(() => {
        game.lives--;
        updateHUD();

        if (game.lives <= 0) {
            gameOver();
        } else {
            generateLevel();
        }
    }, 1000);
}

// Complete level
function completeLevel() {
    game.running = false;

    const bonus = Math.max(0, (game.diamondsNeeded - game.diamonds) * 5);
    game.score += bonus + game.level * 50;

    document.getElementById('levelDiamonds').textContent = game.diamonds;
    document.getElementById('levelBonus').textContent = bonus + game.level * 50;
    document.getElementById('levelComplete').classList.remove('hidden');
}

// Next level
function nextLevel() {
    game.level++;
    document.getElementById('levelComplete').classList.add('hidden');
    generateLevel();
    updateHUD();
    game.running = true;
    gameLoop();
}

// Game over
function gameOver() {
    game.running = false;
    document.getElementById('finalScore').textContent = game.score;
    document.getElementById('finalLevel').textContent = game.level;
    document.getElementById('gameOver').classList.remove('hidden');
}

// Update HUD
function updateHUD() {
    document.getElementById('level').textContent = game.level;
    document.getElementById('diamonds').textContent = game.diamonds;
    document.getElementById('diamondsNeeded').textContent = game.diamondsNeeded;
    document.getElementById('lives').textContent = game.lives;
    document.getElementById('score').textContent = game.score;
}

// Reset game
function resetGame() {
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }

    game.running = true;
    game.level = 1;
    game.score = 0;
    game.lives = 3;

    document.getElementById('gameOver').classList.add('hidden');
    document.getElementById('levelComplete').classList.add('hidden');

    generateLevel();
    updateHUD();
    gameLoop();
}

// Game loop
function gameLoop() {
    if (!game.running) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update physics every 6 frames
    if (game.frame % 6 === 0 && game.playerAlive) {
        updatePhysics();
    }

    // Draw
    drawGrid();

    game.frame++;

    requestAnimationFrame(gameLoop);
}

// Event listeners
let moveTimer = null;
let moveDelay = 150;

document.addEventListener('keydown', (e) => {
    if (!game.running || !game.playerAlive) return;

    if (keys[e.key]) return; // Prevent key repeat
    keys[e.key] = true;

    let dx = 0, dy = 0;

    if (e.key === 'ArrowLeft' || e.key === 'a') {
        dx = -1;
        e.preventDefault();
    } else if (e.key === 'ArrowRight' || e.key === 'd') {
        dx = 1;
        e.preventDefault();
    } else if (e.key === 'ArrowUp' || e.key === 'w') {
        dy = -1;
        e.preventDefault();
    } else if (e.key === 'ArrowDown' || e.key === 's') {
        dy = 1;
        e.preventDefault();
    }

    if (dx !== 0 || dy !== 0) {
        movePlayer(dx, dy);

        // Enable continuous movement
        if (moveTimer) clearInterval(moveTimer);
        moveTimer = setInterval(() => {
            if (keys[e.key]) {
                movePlayer(dx, dy);
            }
        }, moveDelay);
    }
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;

    if (moveTimer) {
        clearInterval(moveTimer);
        moveTimer = null;
    }
});

document.getElementById('restartBtn').addEventListener('click', resetGame);
document.getElementById('nextLevelBtn').addEventListener('click', nextLevel);

// Initialize and start game
resetGame();
