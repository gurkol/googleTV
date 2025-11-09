# River Rider 🚁

Pixel art vertikální scrolling shooter inspirovaný klasickou hrou **River Raid** od Activision (1982).

## 📝 Popis

River Rider je akční hra, kde létáte s letadlem nad nekonečně se scrollující řekou. Vyhýbejte se břehům, střílíte nepřátele a doplňujete palivo. Vydržte co nejdéle a dosáhněte co nejvyššího skóre!

## 🎮 Herní mechanika

### Základní principy
- **Scrollující řeka** s dynamicky se měnící šířkou
- **Palivo** se neustále snižuje - musíte sbírat palivové bóje
- **Nepřátelé** se objevují v řece (lodě a vrtulníky)
- **Životy** - začínáte s 3 životy
- **Progresivní obtížnost** - hra postupně zrychluje

### Herní objekty

#### Hráč (zelené letadlo)
- Pohyblivé ve všech směrech
- Střílí projektily
- Umírá při:
  - Nárazu do břehu
  - Zásahu nepřítelem
  - Dojití paliva

#### Nepřátelé
- **Lodě** (červené) - pohybují se po řece
- **Vrtulníky** (červené) - létají nad řekou
- Lze je sestřelit projektily
- Za zničení získáte **100 bodů**

#### Palivové bóje (cyan)
- Doplní **40%** paliva
- Za sebrání získáte **50 bodů**
- Pulsují pro lepší viditelnost

#### Řeka
- Břehy (zelené) - okamžitá smrt při nárazu
- Voda (modrá) - bezpečná pro let
- Šířka se dynamicky mění

## 🕹️ Ovládání

### Klávesnice
- **Šipky** nebo **WASD** - pohyb letadla
- **Mezerník** nebo **Enter** - střelba

### Google TV (D-pad)
- **D-pad** - pohyb
- **Center/Select** - střelba

## 🎯 Cíle a skóre

- **+1 bod** za každý snímek přežití
- **+100 bodů** za zničení nepřítele
- **+50 bodů** za sebrání paliva
- Snažte se přežít co nejdéle a získat co nejvyšší skóre!

## 🔊 Zvukové efekty

Hra obsahuje procedurálně generované zvuky pomocí Web Audio API:
- **Střelba** - laser zvuk
- **Exploze** - basový rachot při zásahu
- **Sebrání paliva** - stoupající tón
- **Zásah hráče** - varovný zvuk

## 🎨 Vizuální styl

- **Pixel art** retro grafika
- **Plynulé animace** - motory letadla, vrtule vrtulníků
- **Efekty částic** při explozích
- **Pulsující objekty** - palivové bóje
- **Invulnerabilita** - blikání po zásahu

## 📦 Instalace

### Předpoklady
- **Google TV** zařízení nebo Android TV
- **ADB** (Android Debug Bridge) - pro instalaci APK

### Stažení
Stáhněte si `riverRider.apk` z [releases](../../releases) nebo sestavte ze zdrojového kódu.

### Instalace přes ADB

```bash
# Připojte se k vašemu Google TV
adb connect <IP_adresa_vašeho_Google_TV>

# Nainstalujte APK
adb install riverRider.apk
```

### Instalace pomocí USB

1. Přeneste APK na USB flash disk
2. Připojte USB k Google TV
3. Použijte správce souborů na Google TV
4. Najděte a nainstalujte APK

## 🛠️ Sestavení ze zdrojového kódu

### Předpoklady
- **JDK 17** nebo novější
- **Android SDK** s API 34
- **Gradle 8.0** (přiložen wrapper)

### Build proces

```bash
# Nastavte ANDROID_HOME (pokud není nastaveno)
export ANDROID_HOME=/cesta/k/android/sdk

# Sestavte APK
./gradlew assembleDebug

# APK bude v:
# app/build/outputs/apk/debug/app-debug.apk
```

Nebo použijte hlavní build skript z kořenového adresáře:

```bash
cd ..
./build.sh
```

## 🧪 Testování ve webovém prohlížeči

Můžete testovat herní logiku přímo v prohlížeči:

```bash
# Otevřete v prohlížeči
open www/index.html

# Nebo spusťte lokální server
python3 -m http.server 8000
# Pak otevřete http://localhost:8000/www/
```

## 📁 Struktura projektu

```
riverRider/
├── app/
│   ├── src/main/
│   │   ├── java/com/riverrider/
│   │   │   └── MainActivity.java      # Android wrapper
│   │   ├── res/
│   │   │   ├── drawable/
│   │   │   │   └── banner.png         # Google TV banner (320x180)
│   │   │   └── mipmap/
│   │   │       └── ic_launcher.png    # Launcher ikona (192x192)
│   │   └── assets/www/                # HTML5 hra
│   └── build.gradle
├── www/                                # Webová verze hry
│   ├── index.html
│   ├── css/styles.css
│   └── js/game.js                     # Hlavní herní logika
├── build.gradle
├── settings.gradle
└── README.md
```

## 🎯 Technické detaily

### Technologie
- **HTML5 Canvas** - rendering
- **JavaScript (Vanilla)** - herní logika
- **Web Audio API** - zvukové efekty
- **Android WebView** - wrapper pro Google TV
- **Gradle** - build systém

### Herní smyčka
- **60 FPS** pomocí `requestAnimationFrame`
- **Aktualizace fyziky** každý snímek
- **Spawning** objektů pomocí pravděpodobnostních kontrol
- **Detekce kolizí** AABB (Axis-Aligned Bounding Box)

### Výkon
- **Velikost APK**: ~4 MB
- **Minimální Android**: API 21 (Android 5.0)
- **Cílové Android**: API 34 (Android 14)

## 🐛 Známé problémy

- Webová verze vyžaduje moderní prohlížeč s podporou ES6+
- Audio může vyžadovat uživatelskou interakci pro spuštění (omezení prohlížečů)

## 📄 Licence

Tento projekt byl vytvořen pro vzdělávací účely.

## 🙏 Poděkování

Inspirováno klasickou hrou **River Raid** od Carol Shaw (Activision, 1982).

## 🔗 Související projekty

- [Diamantový Muž](../diamantovyMuz/) - Boulder Dash klon
- [Google TV Games](../) - Kolekce retro her

---

Vytvořeno pomocí [Claude Code](https://claude.com/claude-code) 🤖
