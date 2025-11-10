// Databáze všech 50 amerických států pro Velký Americký Závod
// Každý stát má své prostředí, obtížnost a speciální vlastnosti

const USA_STATES = [
    // ZÁPAD - Start v Kalifornii
    {
        id: 1,
        name: "California",
        nameCZ: "Kalifornie",
        abbr: "CA",
        environment: "coastal",
        difficulty: 1,
        distance: 500,
        description: "Start na slunném pobřeží Tichého oceánu",
        obstacles: ["palms", "beach", "traffic"],
        roadType: "highway"
    },
    {
        id: 2,
        name: "Nevada",
        nameCZ: "Nevada",
        abbr: "NV",
        environment: "desert",
        difficulty: 2,
        distance: 600,
        description: "Horká poušť s kaktusy a písečnými bouřemi",
        obstacles: ["cactus", "sandstorm", "heat"],
        roadType: "desert"
    },
    {
        id: 3,
        name: "Arizona",
        nameCZ: "Arizona",
        abbr: "AZ",
        environment: "desert",
        difficulty: 3,
        distance: 550,
        description: "Grand Canyon a horké pouště",
        obstacles: ["cactus", "rocks", "heat"],
        roadType: "desert"
    },
    {
        id: 4,
        name: "Utah",
        nameCZ: "Utah",
        abbr: "UT",
        environment: "mountain",
        difficulty: 4,
        distance: 500,
        description: "Skalnaté hory a serpentiny",
        obstacles: ["rocks", "curves", "elevation"],
        roadType: "mountain"
    },
    {
        id: 5,
        name: "Colorado",
        nameCZ: "Colorado",
        abbr: "CO",
        environment: "mountain",
        difficulty: 5,
        distance: 600,
        description: "Nejvyšší hory Rockies, nebezpečné serpentiny",
        obstacles: ["steep", "curves", "altitude"],
        roadType: "mountain"
    },
    {
        id: 6,
        name: "Wyoming",
        nameCZ: "Wyoming",
        abbr: "WY",
        environment: "mountain",
        difficulty: 4,
        distance: 550,
        description: "Yellowstone a horské průsmyky",
        obstacles: ["wildlife", "curves", "weather"],
        roadType: "mountain"
    },
    {
        id: 7,
        name: "Montana",
        nameCZ: "Montana",
        abbr: "MT",
        environment: "snow",
        difficulty: 5,
        distance: 700,
        description: "Severní hory se sněhem a ledem",
        obstacles: ["ice", "snow", "curves"],
        roadType: "snow"
    },
    {
        id: 8,
        name: "Idaho",
        nameCZ: "Idaho",
        abbr: "ID",
        environment: "forest",
        difficulty: 3,
        distance: 500,
        description: "Husté lesy a klikaté cesty",
        obstacles: ["trees", "fog", "curves"],
        roadType: "forest"
    },
    {
        id: 9,
        name: "Washington",
        nameCZ: "Washington",
        abbr: "WA",
        environment: "forest",
        difficulty: 4,
        distance: 450,
        description: "Deštivé lesy a mlha",
        obstacles: ["rain", "fog", "trees"],
        roadType: "forest"
    },
    {
        id: 10,
        name: "Oregon",
        nameCZ: "Oregon",
        abbr: "OR",
        environment: "forest",
        difficulty: 3,
        distance: 500,
        description: "Pobřežní lesy a déšť",
        obstacles: ["rain", "trees", "curves"],
        roadType: "forest"
    },

    // STŘED - Pláně a farmy
    {
        id: 11,
        name: "North Dakota",
        nameCZ: "Severní Dakota",
        abbr: "ND",
        environment: "snow",
        difficulty: 4,
        distance: 600,
        description: "Mrazivé pláně a ledové bouře",
        obstacles: ["ice", "snow", "wind"],
        roadType: "snow"
    },
    {
        id: 12,
        name: "South Dakota",
        nameCZ: "Jižní Dakota",
        abbr: "SD",
        environment: "plains",
        difficulty: 2,
        distance: 550,
        description: "Rozlehlé pláně a Mount Rushmore",
        obstacles: ["wind", "farms", "wildlife"],
        roadType: "plains"
    },
    {
        id: 13,
        name: "Nebraska",
        nameCZ: "Nebraska",
        abbr: "NE",
        environment: "plains",
        difficulty: 2,
        distance: 600,
        description: "Nekonečné rovné cesty farmami",
        obstacles: ["farms", "tractors", "straight"],
        roadType: "plains"
    },
    {
        id: 14,
        name: "Kansas",
        nameCZ: "Kansas",
        abbr: "KS",
        environment: "plains",
        difficulty: 2,
        distance: 650,
        description: "Kukuřičná pole a rovné dálnice",
        obstacles: ["farms", "wind", "tornadoes"],
        roadType: "plains"
    },
    {
        id: 15,
        name: "Oklahoma",
        nameCZ: "Oklahoma",
        abbr: "OK",
        environment: "plains",
        difficulty: 3,
        distance: 550,
        description: "Prérie a občasné tornádo",
        obstacles: ["wind", "storms", "heat"],
        roadType: "plains"
    },
    {
        id: 16,
        name: "Texas",
        nameCZ: "Texas",
        abbr: "TX",
        environment: "desert",
        difficulty: 4,
        distance: 900,
        description: "Obrovský stát s pouštěmi a horkem",
        obstacles: ["heat", "long", "oil"],
        roadType: "desert"
    },
    {
        id: 17,
        name: "New Mexico",
        nameCZ: "Nové Mexiko",
        abbr: "NM",
        environment: "desert",
        difficulty: 3,
        distance: 550,
        description: "Poušť s písečnými duny",
        obstacles: ["sand", "heat", "cactus"],
        roadType: "desert"
    },

    // JIH - Horké a vlhké státy
    {
        id: 18,
        name: "Louisiana",
        nameCZ: "Louisiana",
        abbr: "LA",
        environment: "rain",
        difficulty: 4,
        distance: 500,
        description: "Bažiny a vlhko",
        obstacles: ["rain", "puddles", "swamp"],
        roadType: "rain"
    },
    {
        id: 19,
        name: "Mississippi",
        nameCZ: "Mississippi",
        abbr: "MS",
        environment: "rain",
        difficulty: 3,
        distance: 450,
        description: "Řeka Mississippi a vlhkost",
        obstacles: ["rain", "puddles", "humidity"],
        roadType: "rain"
    },
    {
        id: 20,
        name: "Alabama",
        nameCZ: "Alabama",
        abbr: "AL",
        environment: "rain",
        difficulty: 3,
        distance: 400,
        description: "Jih s letními bouřkami",
        obstacles: ["rain", "storms", "heat"],
        roadType: "rain"
    },
    {
        id: 21,
        name: "Florida",
        nameCZ: "Florida",
        abbr: "FL",
        environment: "rain",
        difficulty: 5,
        distance: 700,
        description: "Kaluže, hurikány a tropické bouře",
        obstacles: ["puddles", "rain", "hurricane"],
        roadType: "rain"
    },
    {
        id: 22,
        name: "Georgia",
        nameCZ: "Georgie",
        abbr: "GA",
        environment: "rain",
        difficulty: 3,
        distance: 500,
        description: "Vlhké lesní oblasti",
        obstacles: ["rain", "trees", "humidity"],
        roadType: "rain"
    },
    {
        id: 23,
        name: "South Carolina",
        nameCZ: "Jižní Karolína",
        abbr: "SC",
        environment: "rain",
        difficulty: 2,
        distance: 350,
        description: "Pobřežní vlhkost",
        obstacles: ["rain", "beach", "storms"],
        roadType: "rain"
    },
    {
        id: 24,
        name: "North Carolina",
        nameCZ: "Severní Karolína",
        abbr: "NC",
        environment: "forest",
        difficulty: 3,
        distance: 450,
        description: "Lesy Apalačských hor",
        obstacles: ["trees", "curves", "fog"],
        roadType: "forest"
    },
    {
        id: 25,
        name: "Tennessee",
        nameCZ: "Tennessee",
        abbr: "TN",
        environment: "forest",
        difficulty: 3,
        distance: 500,
        description: "Hory a country hudba",
        obstacles: ["curves", "trees", "music"],
        roadType: "forest"
    },
    {
        id: 26,
        name: "Kentucky",
        nameCZ: "Kentucky",
        abbr: "KY",
        environment: "plains",
        difficulty: 2,
        distance: 400,
        description: "Koňské farmy a bluegrass",
        obstacles: ["farms", "horses", "gentle"],
        roadType: "plains"
    },
    {
        id: 27,
        name: "Virginia",
        nameCZ: "Virginie",
        abbr: "VA",
        environment: "forest",
        difficulty: 3,
        distance: 450,
        description: "Lesnaté kopce",
        obstacles: ["trees", "hills", "history"],
        roadType: "forest"
    },
    {
        id: 28,
        name: "West Virginia",
        nameCZ: "Západní Virginie",
        abbr: "WV",
        environment: "mountain",
        difficulty: 4,
        distance: 400,
        description: "Horské cesty v Apalačích",
        obstacles: ["curves", "steep", "coal"],
        roadType: "mountain"
    },
    {
        id: 29,
        name: "Maryland",
        nameCZ: "Maryland",
        abbr: "MD",
        environment: "coastal",
        difficulty: 2,
        distance: 300,
        description: "Pobřeží Chesapeake Bay",
        obstacles: ["water", "traffic", "bridges"],
        roadType: "coastal"
    },
    {
        id: 30,
        name: "Delaware",
        nameCZ: "Delaware",
        abbr: "DE",
        environment: "coastal",
        difficulty: 1,
        distance: 150,
        description: "Malý pobřežní stát",
        obstacles: ["traffic", "beach", "short"],
        roadType: "coastal"
    },

    // SEVEROVÝCHOD - Hustě obydlené
    {
        id: 31,
        name: "Pennsylvania",
        nameCZ: "Pensylvánie",
        abbr: "PA",
        environment: "forest",
        difficulty: 3,
        distance: 500,
        description: "Lesy a průmyslová města",
        obstacles: ["trees", "traffic", "cities"],
        roadType: "forest"
    },
    {
        id: 32,
        name: "New Jersey",
        nameCZ: "New Jersey",
        abbr: "NJ",
        environment: "coastal",
        difficulty: 4,
        distance: 250,
        description: "Hustá doprava poblíž NYC",
        obstacles: ["traffic", "urban", "tolls"],
        roadType: "coastal"
    },
    {
        id: 33,
        name: "New York",
        nameCZ: "New York",
        abbr: "NY",
        environment: "urban",
        difficulty: 5,
        distance: 600,
        description: "NYC - nejtěžší doprava v USA",
        obstacles: ["heavy_traffic", "tunnels", "bridges"],
        roadType: "urban"
    },
    {
        id: 34,
        name: "Connecticut",
        nameCZ: "Connecticut",
        abbr: "CT",
        environment: "coastal",
        difficulty: 2,
        distance: 200,
        description: "Malý stát s příjemnou jízdou",
        obstacles: ["traffic", "tolls", "short"],
        roadType: "coastal"
    },
    {
        id: 35,
        name: "Rhode Island",
        nameCZ: "Rhode Island",
        abbr: "RI",
        environment: "coastal",
        difficulty: 1,
        distance: 100,
        description: "Nejmenší stát USA",
        obstacles: ["short", "coastal", "easy"],
        roadType: "coastal"
    },
    {
        id: 36,
        name: "Massachusetts",
        nameCZ: "Massachusetts",
        abbr: "MA",
        environment: "coastal",
        difficulty: 3,
        distance: 300,
        description: "Historický Boston a pobřeží",
        obstacles: ["traffic", "history", "coastal"],
        roadType: "coastal"
    },
    {
        id: 37,
        name: "Vermont",
        nameCZ: "Vermont",
        abbr: "VT",
        environment: "snow",
        difficulty: 4,
        distance: 350,
        description: "Sněhové Zelené hory",
        obstacles: ["snow", "ice", "curves"],
        roadType: "snow"
    },
    {
        id: 38,
        name: "New Hampshire",
        nameCZ: "New Hampshire",
        abbr: "NH",
        environment: "snow",
        difficulty: 3,
        distance: 300,
        description: "Horské lesy se sněhem",
        obstacles: ["snow", "trees", "cold"],
        roadType: "snow"
    },
    {
        id: 39,
        name: "Maine",
        nameCZ: "Maine",
        abbr: "ME",
        environment: "snow",
        difficulty: 4,
        distance: 450,
        description: "Severní les s mrazem",
        obstacles: ["snow", "ice", "lobster"],
        roadType: "snow"
    },

    // STŘEDOZÁPAD
    {
        id: 40,
        name: "Ohio",
        nameCZ: "Ohio",
        abbr: "OH",
        environment: "plains",
        difficulty: 2,
        distance: 500,
        description: "Průmyslový střed Ameriky",
        obstacles: ["traffic", "cities", "farms"],
        roadType: "plains"
    },
    {
        id: 41,
        name: "Indiana",
        nameCZ: "Indiana",
        abbr: "IN",
        environment: "plains",
        difficulty: 2,
        distance: 400,
        description: "Domov Indianapolis 500",
        obstacles: ["farms", "racing", "flat"],
        roadType: "plains"
    },
    {
        id: 42,
        name: "Illinois",
        nameCZ: "Illinois",
        abbr: "IL",
        environment: "plains",
        difficulty: 3,
        distance: 550,
        description: "Chicago - větrné město",
        obstacles: ["wind", "traffic", "urban"],
        roadType: "plains"
    },
    {
        id: 43,
        name: "Michigan",
        nameCZ: "Michigan",
        abbr: "MI",
        environment: "snow",
        difficulty: 4,
        distance: 600,
        description: "Velká jezera a sníh",
        obstacles: ["snow", "lakes", "ice"],
        roadType: "snow"
    },
    {
        id: 44,
        name: "Wisconsin",
        nameCZ: "Wisconsin",
        abbr: "WI",
        environment: "snow",
        difficulty: 3,
        distance: 500,
        description: "Mléčné farmy a zima",
        obstacles: ["snow", "cold", "cheese"],
        roadType: "snow"
    },
    {
        id: 45,
        name: "Minnesota",
        nameCZ: "Minnesota",
        abbr: "MN",
        environment: "snow",
        difficulty: 5,
        distance: 600,
        description: "Nejchladnější stát - brutální zima",
        obstacles: ["ice", "snow", "extreme_cold"],
        roadType: "snow"
    },
    {
        id: 46,
        name: "Iowa",
        nameCZ: "Iowa",
        abbr: "IA",
        environment: "plains",
        difficulty: 2,
        distance: 500,
        description: "Nekonečná kukuřičná pole",
        obstacles: ["farms", "corn", "flat"],
        roadType: "plains"
    },
    {
        id: 47,
        name: "Missouri",
        nameCZ: "Missouri",
        abbr: "MO",
        environment: "plains",
        difficulty: 2,
        distance: 450,
        description: "Gateway Arch a řeka Missouri",
        obstacles: ["river", "cities", "moderate"],
        roadType: "plains"
    },
    {
        id: 48,
        name: "Arkansas",
        nameCZ: "Arkansas",
        abbr: "AR",
        environment: "forest",
        difficulty: 3,
        distance: 400,
        description: "Ozark hory a lesy",
        obstacles: ["trees", "curves", "hills"],
        roadType: "forest"
    },

    // ALJAŠKÁ A HAVAJ (bonus)
    {
        id: 49,
        name: "Alaska",
        nameCZ: "Aljaška",
        abbr: "AK",
        environment: "snow",
        difficulty: 10,
        distance: 800,
        description: "Extrémní zima - nejnáročnější stát!",
        obstacles: ["extreme_ice", "blizzard", "wildlife", "darkness"],
        roadType: "snow"
    },
    {
        id: 50,
        name: "Hawaii",
        nameCZ: "Havaj",
        abbr: "HI",
        environment: "coastal",
        difficulty: 1,
        distance: 200,
        description: "Tropický ráj - odměna za dokončení!",
        obstacles: ["paradise", "volcanoes", "beaches"],
        roadType: "coastal"
    }
];

// Mapování prostředí na herní engine
const ENVIRONMENT_TYPES = {
    snow: {
        name: "Sníh a led",
        color: "#E8F4FF",
        friction: 0.3,      // Velmi kluzká cesta
        visibility: 0.7,
        weather: "snow"
    },
    rain: {
        name: "Déšť a kaluže",
        color: "#88AACC",
        friction: 0.6,      // Kluzká cesta
        visibility: 0.8,
        weather: "rain"
    },
    mountain: {
        name: "Hory a serpentiny",
        color: "#996633",
        friction: 0.9,
        curves: true,       // Více zatáček
        elevation: true     // Stoupání a klesání
    },
    desert: {
        name: "Poušť",
        color: "#FFD700",
        friction: 0.85,
        heat: true,         // Přehřívání motoru
        sandstorm: true
    },
    plains: {
        name: "Pláně",
        color: "#90EE90",
        friction: 1.0,      // Normální jízda
        straight: true      // Rovné cesty
    },
    forest: {
        name: "Les",
        color: "#228B22",
        friction: 0.8,
        visibility: 0.85,
        trees: true
    },
    coastal: {
        name: "Pobřeží",
        color: "#4682B4",
        friction: 0.95,
        scenery: "ocean"
    },
    urban: {
        name: "Město",
        color: "#696969",
        friction: 1.0,
        traffic: 3          // Hustá doprava
    }
};

// Export pro použití v hlavní hře
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { USA_STATES, ENVIRONMENT_TYPES };
}
