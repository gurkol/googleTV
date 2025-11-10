// Renderer.js - Renderovací engine pro Velký Americký Závod
// Top-down scrolling view s podporou různých prostředí

class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;

        // Nastavení pixel-perfect renderingu
        this.ctx.imageSmoothingEnabled = false;

        // Scroll offset
        this.scrollY = 0;
        this.scrollSpeed = 5;

        // Particle systém
        this.particles = [];

        // Weather effects
        this.weatherParticles = [];
    }

    // Vyčistit canvas
    clear() {
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    // Renderovat pozadí podle prostředí
    renderBackground(environment) {
        const envData = ENVIRONMENT_TYPES[environment];

        // Base color
        this.ctx.fillStyle = envData.color;
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Environment-specific background patterns
        switch(environment) {
            case 'snow':
                this.renderSnowBackground();
                break;
            case 'desert':
                this.renderDesertBackground();
                break;
            case 'forest':
                this.renderForestBackground();
                break;
            case 'mountain':
                this.renderMountainBackground();
                break;
            case 'rain':
                this.renderRainBackground();
                break;
            case 'plains':
                this.renderPlainsBackground();
                break;
            case 'coastal':
                this.renderCoastalBackground();
                break;
            case 'urban':
                this.renderUrbanBackground();
                break;
        }
    }

    // Sněhové pozadí
    renderSnowBackground() {
        this.ctx.fillStyle = '#FFFFFF';
        // Sněhové hromady po stranách
        for (let i = 0; i < 20; i++) {
            const x = Math.random() * 100;
            const y = (i * 40 + this.scrollY) % this.height;
            this.ctx.fillRect(x, y, 30, 20);
            this.ctx.fillRect(this.width - x - 30, y, 30, 20);
        }
    }

    // Pouštní pozadí
    renderDesertBackground() {
        // Písečné duny
        this.ctx.fillStyle = '#DDB76B';
        for (let i = 0; i < 15; i++) {
            const x = Math.random() * this.width;
            const y = (i * 60 + this.scrollY * 0.5) % this.height;
            this.ctx.beginPath();
            this.ctx.arc(x, y, 40, 0, Math.PI);
            this.ctx.fill();
        }
    }

    // Lesní pozadí
    renderForestBackground() {
        // Stromy po stranách
        this.ctx.fillStyle = '#0F5F0F';
        for (let i = 0; i < 25; i++) {
            const x = Math.random() * 80;
            const y = (i * 30 + this.scrollY) % this.height;
            // Levý strom
            this.ctx.fillRect(x, y, 15, 25);
            this.ctx.fillStyle = '#0A4F0A';
            this.ctx.fillRect(x + 3, y - 5, 9, 15);
            this.ctx.fillStyle = '#0F5F0F';
            // Pravý strom
            this.ctx.fillRect(this.width - x - 15, y, 15, 25);
            this.ctx.fillStyle = '#0A4F0A';
            this.ctx.fillRect(this.width - x - 12, y - 5, 9, 15);
            this.ctx.fillStyle = '#0F5F0F';
        }
    }

    // Horské pozadí
    renderMountainBackground() {
        // Skalnaté stěny
        this.ctx.fillStyle = '#8B7355';
        for (let i = 0; i < 10; i++) {
            const x = Math.random() * 60;
            const y = (i * 80 + this.scrollY * 0.3) % this.height;
            this.ctx.fillRect(x, y, 50, 60);
            this.ctx.fillRect(this.width - x - 50, y, 50, 60);
        }
    }

    // Deštivé pozadí
    renderRainBackground() {
        // Kaluže a tráva
        this.ctx.fillStyle = '#5A8A5A';
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Kaluže
        this.ctx.fillStyle = '#4A7A9A';
        for (let i = 0; i < 15; i++) {
            const x = Math.random() * this.width;
            const y = (i * 50 + this.scrollY) % this.height;
            this.ctx.beginPath();
            this.ctx.ellipse(x, y, 30, 15, 0, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }

    // Pláně pozadí
    renderPlainsBackground() {
        // Pole a farmy
        this.ctx.fillStyle = '#7FBA00';
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Kukuřičná pole (pruhy)
        this.ctx.fillStyle = '#6FA000';
        for (let i = 0; i < 30; i++) {
            const y = (i * 20 + this.scrollY) % this.height;
            if (i % 2 === 0) {
                this.ctx.fillRect(0, y, 100, 10);
                this.ctx.fillRect(this.width - 100, y, 100, 10);
            }
        }
    }

    // Pobřežní pozadí
    renderCoastalBackground() {
        // Pláž a oceán
        this.ctx.fillStyle = '#1E90FF';
        this.ctx.fillRect(0, 0, 120, this.height);
        this.ctx.fillRect(this.width - 120, 0, 120, this.height);

        // Vlny
        this.ctx.fillStyle = '#4169E1';
        for (let i = 0; i < 40; i++) {
            const y = (i * 20 + this.scrollY * 1.5) % this.height;
            this.ctx.fillRect(10, y, 30, 3);
            this.ctx.fillRect(this.width - 40, y, 30, 3);
        }
    }

    // Městské pozadí
    renderUrbanBackground() {
        // Budovy
        this.ctx.fillStyle = '#555555';
        for (let i = 0; i < 20; i++) {
            const x = Math.random() * 100;
            const y = (i * 50 + this.scrollY * 0.8) % this.height;
            const h = 30 + Math.random() * 40;
            this.ctx.fillRect(x, y, 40, h);
            this.ctx.fillRect(this.width - x - 40, y, 40, h);

            // Okna
            this.ctx.fillStyle = '#FFFF00';
            for (let j = 0; j < 3; j++) {
                for (let k = 0; k < Math.floor(h / 10); k++) {
                    if (Math.random() > 0.5) {
                        this.ctx.fillRect(x + 5 + j * 12, y + 5 + k * 10, 8, 6);
                        this.ctx.fillRect(this.width - x - 35 + j * 12, y + 5 + k * 10, 8, 6);
                    }
                }
            }
            this.ctx.fillStyle = '#555555';
        }
    }

    // Renderovat cestu/silnici
    renderRoad(roadWidth, curves, scrollOffset) {
        const centerX = this.width / 2;
        this.scrollY = scrollOffset;

        // Cesta
        this.ctx.fillStyle = '#333333';

        for (let y = 0; y < this.height; y += 10) {
            const curveOffset = curves ? Math.sin((y + scrollOffset) * 0.01) * 100 : 0;
            const x = centerX + curveOffset - roadWidth / 2;
            this.ctx.fillRect(x, y, roadWidth, 10);
        }

        // Středová čára
        this.ctx.fillStyle = '#FFFF00';
        for (let y = 0; y < this.height; y += 40) {
            const curveOffset = curves ? Math.sin((y + scrollOffset) * 0.01) * 100 : 0;
            const x = centerX + curveOffset - 3;
            this.ctx.fillRect(x, y, 6, 20);
        }

        // Krajnice
        this.ctx.fillStyle = '#FFFFFF';
        for (let y = 0; y < this.height; y += 20) {
            const curveOffset = curves ? Math.sin((y + scrollOffset) * 0.01) * 100 : 0;
            const leftX = centerX + curveOffset - roadWidth / 2;
            const rightX = centerX + curveOffset + roadWidth / 2;
            this.ctx.fillRect(leftX, y, 4, 10);
            this.ctx.fillRect(rightX - 4, y, 4, 10);
        }
    }

    // Renderovat auto hráče (top-down pixel art)
    renderCar(x, y, color = '#FF0000') {
        // Karoserie
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x - 12, y - 16, 24, 32);

        // Okna
        this.ctx.fillStyle = '#87CEEB';
        this.ctx.fillRect(x - 8, y - 12, 16, 8);
        this.ctx.fillRect(x - 8, y + 2, 16, 8);

        // Kola
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(x - 14, y - 12, 4, 10);
        this.ctx.fillRect(x + 10, y - 12, 4, 10);
        this.ctx.fillRect(x - 14, y + 2, 4, 10);
        this.ctx.fillRect(x + 10, y + 2, 4, 10);

        // Světla
        this.ctx.fillStyle = '#FFFF00';
        this.ctx.fillRect(x - 10, y - 17, 6, 3);
        this.ctx.fillRect(x + 4, y - 17, 6, 3);
    }

    // Renderovat překážku (jiné auto, strom, kámen, atd.)
    renderObstacle(x, y, type) {
        switch(type) {
            case 'car':
                this.renderCar(x, y, '#0000FF');
                break;
            case 'truck':
                this.ctx.fillStyle = '#8B4513';
                this.ctx.fillRect(x - 14, y - 20, 28, 40);
                this.ctx.fillStyle = '#000';
                this.ctx.fillRect(x - 16, y - 15, 4, 12);
                this.ctx.fillRect(x + 12, y - 15, 4, 12);
                this.ctx.fillRect(x - 16, y + 3, 4, 12);
                this.ctx.fillRect(x + 12, y + 3, 4, 12);
                break;
            case 'cactus':
                this.ctx.fillStyle = '#228B22';
                this.ctx.fillRect(x - 6, y - 15, 12, 30);
                this.ctx.fillRect(x - 12, y - 5, 6, 10);
                this.ctx.fillRect(x + 6, y - 5, 6, 10);
                break;
            case 'tree':
                this.ctx.fillStyle = '#8B4513';
                this.ctx.fillRect(x - 4, y, 8, 15);
                this.ctx.fillStyle = '#228B22';
                this.ctx.beginPath();
                this.ctx.arc(x, y - 5, 12, 0, Math.PI * 2);
                this.ctx.fill();
                break;
            case 'rock':
                this.ctx.fillStyle = '#808080';
                this.ctx.fillRect(x - 10, y - 10, 20, 20);
                this.ctx.fillStyle = '#696969';
                this.ctx.fillRect(x - 7, y - 7, 14, 14);
                break;
        }
    }

    // Weather effects
    updateWeather(environment) {
        // Sníh
        if (environment === 'snow') {
            // Přidat nové vločky
            if (Math.random() < 0.3) {
                this.weatherParticles.push({
                    x: Math.random() * this.width,
                    y: -5,
                    speed: 2 + Math.random() * 3,
                    size: 2 + Math.random() * 3,
                    type: 'snow'
                });
            }
        }

        // Déšť
        if (environment === 'rain') {
            if (Math.random() < 0.5) {
                this.weatherParticles.push({
                    x: Math.random() * this.width,
                    y: -5,
                    speed: 8 + Math.random() * 4,
                    size: 1 + Math.random(),
                    type: 'rain'
                });
            }
        }

        // Písečná bouře
        if (environment === 'desert' && Math.random() < 0.01) {
            if (Math.random() < 0.1) {
                this.weatherParticles.push({
                    x: Math.random() * this.width,
                    y: Math.random() * this.height,
                    speed: 3 + Math.random() * 2,
                    size: 4 + Math.random() * 6,
                    type: 'sand',
                    dx: 2 + Math.random() * 3
                });
            }
        }

        // Update a render particles
        this.weatherParticles = this.weatherParticles.filter(p => {
            p.y += p.speed;
            if (p.type === 'sand') {
                p.x += p.dx;
            }

            // Render
            if (p.type === 'snow') {
                this.ctx.fillStyle = '#FFFFFF';
                this.ctx.fillRect(p.x, p.y, p.size, p.size);
            } else if (p.type === 'rain') {
                this.ctx.fillStyle = '#ADD8E6';
                this.ctx.fillRect(p.x, p.y, p.size, p.size * 3);
            } else if (p.type === 'sand') {
                this.ctx.fillStyle = 'rgba(238, 214, 175, 0.5)';
                this.ctx.fillRect(p.x, p.y, p.size, p.size);
            }

            return p.y < this.height && (p.type !== 'sand' || p.x < this.width);
        });
    }

    // Renderovat text
    renderText(text, x, y, size = 20, color = '#FFF') {
        this.ctx.fillStyle = color;
        this.ctx.font = `${size}px monospace`;
        this.ctx.textAlign = 'center';
        this.ctx.fillText(text, x, y);
    }

    // Particle efekty (exploze, jiskry)
    addParticles(x, y, count, color) {
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8,
                life: 30,
                color: color
            });
        }
    }

    updateParticles() {
        this.particles = this.particles.filter(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.life--;

            this.ctx.fillStyle = p.color;
            this.ctx.globalAlpha = p.life / 30;
            this.ctx.fillRect(p.x, p.y, 3, 3);
            this.ctx.globalAlpha = 1.0;

            return p.life > 0;
        });
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Renderer;
}
