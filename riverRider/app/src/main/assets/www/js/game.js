// River Rider - Pixel Art Game
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game state
const game = {
    running: false,
    score: 0,
    lives: 3,
    fuel: 100,
    speed: 2,
    frame: 0
};

// Player
const player = {
    x: canvas.width / 2 - 8,
    y: canvas.height - 100,
    width: 16,
    height: 16,
    speed: 4,
    color: '#00ff00'
};

// River
const river = {
    leftBank: 100,
    rightBank: 700,
    width: 600,
    scrollSpeed: 2,
    segments: []
};

// Arrays for game objects
const bullets = [];
const enemies = [];
const fuelDepots = [];
const explosions = [];

// Keyboard state
const keys = {};

// Initialize river segments
function initRiver() {
    for (let i = 0; i < 30; i++) {
        river.segments.push({
            y: i * 20,
            leftBank: 100 + Math.sin(i * 0.2) * 50,
            width: 600 + Math.cos(i * 0.3) * 100
        });
    }
}

// Update river
function updateRiver() {
    river.segments.forEach(segment => {
        segment.y += river.scrollSpeed;
    });

    // Remove segments that are off screen and add new ones
    if (river.segments[0].y > canvas.height) {
        river.segments.shift();
        const lastSegment = river.segments[river.segments.length - 1];
        river.segments.push({
            y: lastSegment.y - 20,
            leftBank: 100 + Math.sin(game.frame * 0.01) * 50,
            width: 600 + Math.cos(game.frame * 0.015) * 100
        });
    }
}

// Draw river
function drawRiver() {
    // Background (water)
    ctx.fillStyle = '#0066cc';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // River banks
    river.segments.forEach(segment => {
        // Left bank
        ctx.fillStyle = '#228B22';
        ctx.fillRect(0, segment.y, segment.leftBank, 20);

        // Right bank
        const rightBankX = segment.leftBank + segment.width;
        ctx.fillRect(rightBankX, segment.y, canvas.width - rightBankX, 20);

        // Bank borders (pixel art effect)
        ctx.strokeStyle = '#1a5c1a';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(segment.leftBank, segment.y);
        ctx.lineTo(segment.leftBank, segment.y + 20);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(rightBankX, segment.y);
        ctx.lineTo(rightBankX, segment.y + 20);
        ctx.stroke();
    });
}

// Draw player
function drawPlayer() {
    ctx.fillStyle = player.color;
    // Simple pixel art plane
    ctx.fillRect(player.x + 7, player.y, 2, 4); // nose
    ctx.fillRect(player.x + 6, player.y + 4, 4, 6); // body
    ctx.fillRect(player.x + 2, player.y + 7, 12, 3); // wings
    ctx.fillRect(player.x + 6, player.y + 10, 4, 4); // tail
    ctx.fillRect(player.x + 4, player.y + 12, 8, 2); // tail wings
}

// Update player
function updatePlayer() {
    // Movement
    if (keys['ArrowLeft'] || keys['a']) {
        player.x -= player.speed;
    }
    if (keys['ArrowRight'] || keys['d']) {
        player.x += player.speed;
    }
    if (keys['ArrowUp'] || keys['w']) {
        player.y -= player.speed;
    }
    if (keys['ArrowDown'] || keys['s']) {
        player.y += player.speed;
    }

    // Keep player in bounds
    player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));
    player.y = Math.max(0, Math.min(canvas.height - player.height, player.y));

    // Check collision with banks
    const currentSegment = river.segments.find(seg =>
        seg.y <= player.y && seg.y + 20 >= player.y
    );

    if (currentSegment) {
        const rightBankX = currentSegment.leftBank + currentSegment.width;
        if (player.x < currentSegment.leftBank || player.x + player.width > rightBankX) {
            hitPlayer();
        }
    }

    // Decrease fuel
    game.fuel -= 0.05;
    if (game.fuel <= 0) {
        game.fuel = 0;
        hitPlayer();
    }
}

// Bullet class
function createBullet() {
    bullets.push({
        x: player.x + player.width / 2 - 1,
        y: player.y,
        width: 2,
        height: 6,
        speed: 8,
        color: '#ffff00'
    });
}

// Update bullets
function updateBullets() {
    for (let i = bullets.length - 1; i >= 0; i--) {
        bullets[i].y -= bullets[i].speed;

        if (bullets[i].y < 0) {
            bullets.splice(i, 1);
        }
    }
}

// Draw bullets
function drawBullets() {
    bullets.forEach(bullet => {
        ctx.fillStyle = bullet.color;
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });
}

// Enemy class
function spawnEnemy() {
    if (Math.random() < 0.02) {
        const segment = river.segments[Math.floor(river.segments.length * 0.2)];
        const riverLeft = segment.leftBank + 20;
        const riverRight = segment.leftBank + segment.width - 40;

        enemies.push({
            x: riverLeft + Math.random() * (riverRight - riverLeft),
            y: segment.y,
            width: 20,
            height: 20,
            speed: 1,
            type: Math.random() > 0.5 ? 'boat' : 'helicopter',
            color: '#ff0000'
        });
    }
}

// Update enemies
function updateEnemies() {
    for (let i = enemies.length - 1; i >= 0; i--) {
        enemies[i].y += river.scrollSpeed + enemies[i].speed;

        // Remove if off screen
        if (enemies[i].y > canvas.height) {
            enemies.splice(i, 1);
            continue;
        }

        // Check collision with player
        if (checkCollision(player, enemies[i])) {
            createExplosion(enemies[i].x, enemies[i].y);
            enemies.splice(i, 1);
            hitPlayer();
            continue;
        }

        // Check collision with bullets
        for (let j = bullets.length - 1; j >= 0; j--) {
            if (checkCollision(bullets[j], enemies[i])) {
                createExplosion(enemies[i].x, enemies[i].y);
                enemies.splice(i, 1);
                bullets.splice(j, 1);
                game.score += 100;
                updateHUD();
                break;
            }
        }
    }
}

// Draw enemies
function drawEnemies() {
    enemies.forEach(enemy => {
        ctx.fillStyle = enemy.color;
        if (enemy.type === 'boat') {
            // Simple boat
            ctx.fillRect(enemy.x + 5, enemy.y, 10, 12);
            ctx.fillRect(enemy.x, enemy.y + 8, 20, 8);
        } else {
            // Simple helicopter
            ctx.fillRect(enemy.x + 8, enemy.y, 4, 2); // rotor
            ctx.fillRect(enemy.x + 6, enemy.y + 2, 8, 10); // body
            ctx.fillRect(enemy.x + 2, enemy.y + 10, 16, 2); // skids
        }
    });
}

// Fuel depot
function spawnFuelDepot() {
    if (Math.random() < 0.005 && game.fuel < 50) {
        const segment = river.segments[Math.floor(river.segments.length * 0.3)];
        const riverLeft = segment.leftBank + 30;
        const riverRight = segment.leftBank + segment.width - 60;

        fuelDepots.push({
            x: riverLeft + Math.random() * (riverRight - riverLeft),
            y: segment.y,
            width: 30,
            height: 30,
            color: '#00ffff'
        });
    }
}

// Update fuel depots
function updateFuelDepots() {
    for (let i = fuelDepots.length - 1; i >= 0; i--) {
        fuelDepots[i].y += river.scrollSpeed;

        if (fuelDepots[i].y > canvas.height) {
            fuelDepots.splice(i, 1);
            continue;
        }

        if (checkCollision(player, fuelDepots[i])) {
            game.fuel = Math.min(100, game.fuel + 30);
            fuelDepots.splice(i, 1);
            game.score += 50;
            updateHUD();
        }
    }
}

// Draw fuel depots
function drawFuelDepots() {
    fuelDepots.forEach(depot => {
        ctx.fillStyle = depot.color;
        ctx.fillRect(depot.x, depot.y + 10, depot.width, 10);
        ctx.fillRect(depot.x + 10, depot.y, 10, depot.height);

        // Add 'F' for fuel
        ctx.fillStyle = '#000';
        ctx.fillRect(depot.x + 12, depot.y + 12, 6, 2);
        ctx.fillRect(depot.x + 12, depot.y + 16, 4, 2);
    });
}

// Explosion
function createExplosion(x, y) {
    explosions.push({
        x: x,
        y: y,
        frame: 0,
        maxFrames: 20
    });
}

// Update explosions
function updateExplosions() {
    for (let i = explosions.length - 1; i >= 0; i--) {
        explosions[i].frame++;
        if (explosions[i].frame >= explosions[i].maxFrames) {
            explosions.splice(i, 1);
        }
    }
}

// Draw explosions
function drawExplosions() {
    explosions.forEach(exp => {
        const size = exp.frame;
        const alpha = 1 - (exp.frame / exp.maxFrames);
        ctx.fillStyle = `rgba(255, ${128 - exp.frame * 6}, 0, ${alpha})`;
        ctx.fillRect(exp.x - size/2, exp.y - size/2, size, size);
        ctx.fillRect(exp.x - size/4, exp.y - size/4, size/2, size/2);
    });
}

// Collision detection
function checkCollision(obj1, obj2) {
    return obj1.x < obj2.x + obj2.width &&
           obj1.x + obj1.width > obj2.x &&
           obj1.y < obj2.y + obj2.height &&
           obj1.y + obj1.height > obj2.y;
}

// Hit player
function hitPlayer() {
    game.lives--;
    createExplosion(player.x, player.y);
    updateHUD();

    if (game.lives <= 0) {
        gameOver();
    } else {
        // Reset player position
        player.x = canvas.width / 2 - 8;
        player.y = canvas.height - 100;
        game.fuel = 100;
    }
}

// Update HUD
function updateHUD() {
    document.getElementById('score').textContent = game.score;
    document.getElementById('fuel').textContent = Math.floor(game.fuel);
    document.getElementById('lives').textContent = game.lives;
}

// Game over
function gameOver() {
    game.running = false;
    document.getElementById('finalScore').textContent = game.score;
    document.getElementById('gameOver').classList.remove('hidden');
}

// Reset game
function resetGame() {
    game.running = true;
    game.score = 0;
    game.lives = 3;
    game.fuel = 100;
    game.frame = 0;

    player.x = canvas.width / 2 - 8;
    player.y = canvas.height - 100;

    bullets.length = 0;
    enemies.length = 0;
    fuelDepots.length = 0;
    explosions.length = 0;
    river.segments.length = 0;

    initRiver();
    updateHUD();
    document.getElementById('gameOver').classList.add('hidden');
    gameLoop();
}

// Game loop
function gameLoop() {
    if (!game.running) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update
    updateRiver();
    updatePlayer();
    updateBullets();
    updateEnemies();
    updateFuelDepots();
    updateExplosions();

    spawnEnemy();
    spawnFuelDepot();

    // Draw
    drawRiver();
    drawFuelDepots();
    drawEnemies();
    drawPlayer();
    drawBullets();
    drawExplosions();

    game.frame++;
    game.score += 1;
    if (game.frame % 60 === 0) {
        updateHUD();
    }

    requestAnimationFrame(gameLoop);
}

// Event listeners
document.addEventListener('keydown', (e) => {
    keys[e.key] = true;

    if ((e.key === ' ' || e.key === 'Enter') && game.running) {
        e.preventDefault();
        createBullet();
    }
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

document.getElementById('restartBtn').addEventListener('click', resetGame);

// Initialize and start game
initRiver();
updateHUD();
resetGame();
