# Google TV Retro Games 🎮

Kolekce klasických retro her přenesených do pixelartového stylu pro **Google TV** a **Android TV**.

## 🎲 Hry v kolekci

### 1. River Rider 🚁
**Vertikální scrolling shooter inspirovaný River Raid**

- 📝 Létejte nad nekonečně scrollující řekou
- 🎯 Střílíte nepřátele (lodě a vrtulníky)
- ⛽ Sbírejte palivo a vyhýbejte se břehům
- 💥 3 životy, progresivní obtížnost

[📖 Dokumentace River Rider](riverRider/README.md)

### 2. Diamantový Muž 💎
**Puzzle-action kopací hra inspirovaná Boulder Dash**

- 🎯 Sbírejte diamanty v podzemních jeskyních
- 🪨 Pozor na padající kameny!
- 🧩 Fyzika gravitace a kutálení
- 📈 Level systém s progresivní obtížností

[📖 Dokumentace Diamantový Muž](diamantovyMuz/README.md)

### 3. Velký Americký Závod 🏁🇺🇸
**Epický top-down racing game napříč celou Amerikou**

- 🗺️ Všech **50 amerických států** - kompletní cesta!
- 🌨️ **8 různých prostředí** - sníh, pouště, hory, Florida...
- 🚗 **Dynamická fyzika** - kluzkost, aquaplaning, stoupání
- ⛽ **Tankování paliva** - strategické plánování trasy
- 🎯 Progresivní obtížnost - každý stát je výzva!

[📖 Dokumentace Velký Americký Závod](velkyAmerickyZavod/README.md)

## ⚡ Quick Start

### Instalace her na Google TV

```bash
# Stáhněte APK soubory nebo je sestavte
./build.sh

# Připojte se k Google TV
adb connect <IP_adresa_vašeho_Google_TV>

# Nainstalujte hry
adb install riverRider.apk
adb install diamantovyMuz.apk
adb install velkyAmerickyZavod.apk
```

### Hry se automaticky objeví v sekci "Games" na vašem Google TV! 🎮

## 🎯 Vlastnosti

### Optimalizováno pro Google TV
- ✅ **D-pad ovládání** - plně kompatibilní s dálkovým ovladačem
- ✅ **Leanback launcher** - zobrazení v TV rozhraní
- ✅ **Landscape mode** - optimalizace pro televizní obrazovky
- ✅ **`android:isGame="true"`** - správné zařazení mezi hry
- ✅ **TV bannery** - krásné 320×180 px bannery pro menu

### Technologie
- 🎨 **HTML5 Canvas** - pixel art rendering
- 🎵 **Web Audio API** - retro zvukové efekty
- 📱 **Android WebView** - native wrapper
- 🎮 **Vanilla JavaScript** - bez závislostí
- 🔧 **Gradle 8.0** - moderní build systém

### Herní vlastnosti
- 🕹️ **60 FPS** plynulý gameplay
- 🎨 **Pixel art** retro grafika
- 🔊 **Procedurální audio** - generované zvuky
- 💾 **Malá velikost** - každá hra ~4 MB
- 🎯 **Instant load** - okamžité spuštění

## 🛠️ Build & Development

### Předpoklady

```bash
# Java 17+
java -version

# Android SDK
export ANDROID_HOME=/path/to/android/sdk

# Gradle (wrapper je již součástí)
./riverRider/gradlew --version
```

### Sestavení všech her

```bash
# Sestaví obě hry najednou
./build.sh

# Výstup:
# ✅ riverRider.apk (4.0 MB)
# ✅ diamantovyMuz.apk (4.0 MB)
```

### Sestavení jednotlivých her

```bash
# River Rider
cd riverRider
./gradlew assembleDebug

# Diamantový Muž
cd diamantovyMuz
./gradlew assembleDebug
```

### Vývoj a testování

#### Webová verze (rychlé testování)
```bash
# River Rider
open riverRider/www/index.html

# Diamantový Muž
open diamantovyMuz/www/index.html

# Nebo s HTTP serverem
python3 -m http.server 8000
# http://localhost:8000/riverRider/www/
```

#### Android emulator
```bash
# Spusťte emulátor
emulator -avd <avd_name>

# Nainstalujte
adb install riverRider.apk
```

#### Google TV (fyzické zařízení)
```bash
# Zapněte ADB debugging na Google TV:
# Nastavení → Systém → O zařízení → Klikněte 7× na "Sestavení"
# Nastavení → Systém → Pro vývojáře → USB debugging

# Zjistěte IP adresu Google TV:
# Nastavení → Síť & Internet → Vaše síť → Informace

# Připojte se
adb connect 192.168.1.XXX:5555

# Instalujte
adb install riverRider.apk
```

## 📁 Struktura projektu

```
googleTV/
├── riverRider/              # River Raid klon
│   ├── app/                 # Android projekt
│   │   └── src/main/
│   │       ├── java/        # MainActivity
│   │       ├── res/         # Ikony, bannery
│   │       └── assets/www/  # HTML5 hra
│   ├── www/                 # Webová verze
│   ├── build.gradle
│   └── README.md
│
├── diamantovyMuz/           # Boulder Dash klon
│   ├── app/                 # Android projekt
│   │   └── src/main/
│   │       ├── java/        # MainActivity
│   │       ├── res/         # Ikony, bannery
│   │       └── assets/www/  # HTML5 hra
│   ├── www/                 # Webová verze
│   ├── build.gradle
│   └── README.md
│
├── velkyAmerickyZavod/      # Cross-Country Racing
│   ├── app/                 # Android projekt
│   │   └── src/main/
│   │       ├── java/        # MainActivity
│   │       ├── res/         # Ikony, bannery
│   │       └── assets/www/  # HTML5 hra
│   ├── www/                 # Webová verze
│   │   └── js/
│   │       ├── engine/      # Modulární engine
│   │       └── states/      # 50 US států
│   ├── build.gradle
│   └── README.md
│
├── build.sh                 # Master build skript
├── README.md                # Tento soubor
└── .gitignore
```

## 🎨 Design Philosophy

### Pixel Art
- **Autentický retro styl** - věrnost originálu
- **32×32 px dlaždice** pro Boulder Dash
- **Plynulé animace** - 60 FPS
- **Jasné barvy** - dobře viditelné na TV

### Ovládání
- **Jednoduché** - pouze D-pad
- **Responzivní** - okamžitá odezva
- **Přirozené** - intuitivní pro každého

### Audio
- **Procedurální** - generované zvuky pomocí Web Audio API
- **8-bit aesthetic** - nostalgické zvuky
- **Bez externích souborů** - vše v kódu

## 🚀 Roadmap

### Aktuální stav
- ✅ **River Rider** - River Raid klon (HOTOVO!)
- ✅ **Diamantový Muž** - Boulder Dash klon (HOTOVO!)
- ✅ **Velký Americký Závod** - Cross-Country Racing (HOTOVO!)

### Plánované hry
- [ ] **PacMan klon** - klasická honička
- [ ] **Tetris klon** - puzzle klasika
- [ ] **Space Invaders klon** - retro shooter
- [ ] **Snake klon** - jednoduchá hra

### Vylepšení
- [ ] **High score** - ukládání nejlepších výsledků
- [ ] **Více levelů** - předpřipravené levely
- [ ] **Hudba** - background music
- [ ] **Multiplayer** - lokální hra pro 2 hráče

## 🤝 Přispívání

Příspěvky jsou vítány!

### Jak přispět
1. Fork repozitáře
2. Vytvořte feature branch (`git checkout -b feature/NovaHra`)
3. Commit změny (`git commit -m 'Add: Nova hra'`)
4. Push do branch (`git push origin feature/NovaHra`)
5. Otevřete Pull Request

### Coding guidelines
- ✅ Vanilla JavaScript (žádné frameworky)
- ✅ Pixel art styl
- ✅ Web Audio API pro zvuky
- ✅ 60 FPS gameplay
- ✅ D-pad first ovládání
- ✅ Dokumentace v češtině

## 📊 Technické specifikace

### Požadavky na Google TV
- **Minimální Android**: API 21 (Android 5.0 Lollipop)
- **Doporučený Android**: API 34 (Android 14)
- **D-pad**: Povinný (touchscreen volitelný)
- **Rozlišení**: Optimalizováno pro 1080p/4K

### Build konfigurace
- **Gradle**: 8.0
- **Android Gradle Plugin**: 8.1.0
- **Java**: 17 (OpenJDK)
- **Compile SDK**: 34
- **Min SDK**: 21
- **Target SDK**: 34

### APK velikosti
| Hra | Debug APK | Release APK |
|-----|-----------|-------------|
| River Rider | ~4.0 MB | TBD |
| Diamantový Muž | ~4.0 MB | TBD |
| Velký Americký Závod | ~1.7 MB | TBD |

## 🐛 Řešení problémů

### Build chyby

**SDK nenalezen**
```bash
# Nastavte ANDROID_HOME
export ANDROID_HOME=$HOME/Library/Android/sdk  # macOS
export ANDROID_HOME=/opt/android-sdk           # Linux
```

**Gradle chyby**
```bash
# Vymažte build cache
./gradlew clean
rm -rf .gradle build
```

### Instalační problémy

**ADB nevidí zařízení**
```bash
# Restartujte ADB server
adb kill-server
adb start-server
adb devices
```

**APK se nenainstaluje**
```bash
# Odinstalujte starou verzi
adb uninstall com.riverrider
adb uninstall com.diamantovymuz

# Znovu nainstalujte
adb install -r riverRider.apk
```

## 📄 Licence

Tento projekt byl vytvořen pro vzdělávací a zábavné účely.

## 🙏 Poděkování

Inspirováno klasickými hrami:
- **River Raid** (Carol Shaw, Activision, 1982)
- **Boulder Dash** (Peter Liepa, First Star Software, 1984)

A celé retro herní komunitě! 🎮

## 📞 Kontakt

- 🐛 **Issues**: [GitHub Issues](https://github.com/gurkol/googleTV/issues)
- 💬 **Diskuze**: [GitHub Discussions](https://github.com/gurkol/googleTV/discussions)

---

**Vytvořeno pomocí [Claude Code](https://claude.com/claude-code)** 🤖

Enjoy retro gaming on your Google TV! 🎮📺
