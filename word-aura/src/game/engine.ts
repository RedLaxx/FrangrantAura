import { DICTIONARY_WORDS, getDefinition, type Definition } from "./dictionary.ts";
import type { Level } from "./levels.ts";

export const MIN_WORD_LENGTH = 3;
export const HINT_COST = 30;
export const BONUS_WORD_COINS = 5;
export const STARTING_COINS = 120;

export type AttemptStatus =
  | "required"
  | "bonus"
  | "duplicate"
  | "short"
  | "unknown"
  | "impossible";

export interface AttemptResult {
  word: string;
  status: AttemptStatus;
  coins: number;
  definition?: Definition;
  message: string;
}

export function normalizeWord(input: string): string {
  return input.toLowerCase().replace(/[^a-z]/g, "");
}

/** True when `word` can be spelled with the given letters (respecting repeats). */
export function canFormFromLetters(word: string, letters: readonly string[]): boolean {
  const pool = new Map<string, number>();
  for (const letter of letters) {
    pool.set(letter, (pool.get(letter) ?? 0) + 1);
  }
  for (const letter of word) {
    const remaining = pool.get(letter);
    if (!remaining) return false;
    pool.set(letter, remaining - 1);
  }
  return true;
}

export function sortWords(words: readonly string[]): string[] {
  return [...words].sort((a, b) => a.length - b.length || a.localeCompare(b));
}

export function groupByLength(words: readonly string[]): Map<number, string[]> {
  const groups = new Map<number, string[]>();
  for (const word of sortWords(words)) {
    const group = groups.get(word.length);
    if (group) group.push(word);
    else groups.set(word.length, [word]);
  }
  return groups;
}

/**
 * Every dictionary word that can be built from the level's letters and is not
 * already a required answer. This is what makes a level replayable: the bonus
 * list is discovered from the dictionary rather than written by hand.
 */
export function bonusWordsForLevel(level: Level): string[] {
  const required = new Set(level.required);
  return DICTIONARY_WORDS.filter(
    (word) =>
      word.length >= MIN_WORD_LENGTH &&
      !required.has(word) &&
      canFormFromLetters(word, level.letters),
  );
}

export function evaluateAttempt(
  rawWord: string,
  level: Level,
  foundWords: ReadonlySet<string>,
): AttemptResult {
  const word = normalizeWord(rawWord);
  const definition = getDefinition(word);

  if (word.length < MIN_WORD_LENGTH) {
    return {
      word,
      status: "short",
      coins: 0,
      message: "Words need at least three letters.",
    };
  }

  if (foundWords.has(word)) {
    return {
      word,
      status: "duplicate",
      coins: 0,
      definition,
      message: `${word.toUpperCase()} is already on the pan.`,
    };
  }

  if (!canFormFromLetters(word, level.letters)) {
    return {
      word,
      status: "impossible",
      coins: 0,
      message: `You cannot spell ${word.toUpperCase()} with these letters.`,
    };
  }

  if (!definition) {
    return {
      word,
      status: "unknown",
      coins: 0,
      message: `${word.toUpperCase()} is not in the word book yet.`,
    };
  }

  if (level.required.includes(word)) {
    return {
      word,
      status: "required",
      coins: 0,
      definition,
      message: `Found ${word.toUpperCase()}!`,
    };
  }

  return {
    word,
    status: "bonus",
    coins: BONUS_WORD_COINS,
    definition,
    message: `Bonus word! +${BONUS_WORD_COINS} coins`,
  };
}

export function isLevelComplete(level: Level, foundWords: ReadonlySet<string>): boolean {
  return level.required.every((word) => foundWords.has(word));
}

export function starsFor(options: {
  hints: number;
  bonusFound: number;
  bonusTotal: number;
}): 1 | 2 | 3 {
  const { hints, bonusFound, bonusTotal } = options;
  const halfTheBonus = bonusTotal > 0 && bonusFound >= Math.ceil(bonusTotal / 2);
  if (hints === 0 && halfTheBonus) return 3;
  if (hints === 0) return 2;
  return 1;
}

export function completionCoins(stars: number): number {
  return 15 + stars * 5;
}

/** A word is "revealed" left-to-right by hints. Returns how many letters to show. */
export function revealedCountFor(
  revealed: Readonly<Record<string, number>>,
  word: string,
): number {
  return Math.min(revealed[word] ?? 0, word.length);
}
