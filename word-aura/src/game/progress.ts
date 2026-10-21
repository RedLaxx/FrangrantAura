import { ALL_LEVELS, type Level } from "./levels.ts";
import { STARTING_COINS } from "./engine.ts";

export const SAVE_KEY = "word-aura/save/v1";
export const SAVE_VERSION = 1;

export interface LevelSave {
  /** Required words found so far. */
  found: string[];
  /** Bonus words found so far. */
  bonus: string[];
  /** How many hints were bought for this level. */
  hints: number;
  /** word -> number of letters revealed from the left. */
  revealed: Record<string, number>;
  stars: number;
  completedAt: number | null;
}

export interface SaveState {
  version: number;
  coins: number;
  levels: Record<string, LevelSave>;
  /** Words the player has been shown a definition for, with the timestamp. */
  learned: Record<string, number>;
  settings: {
    sound: boolean;
    haptics: boolean;
  };
  createdAt: number;
}

export function emptyLevelSave(): LevelSave {
  return { found: [], bonus: [], hints: 0, revealed: {}, stars: 0, completedAt: null };
}

export function defaultSave(): SaveState {
  return {
    version: SAVE_VERSION,
    coins: STARTING_COINS,
    levels: {},
    learned: {},
    settings: { sound: true, haptics: true },
    createdAt: Date.now(),
  };
}

export function getLevelSave(state: SaveState, levelId: string): LevelSave {
  return state.levels[levelId] ?? emptyLevelSave();
}

/** Levels unlock in order, across pack boundaries. */
export function isLevelUnlocked(state: SaveState, levelId: string): boolean {
  const index = ALL_LEVELS.findIndex((level) => level.id === levelId);
  if (index < 0) return false;
  if (index === 0) return true;
  const previous = ALL_LEVELS[index - 1];
  return getLevelSave(state, previous.id).completedAt !== null;
}

export function totalStars(state: SaveState): number {
  return Object.values(state.levels).reduce((sum, level) => sum + level.stars, 0);
}

export function completedLevelCount(state: SaveState): number {
  return Object.values(state.levels).filter((level) => level.completedAt !== null).length;
}

export function learnedCount(state: SaveState): number {
  return Object.keys(state.learned).length;
}

/** First level that is unlocked but not finished, else the last level. */
export function currentLevel(state: SaveState): Level {
  const unfinished = ALL_LEVELS.find(
    (level) => getLevelSave(state, level.id).completedAt === null,
  );
  return unfinished ?? ALL_LEVELS[ALL_LEVELS.length - 1];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function sanitizeLevelSave(value: unknown): LevelSave {
  const base = emptyLevelSave();
  if (!isRecord(value)) return base;

  const strings = (input: unknown): string[] =>
    Array.isArray(input) ? input.filter((item): item is string => typeof item === "string") : [];

  const revealed: Record<string, number> = {};
  if (isRecord(value.revealed)) {
    for (const [word, count] of Object.entries(value.revealed)) {
      if (typeof count === "number" && Number.isFinite(count) && count > 0) {
        revealed[word] = Math.floor(count);
      }
    }
  }

  return {
    found: strings(value.found),
    bonus: strings(value.bonus),
    hints: typeof value.hints === "number" && value.hints > 0 ? Math.floor(value.hints) : 0,
    revealed,
    stars: typeof value.stars === "number" ? Math.min(3, Math.max(0, Math.floor(value.stars))) : 0,
    completedAt: typeof value.completedAt === "number" ? value.completedAt : null,
  };
}

/**
 * Reads a save from storage, repairing anything unexpected. A corrupt or
 * half-written save should never lock a player out of the game.
 */
export function parseSave(raw: string | null): SaveState {
  if (!raw) return defaultSave();

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return defaultSave();
  }
  if (!isRecord(parsed)) return defaultSave();

  const levels: Record<string, LevelSave> = {};
  if (isRecord(parsed.levels)) {
    for (const [levelId, value] of Object.entries(parsed.levels)) {
      levels[levelId] = sanitizeLevelSave(value);
    }
  }

  const learned: Record<string, number> = {};
  if (isRecord(parsed.learned)) {
    for (const [word, at] of Object.entries(parsed.learned)) {
      if (typeof at === "number" && Number.isFinite(at)) learned[word] = at;
    }
  }

  const settings = isRecord(parsed.settings) ? parsed.settings : {};

  return {
    version: SAVE_VERSION,
    coins:
      typeof parsed.coins === "number" && Number.isFinite(parsed.coins)
        ? Math.max(0, Math.floor(parsed.coins))
        : STARTING_COINS,
    levels,
    learned,
    settings: {
      sound: typeof settings.sound === "boolean" ? settings.sound : true,
      haptics: typeof settings.haptics === "boolean" ? settings.haptics : true,
    },
    createdAt: typeof parsed.createdAt === "number" ? parsed.createdAt : Date.now(),
  };
}

export function loadSave(): SaveState {
  if (typeof window === "undefined") return defaultSave();
  try {
    return parseSave(window.localStorage.getItem(SAVE_KEY));
  } catch {
    return defaultSave();
  }
}

export function saveSave(state: SaveState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  } catch {
    // Storage can be full or blocked (private mode). The game still plays,
    // progress just will not survive a reload.
  }
}
