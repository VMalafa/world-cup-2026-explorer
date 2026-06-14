import type { CountryDraft } from "@/lib/contentGuardian";

/**
 * AI-authored Country learning drafts (ADR-0002), for the first ~week of
 * featured Match-of-the-Day Countries. Each is gated by the Content Guardian
 * before any of it reaches `src/data/countryContent.json`. Facts are kept to
 * well-known, verifiable ones; phrasing is warm, calm, and respectful.
 *
 * Re-run `npm run author:content` to regenerate the approved + quarantined
 * outputs from these drafts.
 */
export const COUNTRY_DRAFTS: CountryDraft[] = [
  {
    code: "MEX",
    countryName: "Mexico",
    wonders: {
      landmark: {
        name: "Chichén Itzá",
        emoji: "🛕",
        blurb: {
          kinder: "A giant stone pyramid built long ago.",
          enriched: "Chichén Itzá is a huge stone pyramid built by the Maya people many centuries ago.",
        },
      },
      animal: {
        name: "Axolotl",
        emoji: "🦎",
        blurb: {
          kinder: "A smiley salamander that lives in water.",
          enriched: "The axolotl is a water salamander with feathery gills and a face that looks like it's smiling.",
        },
      },
      food: {
        name: "Tacos",
        emoji: "🌮",
        blurb: {
          kinder: "Warm tortillas folded around tasty fillings.",
          enriched: "Tacos are soft or crunchy tortillas folded around beans, vegetables, or meat.",
        },
      },
    },
    flagMeaning: {
      kinder: "Green, white, and red, with an eagle on a cactus.",
      enriched: "Mexico's flag is green, white, and red, with an eagle on a cactus — a very old symbol of its founding.",
    },
  },
  {
    code: "CRO",
    countryName: "Croatia",
    wonders: {
      landmark: {
        name: "Plitvice Lakes",
        emoji: "🏞️",
        blurb: {
          kinder: "Blue-green lakes joined by waterfalls.",
          enriched: "Plitvice is a chain of blue-green lakes linked by tumbling waterfalls and wooden walkways.",
        },
      },
      animal: {
        name: "Dalmatian dog",
        emoji: "🐶",
        blurb: {
          kinder: "A white dog covered in black spots.",
          enriched: "The spotty Dalmatian dog shares its name with Dalmatia, a sunny region of Croatia.",
        },
      },
      food: {
        name: "Fritule",
        emoji: "🍩",
        blurb: {
          kinder: "Little round doughnuts dusted with sugar.",
          enriched: "Fritule are tiny round doughnuts, often flavoured with citrus and dusted with sugar.",
        },
      },
    },
    flagMeaning: {
      kinder: "Red, white, and blue with a checkered shield.",
      enriched: "Croatia's flag has red, white, and blue bands and a red-and-white checkerboard shield.",
    },
  },
  {
    code: "ARG",
    countryName: "Argentina",
    wonders: {
      landmark: {
        name: "Perito Moreno Glacier",
        emoji: "🧊",
        blurb: {
          kinder: "A giant wall of bright blue ice.",
          enriched: "The Perito Moreno Glacier is a towering river of ice that creaks and cracks as it slowly moves.",
        },
      },
      animal: {
        name: "Andean condor",
        emoji: "🦅",
        blurb: {
          kinder: "A huge bird that glides over mountains.",
          enriched: "The Andean condor is one of the largest flying birds, soaring high above the mountains.",
        },
      },
      food: {
        name: "Empanadas",
        emoji: "🥟",
        blurb: {
          kinder: "Little pastries folded around a filling.",
          enriched: "Empanadas are little baked pastries folded around vegetables, cheese, or meat.",
        },
      },
    },
    flagMeaning: {
      kinder: "Blue and white stripes with a golden sun.",
      enriched: "Argentina's flag has sky-blue and white bands with a smiling golden sun in the middle.",
    },
  },
  {
    code: "AUS",
    countryName: "Australia",
    wonders: {
      landmark: {
        name: "Uluru",
        emoji: "🪨",
        blurb: {
          kinder: "A giant red rock in the desert.",
          enriched: "Uluru is an enormous red rock in the desert, sacred to its First Nations people.",
        },
      },
      animal: {
        name: "Kangaroo",
        emoji: "🦘",
        blurb: {
          kinder: "It hops and carries babies in a pouch.",
          enriched: "Kangaroos hop on strong back legs and carry their babies, called joeys, in a pouch.",
        },
      },
      food: {
        name: "Vegemite",
        emoji: "🍞",
        blurb: {
          kinder: "A dark, salty spread on toast.",
          enriched: "Vegemite is a dark, salty spread that many Australians love thinly spread on buttered toast.",
        },
      },
    },
    flagMeaning: {
      kinder: "A blue flag with bright white stars.",
      enriched: "Australia's flag shows the Southern Cross, a pattern of stars seen in the southern night sky.",
    },
  },
  {
    code: "SRB",
    countryName: "Serbia",
    wonders: {
      landmark: {
        name: "Belgrade Fortress",
        emoji: "🏰",
        blurb: {
          kinder: "An old fort where two rivers meet.",
          enriched: "Belgrade Fortress sits on a hill where two rivers meet, with parks and wide views.",
        },
      },
      animal: {
        name: "Grey wolf",
        emoji: "🐺",
        blurb: {
          kinder: "Grey wolves roam the quiet forests.",
          enriched: "Grey wolves live in Serbia's forests and mountains, roaming in close family groups.",
        },
      },
      food: {
        name: "Ćevapi",
        emoji: "🍢",
        blurb: {
          kinder: "Little grilled rolls served warm.",
          enriched: "Ćevapi are little grilled rolls of seasoned meat, served warm with soft flatbread.",
        },
      },
    },
    flagMeaning: {
      kinder: "Red, blue, and white with an eagle shield.",
      enriched: "Serbia's flag has red, blue, and white bands and a shield with a double-headed eagle.",
    },
  },
  {
    code: "NZL",
    countryName: "New Zealand",
    wonders: {
      landmark: {
        name: "Milford Sound",
        emoji: "🏞️",
        blurb: {
          kinder: "Steep green cliffs beside calm water.",
          enriched: "Milford Sound is a deep valley of water framed by steep, green cliffs and waterfalls.",
        },
      },
      animal: {
        name: "Kiwi",
        emoji: "🐤",
        blurb: {
          kinder: "A round bird that cannot fly.",
          enriched: "The kiwi is a round, fuzzy bird that cannot fly and comes out at night to feed.",
        },
      },
      food: {
        name: "Pavlova",
        emoji: "🍰",
        blurb: {
          kinder: "A soft cake topped with fruit.",
          enriched: "Pavlova is a soft, marshmallowy dessert topped with cream and fresh fruit.",
        },
      },
    },
    flagMeaning: {
      kinder: "A blue flag with four red stars.",
      enriched: "New Zealand's flag shows four red stars of the Southern Cross on a deep blue sky.",
    },
  },
  {
    code: "ESP",
    countryName: "Spain",
    wonders: {
      landmark: {
        name: "Sagrada Família",
        emoji: "⛪",
        blurb: {
          kinder: "A tall church with pointy towers.",
          enriched: "The Sagrada Família is a tall church in Barcelona, still being built after many years.",
        },
      },
      animal: {
        name: "Iberian lynx",
        emoji: "🐱",
        blurb: {
          kinder: "A wild cat with tufty ears.",
          enriched: "The Iberian lynx is a rare wild cat with tufted ears and a short, spotted coat.",
        },
      },
      food: {
        name: "Paella",
        emoji: "🥘",
        blurb: {
          kinder: "A big pan of rice with veggies.",
          enriched: "Paella is a golden rice dish cooked in a wide pan with vegetables, beans, or seafood.",
        },
      },
    },
    flagMeaning: {
      kinder: "Red and yellow stripes with a shield.",
      enriched: "Spain's flag has red and yellow bands with a shield showing castles and a lion.",
    },
  },
  {
    code: "JPN",
    countryName: "Japan",
    wonders: {
      landmark: {
        name: "Mount Fuji",
        emoji: "🗻",
        blurb: {
          kinder: "A big, snowy mountain with a round top.",
          enriched: "Mount Fuji is Japan's tallest mountain, capped with snow for much of the year.",
        },
      },
      animal: {
        name: "Snow monkey",
        emoji: "🐒",
        blurb: {
          kinder: "Monkeys that warm up in hot pools.",
          enriched: "Japan's snow monkeys keep cosy by bathing in steamy mountain hot springs.",
        },
      },
      food: {
        name: "Sushi",
        emoji: "🍣",
        blurb: {
          kinder: "Rice with fish or veggies, often rolled.",
          enriched: "Sushi pairs seasoned rice with fish or vegetables, often rolled up in seaweed.",
        },
      },
    },
    flagMeaning: {
      kinder: "A red circle for the sun on white.",
      enriched: "Japan's flag shows a red sun on white, giving it the name 'land of the rising sun'.",
    },
  },
  {
    code: "NED",
    countryName: "Netherlands",
    wonders: {
      landmark: {
        name: "Kinderdijk windmills",
        emoji: "🌬️",
        blurb: {
          kinder: "Old windmills standing by the water.",
          enriched: "At Kinderdijk, a row of old windmills once pumped water to keep the low land dry.",
        },
      },
      animal: {
        name: "Friesian cow",
        emoji: "🐄",
        blurb: {
          kinder: "Black-and-white cows in green fields.",
          enriched: "Black-and-white Friesian cows graze the flat green fields of the Dutch countryside.",
        },
      },
      food: {
        name: "Stroopwafel",
        emoji: "🧇",
        blurb: {
          kinder: "Two thin waffles with syrup inside.",
          enriched: "A stroopwafel is two thin waffles pressed together with sweet, sticky syrup inside.",
        },
      },
    },
    flagMeaning: {
      kinder: "Three stripes: red, white, and blue.",
      enriched: "The Netherlands flies a simple flag of three bands — red, white, and blue.",
    },
  },
  {
    code: "SEN",
    countryName: "Senegal",
    wonders: {
      landmark: {
        name: "Lac Rose",
        emoji: "🌸",
        blurb: {
          kinder: "A lake that can look pink.",
          enriched: "Lac Rose is a salty lake that can turn a soft pink colour in bright sunshine.",
        },
      },
      animal: {
        name: "Lion",
        emoji: "🦁",
        blurb: {
          kinder: "Lions live in the wild parks.",
          enriched: "Lions live in Senegal's wild parks, and the national football team is nicknamed the Lions.",
        },
      },
      food: {
        name: "Thieboudienne",
        emoji: "🍚",
        blurb: {
          kinder: "Fish and rice cooked together.",
          enriched: "Thieboudienne is a much-loved dish of fish and rice simmered with vegetables.",
        },
      },
    },
    flagMeaning: {
      kinder: "Green, yellow, and red with a green star.",
      enriched: "Senegal's flag has green, yellow, and red bands with a single green star in the centre.",
    },
  },
  {
    code: "AUT",
    countryName: "Austria",
    wonders: {
      landmark: {
        name: "The Alps",
        emoji: "🏔️",
        blurb: {
          kinder: "Tall mountains with snowy peaks.",
          enriched: "The Alps rise across Austria in tall, snowy peaks loved by hikers and skiers.",
        },
      },
      animal: {
        name: "Alpine marmot",
        emoji: "🐿️",
        blurb: {
          kinder: "A furry animal that whistles.",
          enriched: "The Alpine marmot is a furry mountain animal that whistles to warn its friends.",
        },
      },
      food: {
        name: "Sachertorte",
        emoji: "🍫",
        blurb: {
          kinder: "A rich chocolate cake.",
          enriched: "Sachertorte is a rich chocolate cake with a thin layer of apricot jam inside.",
        },
      },
    },
    flagMeaning: {
      kinder: "Red, white, and red stripes.",
      enriched: "Austria's flag has three bands — red, white, and red — and is a very old design.",
    },
  },
  {
    code: "EGY",
    countryName: "Egypt",
    wonders: {
      landmark: {
        name: "Pyramids of Giza",
        emoji: "🔺",
        blurb: {
          kinder: "Giant stone pyramids in the sand.",
          enriched: "The Pyramids of Giza are giant stone tombs built in the desert thousands of years ago.",
        },
      },
      animal: {
        name: "Camel",
        emoji: "🐪",
        blurb: {
          kinder: "It walks across the sandy desert.",
          enriched: "Camels cross the desert easily, storing energy in their humps for long journeys.",
        },
      },
      food: {
        name: "Koshari",
        emoji: "🍲",
        blurb: {
          kinder: "Rice, pasta, and lentils in one bowl.",
          enriched: "Koshari mixes rice, pasta, and lentils with tomato sauce and crispy onions on top.",
        },
      },
    },
    flagMeaning: {
      kinder: "Red, white, and black with a golden eagle.",
      enriched: "Egypt's flag has red, white, and black bands with a golden eagle in the centre.",
    },
  },
  {
    code: "CMR",
    countryName: "Cameroon",
    wonders: {
      landmark: {
        name: "Mount Cameroon",
        emoji: "🌋",
        blurb: {
          kinder: "A tall mountain near the sea.",
          enriched: "Mount Cameroon is a tall volcano near the coast, the highest peak in West Africa.",
        },
      },
      animal: {
        name: "Forest elephant",
        emoji: "🐘",
        blurb: {
          kinder: "A smaller elephant of the forest.",
          enriched: "Forest elephants are a smaller kind of elephant that lives among Cameroon's rainforests.",
        },
      },
      food: {
        name: "Ndolé",
        emoji: "🍲",
        blurb: {
          kinder: "A green stew with nuts.",
          enriched: "Ndolé is a hearty stew of leafy greens and ground nuts, a favourite across Cameroon.",
        },
      },
    },
    flagMeaning: {
      kinder: "Green, red, and yellow with a gold star.",
      enriched: "Cameroon's flag has green, red, and yellow bands with a single gold star in the middle.",
    },
  },
];

/**
 * Drafts the author could NOT verify with confidence. These are deliberately
 * held back to demonstrate the accuracy gate — the Content Guardian quarantines
 * them, and they never reach the app (ADR-0002). Documented, not shipped.
 */
export const HELD_DRAFTS: CountryDraft[] = [
  {
    // A second take on Senegal's Lac Rose that leaned on an unverifiable
    // superlative. The verified, gentler version ships above; this one is held.
    code: "SEN",
    countryName: "Senegal",
    wonders: {
      landmark: {
        name: "Lac Rose",
        emoji: "🌸",
        blurb: {
          kinder: "The pinkest, saltiest lake on Earth.",
          enriched: "Lac Rose is the pinkest and saltiest lake anywhere on the whole planet.",
        },
      },
      animal: {
        name: "Lion",
        emoji: "🦁",
        blurb: {
          kinder: "Lions live in the wild parks.",
          enriched: "Lions live in Senegal's wild parks and reserves.",
        },
      },
      food: {
        name: "Thieboudienne",
        emoji: "🍚",
        blurb: {
          kinder: "Fish and rice cooked together.",
          enriched: "Thieboudienne is a dish of fish and rice simmered with vegetables.",
        },
      },
    },
    flagMeaning: {
      kinder: "Green, yellow, and red with a green star.",
      enriched: "Senegal's flag has green, yellow, and red bands with a green star.",
    },
    unverifiedClaims: [
      "Lac Rose is the pinkest and saltiest lake on Earth — could not confirm; other lakes are saltier.",
    ],
  },
];

/** Everything fed through the pipeline: featured drafts + held demonstrations. */
export const ALL_DRAFTS: CountryDraft[] = [...COUNTRY_DRAFTS, ...HELD_DRAFTS];
