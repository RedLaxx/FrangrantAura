import { A_F } from "./definitions/a-f.ts";
import { G_M } from "./definitions/g-m.ts";
import { N_S } from "./definitions/n-s.ts";
import { T_Z } from "./definitions/t-z.ts";

export interface Definition {
  /** The word itself, lowercase. */
  word: string;
  /** Part of speech, e.g. "noun", "verb", "adjective". */
  pos: string;
  /** A plain-language definition aimed at learners. */
  definition: string;
  /** One short sentence that shows the word in real use. */
  example: string;
}

const CHUNKS = [A_F, G_M, N_S, T_Z];

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
      if (parts.length !== 4) {
        problems.push(`Expected 4 fields, got ${parts.length}: ${line}`);
        continue;
      }

      const [word, pos, definition, example] = parts.map((p) => p.trim());
      if (!/^[a-z]{3,}$/.test(word)) {
        problems.push(`Word must be 3+ lowercase letters: "${word}"`);
        continue;
      }
      if (!pos || !definition || !example) {
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
