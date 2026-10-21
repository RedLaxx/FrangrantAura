import { A_F } from "./definitions/a-f.ts";
import { G_M } from "./definitions/g-m.ts";
import { N_S } from "./definitions/n-s.ts";
import { T_Z } from "./definitions/t-z.ts";
import { EXTRA_1 } from "./definitions/extra-1.ts";
import { EXTRA_2 } from "./definitions/extra-2.ts";
import { EXTRA_3 } from "./definitions/extra-3.ts";
import { EXTRA_4 } from "./definitions/extra-4.ts";
import { EXTRA_5 } from "./definitions/extra-5.ts";
import { EXTRA_6 } from "./definitions/extra-6.ts";
import { EXTRA_7 } from "./definitions/extra-7.ts";
import { EXTRA_8 } from "./definitions/extra-8.ts";
import { EXTRA_9 } from "./definitions/extra-9.ts";
import { EXTRA_10 } from "./definitions/extra-10.ts";
import { EXTRA_11 } from "./definitions/extra-11.ts";
import { EXTRA_12 } from "./definitions/extra-12.ts";
import { EXTRA_13 } from "./definitions/extra-13.ts";
import { EXTRA_14 } from "./definitions/extra-14.ts";
import { EXTRA_15 } from "./definitions/extra-15.ts";
import { EXTRA_16 } from "./definitions/extra-16.ts";
import { EXTRA_17 } from "./definitions/extra-17.ts";

export interface Definition {
  /** The word itself, lowercase. */
  word: string;
  /** Part of speech, e.g. "noun", "verb", "adjective". */
  pos: string;
  /** A plain-language definition aimed at learners. */
  definition: string;
  /** One short sentence that shows the word in real use, when available. */
  example: string;
}

const CHUNKS = [
  A_F,
  G_M,
  N_S,
  T_Z,
  EXTRA_1,
  EXTRA_2,
  EXTRA_3,
  EXTRA_4,
  EXTRA_5,
  EXTRA_6,
  EXTRA_7,
  EXTRA_8,
  EXTRA_9,
  EXTRA_10,
  EXTRA_11,
  EXTRA_12,
  EXTRA_13,
  EXTRA_14,
  EXTRA_15,
  EXTRA_16,
  EXTRA_17,
];

/**
 * Parses the "word|pos|definition|example" format used by the definition files.
 * Bad lines are collected rather than thrown so the game can still boot, but
 * `npm run validate` fails the build when anything is malformed or missing.
 */
export function parseDefinitions(...chunks: string[]): {
  entries: Definition[];
  problems: string[];
} {
  const entries: Definition[] = [];
  const problems: string[] = [];
  const seen = new Set<string>();

  for (const chunk of chunks) {
    for (const rawLine of chunk.split("\n")) {
      const line = rawLine.trim();
      if (!line || line.startsWith("#") || line.startsWith("//")) continue;

      const parts = line.split("|");
      // The example sentence is optional: the large word lists ship with
      // definitions only, while curated entries add a sentence in use.
      if (parts.length !== 3 && parts.length !== 4) {
        problems.push(`Expected 3 or 4 fields, got ${parts.length}: ${line}`);
        continue;
      }

      const [word, pos, definition, example = ""] = parts.map((p) => p.trim());
      if (!/^[a-z]{3,}$/.test(word)) {
        problems.push(`Word must be 3+ lowercase letters: "${word}"`);
        continue;
      }
      if (!pos || !definition) {
        problems.push(`Empty field for "${word}"`);
        continue;
      }
      if (definition.includes("|") || example.includes("|")) {
        problems.push(`Unescaped pipe in "${word}"`);
        continue;
      }
      if (seen.has(word)) {
        problems.push(`Duplicate entry for "${word}"`);
        continue;
      }

      seen.add(word);
      entries.push({ word, pos, definition, example });
    }
  }

  return { entries, problems };
}

const parsed = parseDefinitions(...CHUNKS);

export const DICTIONARY_PROBLEMS = parsed.problems;

export const DICTIONARY: ReadonlyMap<string, Definition> = new Map(
  parsed.entries.map((entry) => [entry.word, entry]),
);

/** Every defined word, sorted alphabetically. */
export const DICTIONARY_WORDS: readonly string[] = parsed.entries
  .map((entry) => entry.word)
  .sort();

export function getDefinition(word: string): Definition | undefined {
  return DICTIONARY.get(word.toLowerCase());
}
