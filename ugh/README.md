# Ugh! - Prehistoric Helicopter Taxi

Google TV version of the classic 1992 action game Ugh!, featuring caveman helicopter taxi gameplay with lunar lander physics.

## Description

Ugh! is a prehistoric helicopter taxi game where you pilot a pedal-powered helicopter to transport cave people to their destinations. The game features challenging lunar lander-style physics with gravity and inertia, requiring careful control of your thrust to safely pick up and drop off passengers while avoiding dangers.

## Gameplay

### Objective

- Pick up waiting passengers (waving cave people)
- Safely transport them to their destination (marked with red flags)
- Avoid crashes, enemies, and obstacles
- Manage your fuel and pilot energy
- Progress through increasingly difficult levels

### Core Mechanics

**Lunar Lander Physics:**
- Gravity constantly pulls your helicopter down
- Thrust counters gravity but consumes fuel
- Horizontal thrust provides lateral movement
- Inertia means you'll keep moving until you counter it
- Landing too hard will damage your helicopter

**Resource Management:**
- **Fuel**: Consumed when using thrust. Refuel at the fuel station (costs points)
- **Energy**: Your pilot gets tired. Collect fruit from trees to restore energy
- **Health**: Damaged by crashes, hard landings, and enemy collisions

## Controls

Use your Google TV remote's D-pad:

- **D-pad Up** - Vertical thrust (counteracts gravity)
- **D-pad Left/Right** - Horizontal thrust
- **D-pad Center** - Select (restart when game over)

## Game Elements

### Friendly Elements

- **Helicopter** - Your pedal-powered prehistoric helicopter with a rotor
- **Passengers** - Cave people waiting to be transported (waving at you)
- **Destinations** - Red flags marking where passengers want to go
- **Fuel Station** - Refuel here (golden platform with "F" sign)
- **Fruit Trees** - Green trees with red fruit to restore pilot energy

### Hazards

- **Pterosaurs** - Flying purple enemies that damage your helicopter on contact
- **Ground** - Rocky terrain with varying heights
- **Stalactites** - Gray stone formations hanging from above
- **Hard Landings** - Landing too fast damages your helicopter
- **Gravity** - Constantly pulls you down

## Scoring

- **+10 points** - Pick up a passenger
- **+50 points** - Successfully deliver a passenger
- **+20 points** - Collect fruit for energy
- **-0.1 points/sec** - While refueling (fuel costs points!)
- **+100 points** - Complete a level

## Technical Details

### Architecture

- **Frontend**: HTML5 Canvas with JavaScript game engine
- **Physics**: Custom lunar lander physics with gravity, thrust, and inertia
- **Backend**: Android WebView wrapper for Google TV
- **Build System**: Gradle 8.0 with Android Gradle Plugin 8.1.0
- **Minimum API Level**: 21 (Android 5.0)
- **Target API Level**: 34 (Android 14)

### Project Structure

```
ugh/
├── app/
│   ├── src/main/
│   │   ├── assets/www/           # Web assets
│   │   │   ├── index.html        # Main game page
│   │   │   ├── css/
│   │   │   │   └── ugh.css       # Game styles
│   │   │   └── js/
│   │   │       └── ugh.js        # Game engine (600+ lines)
│   │   ├── java/com/ugh/
│   │   │   └── MainActivity.java # Android wrapper
│   │   ├── res/
│   │   │   ├── drawable/
│   │   │   │   └── banner.png    # TV banner (320x180)
│   │   │   └── mipmap/
│   │   │       └── ic_launcher.png # App icon (192x192)
│   │   └── AndroidManifest.xml
│   └── build.gradle
├── build.gradle
├── settings.gradle
└── README.md
```

### Key Features

- **Lunar lander physics** - Realistic gravity, thrust, and inertia
- **Taxi gameplay** - Transport passengers between locations
- **Resource management** - Balance fuel, energy, and health
- **Particle effects** - Thrust particles, explosions
- **Progressive difficulty** - More enemies each level
- **Full-screen immersive mode** - No system UI
- **Google TV optimized** - Leanback launcher support
- **D-pad controls** - Native TV remote support

## Physics Implementation

The game implements authentic lunar lander physics:

```javascript
// Gravity constantly applied
helicopter.vy += GRAVITY;

// Thrust counteracts gravity
if (keys.up && fuel > 0) {
  helicopter.vy -= THRUST_POWER;
}

// Horizontal thrust with damping
helicopter.vx *= 0.98;  // Air resistance
helicopter.x += helicopter.vx;
helicopter.y += helicopter.vy;
```

## Building

### Prerequisites

- Android SDK (API level 34)
- Gradle 8.0+
- Java 11+

### Build Commands

```bash
# Using the master build script (recommended)
cd /Users/mq/DEVEL/claude/googleTV
./build.sh

# Or build individually
cd ugh
./gradlew assembleDebug
```

The APK will be generated at:
`app/build/outputs/apk/debug/app-debug.apk` (4.2MB)

## Installation

Install on your Google TV device via ADB:

```bash
adb install ugh.apk
```

Or sideload using the Google TV interface and a file manager app.

## Game Tips

1. **Gentle Landings**: Always slow down before landing. Use upward thrust to reduce descent speed to less than 2 units.

2. **Fuel Management**: Fuel is precious and costs points. Try to minimize thrust usage and plan efficient routes.

3. **Energy Conservation**: Your pilot gets tired quickly. Collect fruit whenever possible to maintain energy levels.

4. **Avoid Enemies**: Pterosaurs are unpredictable. Give them wide berth or wait for them to pass.

5. **Physics Mastery**: Understand inertia - you'll keep drifting in a direction until you counter it with thrust in the opposite direction.

6. **Safe Routes**: Study the level layout before rushing to pick up passengers. Plan the safest route.

## Game Credits

Based on the original Ugh! game created by Ego Soft GmbH in 1992 for MS-DOS and Amiga platforms. The original game featured 69 levels of prehistoric helicopter taxi action.

This is a modern recreation optimized for Google TV with enhanced graphics and smooth gameplay.

## License

This is a fan recreation for educational and entertainment purposes. Original Ugh! is a trademark of its respective owners.
