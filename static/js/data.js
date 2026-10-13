export const AU_VISUAL = 200;
export const SUN_MASS = 332946;

export const PLANETS = [
  {
    name: 'Mercure', a: 0.387, e: 0.206, period: 87.97, inclination: 7.0,
    radius: 3, color: 0x8C7853, rotSpeed: 0.004, mass: 0.055, M0: 0.8,
  },
  {
    name: 'Vénus', a: 0.723, e: 0.007, period: 224.70, inclination: 3.4,
    radius: 5, color: 0xFFC649, rotSpeed: -0.002, mass: 0.815, M0: 3.2,
  },
  {
    name: 'Terre', a: 1.000, e: 0.017, period: 365.25, inclination: 0.0,
    radius: 6, color: 0x6B93D6, rotSpeed: 0.02, mass: 1.0, M0: 1.7,
  },
  {
    name: 'Mars', a: 1.524, e: 0.093, period: 686.98, inclination: 1.85,
    radius: 4, color: 0xCD5C5C, rotSpeed: 0.018, mass: 0.107, M0: 5.9,
  },
  {
    name: 'Jupiter', a: 5.203, e: 0.048, period: 4332.59, inclination: 1.3,
    radius: 25, color: 0xD8CA9D, rotSpeed: 0.045, mass: 317.8, M0: 0.3,
  },
  {
    name: 'Saturne', a: 9.537, e: 0.054, period: 10759.22, inclination: 2.5,
    radius: 22, color: 0xFAD5A5, rotSpeed: 0.038, mass: 95.2, M0: 2.4,
  },
  {
    name: 'Uranus', a: 19.19, e: 0.047, period: 30688.5, inclination: 0.77,
    radius: 15, color: 0x4FD0E4, rotSpeed: 0.025, mass: 14.5, M0: 4.5,
  },
  {
    name: 'Neptune', a: 30.07, e: 0.009, period: 60182, inclination: 1.77,
    radius: 14, color: 0x4B70DD, rotSpeed: 0.022, mass: 17.1, M0: 1.1,
  },
];

export const REFERENTIAL_CAPTIONS = {
  Soleil: "Vue classique : toutes les planètes tournent autour du Soleil dans le même sens (anti-horaire vu du nord).",
  Mercure: "Vu depuis Mercure, le ciel semble tourner très vite : la planète boucle une orbite en 88 jours seulement.",
  Vénus: "Vénus tourne à l'envers : son jour sidéral dure plus longtemps que son année de 225 jours.",
  Terre: "Notre point de vue habituel. Le Soleil semble parcourir le ciel en un an — c'est nous qui bougeons.",
  Mars: "Vu depuis Mars, la Terre semble s'éloigner puis se rapprocher : c'est le mouvement rétrograde apparent qui a troublé les astronomes pendant des siècles.",
  Jupiter: "Le géant abrite des milliers d'astéroïdes troyens, piégés aux points L4 et L5 depuis 4,5 milliards d'années.",
  Saturne: "Ses anneaux s'étendent sur 280 000 km mais n'ont que quelques dizaines de mètres d'épaisseur.",
  Uranus: "Uranus roule sur son orbite : son axe est incliné à 98°, ses saisons durent 21 ans.",
  Neptune: "La plus lointaine : sa découverte en 1846 fut un triomphe du calcul, prédite par la gravité avant d'être vue.",
};

export const PLANET_INFO = {
  Soleil: {
    type: 'Étoile — naine jaune',
    stats: [['Masse', '333 000 Terres'], ['Température de surface', '5 500 °C'], ['Âge', '4,6 milliards d\'années'], ['Composition', '74 % hydrogène, 24 % hélium']],
    facts: "Le Soleil concentre 99,86 % de la masse du système solaire. Tous les points de Lagrange existent grâce à son duel gravitationnel avec chaque planète.",
  },
  Mercure: {
    type: 'Planète tellurique',
    stats: [['Distance au Soleil', '0,39 UA (58 M km)'], ['Année', '88 jours'], ['Jour', '58,6 jours terrestres'], ['Température', '-173 °C à +427 °C']],
    facts: "Mercure n'a pas d'atmosphère notable : sa surface passe de brûlante à glaciale entre le jour et la nuit. Sa forte excentricité (0,21) rend sa vitesse orbitale très variable — Kepler l'avait remarqué.",
  },
  Vénus: {
    type: 'Planète tellurique',
    stats: [['Distance au Soleil', '0,72 UA (108 M km)'], ['Année', '225 jours'], ['Jour', '243 jours (rétrograde)'], ['Température', '+464 °C']],
    facts: "Enfer de serre extrême : sa surface est plus chaude que celle de Mercure malgré le double de distance au Soleil. Elle tourne à l'envers, à peine plus vite qu'elle n'orbite.",
  },
  Terre: {
    type: 'Planète tellurique',
    stats: [['Distance au Soleil', '1 UA (150 M km)'], ['Année', '365,25 jours'], ['Inclinaison de l\'axe', '23,4°'], ['Lunes', '1']],
    facts: "C'est ici que les points de Lagrange sont les plus utiles : SOHO observe le Soleil depuis L1, le télescope James-Webb est stationné à L2, à 1,5 million de km — dans l'ombre de la Terre.",
  },
  Mars: {
    type: 'Planète tellurique',
    stats: [['Distance au Soleil', '1,52 UA (228 M km)'], ['Année', '687 jours'], ['Jour', '24,6 heures'], ['Lunes', '2 (Phobos, Déimos)']],
    facts: "Le mouvement rétrograde apparent de Mars, vu depuis la Terre, a été le grand mystère astronomique pendant 2000 ans — résolu par Copernic, Galilée et Kepler.",
  },
  Jupiter: {
    type: 'Géante gazeuse',
    stats: [['Distance au Soleil', '5,2 UA (778 M km)'], ['Année', '11,9 ans'], ['Masse', '318 Terres'], ['Lunes', '95+']],
    facts: "Jupiter abrite plus de 10 000 astéroïdes troyens, piégés aux points L4 et L5. Ces zones stables furent prédites par Lagrange en 1772 — les premiers troyens furent découverts en 1906.",
  },
  Saturne: {
    type: 'Géante gazeuse',
    stats: [['Distance au Soleil', '9,5 UA (1,43 Md km)'], ['Année', '29,5 ans'], ['Anneaux', '7 principaux, ~280 000 km'], ['Lunes', '146+']],
    facts: "Ses anneaux sont faits de milliards de fragments de glace, largement dans sa sphère de Hill — la zone où sa gravité domine celle du Soleil.",
  },
  Uranus: {
    type: 'Géante de glaces',
    stats: [['Distance au Soleil', '19,2 UA (2,87 Md km)'], ['Année', '84 ans'], ['Inclinaison de l\'axe', '98°'], ['Lunes', '28']],
    facts: "Uranus bascule sur son orbite : probablement suite à une collision géante. Chaque pôle connaît 42 ans de jour puis 42 ans de nuit.",
  },
  Neptune: {
    type: 'Géante de glaces',
    stats: [['Distance au Soleil', '30,1 UA (4,5 Md km)'], ['Année', '165 ans'], ['Vents', 'jusqu\'à 2 100 km/h'], ['Lunes', '16']],
    facts: "Neptune fut découverte « au bout de la plume » : Le Verrier prédit sa position par le calcul, et l'observateur la trouva à moins de 1° de la prédiction. La gravité comme instrument.",
  },
};

export const LAGRANGE_INFO = {
  L1: "L1 — entre la planète et le Soleil. Instable mais parfaite pour l'observation : SOHO scrute le Soleil depuis L1 Terre-Soleil, alerte des tempêtes solaires 30 min avant nous.",
  L2: "L2 — au-delà de la planète, dans son ombre. Le James-Webb y est stationné : froid, stable, Terre et Soleil toujours du même côté.",
  L3: "L3 — de l'autre côté du Soleil. Une « anti-Terre » y resterait invisible depuis chez nous ; la science-fiction a aimé cette idée, la réalité l'a démentie (instabilité).",
  L4: "L4 — 60° devant la planète. Stable : Jupiter y garde des milliers d'astéroïdes troyens depuis la formation du système solaire.",
  L5: "L5 — 60° derrière la planète. Le compagnon de L4. Ensemble, ils forment deux triangles équilatéraux avec le Soleil et la planète — la pure géométrie de Lagrange.",
};

export const TRAIL_DURATIONS = [5, 10, 20, 30, 50, 100];
