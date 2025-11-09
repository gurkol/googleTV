# Building River Rider APK

## Prerequisites

Before building, you need to have Android SDK installed.

### Option 1: Install Android Studio (Recommended)
1. Download from https://developer.android.com/studio
2. Install and open Android Studio
3. SDK will be installed automatically at `~/Library/Android/sdk` (macOS)

### Option 2: Command Line Tools Only
1. Download from https://developer.android.com/studio#command-tools
2. Extract to your preferred location
3. Set ANDROID_HOME environment variable:
   ```bash
   export ANDROID_HOME=/path/to/android/sdk
   ```

## Building

### Using the build script (Easy)

Simply run the build script from the root directory:

```bash
cd /path/to/googleTV
./build.sh
```

This will:
- Check for Android SDK
- Build the debug APK
- Copy `riverRider.apk` to the root directory

### Using Gradle directly

From the `riverRider` directory:

```bash
cd riverRider

# Create local.properties (first time only)
echo "sdk.dir=$ANDROID_HOME" > local.properties

# Build debug APK
./gradlew assembleDebug
```

The APK will be at: `app/build/outputs/apk/debug/app-debug.apk`

### Release Build

To build a release APK:

```bash
./gradlew assembleRelease
```

Note: For release builds, you'll need to configure signing in `app/build.gradle`

## Installing on Device

### Via ADB

```bash
adb install riverRider.apk
```

### Via Google TV

1. Transfer the APK to your Google TV device
2. Install using a file manager app
3. Grant necessary permissions

## Troubleshooting

### SDK location not found

Make sure ANDROID_HOME is set or `local.properties` exists with:
```
sdk.dir=/path/to/android/sdk
```

### Gradle version errors

The project uses Gradle 8.0. If you get version errors, the gradle wrapper should download the correct version automatically.

### Build fails with "module" error

This occurs with very new Gradle versions (9.x+). The project is configured to use Gradle 8.0 via the wrapper, which should avoid this issue.
