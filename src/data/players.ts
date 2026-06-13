import type { PlayerStory } from "@/types";

/**
 * Curated, inspiring player stories — every one is true at heart and written
 * for 4–6 year olds. Each story has a kindergarten level and an enriched level.
 *
 * They are tied to teams so the dashboard can show stories for *today's* match.
 */
export const PLAYER_STORIES: PlayerStory[] = [
  {
    id: "messi",
    name: "Lionel Messi",
    teamCode: "ARG",
    position: "Forward",
    emoji: "🐐",
    hook: {
      kinder: "A tiny boy who grew into a giant of football.",
      enriched: "A small boy from Argentina who became one of the greatest ever.",
    },
    story: {
      kinder:
        "As a boy, Leo was very small. A doctor helped him grow. He never gave up. He practised every single day. Now he is a champion!",
      enriched:
        "When Leo was young, he was much smaller than the other children. His family worked hard to find a doctor to help him grow. Even when it was tough, he kept practising with the ball every day, and he grew into a World Cup champion.",
    },
    lesson: {
      kinder: "Being small can't stop a big dream.",
      enriched: "No challenge is too big when you never stop trying.",
    },
  },
  {
    id: "ronaldo",
    name: "Cristiano Ronaldo",
    teamCode: "POR",
    position: "Forward",
    emoji: "🚀",
    hook: {
      kinder: "He works harder than almost anyone.",
      enriched: "A boy from a small island who trained his way to greatness.",
    },
    story: {
      kinder:
        "Cristiano grew up with very little. He loved football so much. He trained and trained. Now he jumps super high and scores lots of goals!",
      enriched:
        "Cristiano grew up on a small island without much money. He loved football more than anything, so he practised jumping and running for hours. All that hard work made him one of the best goal scorers in the world.",
    },
    lesson: {
      kinder: "Hard work makes dreams come true.",
      enriched: "Practice every day and you can do amazing things.",
    },
  },
  {
    id: "mbappe",
    name: "Kylian Mbappé",
    teamCode: "FRA",
    position: "Forward",
    emoji: "⚡",
    hook: {
      kinder: "The fastest runner on the pitch.",
      enriched: "A super-fast star who dreamed big as a little kid.",
    },
    story: {
      kinder:
        "Kylian was always very fast. As a little boy he dreamed of the World Cup. He worked hard. He won it when he was still young!",
      enriched:
        "Kylian could run faster than everyone, even as a child. He pinned football pictures on his wall and dreamed of winning the World Cup. He worked hard, and his dream came true while he was still very young.",
    },
    lesson: {
      kinder: "Dream big and run fast at your goals.",
      enriched: "Believe in your dream and chase it with all your speed.",
    },
  },
  {
    id: "vinicius",
    name: "Vinícius Júnior",
    teamCode: "BRA",
    position: "Forward",
    emoji: "🎉",
    hook: {
      kinder: "He plays with a big, happy smile.",
      enriched: "A joyful dancer with the ball from sunny Brazil.",
    },
    story: {
      kinder:
        "Vini grew up far from the big city. He played football in the street. He kept smiling and dancing. Now the whole world watches him!",
      enriched:
        "Vinícius grew up in a busy neighbourhood in Brazil, playing football in the streets. He played with joy, dancing after every goal. His happiness and skill carried him all the way to the world stage.",
    },
    lesson: {
      kinder: "Play with joy and a happy heart.",
      enriched: "Doing what you love with joy helps you shine.",
    },
  },
  {
    id: "bellingham",
    name: "Jude Bellingham",
    teamCode: "ENG",
    position: "Midfielder",
    emoji: "🦁",
    hook: {
      kinder: "A young leader who is brave on the ball.",
      enriched: "A calm young star who leads England with courage.",
    },
    story: {
      kinder:
        "Jude was a star when he was very young. He stayed kind and calm. He listens and learns. Now he helps his whole team!",
      enriched:
        "Jude became a professional footballer while he was still a teenager. He stayed humble, listened to his coaches, and kept learning. Now he leads his team with calm courage and a big heart.",
    },
    lesson: {
      kinder: "Stay kind even when you are great.",
      enriched: "True leaders stay humble and lift up their team.",
    },
  },
  {
    id: "yamal",
    name: "Lamine Yamal",
    teamCode: "ESP",
    position: "Forward",
    emoji: "✨",
    hook: {
      kinder: "A wonder kid full of magic tricks.",
      enriched: "A teenage magician dazzling fans for Spain.",
    },
    story: {
      kinder:
        "Lamine started playing when he was very tiny. He loved tricks with the ball. He believed in himself. Now he amazes everyone!",
      enriched:
        "Lamine learned football as a tiny boy and adored doing tricks. He believed in himself even when others said he was too young. His magic with the ball now lights up stadiums around the world.",
    },
    lesson: {
      kinder: "Believe in yourself, even when you are small.",
      enriched: "Self-belief turns a young dreamer into a star.",
    },
  },
  {
    id: "haaland",
    name: "Erling Haaland",
    teamCode: "NOR",
    position: "Forward",
    emoji: "🥶",
    hook: {
      kinder: "A goal machine as cool as the snow.",
      enriched: "A powerful scorer from the cold north of Norway.",
    },
    story: {
      kinder:
        "Erling grew up where it is cold and snowy. His dad played football too. He ate well and trained hard. Now he scores so many goals!",
      enriched:
        "Erling grew up in snowy Norway, where his father had also played football. He ate healthy food and trained with great discipline. That hard work made him one of the deadliest goal scorers around.",
    },
    lesson: {
      kinder: "Eat well, train hard, score big.",
      enriched: "Good habits and hard work build real strength.",
    },
  },
  {
    id: "modric",
    name: "Luka Modrić",
    teamCode: "CRO",
    position: "Midfielder",
    emoji: "🧠",
    hook: {
      kinder: "A clever player who never, ever gives up.",
      enriched: "A wise midfielder who overcame a hard childhood.",
    },
    story: {
      kinder:
        "Luka had a very hard start in life. He was small too. But he was clever and brave. He grew into a football hero!",
      enriched:
        "Luka grew up during very difficult times in Croatia and was often told he was too small. He stayed brave and used his clever football brain. He became one of the smartest midfielders the game has ever seen.",
    },
    lesson: {
      kinder: "A clever, brave heart beats every problem.",
      enriched: "Courage and a clever mind can overcome any hardship.",
    },
  },
  {
    id: "salah",
    name: "Mohamed Salah",
    teamCode: "EGY",
    position: "Forward",
    emoji: "🌟",
    hook: {
      kinder: "He traveled far every day just to train.",
      enriched: "Egypt's king who rode buses for hours to chase his dream.",
    },
    story: {
      kinder:
        "Mo lived in a small village. He rode buses for hours to practise. He was tired but happy. Now he is a hero in Egypt!",
      enriched:
        "Mohamed grew up in a small Egyptian village, far from any big club. Every day he travelled for hours on buses just to train. His patience and effort made him a beloved hero across Egypt.",
    },
    lesson: {
      kinder: "Go the extra mile for your dream.",
      enriched: "Patience and effort carry you all the way.",
    },
  },
  {
    id: "mane",
    name: "Sadio Mané",
    teamCode: "SEN",
    position: "Forward",
    emoji: "💛",
    hook: {
      kinder: "A kind star who helps his whole village.",
      enriched: "A Senegalese hero who shares everything he earns.",
    },
    story: {
      kinder:
        "Sadio grew up in a small village. He worked very hard. Now he builds schools and helps friends back home. He is very kind!",
      enriched:
        "Sadio grew up in a small village in Senegal and dreamed of football. After working hard to succeed, he built schools and a hospital to help his community. He shows that greatness means giving back.",
    },
    lesson: {
      kinder: "Be kind and share with others.",
      enriched: "The best champions lift up everyone around them.",
    },
  },
  {
    id: "davies",
    name: "Alphonso Davies",
    teamCode: "CAN",
    position: "Defender",
    emoji: "🛣️",
    hook: {
      kinder: "A speedy boy who found a brand new home.",
      enriched: "A Canadian roadrunner who began life far away.",
    },
    story: {
      kinder:
        "Alphonso was born far from Canada. His family found a safe new home. He played football and ran fast. Now he plays for Canada!",
      enriched:
        "Alphonso was born in a refugee camp before his family found a safe new home in Canada. He fell in love with football and his amazing speed earned him the nickname 'Roadrunner'.",
    },
    lesson: {
      kinder: "A new start can lead to big things.",
      enriched: "Hope and hard work can turn a tough start into triumph.",
    },
  },
  {
    id: "pulisic",
    name: "Christian Pulisic",
    teamCode: "USA",
    position: "Forward",
    emoji: "🦅",
    hook: {
      kinder: "He left home young to chase his dream.",
      enriched: "An American star brave enough to chase football far away.",
    },
    story: {
      kinder:
        "Christian loved football as a boy. He moved far away to learn. He missed home but stayed strong. Now he stars for the USA!",
      enriched:
        "Christian loved football and was brave enough to move across the ocean as a teenager to train. He missed his family but stayed focused. Now he is one of America's brightest stars.",
    },
    lesson: {
      kinder: "Be brave to follow your dream.",
      enriched: "Courage to leave your comfort zone helps you grow.",
    },
  },
  {
    id: "son",
    name: "Son Heung-min",
    teamCode: "KOR",
    position: "Forward",
    emoji: "😄",
    hook: {
      kinder: "He practised kicking for hours and hours.",
      enriched: "A smiling Korean captain shaped by endless practice.",
    },
    story: {
      kinder:
        "Son's dad taught him football. He practised for hours every day. He never skipped a day. Now he scores beautiful goals!",
      enriched:
        "Son's father trained him with hours of practice every single day, focusing on the basics. That patient, careful work made Son a brilliant scorer and the smiling captain of South Korea.",
    },
    lesson: {
      kinder: "Practise the basics every day.",
      enriched: "Mastering the basics is the secret to brilliance.",
    },
  },
  {
    id: "osimhen",
    name: "Victor Osimhen",
    teamCode: "NGA",
    position: "Forward",
    emoji: "🦅",
    hook: {
      kinder: "He sold snacks before he scored goals.",
      enriched: "A Nigerian striker who rose from selling on the streets.",
    },
    story: {
      kinder:
        "Victor had very little as a boy. He sold water and snacks to help. He kept playing football. Now he is a star striker!",
      enriched:
        "Victor grew up with very little and sold water and snacks on the streets to help his family. Through it all he kept playing football, and his determination made him a star striker for Nigeria.",
    },
    lesson: {
      kinder: "Keep going, even when it is hard.",
      enriched: "Determination can lift you from the hardest start.",
    },
  },
  {
    id: "hakimi",
    name: "Achraf Hakimi",
    teamCode: "MAR",
    position: "Defender",
    emoji: "🏍️",
    hook: {
      kinder: "A speedy defender who loves his family.",
      enriched: "A flying Moroccan whose parents worked hard for him.",
    },
    story: {
      kinder:
        "Achraf's parents worked very hard for him. He never forgot it. He runs super fast down the side. He plays for them with love!",
      enriched:
        "Achraf's parents worked long hours so he could chase his football dream. He never forgot their sacrifice. He flies down the wing for Morocco and dedicates his success to his loving family.",
    },
    lesson: {
      kinder: "Say thank you to those who help you.",
      enriched: "Honour the people who believe in and support you.",
    },
  },
  {
    id: "musiala",
    name: "Jamal Musiala",
    teamCode: "GER",
    position: "Midfielder",
    emoji: "🤹",
    hook: {
      kinder: "He dribbles like the ball is glued on.",
      enriched: "A smiling dribbler who grew up in many countries.",
    },
    story: {
      kinder:
        "Jamal lived in different countries as a boy. He made new friends everywhere. He loves to dribble and smile. Now he dazzles for Germany!",
      enriched:
        "Jamal grew up living in different countries, learning to make friends and adapt wherever he went. He kept his joyful dribbling, and that bubbly skill now lights up the German team.",
    },
    lesson: {
      kinder: "New places can bring new friends.",
      enriched: "Being open to change helps you grow and belong.",
    },
  },
];

/** All stories for a given team. */
export function storiesForTeam(code: string): PlayerStory[] {
  return PLAYER_STORIES.filter((p) => p.teamCode === code);
}

/** Stories for either side of a match, with a sensible fallback. */
export function storiesForMatch(
  homeCode: string,
  awayCode: string,
): PlayerStory[] {
  const found = PLAYER_STORIES.filter(
    (p) => p.teamCode === homeCode || p.teamCode === awayCode,
  );
  // Always give the kids at least a few stories to explore.
  if (found.length >= 2) return found;
  const extras = PLAYER_STORIES.filter((p) => !found.includes(p)).slice(0, 4);
  return [...found, ...extras];
}
