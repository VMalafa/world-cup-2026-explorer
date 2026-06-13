import type { Team } from "@/types";

/**
 * The 48 nations of the 2026 tournament, each with kid-friendly learning data.
 *
 * NOTE: groups & line-ups are a realistic sample for the Explorer. See the
 * README ("How to update match data") for how Vee can swap in official data.
 */
export const TEAMS: Team[] = [
  // ---- Group A ----
  {
    code: "MEX", name: "Mexico", flag: "🇲🇽", iso2: "mx", capital: "Mexico City",
    continent: "namerica", lat: 19.43, lng: -99.13, group: "A", hello: "¡Hola!",
    funFacts: [
      { kinder: "Mexico is one of the three host countries.", enriched: "Mexico is co-hosting the World Cup for a record third time in its history." },
      { kinder: "People here love spicy food and music.", enriched: "Mexico is famous for tacos, mariachi music, and colourful festivals." },
    ],
  },
  {
    code: "CRO", name: "Croatia", flag: "🇭🇷", iso2: "hr", capital: "Zagreb",
    continent: "europe", lat: 45.81, lng: 15.98, group: "A", hello: "Bok!",
    funFacts: [
      { kinder: "Croatia has a long, sunny sea coast.", enriched: "Croatia sits beside the sparkling Adriatic Sea with over a thousand islands." },
    ],
  },
  {
    code: "CMR", name: "Cameroon", flag: "🇨🇲", iso2: "cm", capital: "Yaoundé",
    continent: "africa", lat: 3.85, lng: 11.50, group: "A", hello: "Mbolo!",
    funFacts: [
      { kinder: "Cameroon is called 'Africa in one place'.", enriched: "Cameroon is nicknamed 'Africa in miniature' for its beaches, mountains, and rainforests." },
    ],
  },
  {
    code: "KSA", name: "Saudi Arabia", flag: "🇸🇦", iso2: "sa", capital: "Riyadh",
    continent: "asia", lat: 24.71, lng: 46.68, group: "A", hello: "Marhaba!",
    funFacts: [
      { kinder: "Saudi Arabia has huge sandy deserts.", enriched: "Saudi Arabia holds one of the world's largest sand deserts, the Empty Quarter." },
    ],
  },

  // ---- Group B ----
  {
    code: "CAN", name: "Canada", flag: "🇨🇦", iso2: "ca", capital: "Ottawa",
    continent: "namerica", lat: 45.42, lng: -75.70, group: "B", hello: "Hello!",
    funFacts: [
      { kinder: "Canada is a host and very, very big.", enriched: "Canada, a tournament host, is the second-largest country in the whole world." },
      { kinder: "It has a red maple leaf on its flag.", enriched: "Canada's flag shows a red maple leaf, a tree that gives us sweet syrup." },
    ],
  },
  {
    code: "ECU", name: "Ecuador", flag: "🇪🇨", iso2: "ec", capital: "Quito",
    continent: "samerica", lat: -0.18, lng: -78.47, group: "B", hello: "¡Hola!",
    funFacts: [
      { kinder: "Ecuador sits right on the middle of Earth.", enriched: "Ecuador is named after the equator, the imaginary line around Earth's middle." },
    ],
  },
  {
    code: "MAR", name: "Morocco", flag: "🇲🇦", iso2: "ma", capital: "Rabat",
    continent: "africa", lat: 34.02, lng: -6.83, group: "B", hello: "Salam!",
    funFacts: [
      { kinder: "Morocco reached the final four in 2022.", enriched: "Morocco made history in 2022 as the first African team to reach the semi-finals." },
    ],
  },
  {
    code: "UZB", name: "Uzbekistan", flag: "🇺🇿", iso2: "uz", capital: "Tashkent",
    continent: "asia", lat: 41.31, lng: 69.24, group: "B", hello: "Salom!",
    funFacts: [
      { kinder: "Uzbekistan is at its first ever World Cup.", enriched: "Uzbekistan qualified for the very first World Cup in the nation's history." },
    ],
  },

  // ---- Group C ----
  {
    code: "USA", name: "United States", flag: "🇺🇸", iso2: "us", capital: "Washington, D.C.",
    continent: "namerica", lat: 38.90, lng: -77.04, group: "C", hello: "Hi!",
    funFacts: [
      { kinder: "The USA is the biggest host country.", enriched: "The United States hosts most of the matches across its many huge cities." },
      { kinder: "It has 50 states joined together.", enriched: "The United States is made of fifty states, each a little different." },
    ],
  },
  {
    code: "WAL", name: "Wales", flag: "🏴󠁧󠁢󠁷󠁬󠁳󠁿", iso2: "gb-wls", capital: "Cardiff",
    continent: "europe", lat: 51.48, lng: -3.18, group: "C", hello: "Helo!",
    funFacts: [
      { kinder: "Wales has a red dragon on its flag.", enriched: "Wales is the only country with a fierce red dragon on its national flag." },
    ],
  },
  {
    code: "IRN", name: "Iran", flag: "🇮🇷", iso2: "ir", capital: "Tehran",
    continent: "asia", lat: 35.69, lng: 51.39, group: "C", hello: "Salam!",
    funFacts: [
      { kinder: "Iran makes beautiful soft carpets.", enriched: "Iran is famous for handmade carpets woven with thousands of tiny knots." },
    ],
  },
  {
    code: "JAM", name: "Jamaica", flag: "🇯🇲", iso2: "jm", capital: "Kingston",
    continent: "namerica", lat: 18.02, lng: -76.80, group: "C", hello: "Wah gwaan!",
    funFacts: [
      { kinder: "Jamaica gave the world reggae music.", enriched: "Jamaica is the birthplace of reggae music and very fast sprinters." },
    ],
  },

  // ---- Group D ----
  {
    code: "ARG", name: "Argentina", flag: "🇦🇷", iso2: "ar", capital: "Buenos Aires",
    continent: "samerica", lat: -34.60, lng: -58.38, group: "D", hello: "¡Hola!",
    funFacts: [
      { kinder: "Argentina won the last World Cup.", enriched: "Argentina are the reigning champions after lifting the trophy in 2022." },
      { kinder: "It is the home of football star Messi.", enriched: "Argentina is the homeland of Lionel Messi, one of football's greatest players." },
    ],
  },
  {
    code: "AUS", name: "Australia", flag: "🇦🇺", iso2: "au", capital: "Canberra",
    continent: "oceania", lat: -35.28, lng: 149.13, group: "D", hello: "G'day!",
    funFacts: [
      { kinder: "Australia has hopping kangaroos.", enriched: "Australia is home to kangaroos and koalas found nowhere else on Earth." },
    ],
  },
  {
    code: "POL", name: "Poland", flag: "🇵🇱", iso2: "pl", capital: "Warsaw",
    continent: "europe", lat: 52.23, lng: 21.01, group: "D", hello: "Cześć!",
    funFacts: [
      { kinder: "Poland has tall castles to explore.", enriched: "Poland is dotted with fairy-tale castles and one of Europe's oldest forests." },
    ],
  },
  {
    code: "CRC", name: "Costa Rica", flag: "🇨🇷", iso2: "cr", capital: "San José",
    continent: "namerica", lat: 9.93, lng: -84.08, group: "D", hello: "¡Pura vida!",
    funFacts: [
      { kinder: "Costa Rica has rainforests full of animals.", enriched: "Costa Rica protects rainforests buzzing with monkeys, sloths, and toucans." },
    ],
  },

  // ---- Group E ----
  {
    code: "BRA", name: "Brazil", flag: "🇧🇷", iso2: "br", capital: "Brasília",
    continent: "samerica", lat: -15.79, lng: -47.88, group: "E", hello: "Olá!",
    funFacts: [
      { kinder: "Brazil has won the World Cup five times.", enriched: "Brazil has won the World Cup a record five times, more than any other nation." },
      { kinder: "The huge Amazon rainforest is here.", enriched: "Brazil holds most of the Amazon, the largest rainforest on the planet." },
    ],
  },
  {
    code: "SUI", name: "Switzerland", flag: "🇨🇭", iso2: "ch", capital: "Bern",
    continent: "europe", lat: 46.95, lng: 7.45, group: "E", hello: "Grüezi!",
    funFacts: [
      { kinder: "Switzerland has snowy mountains called the Alps.", enriched: "Switzerland is famous for the snowy Alps, tasty chocolate, and cheese." },
    ],
  },
  {
    code: "SRB", name: "Serbia", flag: "🇷🇸", iso2: "rs", capital: "Belgrade",
    continent: "europe", lat: 44.79, lng: 20.45, group: "E", hello: "Zdravo!",
    funFacts: [
      { kinder: "Serbia loves lively brass band music.", enriched: "Serbia is known for energetic brass bands and big summer music festivals." },
    ],
  },
  {
    code: "NZL", name: "New Zealand", flag: "🇳🇿", iso2: "nz", capital: "Wellington",
    continent: "oceania", lat: -41.29, lng: 174.78, group: "E", hello: "Kia ora!",
    funFacts: [
      { kinder: "New Zealand has a funny bird called a kiwi.", enriched: "New Zealand's special kiwi bird cannot fly and comes out at night." },
    ],
  },

  // ---- Group F ----
  {
    code: "FRA", name: "France", flag: "🇫🇷", iso2: "fr", capital: "Paris",
    continent: "europe", lat: 48.85, lng: 2.35, group: "F", hello: "Bonjour!",
    funFacts: [
      { kinder: "France has the tall Eiffel Tower.", enriched: "France is home to the Eiffel Tower, one of the world's most famous landmarks." },
      { kinder: "France won the World Cup in 2018.", enriched: "France are recent champions, having won the World Cup back in 2018." },
    ],
  },
  {
    code: "KOR", name: "South Korea", flag: "🇰🇷", iso2: "kr", capital: "Seoul",
    continent: "asia", lat: 37.57, lng: 126.98, group: "F", hello: "Annyeong!",
    funFacts: [
      { kinder: "South Korea makes lots of fun pop music.", enriched: "South Korea is famous for K-pop music and super-fast internet." },
    ],
  },
  {
    code: "RSA", name: "South Africa", flag: "🇿🇦", iso2: "za", capital: "Pretoria",
    continent: "africa", lat: -25.75, lng: 28.19, group: "F", hello: "Sawubona!",
    funFacts: [
      { kinder: "South Africa has lions and elephants.", enriched: "South Africa's parks are home to lions, elephants, and rhinos on safari." },
    ],
  },
  {
    code: "PAN", name: "Panama", flag: "🇵🇦", iso2: "pa", capital: "Panama City",
    continent: "namerica", lat: 8.98, lng: -79.52, group: "F", hello: "¡Hola!",
    funFacts: [
      { kinder: "Panama has a canal for big ships.", enriched: "Panama's famous canal lets ships cut between two giant oceans." },
    ],
  },

  // ---- Group G ----
  {
    code: "ESP", name: "Spain", flag: "🇪🇸", iso2: "es", capital: "Madrid",
    continent: "europe", lat: 40.42, lng: -3.70, group: "G", hello: "¡Hola!",
    funFacts: [
      { kinder: "Spain won the World Cup in 2010.", enriched: "Spain are former world champions, famous for quick, clever passing." },
      { kinder: "People here dance the flamenco.", enriched: "Spain is known for flamenco dancing and delicious dishes like paella." },
    ],
  },
  {
    code: "JPN", name: "Japan", flag: "🇯🇵", iso2: "jp", capital: "Tokyo",
    continent: "asia", lat: 35.68, lng: 139.69, group: "G", hello: "Konnichiwa!",
    funFacts: [
      { kinder: "Japan has super-fast bullet trains.", enriched: "Japan is famous for bullet trains that zoom faster than racing cars." },
    ],
  },
  {
    code: "TUN", name: "Tunisia", flag: "🇹🇳", iso2: "tn", capital: "Tunis",
    continent: "africa", lat: 36.81, lng: 10.18, group: "G", hello: "Aslema!",
    funFacts: [
      { kinder: "Tunisia has parts of the Sahara desert.", enriched: "Tunisia reaches into the vast Sahara, the biggest hot desert on Earth." },
    ],
  },
  {
    code: "PAR", name: "Paraguay", flag: "🇵🇾", iso2: "py", capital: "Asunción",
    continent: "samerica", lat: -25.30, lng: -57.64, group: "G", hello: "¡Hola!",
    funFacts: [
      { kinder: "People in Paraguay speak two languages.", enriched: "Paraguay speaks both Spanish and Guaraní, an old native language." },
    ],
  },

  // ---- Group H ----
  {
    code: "GER", name: "Germany", flag: "🇩🇪", iso2: "de", capital: "Berlin",
    continent: "europe", lat: 52.52, lng: 13.40, group: "H", hello: "Hallo!",
    funFacts: [
      { kinder: "Germany has won the World Cup four times.", enriched: "Germany are four-time champions and famous for clever engineering." },
      { kinder: "It has spooky forests and big castles.", enriched: "Germany inspired many fairy tales with its dark forests and hilltop castles." },
    ],
  },
  {
    code: "COL", name: "Colombia", flag: "🇨🇴", iso2: "co", capital: "Bogotá",
    continent: "samerica", lat: 4.71, lng: -74.07, group: "H", hello: "¡Hola!",
    funFacts: [
      { kinder: "Colombia grows yummy coffee beans.", enriched: "Colombia grows some of the world's most loved coffee high in the mountains." },
    ],
  },
  {
    code: "QAT", name: "Qatar", flag: "🇶🇦", iso2: "qa", capital: "Doha",
    continent: "asia", lat: 25.29, lng: 51.53, group: "H", hello: "Marhaba!",
    funFacts: [
      { kinder: "Qatar hosted the World Cup in 2022.", enriched: "Qatar hosted the last World Cup with shiny new air-cooled stadiums." },
    ],
  },
  {
    code: "SCO", name: "Scotland", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", iso2: "gb-sct", capital: "Edinburgh",
    continent: "europe", lat: 55.95, lng: -3.19, group: "H", hello: "Hello!",
    funFacts: [
      { kinder: "Scotland has a famous lake monster story.", enriched: "Scotland is known for bagpipes, kilts, and the Loch Ness Monster legend." },
    ],
  },

  // ---- Group I ----
  {
    code: "POR", name: "Portugal", flag: "🇵🇹", iso2: "pt", capital: "Lisbon",
    continent: "europe", lat: 38.72, lng: -9.14, group: "I", hello: "Olá!",
    funFacts: [
      { kinder: "Portugal is home to star Cristiano Ronaldo.", enriched: "Portugal is the homeland of Cristiano Ronaldo, a record-breaking goal scorer." },
      { kinder: "Brave sailors set off from here long ago.", enriched: "Portugal's brave explorers sailed across unknown oceans centuries ago." },
    ],
  },
  {
    code: "URU", name: "Uruguay", flag: "🇺🇾", iso2: "uy", capital: "Montevideo",
    continent: "samerica", lat: -34.90, lng: -56.16, group: "I", hello: "¡Hola!",
    funFacts: [
      { kinder: "Uruguay won the very first World Cup.", enriched: "Uruguay won the very first World Cup, held at home in 1930." },
    ],
  },
  {
    code: "GHA", name: "Ghana", flag: "🇬🇭", iso2: "gh", capital: "Accra",
    continent: "africa", lat: 5.60, lng: -0.19, group: "I", hello: "Akwaaba!",
    funFacts: [
      { kinder: "Ghana's team is called the Black Stars.", enriched: "Ghana's team, the Black Stars, are loved across all of Africa." },
    ],
  },
  {
    code: "NOR", name: "Norway", flag: "🇳🇴", iso2: "no", capital: "Oslo",
    continent: "europe", lat: 59.91, lng: 10.75, group: "I", hello: "Hei!",
    funFacts: [
      { kinder: "In Norway the sky can glow at night.", enriched: "Norway's far north shows the northern lights, glowing colours in the sky." },
    ],
  },

  // ---- Group J ----
  {
    code: "NED", name: "Netherlands", flag: "🇳🇱", iso2: "nl", capital: "Amsterdam",
    continent: "europe", lat: 52.37, lng: 4.90, group: "J", hello: "Hallo!",
    funFacts: [
      { kinder: "The Netherlands has windmills and tulips.", enriched: "The Netherlands is famous for windmills, tulip fields, and lots of bicycles." },
    ],
  },
  {
    code: "SEN", name: "Senegal", flag: "🇸🇳", iso2: "sn", capital: "Dakar",
    continent: "africa", lat: 14.69, lng: -17.44, group: "J", hello: "Salaam!",
    funFacts: [
      { kinder: "Senegal has a giant pink lake.", enriched: "Senegal has a famous lake that turns bright pink in the sunshine." },
    ],
  },
  {
    code: "DEN", name: "Denmark", flag: "🇩🇰", iso2: "dk", capital: "Copenhagen",
    continent: "europe", lat: 55.68, lng: 12.57, group: "J", hello: "Hej!",
    funFacts: [
      { kinder: "Denmark invented those clicky building bricks.", enriched: "Denmark is the home of LEGO, the colourful clicking building bricks." },
    ],
  },
  {
    code: "CHI", name: "Chile", flag: "🇨🇱", iso2: "cl", capital: "Santiago",
    continent: "samerica", lat: -33.45, lng: -70.67, group: "J", hello: "¡Hola!",
    funFacts: [
      { kinder: "Chile is a very long, thin country.", enriched: "Chile is super long and thin, stretching down the edge of South America." },
    ],
  },

  // ---- Group K ----
  {
    code: "BEL", name: "Belgium", flag: "🇧🇪", iso2: "be", capital: "Brussels",
    continent: "europe", lat: 50.85, lng: 4.35, group: "K", hello: "Hallo!",
    funFacts: [
      { kinder: "Belgium makes yummy chocolate and waffles.", enriched: "Belgium is famous worldwide for its chocolate, waffles, and crispy fries." },
    ],
  },
  {
    code: "NGA", name: "Nigeria", flag: "🇳🇬", iso2: "ng", capital: "Abuja",
    continent: "africa", lat: 9.07, lng: 7.49, group: "K", hello: "Sannu!",
    funFacts: [
      { kinder: "Nigeria has the most people in Africa.", enriched: "Nigeria is Africa's most populous country and loves football dearly." },
    ],
  },
  {
    code: "AUT", name: "Austria", flag: "🇦🇹", iso2: "at", capital: "Vienna",
    continent: "europe", lat: 48.21, lng: 16.37, group: "K", hello: "Servus!",
    funFacts: [
      { kinder: "Austria has beautiful music and mountains.", enriched: "Austria is famous for classical music and the snowy peaks of the Alps." },
    ],
  },
  {
    code: "EGY", name: "Egypt", flag: "🇪🇬", iso2: "eg", capital: "Cairo",
    continent: "africa", lat: 30.04, lng: 31.24, group: "K", hello: "Ahlan!",
    funFacts: [
      { kinder: "Egypt has giant pyramids in the sand.", enriched: "Egypt is home to the ancient pyramids, built thousands of years ago." },
    ],
  },

  // ---- Group L ----
  {
    code: "ENG", name: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", iso2: "gb-eng", capital: "London",
    continent: "europe", lat: 51.51, lng: -0.13, group: "L", hello: "Hello!",
    funFacts: [
      { kinder: "Football was first made into a game here.", enriched: "England wrote the first football rule book, giving the sport its modern form." },
      { kinder: "London has a giant clock called Big Ben.", enriched: "England's capital, London, has the famous clock tower known as Big Ben." },
    ],
  },
  {
    code: "ITA", name: "Italy", flag: "🇮🇹", iso2: "it", capital: "Rome",
    continent: "europe", lat: 41.90, lng: 12.50, group: "L", hello: "Ciao!",
    funFacts: [
      { kinder: "Italy is shaped like a boot.", enriched: "Italy is shaped like a tall boot kicking a ball into the sea." },
      { kinder: "Pizza and pasta come from Italy.", enriched: "Italy gave the world pizza, pasta, and creamy gelato ice cream." },
    ],
  },
  {
    code: "ALG", name: "Algeria", flag: "🇩🇿", iso2: "dz", capital: "Algiers",
    continent: "africa", lat: 36.75, lng: 3.06, group: "L", hello: "Salam!",
    funFacts: [
      { kinder: "Algeria is the biggest country in Africa.", enriched: "Algeria is the largest country in Africa, much of it golden Sahara desert." },
    ],
  },
  {
    code: "CIV", name: "Ivory Coast", flag: "🇨🇮", iso2: "ci", capital: "Yamoussoukro",
    continent: "africa", lat: 6.83, lng: -5.29, group: "L", hello: "Akwaba!",
    funFacts: [
      { kinder: "Ivory Coast grows most of the world's cocoa.", enriched: "Ivory Coast grows more cocoa beans than anywhere, the source of chocolate." },
    ],
  },
];

/** Fast lookup of a team by its code. */
export const TEAM_BY_CODE: Record<string, Team> = Object.fromEntries(
  TEAMS.map((t) => [t.code, t]),
);

/** Human-friendly continent names for labels. */
export const CONTINENT_LABEL: Record<Team["continent"], string> = {
  africa: "Africa",
  asia: "Asia",
  europe: "Europe",
  namerica: "North America",
  samerica: "South America",
  oceania: "Oceania",
};

/** Continent colours mirror tailwind.config.ts so JS + CSS agree. */
export const CONTINENT_COLOR: Record<Team["continent"], string> = {
  africa: "#f59e0b",
  asia: "#ef4444",
  europe: "#3b82f6",
  namerica: "#10b981",
  samerica: "#a855f7",
  oceania: "#06b6d4",
};

export function getTeam(code: string): Team | undefined {
  return TEAM_BY_CODE[code];
}
