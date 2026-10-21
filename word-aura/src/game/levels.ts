/**
 * Hand-built level packs. A level is a multiset of letters plus the words the
 * player must find. Bonus words are derived at runtime from the curated
 * dictionary, so every word this game will ever show the player already has a
 * definition attached.
 */

interface RawLevel {
  /** Letters available on the wheel; repeats are allowed (e.g. "bottle" has two t's). */
  letters: string;
  /** Words that must be found to clear the level. */
  required: string[];
}

interface RawPack {
  id: string;
  name: string;
  blurb: string;
  levels: RawLevel[];
}

const RAW_PACKS: RawPack[] = [
  {
    id: "first-light",
    name: "First Light",
    blurb: "Three and four letters. Warm up your eyes.",
    levels: [
      { letters: "tape", required: ["tape", "tap", "pat", "tea"] },
      { letters: "east", required: ["east", "seat", "tea", "eat", "ate"] },
      { letters: "skin", required: ["skin", "sink", "ink", "kin", "sin"] },
      { letters: "pear", required: ["pear", "pare", "ear", "ape", "pea"] },
      { letters: "cloud", required: ["cloud", "loud", "cold", "old", "duo"] },
      { letters: "trail", required: ["trail", "trial", "rail", "tail", "air", "liar"] },
      { letters: "stone", required: ["stone", "note", "tone", "nest", "one", "ten"] },
      { letters: "spare", required: ["spare", "pear", "spar", "rasp", "sea", "are"] },
      { letters: "listen", required: ["listen", "silent", "list", "line", "tile", "lens"] },
      { letters: "night", required: ["night", "thing", "thin", "hint", "tin"] },
    ],
  },
  {
    id: "everyday",
    name: "Everyday",
    blurb: "The words you meet at home, at work and on the road.",
    levels: [
      { letters: "ocean", required: ["ocean", "cone", "cane", "acne", "one", "ace"] },
      { letters: "plant", required: ["plant", "plan", "ant", "pan", "lap", "nap"] },
      { letters: "bread", required: ["bread", "beard", "read", "bear", "bare", "ear"] },
      { letters: "smile", required: ["smile", "mile", "lime", "slim", "isle", "lie"] },
      { letters: "water", required: ["water", "tear", "rate", "wear", "art", "wet"] },
      { letters: "chair", required: ["chair", "hair", "rich", "char", "air", "car"] },
      { letters: "table", required: ["table", "late", "tale", "able", "belt", "beat"] },
      { letters: "metal", required: ["metal", "meal", "mate", "team", "late", "tale"] },
      { letters: "wonder", required: ["wonder", "owner", "word", "done", "down", "one"] },
      { letters: "castle", required: ["castle", "least", "steal", "slate", "tale", "sale"] },
    ],
  },
  {
    id: "turning-point",
    name: "Turning Point",
    blurb: "Five letters, and a few words that change meaning with context.",
    levels: [
      { letters: "dream", required: ["dream", "armed", "read", "dare", "made", "mare"] },
      { letters: "brave", required: ["brave", "bear", "bare", "rave", "ear", "bar"] },
      { letters: "flame", required: ["flame", "fame", "leaf", "meal", "male", "flea"] },
      { letters: "grace", required: ["grace", "race", "care", "cage", "age", "car"] },
      { letters: "stare", required: ["stare", "rest", "star", "seat", "tear"] },
      { letters: "cloudy", required: ["cloudy", "cloud", "cold", "loud", "old", "duo"] },
      { letters: "jungle", required: ["jungle", "lunge", "lung", "glue", "jug"] },
      { letters: "market", required: ["market", "maker", "take", "rate", "mark", "team"] },
      { letters: "silver", required: ["silver", "liver", "live", "evil", "veil", "rise"] },
      { letters: "planet", required: ["planet", "plane", "plant", "plate", "panel", "petal"] },
    ],
  },
  {
    id: "longer-words",
    name: "Longer Words",
    blurb: "Six-letter puzzles. Take your time with the wheel.",
    levels: [
      { letters: "garden", required: ["garden", "danger", "range", "anger", "grade", "grand"] },
      { letters: "bright", required: ["bright", "right", "birth", "grit", "hit"] },
      { letters: "summer", required: ["summer", "user", "muse", "sure", "sum"] },
      { letters: "winter", required: ["winter", "twine", "inert", "wine", "tire", "rent"] },
      { letters: "forest", required: ["forest", "foster", "softer", "store", "rest", "rose"] },
      { letters: "orange", required: ["orange", "range", "anger", "organ", "groan", "near"] },
      { letters: "travel", required: ["travel", "later", "alert", "alter", "real", "tale"] },
      { letters: "window", required: ["window", "wind", "down", "own", "won"] },
      { letters: "camera", required: ["camera", "cream", "care", "race", "area", "mare"] },
      { letters: "bottle", required: ["bottle", "tote", "bolt", "lot", "let", "toe"] },
    ],
  },
  {
    id: "hidden-gems",
    name: "Hidden Gems",
    blurb: "Seven-letter words with a few treasures tucked inside.",
    levels: [
      { letters: "whisper", required: ["whisper", "perish", "spire", "wish", "ship", "wise"] },
      { letters: "journey", required: ["journey", "enjoy", "your", "rune", "joy"] },
      { letters: "lantern", required: ["lantern", "antler", "rental", "learn", "later", "near"] },
      { letters: "silence", required: ["silence", "license", "since", "nice", "line", "lens"] },
      { letters: "caution", required: ["caution", "action", "count", "coin", "coat", "aunt"] },
      { letters: "feather", required: ["feather", "father", "earth", "heart", "fear", "rate"] },
      { letters: "compass", required: ["compass", "pass", "mass", "camp", "soap", "map"] },
      { letters: "gravity", required: ["gravity", "gravy", "vary", "tray", "grit"] },
      { letters: "blanket", required: ["blanket", "blank", "lake", "bake", "tank", "belt"] },
      { letters: "teacher", required: ["teacher", "teach", "cheat", "cheer", "reach", "heart"] },
    ],
  },
];

export interface Level {
  /** Stable id, e.g. "silence-4". */
  id: string;
  packId: string;
  packName: string;
  /** 1-based position inside the pack. */
  index: number;
  letters: string[];
  /** Required words, sorted by length then alphabetically (matches the pan layout). */
  required: string[];
}

export interface Pack {
  id: string;
  name: string;
  blurb: string;
  levels: Level[];
}

function sortWords(words: string[]): string[] {
  return [...words].sort((a, b) => a.length - b.length || a.localeCompare(b));
}

export const PACKS: Pack[] = RAW_PACKS.map((rawPack) => {
  const levels: Level[] = rawPack.levels.map((rawLevel, i) => ({
    id: `${rawPack.id}-${i + 1}`,
    packId: rawPack.id,
    packName: rawPack.name,
    index: i + 1,
    letters: rawLevel.letters.split(""),
    required: sortWords([...new Set(rawLevel.required)]),
  }));

  return { id: rawPack.id, name: rawPack.name, blurb: rawPack.blurb, levels };
});

/** Flat, in play order — used for unlocking and "next level" navigation. */
export const ALL_LEVELS: Level[] = PACKS.flatMap((pack) => pack.levels);

export const LEVEL_BY_ID: ReadonlyMap<string, Level> = new Map(
  ALL_LEVELS.map((level) => [level.id, level]),
);

export function getPack(packId: string): Pack | undefined {
  return PACKS.find((pack) => pack.id === packId);
}

export function getLevel(levelId: string): Level | undefined {
  return LEVEL_BY_ID.get(levelId);
}

export function nextLevel(levelId: string): Level | undefined {
  const i = ALL_LEVELS.findIndex((level) => level.id === levelId);
  return i === -1 ? undefined : ALL_LEVELS[i + 1];
}

export function previousLevel(levelId: string): Level | undefined {
  const i = ALL_LEVELS.findIndex((level) => level.id === levelId);
  return i <= 0 ? undefined : ALL_LEVELS[i - 1];
}
