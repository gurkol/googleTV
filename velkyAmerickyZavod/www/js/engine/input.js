// Input.js - Ovládací systém pro Velký Americký Závod
// Podporuje klávesnici, D-pad (Google TV), touch

class InputManager {
    constructor() {
        // Input state
        this.input = {
            up: false,
            down: false,
            left: false,
            right: false,
            action: false  // Pro možné budoucí akce (turbo, klakson)
        };

        // Rate limiting pro kontinuální input
        this.lastInputTime = 0;
        this.inputDelay = 50; // ms

        // Bind event listeners
        this.setupKeyboardListeners();
        this.setupTouchListeners();
    }

    setupKeyboardListeners() {
        // Klávesnice a D-pad ovládání
        document.addEventListener('keydown', (e) => {
            this.handleKeyDown(e);
        });

        document.addEventListener('keyup', (e) => {
            this.handleKeyUp(e);
        });
    }

    handleKeyDown(e) {
        switch(e.key) {
            // Šipky
            case 'ArrowUp':
                this.input.up = true;
                e.preventDefault();
                break;
            case 'ArrowDown':
                this.input.down = true;
                e.preventDefault();
                break;
            case 'ArrowLeft':
                this.input.left = true;
                e.preventDefault();
                break;
            case 'ArrowRight':
                this.input.right = true;
                e.preventDefault();
                break;

            // WASD
            case 'w':
            case 'W':
                this.input.up = true;
                e.preventDefault();
                break;
            case 's':
            case 'S':
                this.input.down = true;
                e.preventDefault();
                break;
            case 'a':
            case 'A':
                this.input.left = true;
                e.preventDefault();
                break;
            case 'd':
            case 'D':
                this.input.right = true;
                e.preventDefault();
                break;

            // Akce (mezerník, Enter, Center button na D-pad)
            case ' ':
            case 'Enter':
                this.input.action = true;
                e.preventDefault();
                break;
        }
    }

    handleKeyUp(e) {
        switch(e.key) {
            // Šipky
            case 'ArrowUp':
                this.input.up = false;
                break;
            case 'ArrowDown':
                this.input.down = false;
                break;
            case 'ArrowLeft':
                this.input.left = false;
                break;
            case 'ArrowRight':
                this.input.right = false;
                break;

            // WASD
            case 'w':
            case 'W':
                this.input.up = false;
                break;
            case 's':
            case 'S':
                this.input.down = false;
                break;
            case 'a':
            case 'A':
                this.input.left = false;
                break;
            case 'd':
            case 'D':
                this.input.right = false;
                break;

            // Akce
            case ' ':
            case 'Enter':
                this.input.action = false;
                break;
        }
    }

    // Touch/swipe ovládání pro mobilní zařízení
    setupTouchListeners() {
        let touchStartX = 0;
        let touchStartY = 0;

        document.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        }, { passive: true });

        document.addEventListener('touchmove', (e) => {
            if (!touchStartX || !touchStartY) return;

            const touchX = e.touches[0].clientX;
            const touchY = e.touches[0].clientY;

            const diffX = touchX - touchStartX;
            const diffY = touchY - touchStartY;

            // Swipe detection
            if (Math.abs(diffX) > Math.abs(diffY)) {
                // Horizontální swipe
                if (diffX > 30) {
                    this.input.right = true;
                    this.input.left = false;
                } else if (diffX < -30) {
                    this.input.left = true;
                    this.input.right = false;
                }
            } else {
                // Vertikální swipe
                if (diffY < -30) {
                    this.input.up = true;
                    this.input.down = false;
                } else if (diffY > 30) {
                    this.input.down = true;
                    this.input.up = false;
                }
            }
        }, { passive: true });

        document.addEventListener('touchend', () => {
            // Reset inputs po touch end
            setTimeout(() => {
                this.input.left = false;
                this.input.right = false;
                this.input.up = false;
                this.input.down = false;
            }, 100);
        });
    }

    // Získat aktuální input state
    getInput() {
        return this.input;
    }

    // Reset všech inputů
    reset() {
        this.input = {
            up: false,
            down: false,
            left: false,
            right: false,
            action: false
        };
    }

    // Kontrola, zda je stisknut nějaký input
    anyInputActive() {
        return this.input.up || this.input.down ||
               this.input.left || this.input.right ||
               this.input.action;
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InputManager;
}
