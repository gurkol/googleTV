#!/bin/bash

# Build script for River Rider APK
set -e

echo "🎮 Building River Rider APK..."
echo ""

# Check for Android SDK
if [ -z "$ANDROID_HOME" ] && [ -z "$ANDROID_SDK_ROOT" ]; then
    # Try to find SDK in common locations
    if [ -d "$HOME/Library/Android/sdk" ]; then
        export ANDROID_HOME="$HOME/Library/Android/sdk"
        echo "✓ Found Android SDK at: $ANDROID_HOME"
    elif [ -d "$HOME/Android/Sdk" ]; then
        export ANDROID_HOME="$HOME/Android/Sdk"
        echo "✓ Found Android SDK at: $ANDROID_HOME"
    else
        echo "❌ Error: Android SDK not found!"
        echo ""
        echo "Please install Android SDK using one of these methods:"
        echo ""
        echo "1. Install Android Studio:"
        echo "   https://developer.android.com/studio"
        echo ""
        echo "2. Install command line tools only:"
        echo "   https://developer.android.com/studio#command-tools"
        echo ""
        echo "3. Or set ANDROID_HOME environment variable:"
        echo "   export ANDROID_HOME=/path/to/android/sdk"
        echo ""
        exit 1
    fi
else
    echo "✓ Using Android SDK from environment variable"
fi

# Create local.properties if it doesn't exist
cd riverRider
if [ ! -f "local.properties" ]; then
    echo "sdk.dir=$ANDROID_HOME" > local.properties
    echo "✓ Created local.properties"
fi

# Clean previous builds
echo "🧹 Cleaning previous builds..."
if [ -d "build" ]; then
    rm -rf build
fi
if [ -d "app/build" ]; then
    rm -rf app/build
fi

# Build debug APK using gradlew
echo "🔨 Building debug APK..."
./gradlew assembleDebug

# Find the generated APK
APK_PATH=$(find app/build/outputs/apk/debug -name "*.apk" | head -n 1)

if [ -z "$APK_PATH" ]; then
    echo "❌ Error: APK not found!"
    exit 1
fi

# Copy APK to root directory
echo "📦 Copying APK to root directory..."
cp "$APK_PATH" ../riverRider.apk

cd ..

echo ""
echo "✅ Build complete! APK created: riverRider.apk"
ls -lh riverRider.apk
echo ""
echo "To install on your device:"
echo "  adb install riverRider.apk"
echo ""
