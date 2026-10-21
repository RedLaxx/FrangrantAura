/**
 * Content sanity check. Run with `npm run validate`.
 *
 * Guarantees we never ship a level that cannot be completed, or a word the
 * player can find but never gets a definition for — that would break the
 * central promise of the game.
 */
import { DICTIONARY_PROBLEMS, getDefinition } from "../src/game/dictionary.ts";
import { PACKS } from "../src/game/levels.ts";
import { bonusWordsForLevel, canFormFromLetters, MIN_WORD_LENGTH } from "../src/game/engine.ts";

const errors: string[] = [];
const warnings: string[] = [];

for (const problem of DICTIONARY_PROBLEMS) {
  errors.push(`dictionary: ${problem}`);
}

let levelCount = 0;
let wordCount = 0;
let bonusCount = 0;

for (const pack of PACKS) {
  for (const level of pack.levels) {
    levelCount += 1;
    const where = `${pack.name} ${level.index}`;
    const required = new Set(level.required);

    if (level.required.length < 3) {
      errors.push(`${where}: needs at least 3 required words`);
    }
    if (level.letters.length < 3 || level.letters.length > 7) {
      errors.push(`${where}: letters must be 3–7 characters (got ${level.letters.length})`);
    }

    let longest = 0;
    for (const word of level.required) {
      wordCount += 1;
      if (word.length < MIN_WORD_LENGTH) {
        errors.push(`${where}: "${word}" is shorter than ${MIN_WORD_LENGTH} letters`);
      }
      if (!canFormFromLetters(word, level.letters)) {
        errors.push(`${where}: "${word}" cannot be spelled from [${level.letters.join("")}]`);
      }
      if (!getDefinition(word)) {
        errors.push(`${where}: no definition for required word "${word}"`);
      }
      longest = Math.max(longest, word.length);
    }

    if (longest !== level.letters.length) {
      warnings.push(
        `${where}: no required word uses all ${level.letters.length} letters (longest is ${longest})`,
      );
    }

    const bonus = bonusWordsForLevel(level);
    bonusCount += bonus.length;
    for (const word of bonus) {
      if (required.has(word)) errors.push(`${where}: "${word}" is both required and bonus`);
      if (!getDefinition(word)) errors.push(`${where}: bonus word "${word}" has no definition`);
    }
    if (bonus.length === 0) {
      warnings.push(`${where}: no bonus words available`);
    }
  }
}

console.log(
  `Checked ${PACKS.length} packs, ${levelCount} levels, ${wordCount} required word slots, ` +
    `${bonusCount} bonus word opportunities.`,
);

for (const warning of warnings) console.warn(`warning: ${warning}`);

if (errors.length > 0) {
  for (const error of errors) console.error(`error: ${error}`);
  console.error(`\n${errors.length} problem(s) found.`);
  process.exit(1);
}

console.log("All levels and definitions look good.");
