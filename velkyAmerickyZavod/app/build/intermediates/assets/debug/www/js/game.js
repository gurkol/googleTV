// game.js - Hlavní herní logika pro Velký Americký Závod
// Spojuje všechny engine komponenty a řídí gameplay

class Game {
    constructor() {
        // Canvas setup
        this.canvas = document.getElementById('gameCanvas');
        this.canvas.width = 640;
        this.canvas.height = 480;

        // Engine komponenty
        this.renderer = new Renderer(this.canvas);
        this.physics = new Physics();
        this.input = new InputManager();
        this.audio = new AudioEngine();

        // Game state
        this.state = 'menu'; // menu, playing, paused, gameover, victory
        this.score = 0;
        this.distance = 0;
        this.scrollOffset = 0;

        // Car state
        this.car = {
            x: 320,
            y: 380,
            speed: 5,
            velocityX: 0,
            fuel: 100,
            offRoad: false
        };

        // Lives
        this.lives = 3;
        this.invulnerable = false;
        this.invulnerableTime = 0;

        // USA States progress
        this.currentStateIndex = 0;
        this.currentState = USA_STATES[0];
        this.stateDistance = 0;
        this.statesCompleted = 0;

        // Obstacles
        this.obstacles = [];
        this.fuelStations = [];

        // Game loop
        this.lastTime = 0;
        this.running = false;

        // Ambient sound timer
        this.ambientSoundTimer = 0;
    }

    // Inicializace hry
    init() {
        console.log('Inicializace Velkého Amerického Závodu...');

        // Inicializovat audio při prvním kliknutí
        document.addEventListener('click', () => {
            if (!this.audio.initialized) {
                this.audio.init();
            }
        }, { once: true });

        // Začít na menu
        this.showMenu();
    }

    // Menu obrazovka
    showMenu() {
        this.state = 'menu';
        this.renderer.clear();

        // Title
        this.renderer.renderText('VELKÝ AMERICKÝ ZÁVOD', 320, 100, 24, '#FFD700');
        this.renderer.renderText('50 států - 1 cesta!', 320, 140, 16, '#FFF');

        // Instructions
        this.renderer.renderText('Ovládání:', 320, 200, 18, '#FFF');
        this.renderer.renderText('Šipky / WASD - Řízení', 320, 230, 14, '#CCC');
        this.renderer.renderText('Nahoru - Zrychlení', 320, 250, 14, '#CCC');
        this.renderer.renderText('Dolů - Brzdění', 320, 270, 14, '#CCC');

        // Start prompt
        this.renderer.renderText('Stiskněte MEZERNÍK pro start', 320, 350, 16, '#0F0');
        this.renderer.renderText(`Aktuální rekord: ${this.statesCompleted} států`, 320, 400, 14, '#AAA');

        // Čekat na start
        const checkStart = () => {
            if (this.input.getInput().action) {
                this.startGame();
            } else if (this.state === 'menu') {
                requestAnimationFrame(checkStart);
            }
        };
        checkStart();
    }

    // Spustit hru
    startGame() {
        console.log('Startování hry...');
        this.state = 'playing';

        // Reset game state
        this.score = 0;
        this.distance = 0;
        this.scrollOffset = 0;
        this.lives = 3;
        this.currentStateIndex = 0;
        this.currentState = USA_STATES[0];
        this.stateDistance = 0;

        // Reset car
        this.car = {
            x: 320,
            y: 380,
            speed: 5,
            velocityX: 0,
            fuel: 100,
            offRoad: false
        };

        // Clear obstacles
        this.obstacles = [];
        this.fuelStations = [];

        // Inicializovat audio
        if (!this.audio.initialized) {
            this.audio.init();
        }

        // Začít game loop
        this.running = true;
        this.lastTime = performance.now();
        this.gameLoop();
    }

    // Hlavní herní smyčka
    gameLoop() {
        if (!this.running || this.state !== 'playing') return;

        const currentTime = performance.now();
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;

        // Update
        this.update(deltaTime);

        // Render
        this.render();

        // Continue loop
        requestAnimationFrame(() => this.gameLoop());
    }

    // Update game logic
    update(deltaTime) {
        const input = this.input.getInput();

        // Aktualizovat scrolling
        this.scrollOffset += this.car.speed;
        this.distance += this.car.speed / 10;
        this.stateDistance += this.car.speed / 10;

        // Kontrola dokončení státu
        if (this.stateDistance >= this.currentState.distance) {
            this.completeState();
        }

        // Aktualizovat fyziku auta
        const roadCurve = this.physics.generateRoadCurve(this.scrollOffset, this.currentState.environment);
        const roadWidth = this.physics.getRoadWidth(this.currentState.environment);

        this.car = this.physics.updateCarPosition(
            this.car,
            input,
            this.currentState.environment,
            roadWidth,
            roadCurve
        );

        // Aplikovat speciální efekty podle prostředí
        this.physics.applySliding(this.car, this.currentState.environment);
        this.physics.applyElevation(this.car, this.currentState.environment, this.scrollOffset);
        this.physics.applyHeat(this.car, this.currentState.environment, this.distance);

        // Aktualizovat zvuk motoru
        this.audio.updateEngineSound(this.car.speed, this.physics.MAX_SPEED);

        // Spotřeba paliva
        const fuelConsumption = this.physics.calculateFuelConsumption(this.car, this.currentState.environment);
        this.car.fuel -= fuelConsumption * (deltaTime / 1000);

        // Konec hry pokud dojde palivo
        if (this.car.fuel <= 0) {
            this.car.fuel = 0;
            this.gameOver('Došlo palivo!');
            return;
        }

        // Spawn obstacles
        this.spawnObstacles();

        // Spawn fuel stations
        this.spawnFuelStations();

        // Update obstacles
        this.updateObstacles();

        // Update fuel stations
        this.updateFuelStations();

        // Check collisions
        this.checkCollisions();

        // Update score
        this.score += this.physics.calculateScore(this.distance, this.car.speed, this.currentState.environment);

        // Invulnerability timer
        if (this.invulnerable) {
            this.invulnerableTime--;
            if (this.invulnerableTime <= 0) {
                this.invulnerable = false;
            }
        }

        // Ambient sounds
        this.ambientSoundTimer++;
        if (this.ambientSoundTimer > 600) { // Každých 10 sekund
            this.playAmbientSound();
            this.ambientSoundTimer = 0;
        }
    }

    // Spawn překážky
    spawnObstacles() {
        const trafficDensity = this.physics.calculateTrafficDensity(this.currentState.environment);

        if (Math.random() < trafficDensity) {
            const roadCurve = this.physics.generateRoadCurve(this.scrollOffset, this.currentState.environment);
            const roadWidth = this.physics.getRoadWidth(this.currentState.environment);
            const roadCenterX = 320 + roadCurve;

            let obstacleType = 'car';

            // Typ překážky podle prostředí
            const env = this.currentState.environment;
            if (env === 'desert') {
                obstacleType = Math.random() < 0.3 ? 'cactus' : 'car';
            } else if (env === 'forest') {
                obstacleType = Math.random() < 0.4 ? 'tree' : 'car';
            } else if (env === 'mountain') {
                obstacleType = Math.random() < 0.3 ? 'rock' : 'car';
            } else if (env === 'urban') {
                obstacleType = Math.random() < 0.2 ? 'truck' : 'car';
            }

            this.obstacles.push({
                x: roadCenterX + (Math.random() - 0.5) * (roadWidth - 80),
                y: -50,
                type: obstacleType
            });
        }
    }

    // Spawn čerpací stanice
    spawnFuelStations() {
        // Spawn méně často, ale pravidelně
        if (Math.random() < 0.0015 && this.car.fuel < 70) {
            const roadCurve = this.physics.generateRoadCurve(this.scrollOffset, this.currentState.environment);
            const roadCenterX = 320 + roadCurve;

            this.fuelStations.push({
                x: roadCenterX,
                y: -50
            });
        }
    }

    // Update obstacles
    updateObstacles() {
        this.obstacles = this.obstacles.filter(obs => {
            obs.y += this.car.speed;
            return obs.y < this.canvas.height + 50;
        });
    }

    // Update fuel stations
    updateFuelStations() {
        this.fuelStations = this.fuelStations.filter(station => {
            station.y += this.car.speed;

            // Check pickup
            const dist = Math.hypot(station.x - this.car.x, station.y - this.car.y);
            if (dist < 40) {
                this.car.fuel = Math.min(100, this.car.fuel + 50);
                this.audio.playRefuel();
                this.score += 100;
                return false; // Remove station
            }

            return station.y < this.canvas.height + 50;
        });
    }

    // Check collisions
    checkCollisions() {
        if (this.invulnerable) return;

        for (const obs of this.obstacles) {
            if (this.physics.checkCollision(this.car, obs)) {
                this.handleCollision();
                // Remove obstacle
                const index = this.obstacles.indexOf(obs);
                if (index > -1) {
                    this.obstacles.splice(index, 1);
                }
                break;
            }
        }
    }

    // Handle collision
    handleCollision() {
        this.audio.playCollision();
        this.renderer.addParticles(this.car.x, this.car.y, 20, '#FF6600');

        this.lives--;
        if (this.lives <= 0) {
            this.gameOver('Příliš mnoho havárií!');
        } else {
            // Invulnerability po kolizi
            this.invulnerable = true;
            this.invulnerableTime = 120; // 2 sekundy
            this.car.speed *= 0.5; // Zpomalení
        }
    }

    // Dokončit stát
    completeState() {
        this.statesCompleted++;
        this.audio.playStateComplete();

        // Bonus score
        this.score += 1000 + this.currentState.difficulty * 200;

        // Bonus fuel
        this.car.fuel = Math.min(100, this.car.fuel + 30);

        // Posunout na další stát
        this.currentStateIndex++;

        if (this.currentStateIndex >= USA_STATES.length) {
            this.victory();
        } else {
            this.currentState = USA_STATES[this.currentStateIndex];
            this.stateDistance = 0;

            // Show transition (můžeme přidat později)
            console.log(`Vstupujete do: ${this.currentState.nameCZ} (${this.currentState.name})`);
        }
    }

    // Play ambient sound podle prostředí
    playAmbientSound() {
        const env = this.currentState.environment;

        if (env === 'snow') {
            this.audio.playSnowstormAmbient();
        } else if (env === 'rain') {
            this.audio.playRainAmbient();
        } else if (env === 'desert') {
            this.audio.playDesertWindAmbient();
        }
    }

    // Render
    render() {
        // Clear
        this.renderer.clear();

        // Background
        this.renderer.renderBackground(this.currentState.environment);

        // Road
        const roadWidth = this.physics.getRoadWidth(this.currentState.environment);
        const roadCurve = this.physics.generateRoadCurve(this.scrollOffset, this.currentState.environment);
        this.renderer.renderRoad(roadWidth, this.currentState.environment === 'mountain', this.scrollOffset);

        // Fuel stations
        for (const station of this.fuelStations) {
            // Render fuel pump (cyan)
            this.renderer.ctx.fillStyle = '#00FFFF';
            this.renderer.ctx.fillRect(station.x - 12, station.y - 20, 24, 40);
            this.renderer.ctx.fillStyle = '#00AAAA';
            this.renderer.ctx.fillRect(station.x - 8, station.y - 16, 16, 32);

            // Pulsing effect
            const pulse = Math.sin(Date.now() * 0.01) * 0.3 + 0.7;
            this.renderer.ctx.globalAlpha = pulse;
            this.renderer.ctx.fillStyle = '#FFFFFF';
            this.renderer.ctx.fillRect(station.x - 4, station.y - 10, 8, 4);
            this.renderer.ctx.globalAlpha = 1.0;
        }

        // Obstacles
        for (const obs of this.obstacles) {
            this.renderer.renderObstacle(obs.x, obs.y, obs.type);
        }

        // Car (with invulnerability flashing)
        if (!this.invulnerable || Math.floor(this.invulnerableTime / 10) % 2 === 0) {
            this.renderer.renderCar(this.car.x, this.car.y, '#FF0000');
        }

        // Particles
        this.renderer.updateParticles();

        // Weather effects
        this.renderer.updateWeather(this.currentState.environment);

        // HUD
        this.renderHUD();
    }

    // Render HUD
    renderHUD() {
        const ctx = this.renderer.ctx;

        // Background pro HUD
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, 640, 35);
        ctx.fillRect(0, 445, 640, 35);

        // Top HUD
        ctx.fillStyle = '#FFF';
        ctx.font = '14px monospace';
        ctx.textAlign = 'left';
        ctx.fillText(`Stát: ${this.currentState.nameCZ} (${this.currentStateIndex + 1}/50)`, 10, 20);

        ctx.textAlign = 'center';
        ctx.fillText(`Skóre: ${Math.floor(this.score)}`, 320, 20);

        ctx.textAlign = 'right';
        ctx.fillText(`Životy: ${'❤️'.repeat(this.lives)}`, 630, 20);

        // Bottom HUD
        // Fuel bar
        ctx.textAlign = 'left';
        ctx.fillStyle = '#FFF';
        ctx.fillText('Palivo:', 10, 465);

        // Fuel bar background
        ctx.fillStyle = '#333';
        ctx.fillRect(70, 452, 200, 16);

        // Fuel bar fill
        const fuelColor = this.car.fuel > 30 ? '#0F0' : (this.car.fuel > 15 ? '#FF0' : '#F00');
        ctx.fillStyle = fuelColor;
        ctx.fillRect(70, 452, this.car.fuel * 2, 16);

        // Speed
        ctx.fillStyle = '#FFF';
        ctx.textAlign = 'center';
        ctx.fillText(`Rychlost: ${Math.floor(this.car.speed * 10)} km/h`, 400, 465);

        // Distance in state
        ctx.textAlign = 'right';
        ctx.fillText(`${Math.floor(this.stateDistance)}/${this.currentState.distance} km`, 630, 465);
    }

    // Game Over
    gameOver(reason) {
        this.state = 'gameover';
        this.running = false;
        this.audio.stopAll();

        this.renderer.clear();
        this.renderer.renderText('KONEC HRY', 320, 180, 32, '#F00');
        this.renderer.renderText(reason, 320, 220, 18, '#FFF');
        this.renderer.renderText(`Finální skóre: ${Math.floor(this.score)}`, 320, 260, 18, '#FFD700');
        this.renderer.renderText(`Dokončeno států: ${this.statesCompleted}/50`, 320, 290, 16, '#FFF');
        this.renderer.renderText(`Vzdálenost: ${Math.floor(this.distance)} km`, 320, 320, 16, '#FFF');
        this.renderer.renderText('Stiskněte MEZERNÍK pro restart', 320, 380, 16, '#0F0');

        // Čekat na restart
        const checkRestart = () => {
            if (this.input.getInput().action) {
                this.showMenu();
            } else if (this.state === 'gameover') {
                setTimeout(checkRestart, 100);
            }
        };
        checkRestart();
    }

    // Victory
    victory() {
        this.state = 'victory';
        this.running = false;
        this.audio.stopAll();

        this.renderer.clear();
        this.renderer.renderText('VÍTĚZSTVÍ! 🏆', 320, 140, 32, '#FFD700');
        this.renderer.renderText('Dokončili jste celou Ameriku!', 320, 190, 18, '#FFF');
        this.renderer.renderText('Všech 50 států projeto!', 320, 220, 16, '#0F0');
        this.renderer.renderText(`Finální skóre: ${Math.floor(this.score)}`, 320, 270, 20, '#FFD700');
        this.renderer.renderText(`Celková vzdálenost: ${Math.floor(this.distance)} km`, 320, 310, 16, '#FFF');
        this.renderer.renderText('Jste šampión!', 320, 350, 18, '#FF0');
        this.renderer.renderText('Stiskněte MEZERNÍK pro novou hru', 320, 410, 14, '#0F0');

        // Čekat na restart
        const checkRestart = () => {
            if (this.input.getInput().action) {
                this.showMenu();
            } else if (this.state === 'victory') {
                setTimeout(checkRestart, 100);
            }
        };
        checkRestart();
    }
}

// Spustit hru po načtení stránky
window.addEventListener('load', () => {
    const game = new Game();
    game.init();
});
