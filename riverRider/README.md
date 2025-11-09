# River Rider

Pixel art hra inspirovaná klasickou hrou River Raid pro Google TV.

## Popis

River Rider je vertikální scrolling shooter, kde létáte nad řekou, vyhýbáte se břehům, střílíte nepřátele a doplňujete palivo.

## Ovládání

- **Šipky / WASD**: Pohyb letadla
- **Mezerník / Enter**: Střelba

## Funkce

- Pixel art grafika
- Scrollující řeka s měnící se šířkou
- Nepřátelské lodě a vrtulníky
- Systém paliva s možností doplnění
- Systém životů
- Skóre

## Vývoj

### Web verze

Otevřete `www/index.html` v prohlížeči pro testování web verze.

### Android/Google TV APK

Pro sestavení APK pro Google TV:

```bash
./gradlew assembleDebug
```

APK se vytvoří v `app/build/outputs/apk/debug/app-debug.apk`

Pro release verzi:

```bash
./gradlew assembleRelease
```

## Technologie

- HTML5 Canvas
- JavaScript (vanilla)
- CSS3
- Android WebView
- Gradle build system
