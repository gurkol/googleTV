// Physics.js - Fyzikální engine pro Velký Americký Závod
// Řeší jízdu auta, tření, kluzkost, kolize

class Physics {
    constructor() {
        // Fyzikální konstanty
        this.ACCELERATION = 0.5;
        this.DECELERATION = 0.3;
        this.MAX_SPEED = 12;
        this.MIN_SPEED = 3;
        this.TURN_SPEED = 5;

        // Friction multipliers podle prostředí
        this.frictionMultipliers = {
            snow: 0.3,      // Velmi kluzké!
            rain: 0.6,      // Kaluže zpomalují
            mountain: 0.9,
            desert: 0.85,
            plains: 1.0,    // Normální
            forest: 0.8,
            coastal: 0.95,
            urban: 1.0
        };
    }

    // Aktualizovat pozici auta
    updateCarPosition(car, input, environment, roadWidth, roadCurveOffset) {
        const friction = this.frictionMultipliers[environment] || 1.0;

        // Akcelerace/brždění
        if (input.up) {
            car.speed = Math.min(car.speed + this.ACCELERATION * friction, this.MAX_SPEED);
        } else if (input.down) {
            car.speed = Math.max(car.speed - this.DECELERATION * 2, 0);
        } else {
            // Přirozené zpomalení
            car.speed = Math.max(car.speed - this.DECELERATION * 0.5, this.MIN_SPEED);
        }

        // Směr (vlevo/vpravo)
        const turnSpeed = this.TURN_SPEED * friction;
        if (input.left) {
            car.velocityX -= turnSpeed * (car.speed / this.MAX_SPEED);
        }
        if (input.right) {
            car.velocityX += turnSpeed * (car.speed / this.MAX_SPEED);
        }

        // Klouzání na sněhu/ledu - auto pokračuje v původním směru
        if (environment === 'snow' || environment === 'rain') {
            car.velocityX *= 0.95; // Pomalu zpomaluje boční pohyb
        } else {
            car.velocityX *= 0.85; // Rychlejší zpomalení na normálních površích
        }

        // Aplikovat velocity
        car.x += car.velocityX;

        // Kontrola hranic cesty
        const roadCenterX = 320 + roadCurveOffset;
        const roadLeft = roadCenterX - roadWidth / 2 + 20;
        const roadRight = roadCenterX + roadWidth / 2 - 20;

        // Kolize s okrajem cesty
        if (car.x < roadLeft || car.x > roadRight) {
            car.offRoad = true;
            // Dramatické zpomalení mimo cestu
            car.speed *= 0.95;
            car.velocityX *= 0.8;

            // Odraz od okraje
            if (car.x < roadLeft) {
                car.x = roadLeft;
                car.velocityX = Math.abs(car.velocityX) * 0.5;
            }
            if (car.x > roadRight) {
                car.x = roadRight;
                car.velocityX = -Math.abs(car.velocityX) * 0.5;
            }
        } else {
            car.offRoad = false;
        }

        // Omezit extrémní velocity
        car.velocityX = Math.max(-15, Math.min(15, car.velocityX));

        return car;
    }

    // Kontrola kolize s překážkou
    checkCollision(car, obstacle) {
        const carWidth = 24;
        const carHeight = 32;
        const obsWidth = 28;
        const obsHeight = 40;

        // AABB collision detection
        return (
            car.x - carWidth / 2 < obstacle.x + obsWidth / 2 &&
            car.x + carWidth / 2 > obstacle.x - obsWidth / 2 &&
            car.y - carHeight / 2 < obstacle.y + obsHeight / 2 &&
            car.y + carHeight / 2 > obstacle.y - obsHeight / 2
        );
    }

    // Simulovat klouzání na kluzkém povrchu
    applySliding(car, environment) {
        if (environment === 'snow') {
            // Náhodné vybočení kvůli ledu
            if (Math.random() < 0.02) {
                car.velocityX += (Math.random() - 0.5) * 3;
            }
        } else if (environment === 'rain') {
            // Aquaplaning v kaluži
            if (Math.random() < 0.01 && car.speed > 8) {
                car.velocityX += (Math.random() - 0.5) * 5;
            }
        }
    }

    // Efekt stoupání/klesání v horách
    applyElevation(car, environment, scrollOffset) {
        if (environment === 'mountain') {
            // Stoupání zpomaluje, klesání zrychluje
            const elevation = Math.sin(scrollOffset * 0.005);
            if (elevation > 0) {
                // Stoupání - zpomalení
                car.speed *= 0.98;
            } else {
                // Klesání - zrychlení
                car.speed = Math.min(car.speed * 1.01, this.MAX_SPEED * 1.2);
            }
        }
    }

    // Efekt vedra v poušti - přehřívání
    applyHeat(car, environment, distance) {
        if (environment === 'desert') {
            // Dlouhá jízda pouští přehřívá motor
            if (distance % 1000 < 100 && distance > 500) {
                car.speed *= 0.97; // Zpomalení kvůli přehřátí
            }
        }
    }

    // Hustá doprava ve městě
    calculateTrafficDensity(environment) {
        const densities = {
            urban: 0.03,      // Velmi hustá
            coastal: 0.015,
            plains: 0.01,
            forest: 0.005,
            mountain: 0.003,
            desert: 0.001,
            snow: 0.002,
            rain: 0.01
        };
        return densities[environment] || 0.01;
    }

    // Výpočet spotřeby paliva
    calculateFuelConsumption(car, environment) {
        let consumption = 0.1; // Base consumption

        // Rychlost ovlivňuje spotřebu
        consumption += car.speed * 0.01;

        // Prostředí ovlivňuje spotřebu
        const environmentMultipliers = {
            mountain: 1.5,   // Stoupání spotřebovává více
            snow: 1.3,       // Klouzání spotřebovává více
            desert: 1.2,     // Horko zvyšuje spotřebu
            urban: 1.1,      // Městský provoz
            plains: 0.9,     // Nejefektivnější
            forest: 1.0,
            coastal: 1.0,
            rain: 1.1
        };

        consumption *= environmentMultipliers[environment] || 1.0;

        // Jízda mimo cestu spotřebovává více
        if (car.offRoad) {
            consumption *= 2.0;
        }

        return consumption;
    }

    // Výpočet skóre za vzdálenost
    calculateScore(distance, speed, environment) {
        let score = Math.floor(distance / 10);

        // Bonus za rychlost
        if (speed > 10) {
            score += 5;
        }

        // Bonus za obtížné prostředí
        const difficultyBonus = {
            snow: 3,
            mountain: 2,
            rain: 2,
            desert: 1,
            urban: 2,
            forest: 1,
            plains: 0,
            coastal: 0
        };

        score += difficultyBonus[environment] || 0;

        return score;
    }

    // Generovat offset pro zatáčky
    generateRoadCurve(scrollOffset, environment) {
        if (environment === 'mountain' || environment === 'forest') {
            // Více zatáček v horách a lesích
            return Math.sin(scrollOffset * 0.008) * 120;
        } else if (environment === 'plains') {
            // Rovné cesty
            return Math.sin(scrollOffset * 0.002) * 30;
        } else {
            // Střední zatáčení
            return Math.sin(scrollOffset * 0.005) * 80;
        }
    }

    // Výpočet šířky cesty podle prostředí
    getRoadWidth(environment) {
        const widths = {
            urban: 280,      // Široké městské dálnice
            plains: 260,
            coastal: 240,
            desert: 220,
            forest: 200,     // Užší lesní cesty
            mountain: 180,   // Nejužší horské serpentiny
            snow: 200,
            rain: 240
        };
        return widths[environment] || 240;
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Physics;
}
