// Ugh! - Prehistoric Helicopter Taxi Game
// Google TV Edition with D-pad controls

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Game constants
const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const GRAVITY = 0.15;
const THRUST_POWER = 0.3;
const HORIZONTAL_THRUST = 0.2;
const MAX_SAFE_LANDING_SPEED = 2;
const FUEL_CONSUMPTION = 0.1;
const ENERGY_DRAIN = 0.01;

// Set canvas size
canvas.width = GAME_WIDTH;
canvas.height = GAME_HEIGHT;

// Game state
const game = {
  state: 'playing', // 'playing', 'gameover', 'levelcomplete'
  level: 1,
  score: 0,
  fuel: 100,
  energy: 100,
  lives: 3
};

// Helicopter object
const helicopter = {
  x: 100,
  y: 100,
  vx: 0,
  vy: 0,
  width: 40,
  height: 25,
  angle: 0,
  rotorAngle: 0,
  health: 100,
  hasPassenger: false,
  passenger: null
};

// Input state
const keys = {
  up: false,
  down: false,
  left: false,
  right: false,
  space: false
};

// Passengers
const passengers = [];
const destinations = [];

// Obstacles
const obstacles = [];
const enemies = [];

// Particles for effects
const particles = [];

// Fuel station
const fuelStation = { x: 700, y: 500, width: 60, height: 40 };

// Fruit trees for energy
const trees = [];

// Level data
class Level {
  constructor(number) {
    this.number = number;
    this.ground = [];
    this.caves = [];
    this.platforms = [];
    this.generateLevel();
  }

  generateLevel() {
    // Generate ground with varying heights
    const segments = 20;
    const segmentWidth = GAME_WIDTH / segments;

    for (let i = 0; i <= segments; i++) {
      const x = i * segmentWidth;
      const baseHeight = GAME_HEIGHT - 100;
      const variation = Math.sin(i * 0.5) * 50 + Math.random() * 30;
      this.ground.push({
        x: x,
        y: baseHeight + variation
      });
    }

    // Add platforms for passengers
    this.platforms.push(
      { x: 150, y: 450, width: 80, height: 10 },
      { x: 350, y: 350, width: 80, height: 10 },
      { x: 550, y: 400, width: 80, height: 10 }
    );

    // Add caves (obstacles)
    this.caves.push(
      { x: 200, y: 50, width: 100, height: 200 },
      { x: 500, y: 100, width: 120, height: 150 }
    );
  }

  draw() {
    // Draw sky gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, GAME_HEIGHT);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(1, '#E0F6FF');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Draw ground
    ctx.fillStyle = '#8B4513';
    ctx.strokeStyle = '#654321';
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(0, GAME_HEIGHT);
    for (let point of this.ground) {
      ctx.lineTo(point.x, point.y);
    }
    ctx.lineTo(GAME_WIDTH, GAME_HEIGHT);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Draw grass on ground
    ctx.strokeStyle = '#228B22';
    ctx.lineWidth = 3;
    for (let point of this.ground) {
      for (let i = 0; i < 3; i++) {
        const grassX = point.x + (i - 1) * 3;
        ctx.beginPath();
        ctx.moveTo(grassX, point.y);
        ctx.lineTo(grassX - 2, point.y - 8);
        ctx.stroke();
      }
    }

    // Draw platforms
    ctx.fillStyle = '#A0522D';
    for (let platform of this.platforms) {
      ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
      // Platform support
      ctx.fillStyle = '#654321';
      ctx.fillRect(platform.x + 10, platform.y + platform.height, 5, 30);
      ctx.fillRect(platform.x + platform.width - 15, platform.y + platform.height, 5, 30);
      ctx.fillStyle = '#A0522D';
    }

    // Draw caves (stalactites)
    ctx.fillStyle = '#696969';
    ctx.strokeStyle = '#505050';
    for (let cave of this.caves) {
      // Draw stalactite
      ctx.beginPath();
      ctx.moveTo(cave.x, cave.y);
      ctx.lineTo(cave.x + cave.width / 2, cave.y + cave.height);
      ctx.lineTo(cave.x + cave.width, cave.y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
  }
}

let currentLevel = new Level(1);

// Initialize level
function initLevel() {
  // Reset helicopter
  helicopter.x = 100;
  helicopter.y = 100;
  helicopter.vx = 0;
  helicopter.vy = 0;
  helicopter.health = 100;
  helicopter.hasPassenger = false;

  game.fuel = 100;
  game.energy = 100;

  // Clear arrays
  passengers.length = 0;
  destinations.length = 0;
  enemies.length = 0;
  trees.length = 0;

  // Spawn passengers
  passengers.push(
    { x: 180, y: 440, width: 20, height: 30, waiting: true, destination: 0 },
    { x: 380, y: 340, width: 20, height: 30, waiting: true, destination: 1 }
  );

  // Spawn destinations
  destinations.push(
    { x: 380, y: 340, width: 40, height: 40, active: true },
    { x: 580, y: 390, width: 40, height: 40, active: true }
  );

  // Spawn enemies (pterosaurs)
  for (let i = 0; i < 2 + game.level; i++) {
    enemies.push({
      x: Math.random() * GAME_WIDTH,
      y: 50 + Math.random() * 200,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 0.5,
      width: 30,
      height: 20,
      flapPhase: Math.random() * Math.PI * 2
    });
  }

  // Spawn fruit trees
  trees.push(
    { x: 250, y: currentLevel.ground[5].y - 60, width: 30, height: 60, hasFruit: true },
    { x: 650, y: currentLevel.ground[16].y - 60, width: 30, height: 60, hasFruit: true }
  );
}

// Draw helicopter
function drawHelicopter() {
  ctx.save();
  ctx.translate(helicopter.x, helicopter.y);

  // Body
  ctx.fillStyle = '#8B4513';
  ctx.fillRect(-20, -5, 40, 15);

  // Cockpit window
  ctx.fillStyle = '#87CEEB';
  ctx.fillRect(-15, -3, 15, 10);

  // Tail
  ctx.fillStyle = '#654321';
  ctx.fillRect(15, 0, 15, 5);

  // Rotor
  ctx.save();
  ctx.translate(0, -15);
  ctx.rotate(helicopter.rotorAngle);
  ctx.strokeStyle = '#696969';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-25, 0);
  ctx.lineTo(25, 0);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, -25);
  ctx.lineTo(0, 25);
  ctx.stroke();
  ctx.restore();

  // Rotor shaft
  ctx.fillStyle = '#505050';
  ctx.fillRect(-2, -15, 4, 10);

  // Landing skids
  ctx.strokeStyle = '#696969';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-18, 10);
  ctx.lineTo(-18, 15);
  ctx.lineTo(18, 15);
  ctx.lineTo(18, 10);
  ctx.stroke();

  // Caveman pilot (simple)
  if (!helicopter.hasPassenger) {
    ctx.fillStyle = '#FDB462';
    ctx.fillRect(-12, -2, 8, 8);
  } else {
    // With passenger
    ctx.fillStyle = '#FDB462';
    ctx.fillRect(-12, -2, 8, 8);
    ctx.fillStyle = '#D4A373';
    ctx.fillRect(-3, -2, 8, 8);
  }

  ctx.restore();

  // Thrust particles
  if (keys.up && game.fuel > 0) {
    for (let i = 0; i < 2; i++) {
      particles.push({
        x: helicopter.x + (Math.random() - 0.5) * 20,
        y: helicopter.y + 15,
        vx: (Math.random() - 0.5) * 2,
        vy: Math.random() * 2 + 1,
        life: 20,
        color: `rgba(255, ${100 + Math.random() * 155}, 0, 0.7)`
      });
    }
  }
}

// Draw passengers
function drawPassengers() {
  for (let passenger of passengers) {
    if (!passenger.waiting) continue;

    ctx.fillStyle = '#FDB462';
    // Head
    ctx.fillRect(passenger.x, passenger.y, passenger.width, passenger.height * 0.4);
    // Body
    ctx.fillStyle = '#D4A373';
    ctx.fillRect(passenger.x, passenger.y + passenger.height * 0.4, passenger.width, passenger.height * 0.6);

    // Waving arm
    ctx.strokeStyle = '#FDB462';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(passenger.x + passenger.width, passenger.y + passenger.height * 0.5);
    ctx.lineTo(passenger.x + passenger.width + 10, passenger.y + passenger.height * 0.3 + Math.sin(Date.now() / 200) * 5);
    ctx.stroke();
  }
}

// Draw destinations
function drawDestinations() {
  for (let dest of destinations) {
    if (!dest.active) continue;

    // Flag pole
    ctx.fillStyle = '#654321';
    ctx.fillRect(dest.x + dest.width / 2 - 2, dest.y, 4, dest.height);

    // Flag
    ctx.fillStyle = '#FF4500';
    ctx.beginPath();
    ctx.moveTo(dest.x + dest.width / 2, dest.y);
    ctx.lineTo(dest.x + dest.width / 2 + 20, dest.y + 8);
    ctx.lineTo(dest.x + dest.width / 2, dest.y + 16);
    ctx.fill();
  }
}

// Draw enemies (pterosaurs)
function drawEnemies() {
  for (let enemy of enemies) {
    ctx.save();
    ctx.translate(enemy.x, enemy.y);

    enemy.flapPhase += 0.1;
    const flapOffset = Math.sin(enemy.flapPhase) * 5;

    // Body
    ctx.fillStyle = '#8B008B';
    ctx.fillRect(-10, -5, 20, 10);

    // Head
    ctx.beginPath();
    ctx.arc(10, 0, 8, 0, Math.PI * 2);
    ctx.fill();

    // Wings
    ctx.fillStyle = '#9932CC';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-15, -10 + flapOffset);
    ctx.lineTo(-20, 5);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-15, 10 - flapOffset);
    ctx.lineTo(-20, -5);
    ctx.fill();

    ctx.restore();
  }
}

// Draw trees
function drawTrees() {
  for (let tree of trees) {
    // Trunk
    ctx.fillStyle = '#654321';
    ctx.fillRect(tree.x, tree.y, tree.width, tree.height);

    // Foliage
    ctx.fillStyle = '#228B22';
    ctx.beginPath();
    ctx.arc(tree.x + tree.width / 2, tree.y, tree.width, 0, Math.PI * 2);
    ctx.fill();

    // Fruit
    if (tree.hasFruit) {
      ctx.fillStyle = '#FF6347';
      ctx.beginPath();
      ctx.arc(tree.x + tree.width / 2 - 10, tree.y - 5, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(tree.x + tree.width / 2 + 10, tree.y + 5, 5, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

// Draw fuel station
function drawFuelStation() {
  ctx.fillStyle = '#B8860B';
  ctx.fillRect(fuelStation.x, fuelStation.y, fuelStation.width, fuelStation.height);

  // Pump
  ctx.fillStyle = '#DAA520';
  ctx.fillRect(fuelStation.x + 10, fuelStation.y - 20, 15, 20);

  // Sign
  ctx.fillStyle = '#FFD700';
  ctx.fillRect(fuelStation.x + fuelStation.width - 20, fuelStation.y - 30, 15, 15);
  ctx.fillStyle = '#000';
  ctx.font = '10px Arial';
  ctx.fillText('F', fuelStation.x + fuelStation.width - 17, fuelStation.y - 18);
}

// Draw particles
function drawParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x, p.y, 3, 3);

    p.x += p.vx;
    p.y += p.vy;
    p.life--;

    if (p.life <= 0) {
      particles.splice(i, 1);
    }
  }
}

// Draw HUD
function drawHUD() {
  ctx.fillStyle = '#000';
  ctx.font = '16px Arial';

  // Score
  ctx.fillText(`Score: ${game.score}`, 10, 25);

  // Level
  ctx.fillText(`Level: ${game.level}`, 10, 50);

  // Lives
  ctx.fillText(`Lives: ${game.lives}`, 10, 75);

  // Fuel bar
  ctx.fillStyle = '#333';
  ctx.fillRect(10, 90, 150, 20);
  const fuelColor = game.fuel > 30 ? '#00FF00' : game.fuel > 15 ? '#FFD700' : '#FF0000';
  ctx.fillStyle = fuelColor;
  ctx.fillRect(10, 90, game.fuel * 1.5, 20);
  ctx.strokeStyle = '#000';
  ctx.strokeRect(10, 90, 150, 20);
  ctx.fillStyle = '#FFF';
  ctx.font = '12px Arial';
  ctx.fillText('FUEL', 65, 105);

  // Energy bar
  ctx.fillStyle = '#333';
  ctx.fillRect(10, 120, 150, 20);
  const energyColor = game.energy > 30 ? '#00BFFF' : game.energy > 15 ? '#FFD700' : '#FF0000';
  ctx.fillStyle = energyColor;
  ctx.fillRect(10, 120, game.energy * 1.5, 20);
  ctx.strokeStyle = '#000';
  ctx.strokeRect(10, 120, 150, 20);
  ctx.fillStyle = '#FFF';
  ctx.fillText('ENERGY', 55, 135);

  // Health
  ctx.fillStyle = '#333';
  ctx.fillRect(10, 150, 150, 20);
  const healthColor = helicopter.health > 50 ? '#00FF00' : helicopter.health > 25 ? '#FFD700' : '#FF0000';
  ctx.fillStyle = healthColor;
  ctx.fillRect(10, 150, helicopter.health * 1.5, 20);
  ctx.strokeStyle = '#000';
  ctx.strokeRect(10, 150, 150, 20);
  ctx.fillStyle = '#FFF';
  ctx.fillText('HEALTH', 55, 165);
}

// Update game physics
function update() {
  if (game.state !== 'playing') return;

  // Rotate rotor
  helicopter.rotorAngle += keys.up && game.fuel > 0 ? 0.5 : 0.2;

  // Apply gravity
  helicopter.vy += GRAVITY;

  // Apply thrust
  if (keys.up && game.fuel > 0) {
    helicopter.vy -= THRUST_POWER;
    game.fuel -= FUEL_CONSUMPTION;
    game.energy -= ENERGY_DRAIN;
  }

  if (keys.left && game.fuel > 0) {
    helicopter.vx -= HORIZONTAL_THRUST;
    game.fuel -= FUEL_CONSUMPTION * 0.5;
    game.energy -= ENERGY_DRAIN * 0.5;
  }

  if (keys.right && game.fuel > 0) {
    helicopter.vx += HORIZONTAL_THRUST;
    game.fuel -= FUEL_CONSUMPTION * 0.5;
    game.energy -= ENERGY_DRAIN * 0.5;
  }

  // Apply velocity with damping
  helicopter.vx *= 0.98;
  helicopter.x += helicopter.vx;
  helicopter.y += helicopter.vy;

  // Clamp fuel and energy
  game.fuel = Math.max(0, game.fuel);
  game.energy = Math.max(0, game.energy);

  // Check boundaries
  if (helicopter.x < 0) {
    helicopter.x = 0;
    helicopter.vx = 0;
  }
  if (helicopter.x > GAME_WIDTH) {
    helicopter.x = GAME_WIDTH;
    helicopter.vx = 0;
  }

  // Check ground collision
  for (let i = 0; i < currentLevel.ground.length - 1; i++) {
    const p1 = currentLevel.ground[i];
    const p2 = currentLevel.ground[i + 1];

    if (helicopter.x >= p1.x && helicopter.x <= p2.x) {
      const groundY = p1.y + (p2.y - p1.y) * ((helicopter.x - p1.x) / (p2.x - p1.x));

      if (helicopter.y + helicopter.height / 2 >= groundY) {
        if (Math.abs(helicopter.vy) > MAX_SAFE_LANDING_SPEED) {
          // Crash!
          helicopter.health -= 20;
          createExplosion(helicopter.x, helicopter.y);
        }
        helicopter.y = groundY - helicopter.height / 2;
        helicopter.vy = 0;
      }
    }
  }

  // Update enemies
  for (let enemy of enemies) {
    enemy.x += enemy.vx;
    enemy.y += enemy.vy;

    // Bounce off boundaries
    if (enemy.x < 0 || enemy.x > GAME_WIDTH) enemy.vx *= -1;
    if (enemy.y < 50 || enemy.y > 300) enemy.vy *= -1;

    // Check collision with helicopter
    if (checkCollision(helicopter, enemy)) {
      helicopter.health -= 10;
      createExplosion(helicopter.x, helicopter.y);
      // Bounce back
      helicopter.vx = -helicopter.vx * 0.5;
      helicopter.vy = -helicopter.vy * 0.5;
    }
  }

  // Check passenger pickup
  if (!helicopter.hasPassenger) {
    for (let passenger of passengers) {
      if (!passenger.waiting) continue;

      const dist = Math.hypot(helicopter.x - passenger.x - passenger.width / 2,
                              helicopter.y - passenger.y - passenger.height / 2);

      if (dist < 30 && Math.abs(helicopter.vy) < 1) {
        helicopter.hasPassenger = true;
        helicopter.passenger = passenger;
        passenger.waiting = false;
        game.score += 10;
      }
    }
  } else {
    // Check passenger dropoff
    const destIndex = helicopter.passenger.destination;
    const dest = destinations[destIndex];

    if (dest && dest.active) {
      const dist = Math.hypot(helicopter.x - dest.x - dest.width / 2,
                              helicopter.y - dest.y - dest.height / 2);

      if (dist < 40 && Math.abs(helicopter.vy) < 1) {
        helicopter.hasPassenger = false;
        helicopter.passenger = null;
        dest.active = false;
        game.score += 50;

        // Check if all passengers delivered
        if (destinations.every(d => !d.active)) {
          levelComplete();
        }
      }
    }
  }

  // Check fuel station
  const distToFuel = Math.hypot(helicopter.x - fuelStation.x - fuelStation.width / 2,
                                helicopter.y - fuelStation.y - fuelStation.height / 2);

  if (distToFuel < 50 && Math.abs(helicopter.vy) < 1) {
    if (game.fuel < 100) {
      game.fuel = Math.min(100, game.fuel + 0.5);
      game.score = Math.max(0, game.score - 0.1); // Fuel costs points
    }
  }

  // Check tree collision for fruit
  for (let tree of trees) {
    if (!tree.hasFruit) continue;

    const distToTree = Math.hypot(helicopter.x - tree.x - tree.width / 2,
                                  helicopter.y - tree.y);

    if (distToTree < 40) {
      tree.hasFruit = false;
      game.energy = Math.min(100, game.energy + 30);
      game.score += 20;
    }
  }

  // Check game over conditions
  if (helicopter.health <= 0 || game.energy <= 0) {
    game.lives--;
    if (game.lives <= 0) {
      game.state = 'gameover';
    } else {
      initLevel();
    }
  }
}

// Check collision between two rectangles
function checkCollision(a, b) {
  return a.x - a.width / 2 < b.x + b.width / 2 &&
         a.x + a.width / 2 > b.x - b.width / 2 &&
         a.y - a.height / 2 < b.y + b.height / 2 &&
         a.y + a.height / 2 > b.y - b.height / 2;
}

// Create explosion effect
function createExplosion(x, y) {
  for (let i = 0; i < 20; i++) {
    particles.push({
      x: x,
      y: y,
      vx: (Math.random() - 0.5) * 8,
      vy: (Math.random() - 0.5) * 8,
      life: 30,
      color: `rgba(255, ${Math.random() * 100}, 0, 0.9)`
    });
  }
}

// Level complete
function levelComplete() {
  game.level++;
  game.score += 100;
  currentLevel = new Level(game.level);
  initLevel();
}

// Main game loop
function gameLoop() {
  update();

  // Draw
  currentLevel.draw();
  drawFuelStation();
  drawTrees();
  drawDestinations();
  drawPassengers();
  drawEnemies();
  drawHelicopter();
  drawParticles();
  drawHUD();

  // Game over screen
  if (game.state === 'gameover') {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    ctx.fillStyle = '#FFF';
    ctx.font = '48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', GAME_WIDTH / 2, GAME_HEIGHT / 2 - 30);
    ctx.font = '24px Arial';
    ctx.fillText(`Final Score: ${Math.floor(game.score)}`, GAME_WIDTH / 2, GAME_HEIGHT / 2 + 20);
    ctx.fillText('Press SPACE to restart', GAME_WIDTH / 2, GAME_HEIGHT / 2 + 60);
  }

  requestAnimationFrame(gameLoop);
}

// Input handling
document.addEventListener('keydown', (e) => {
  switch(e.key) {
    case 'ArrowUp':
      keys.up = true;
      e.preventDefault();
      break;
    case 'ArrowDown':
      keys.down = true;
      e.preventDefault();
      break;
    case 'ArrowLeft':
      keys.left = true;
      e.preventDefault();
      break;
    case 'ArrowRight':
      keys.right = true;
      e.preventDefault();
      break;
    case ' ':
      if (game.state === 'gameover') {
        // Restart game
        game.state = 'playing';
        game.level = 1;
        game.score = 0;
        game.lives = 3;
        currentLevel = new Level(1);
        initLevel();
      }
      keys.space = true;
      e.preventDefault();
      break;
  }
});

document.addEventListener('keyup', (e) => {
  switch(e.key) {
    case 'ArrowUp':
      keys.up = false;
      break;
    case 'ArrowDown':
      keys.down = false;
      break;
    case 'ArrowLeft':
      keys.left = false;
      break;
    case 'ArrowRight':
      keys.right = false;
      break;
    case ' ':
      keys.space = false;
      break;
  }
});

// Initialize and start game
initLevel();
gameLoop();
