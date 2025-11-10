# Velký Americký Závod 🏁🇺🇸

Epický top-down racing game inspirovaný klasickou hrou **The Great American Cross-Country Road Race** (Activision, 1985).

## 📝 Popis

Velký Americký Závod je ambiciózní závodní hra, kde cestujete napříč **všemi 50 americkými státy**, každý s jedinečným prostředím, obtížností a výzvami. Od mrazivých hor Aljašky přes horké pouště Arizony až po tropický ráj Havaje!

## 🎮 Herní mechanika

### Základní principy
- **50 států** - kompletní cesta napříč USA
- **8 různých prostředí** s unikátními vlastnostmi
- **Dynamická fyzika** podle prostředí (kluzkost, třen í, vítr)
- **Palivo** se spotřebovává - musíte tankovat
- **3 životy** - havárie stojí život
- **Progresivní obtížnost** - každý stát je náročnější

### Prostředí a jejich vlastnosti

#### 🌨️ Sníh a led (Alaska, Montana, Vermont, Minnesota...)
- **Velmi kluzká cesta** - obtížné řízení
- Náhodné vybočení kvůli ledu
- Sněhové bouře snižují viditelnost
- **Friction: 0.3** - nejnáročnější ovládání!

#### 🌴 Déšť a kaluže (Florida, Louisiana, Georgia...)
- **Kaluže** způsobují aquaplaning
- Déšť snižuje viditelnost
- Kluzké povrchy
- **Friction: 0.6**

#### ⛰️ Hory a serpentiny (Colorado, Utah, Wyoming...)
- **Strmé serpentiny** a zatáčky
- Stoupání zpomaluje, klesání zrychluje
- Úzké silnice
- Skalnaté překážky
- **Nejužší cesty** (180px)

#### 🏜️ Pouště (Arizona, Nevada, Nové Mexiko, Texas...)
- **Horko přehřívá motor**
- Písečné bouře
- Kaktusy jako překážky
- Dlouhé vzdálenosti
- **Friction: 0.85**

#### 🌾 Pláně (Kansas, Nebraska, Iowa...)
- **Rovné dálnice** - nejjednodušší
- Farmářská technika na silnicích
- Tornáda (občas!)
- **Friction: 1.0** - nejlepší ovládání

#### 🌲 Lesy (Oregon, Washington, Pennsylvania...)
- **Husté stromy** po stranách
- Mlha snižuje viditelnost
- Klikaté lesní cesty
- **Friction: 0.8**

#### 🌊 Pobřeží (Kalifornie, Massachusetts...)
- Krásné výhledy na oceán
- Vlny v pozadí
- Středně široké silnice
- **Friction: 0.95**

#### 🏙️ Město (New York)
- **Velmi hustá doprava**
- Široké městské dálnice
- Mnoho aut a kamionů
- **Friction: 1.0** ale obtížné kvůli provozu

## 🕹️ Ovládání

### Klávesnice
- **Šipky** nebo **WASD** - řízení auta
  - Nahoru - Zrychlení
  - Dolů - Brzdění
  - Vlevo/Vpravo - Zatáčení
- **Mezerník** nebo **Enter** - Start/Akce

### Google TV (D-pad)
- **D-pad** - pohyb
- **Center/Select** - start/akce
- Plynulé ovládání optimalizované pro dálkový ovladač

## 🎯 Herní cíle

### Dokončení státu
1. Projeďte celou vzdálenost státu (100-900 km podle státu)
2. Vyhýbejte se překážkám a jiným autům
3. Tankujte palivo na čerpacích stanicích
4. Automaticky postupujete do dalšího státu

### Bodování
- **Průběžné body** za vzdálenost
- **+5 bodů** za rychlost nad 100 km/h
- **+100 bodů** za tankování
- **+1000+ bodů** za dokončení státu (závisí na obtížnosti)

### Progrese
- **Stát 1** (Kalifornie): 500 km, obtížnost 1
- **Stát 49** (Aljaška): 800 km, obtížnost 10
- **Stát 50** (Havaj): 200 km, obtížnost 1 (odměna!)

## 🚗 Fyzika a mechanika

### Spotřeba paliva
- **Základní spotřeba**: 0.1 litrů/snímek
- **Rychlost**: vyšší rychlost = vyšší spotřeba
- **Prostředí**:
  - Hory: +50% spotřeba (stoupání)
  - Sníh: +30% spotřeba (kl ouzání)
  - Poušť: +20% spotřeba (horko)
  - Pláně: -10% spotřeba (nejefektivnější)
- **Mimo cestu**: 2× spotřeba!

### Kluzkost
- Sníh: náhodné vybočení kvůli ledu
- Déšť: aquaplaning při vysoké rychlosti
- Všechny povrchy: různá úroveň tření

### Doprava
- Hustota podle prostředí:
  - Města: velmi hustá
  - Pobřeží, pláně: střední
  - Hory, pouště: řídká
- Různé typy vozidel: osobní auta, kamiony

## 🔊 Zvukové efekty

### Procedurální zvuky (Web Audio API)
- **Motor** - mění se podle rychlosti (80-200 Hz)
- **Kolize** - dramatický crash zvuk
- **Klakson** - 400 Hz píp
- **Smyk/brždění** - šum brzd
- **Tankování** - stoupající tón (200-600 Hz)
- **Dokončení státu** - vítězná melodie (C-E-G)

### Ambientní zvuky
- **Sněhová bouře** - high-pass noise
- **Déšť** - low-pass noise
- **Pouštní vítr** - modulovaný sinus

## 🎨 Vizuální styl

- **Top-down pixel art** - pohled z ptačí perspektivy
- **Barevné kódování prostředí**:
  - ❄️ Sníh: bílá (#E8F4FF)
  - 🌊 Déšť: modrá (#88AACC)
  - ⛰️ Hory: hnědá (#996633)
  - 🏜️ Poušť: zlatá (#FFD700)
  - 🌾 Pláně: zelená (#90EE90)
  - 🌲 Les: tmavě zelená (#228B22)
  - 🌊 Pobřeží: modrá (#4682B4)
  - 🏙️ Město: šedá (#696969)

### Dynamické efekty
- **Počasí**: sníh, déšť, písečné bouře
- **Particles**: jiskry při kolizi
- **Animace**: pohybující se stromy, budovy, vlny
- **Pulsující čerpací stanice** (cyan)

## 📊 Statistiky

### Herní parametry
- **Max rychlost**: 120 km/h (závisí na prostředí)
- **Životy**: 3
- **Palivo**: 100 litrů (začátek)
- **Invulnerabilita po kolizi**: 2 sekundy
- **Šířka silnice**: 180-280 px (podle prostředí)

### Všech 50 států
Celková vzdálenost napříč USA: **~26,000 km**!

## 📦 Instalace

### Předpoklady
- **Google TV** zařízení nebo Android TV
- **ADB** (Android Debug Bridge) - pro instalaci APK

### Stažení
Stáhněte si `velkyAmerickyZavod.apk` z [releases](../../releases) nebo sestavte ze zdrojového kódu.

### Instalace přes ADB

```bash
# Připojte se k vašemu Google TV
adb connect <IP_adresa_vašeho_Google_TV>

# Nainstalujte APK
adb install velkyAmerickyZavod.apk
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
cd velkyAmerickyZavod
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
velkyAmerickyZavod/
├── app/
│   ├── src/main/
│   │   ├── java/com/velkyamerickyZavod/
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
│   └── js/
│       ├── game.js                    # Hlavní herní logika
│       ├── engine/
│       │   ├── renderer.js            # Canvas rendering
│       │   ├── physics.js             # Fyzikální systém
│       │   ├── input.js               # Ovládání
│       │   └── audio.js               # Zvuky
│       └── states/
│           └── usa-states.js          # Data všech 50 států
├── build.gradle
├── settings.gradle
└── README.md
```

## 🎯 Technické detaily

### Technologie
- **HTML5 Canvas** - rendering
- **JavaScript (Vanilla)** - herní logika (žádné frameworky!)
- **Web Audio API** - procedurální zvuky
- **Android WebView** - wrapper pro Google TV
- **Gradle 8.0** - build systém

### Herní architektura
- **Modulární engine**:
  - `Renderer` - vizuální renderování
  - `Physics` - fyzikální výpočty
  - `InputManager` - ovládání
  - `AudioEngine` - zvuky
- **State management** - menu, playing, paused, gameover, victory
- **60 FPS** pomocí `requestAnimationFrame`

### Fyzikální engine
- **AABB collision detection**
- **Friction system** - různé koeficienty pro prostředí
- **Dynamic road curves** - procedurálně generované zatáčky
- **Fuel consumption model** - realistická spotřeba
- **Speed physics** - akcelerace, decelerace, max rychlost

### Výkon
- **Velikost APK**: ~1.7 MB
- **Minimální Android**: API 21 (Android 5.0)
- **Cílové Android**: API 34 (Android 14)
- **Žádné externí assety** - vše procedurální!

## 💡 Tipy a strategie

1. **Tankujte včas** - nečekejte, až dojde palivo!
2. **Zpomalte v horách** - serpentiny jsou nebezpečné
3. **Opatrně na sněhu** - velmi kluzké!
4. **Vyvarujte se haváriím** - máte jen 3 životy
5. **Rychlost vs. bezpečnost** - rychlost dává body, ale je riziková
6. **Sledujte prostředí** - každý stát má jiné výzvy
7. **Pláně jsou odpočinek** - využijte je k načerpání paliva
8. **Města = doprava** - vyžadují trpělivost

## 🗺️ Zajímavé státy

- **Texas** - největší stát (900 km!)
- **Rhode Island** - nejmenší stát (100 km)
- **Aljaška** - nejtěžší (obtížnost 10!)
- **Havaj** - finální odměna (tropický ráj)
- **New York** - nejtěžší doprava
- **Colorado** - nejvyšší hory

## 🐛 Známé problémy

- Webová verze vyžaduje moderní prohlížeč s podporou ES6+
- Audio může vyžadovat uživatelskou interakci pro spuštění (omezení prohlížečů)
- Velmi rychlý pohyb může způsobit neočekávané chování (rate limited)

## 📄 Licence

Tento projekt byl vytvořen pro vzdělávací účely.

## 🙏 Poděkování

Inspirováno klasickou hrou **The Great American Cross-Country Road Race** od Activision (1985) a všemi skvělými cestovními hrami!

## 🔗 Související projekty

- [River Rider](../riverRider/) - River Raid klon
- [Diamantový Muž](../diamantovyMuz/) - Boulder Dash klon
- [Google TV Games](../) - Kolekce retro her

---

Vytvořeno pomocí [Claude Code](https://claude.com/claude-code) 🤖

Užijte si cestu napříč Amerikou! 🏁🇺🇸
