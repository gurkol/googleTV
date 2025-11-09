// River Rider - Pixel Art Game
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Audio Context for sound effects
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContext();

// Sound effects
const sounds = {
    shoot: (time = 0) => {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();

        osc.connect(gain);
        gain.connect(audioContext.destination);

        osc.frequency.setValueAtTime(800, audioContext.currentTime + time);
        osc.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + time + 0.1);

        gain.gain.setValueAtTime(0.3, audioContext.currentTime + time);
        gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + time + 0.1);

        osc.start(audioContext.currentTime + time);
        osc.stop(audioContext.currentTime + time + 0.1);
    },

    explosion: (time = 0) => {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        const filter = audioContext.createBiquadFilter();

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(audioContext.destination);

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(200, audioContext.currentTime + time);
        osc.frequency.exponentialRampToValueAtTime(20, audioContext.currentTime + time + 0.5);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2000, audioContext.currentTime + time);
        filter.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + time + 0.5);

        gain.gain.setValueAtTime(0.5, audioContext.currentTime + time);
        gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + time + 0.5);

        osc.start(audioContext.currentTime + time);
        osc.stop(audioContext.currentTime + time + 0.5);
    },

    pickup: (time = 0) => {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();

        osc.connect(gain);
        gain.connect(audioContext.destination);

        osc.frequency.setValueAtTime(400, audioContext.currentTime + time);
        osc.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + time + 0.2);

        gain.gain.setValueAtTime(0.3, audioContext.currentTime + time);
        gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + time + 0.2);

        osc.start(audioContext.currentTime + time);
        osc.stop(audioContext.currentTime + time + 0.2);
    },

    hit: (time = 0) => {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();

        osc.connect(gain);
        gain.connect(audioContext.destination);

        osc.type = 'square';
        osc.frequency.setValueAtTime(150, audioContext.currentTime + time);
        osc.frequency.exponentialRampToValueAtTime(50, audioContext.currentTime + time + 0.3);

        gain.gain.setValueAtTime(0.4, audioContext.currentTime + time);
        gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + time + 0.3);

        osc.start(audioContext.currentTime + time);
        osc.stop(audioContext.currentTime + time + 0.3);
    }
};

// Game state
const game = {
    running: false,
    score: 0,
    lives: 3,
    fuel: 100,
    speed: 2,
    frame: 0,
    difficulty: 1
};

// Player
const player = {
    x: canvas.width / 2 - 8,
    y: canvas.height - 100,
    width: 16,
    height: 16,
    speed: 5,
    color: '#00ff00',
    invulnerable: 0
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
const particles = [];

// Keyboard state
const keys = {};

// Initialize river segments
function initRiver() {
    for (let i = 0; i < 40; i++) {
        river.segments.push({
            y: i * 20 - 200,
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
    while (river.segments[river.segments.length - 1].y > -20) {
        const lastSegment = river.segments[river.segments.length - 1];
        river.segments.push({
            y: lastSegment.y - 20,
            leftBank: 100 + Math.sin(game.frame * 0.01) * 50,
            width: 600 + Math.cos(game.frame * 0.015) * 100
        });
    }

    // Remove old segments
    while (river.segments[0] && river.segments[0].y > canvas.height) {
        river.segments.shift();
    }
}

// Draw river
function drawRiver() {
    // Background (water)
    ctx.fillStyle = '#0066cc';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // River banks
    river.segments.forEach(segment => {
        if (segment.y < canvas.height && segment.y > -20) {
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
        }
    });
}

// Draw player
function drawPlayer() {
    // Flashing effect when invulnerable
    if (player.invulnerable > 0 && Math.floor(game.frame / 5) % 2 === 0) {
        return;
    }

    ctx.fillStyle = player.color;
    // Simple pixel art plane
    ctx.fillRect(player.x + 7, player.y, 2, 4); // nose
    ctx.fillRect(player.x + 6, player.y + 4, 4, 6); // body
    ctx.fillRect(player.x + 2, player.y + 7, 12, 3); // wings
    ctx.fillRect(player.x + 6, player.y + 10, 4, 4); // tail
    ctx.fillRect(player.x + 4, player.y + 12, 8, 2); // tail wings

    // Engine glow
    if (game.frame % 4 < 2) {
        ctx.fillStyle = '#ffaa00';
        ctx.fillRect(player.x + 6, player.y + 14, 4, 2);
    }
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

    // Decrease invulnerability
    if (player.invulnerable > 0) {
        player.invulnerable--;
    }

    // Check collision with banks
    if (player.invulnerable === 0) {
        const currentSegment = river.segments.find(seg =>
            seg.y <= player.y + player.height && seg.y + 20 >= player.y
        );

        if (currentSegment) {
            const rightBankX = currentSegment.leftBank + currentSegment.width;
            if (player.x < currentSegment.leftBank || player.x + player.width > rightBankX) {
                hitPlayer();
            }
        }
    }

    // Decrease fuel
    game.fuel -= 0.03;
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
    sounds.shoot();
}

// Update bullets
function updateBullets() {
    for (let i = bullets.length - 1; i >= 0; i--) {
        bullets[i].y -= bullets[i].speed;

        if (bullets[i].y < -10) {
            bullets.splice(i, 1);
        }
    }
}

// Draw bullets
function drawBullets() {
    bullets.forEach(bullet => {
        ctx.fillStyle = bullet.color;
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        // Glow effect
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(bullet.x, bullet.y, bullet.width, 2);
    });
}

// Enemy class
function spawnEnemy() {
    if (Math.random() < 0.015 + game.difficulty * 0.005) {
        // Find a segment that's above the screen
        const topSegments = river.segments.filter(seg => seg.y < 0);
        if (topSegments.length === 0) return;

        const segment = topSegments[Math.floor(Math.random() * Math.min(5, topSegments.length))];
        const riverLeft = segment.leftBank + 20;
        const riverRight = segment.leftBank + segment.width - 40;

        if (riverRight > riverLeft) {
            enemies.push({
                x: riverLeft + Math.random() * (riverRight - riverLeft),
                y: segment.y,
                width: 20,
                height: 20,
                speed: 0.5 + Math.random() * 0.5,
                type: Math.random() > 0.5 ? 'boat' : 'helicopter',
                color: '#ff0000',
                health: 1
            });
        }
    }
}

// Update enemies
function updateEnemies() {
    for (let i = enemies.length - 1; i >= 0; i--) {
        enemies[i].y += river.scrollSpeed + enemies[i].speed;

        // Remove if off screen
        if (enemies[i].y > canvas.height + 50) {
            enemies.splice(i, 1);
            continue;
        }

        // Check collision with player
        if (player.invulnerable === 0 && checkCollision(player, enemies[i])) {
            createExplosion(enemies[i].x + 10, enemies[i].y + 10, 15);
            sounds.explosion();
            enemies.splice(i, 1);
            hitPlayer();
            continue;
        }

        // Check collision with bullets
        for (let j = bullets.length - 1; j >= 0; j--) {
            if (checkCollision(bullets[j], enemies[i])) {
                enemies[i].health--;
                bullets.splice(j, 1);

                if (enemies[i].health <= 0) {
                    createExplosion(enemies[i].x + 10, enemies[i].y + 10, 15);
                    createParticles(enemies[i].x + 10, enemies[i].y + 10, '#ff0000');
                    sounds.explosion();
                    enemies.splice(i, 1);
                    game.score += 100;
                    updateHUD();
                }
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
            ctx.fillStyle = '#cc0000';
            ctx.fillRect(enemy.x + 8, enemy.y + 2, 4, 6);
        } else {
            // Simple helicopter
            ctx.fillRect(enemy.x + 8, enemy.y, 4, 2); // rotor
            ctx.fillRect(enemy.x + 6, enemy.y + 2, 8, 10); // body
            ctx.fillRect(enemy.x + 2, enemy.y + 10, 16, 2); // skids
            // Animated rotor
            if (game.frame % 4 < 2) {
                ctx.fillStyle = '#cc0000';
                ctx.fillRect(enemy.x + 4, enemy.y - 1, 12, 3);
            }
        }
    });
}

// Fuel depot
function spawnFuelDepot() {
    if (Math.random() < 0.008) {
        // Find a segment that's above the screen
        const topSegments = river.segments.filter(seg => seg.y < 0);
        if (topSegments.length === 0) return;

        const segment = topSegments[Math.floor(Math.random() * Math.min(10, topSegments.length))];
        const riverLeft = segment.leftBank + 30;
        const riverRight = segment.leftBank + segment.width - 60;

        if (riverRight > riverLeft) {
            fuelDepots.push({
                x: riverLeft + Math.random() * (riverRight - riverLeft),
                y: segment.y,
                width: 30,
                height: 30,
                color: '#00ffff'
            });
        }
    }
}

// Update fuel depots
function updateFuelDepots() {
    for (let i = fuelDepots.length - 1; i >= 0; i--) {
        fuelDepots[i].y += river.scrollSpeed;

        if (fuelDepots[i].y > canvas.height + 50) {
            fuelDepots.splice(i, 1);
            continue;
        }

        if (checkCollision(player, fuelDepots[i])) {
            game.fuel = Math.min(100, game.fuel + 40);
            fuelDepots.splice(i, 1);
            game.score += 50;
            createParticles(player.x + 8, player.y + 8, '#00ffff');
            sounds.pickup();
            updateHUD();
        }
    }
}

// Draw fuel depots
function drawFuelDepots() {
    fuelDepots.forEach(depot => {
        // Pulsing effect
        const pulse = Math.sin(game.frame * 0.1) * 0.2 + 0.8;
        ctx.globalAlpha = pulse;

        ctx.fillStyle = depot.color;
        ctx.fillRect(depot.x, depot.y + 10, depot.width, 10);
        ctx.fillRect(depot.x + 10, depot.y, 10, depot.height);

        // Add 'F' for fuel
        ctx.fillStyle = '#000';
        ctx.fillRect(depot.x + 12, depot.y + 12, 6, 2);
        ctx.fillRect(depot.x + 12, depot.y + 16, 4, 2);

        // Border
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.strokeRect(depot.x, depot.y, depot.width, depot.height);

        ctx.globalAlpha = 1;
    });
}

// Particles
function createParticles(x, y, color) {
    for (let i = 0; i < 10; i++) {
        particles.push({
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 4,
            vy: (Math.random() - 0.5) * 4,
            life: 30,
            color: color
        });
    }
}

function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].x += particles[i].vx;
        particles[i].y += particles[i].vy;
        particles[i].life--;

        if (particles[i].life <= 0) {
            particles.splice(i, 1);
        }
    }
}

function drawParticles() {
    particles.forEach(p => {
        const alpha = p.life / 30;
        ctx.fillStyle = p.color;
        ctx.globalAlpha = alpha;
        ctx.fillRect(p.x, p.y, 3, 3);
        ctx.globalAlpha = 1;
    });
}

// Explosion
function createExplosion(x, y, size = 10) {
    explosions.push({
        x: x,
        y: y,
        frame: 0,
        maxFrames: 20,
        size: size
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
        const progress = exp.frame / exp.maxFrames;
        const size = exp.size * (1 + progress * 2);
        const alpha = 1 - progress;

        ctx.globalAlpha = alpha;
        ctx.fillStyle = `rgb(255, ${255 * (1 - progress)}, 0)`;
        ctx.fillRect(exp.x - size/2, exp.y - size/2, size, size);
        ctx.fillRect(exp.x - size/4, exp.y - size/4, size/2, size/2);

        // Inner bright core
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(exp.x - size/8, exp.y - size/8, size/4, size/4);
        ctx.globalAlpha = 1;
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
    if (player.invulnerable > 0) return;

    game.lives--;
    createExplosion(player.x + 8, player.y + 8, 20);
    createParticles(player.x + 8, player.y + 8, '#00ff00');
    sounds.hit();
    updateHUD();

    if (game.lives <= 0) {
        gameOver();
    } else {
        // Reset player position and make invulnerable
        player.x = canvas.width / 2 - 8;
        player.y = canvas.height - 100;
        player.invulnerable = 120; // 2 seconds at 60fps
        game.fuel = Math.min(100, game.fuel + 50);
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
    // Resume audio context (needed for user interaction)
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }

    game.running = true;
    game.score = 0;
    game.lives = 3;
    game.fuel = 100;
    game.frame = 0;
    game.difficulty = 1;

    player.x = canvas.width / 2 - 8;
    player.y = canvas.height - 100;
    player.invulnerable = 60;

    bullets.length = 0;
    enemies.length = 0;
    fuelDepots.length = 0;
    explosions.length = 0;
    particles.length = 0;
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
    updateParticles();

    spawnEnemy();
    spawnFuelDepot();

    // Draw
    drawRiver();
    drawFuelDepots();
    drawEnemies();
    drawPlayer();
    drawBullets();
    drawParticles();
    drawExplosions();

    game.frame++;
    game.score += 1;

    // Increase difficulty over time
    if (game.frame % 1000 === 0) {
        game.difficulty += 0.1;
    }

    if (game.frame % 60 === 0) {
        updateHUD();
    }

    requestAnimationFrame(gameLoop);
}

// Event listeners
let canShoot = true;
document.addEventListener('keydown', (e) => {
    keys[e.key] = true;

    if ((e.key === ' ' || e.key === 'Enter') && game.running && canShoot) {
        e.preventDefault();
        createBullet();
        canShoot = false;
        setTimeout(() => canShoot = true, 150); // Rate limit shooting
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
