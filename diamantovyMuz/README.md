# Diamantový Muž 💎

Pixel art puzzle-action hra inspirovaná legendární hrou **Boulder Dash** od Petera Liepa (First Star Software, 1984).

## 📝 Popis

Diamantový Muž je klasická kopací hra, kde ovládáte Rockforda (tentokrát jako Diamantového muže), který se prokopává skrz podzemní jeskyně plné hlíny, kamenů a cenných diamantů. Vaším úkolem je sebrat dostatečný počet diamantů a dostat se k východu, aniž by vás rozdrtily padající kameny!

## 🎮 Herní mechanika

### Základní principy
- **Mřížkový systém** - 20×20 dlaždic
- **Gravitace** - kameny a diamanty padají dolů
- **Kopání** - prokopávejte se hlínou
- **Nebezpečí** - padající kameny vás zabijí
- **Level systém** - progresivní obtížnost

### Herní objekty

#### Diamantový muž (zlatá postava)
- Pohyb ve 4 směrech (nahoru, dolů, vlevo, vpravo)
- Kopání hlíny průchodem
- Sbírání diamantů
- Tlačení kamenů horizontálně
- Umírá při:
  - Zásahu padajícím kamenem
  - Zásahu padajícím diamantem

#### Dlaždice

| Dlaždice | Popis | Vlastnosti |
|----------|-------|------------|
| 🟫 **Hlína** | Prokopáváte se jí | +1 bod při prokopání |
| ⬜ **Zeď** | Neprůchodná | Nelze zničit |
| ⚫ **Kámen** | Padá dolů | Může se kutálet po stranách |
| 💎 **Diamant** | Cíl hry | +10 bodů, padá dolů |
| 🚪 **Východ** | Dokončení levelu | Otevře se po sebrání diamantů |

### Fyzika kamenů (Boulder Dash mechanika!)

#### Gravitace
- Kameny a diamanty padají dolů, pokud pod nimi není podpora
- Padající objekt zabije hráče při nárazu

#### Kutálení
- Kameny se kutálí z kulatých objektů (jiné kameny, diamanty, zdi)
- Kutálí se náhodně vlevo nebo vpravo, pokud je místo
- Kutálející se kámen pokračuje v pádu

#### Tlačení
- Hráč může tlačit jednotlivé kameny **horizontálně**
- Nelze tlačit vertikálně
- Lze tlačit pouze pokud je za kamenem volno

## 🕹️ Ovládání

### Klávesnice
- **Šipky** nebo **WASD** - pohyb hráče
- Pohyb automaticky kopá hlínu a sbírá diamanty

### Google TV (D-pad)
- **D-pad** - pohyb ve 4 směrech
- Plynulé ovládání s rate limiting

## 🎯 Cíle a level systém

### Dokončení levelu
1. Seberte požadovaný počet **diamantů**
2. Východ se automaticky **otevře** (zelený pulsující)
3. Dostavte se k východu
4. Level dokončen! 🎉

### Bodování
- **+1 bod** za prokopání hlíny
- **+10 bodů** za diamant
- **+50 bodů** za dokončení levelu (base)
- **Bonus** za přebytečné diamanty a level

### Progrese
- **Level 1**: 10 diamantů potřeba
- **Level 2**: 12 diamantů potřeba
- **Level 3**: 14 diamantů potřeba
- ... a tak dále (progresivně +2 diamanty)

### Životy
- Začínáte s **3 životy**
- Při ztrátě života se level restartuje
- Palivo se doplní
- Pozice hráče se resetuje

## 🔊 Zvukové efekty

Hra obsahuje autentické 8-bitové zvuky pomocí Web Audio API:
- **Kopání** - dunivý zvuk při prokopávání hlíny
- **Diamant** - zvonivý tón při sebrání
- **Smrt** - dramatický pokles tónu
- **Východ** - vítězná melodie
- **Pád kamene** - periodické dunění padajících kamenů

## 🎨 Vizuální styl

- **Pixel art** retro grafika
- **Barevné kódování**:
  - 🟫 Hnědá hlína s texturou
  - ⬜ Šedá zeď s ohraničením
  - ⚫ Tmavě šedý kámen se stínem
  - 💎 Cyan diamant s **pulsující animací**
  - 🟡 Zlatý hráč s detaily (hlava, ruce, nohy)
  - 🚪 Červený zavřený / zelený otevřený východ
- **Animace**:
  - Pulsující diamanty
  - Blikající otevřený východ
  - Animace motorů hráče

## 📦 Instalace

### Předpoklady
- **Google TV** zařízení nebo Android TV
- **ADB** (Android Debug Bridge) - pro instalaci APK

### Stažení
Stáhněte si `diamantovyMuz.apk` z [releases](../../releases) nebo sestavte ze zdrojového kódu.

### Instalace přes ADB

```bash
# Připojte se k vašemu Google TV
adb connect <IP_adresa_vašeho_Google_TV>

# Nainstalujte APK
adb install diamantovyMuz.apk
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
diamantovyMuz/
├── app/
│   ├── src/main/
│   │   ├── java/com/diamantovymuz/
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
│   └── js/game.js                     # Hlavní herní logika + fyzika
├── build.gradle
├── settings.gradle
└── README.md
```

## 🎯 Technické detaily

### Technologie
- **HTML5 Canvas** - rendering (32×32 px dlaždice)
- **JavaScript (Vanilla)** - herní logika
- **Web Audio API** - zvukové efekty
- **Android WebView** - wrapper pro Google TV
- **Gradle** - build systém

### Fyzikální engine
- **Grid-based** - 20×20 dlaždic
- **Gravitace** - aktualizace každých 6 snímků (10× za sekundu)
- **Dvojitý buffer** - `grid` a `nextGrid` pro stabilní simulaci
- **Detekce pádu** - tracking padajících objektů pomocí Set
- **Collision detection** - AABB pro hráče

### Herní smyčka
- **60 FPS** pomocí `requestAnimationFrame`
- **Fyzika** aktualizována každých 6 snímků
- **Bottom-up processing** - fyzika zpracována zdola nahoru
- **Continuous movement** - plynulý pohyb s delay 150ms

### Výkon
- **Velikost APK**: ~4 MB
- **Minimální Android**: API 21 (Android 5.0)
- **Cílové Android**: API 34 (Android 14)
- **Velikost grid**: 20×20 = 400 dlaždic
- **Velikost canvas**: 640×640 px

## 💡 Tipy a strategie

1. **Pozorujte gravitaci** - počkejte, až kameny dopadnou
2. **Plánujte cestu** - nemáte neomezeně pokusů
3. **Sbírejte opatrně** - diamanty také padají!
4. **Tlačte strategicky** - vytvořte si bezpečnou cestu
5. **Pozor na kutálení** - kameny se kutálí z vrcholů
6. **Časování** - někdy je lepší počkat než se hnout

## 🐛 Známé problémy

- Webová verze vyžaduje moderní prohlížeč s podporou ES6+
- Audio může vyžadovat uživatelskou interakci pro spuštění (omezení prohlížečů)
- Velmi rychlý pohyb může způsobit unexpected behavior (rate limited)

## 📄 Licence

Tento projekt byl vytvořen pro vzdělávací účely.

## 🙏 Poděkování

Inspirováno legendární hrou **Boulder Dash** od Petera Liepa (First Star Software, 1984) a jejími nesčetnými porty a klony.

## 🔗 Související projekty

- [River Rider](../riverRider/) - River Raid klon
- [Google TV Games](../) - Kolekce retro her

---

Vytvořeno pomocí [Claude Code](https://claude.com/claude-code) 🤖
