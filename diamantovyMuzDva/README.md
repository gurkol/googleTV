# Diamantový Muž 2 (Boulder Dash 2)

Google TV version of the classic Boulder Dash game, optimized for TV controls and full-screen gameplay.

## Description

Diamantový Muž 2 is a Boulder Dash clone built with HTML5 Canvas and wrapped in an Android WebView for Google TV. This version includes 50+ levels (caves) with increasing difficulty, featuring the classic Boulder Dash gameplay mechanics.

## Game Elements

- **Rockford** - The player character you control
- **Diamonds** - Collect these to complete each level
- **Boulders** - Heavy rocks that fall with gravity
- **Dirt** - Dig through to create paths
- **Walls** - Various types of indestructible barriers
- **Enemies** - Butterflies, fireflies, and amoebas
- **Magic Walls** - Special walls that transform falling objects
- **Exit Door** - Appears when enough diamonds are collected

## Controls

Use your Google TV remote's D-pad to control Rockford:

- **D-pad Up/Down/Left/Right** - Move in the corresponding direction
- **D-pad Center/OK** - Confirm/Select

The game responds to arrow key events forwarded from the Android WebView.

## Technical Details

### Architecture

- **Frontend**: HTML5 Canvas with JavaScript game engine
- **Backend**: Android WebView wrapper for Google TV
- **Build System**: Gradle 8.0 with Android Gradle Plugin 8.1.0
- **Minimum API Level**: 21 (Android 5.0)
- **Target API Level**: 34 (Android 14)

### Project Structure

```
diamantovyMuzDva/
├── app/
│   ├── src/main/
│   │   ├── assets/www/           # Web assets
│   │   │   ├── index.html        # Main game page
│   │   │   ├── css/
│   │   │   │   └── boulderdash.css
│   │   │   ├── js/
│   │   │   │   ├── boulderdash.js  # Game engine
│   │   │   │   └── caves.js        # Level data
│   │   │   └── images/
│   │   │       └── sprites.png     # Game sprites (32x32)
│   │   ├── java/com/diamantovymuzDva/
│   │   │   └── MainActivity.java   # Android wrapper
│   │   ├── res/
│   │   │   ├── drawable/
│   │   │   │   └── banner.png      # TV banner (320x180)
│   │   │   └── mipmap/
│   │   │       └── ic_launcher.png # App icon (192x192)
│   │   └── AndroidManifest.xml
│   └── build.gradle
├── build.gradle
├── settings.gradle
└── README.md
```

### Key Features

- **Full-screen immersive mode** - No system UI, just the game
- **Google TV optimized** - Proper leanback launcher support
- **D-pad controls** - Native TV remote support
- **Landscape orientation** - Locked for TV viewing
- **Pixel-perfect rendering** - Crisp retro graphics

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
cd diamantovyMuzDva
./gradlew assembleDebug
```

The APK will be generated at:
`app/build/outputs/apk/debug/app-debug.apk` (1.7MB)

## Installation

Install on your Google TV device via ADB:

```bash
adb install diamantovyMuzDva.apk
```

Or sideload using the Google TV interface and a file manager app.

## Game Credits

Based on the original Boulder Dash game created by Peter Liepa and Chris Gray (First Star Software, 1984).

This implementation uses level data and sprites from the classic version, optimized for modern Google TV platforms.

## License

This is a fan recreation for educational and entertainment purposes. Original Boulder Dash is a trademark of BBG Entertainment GmbH.
