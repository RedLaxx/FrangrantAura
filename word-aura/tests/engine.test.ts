import test from "node:test";
import assert from "node:assert/strict";

import {
  BONUS_WORD_COINS,
  MIN_WORD_LENGTH,
  bonusWordsForLevel,
  canFormFromLetters,
  completionCoins,
  evaluateAttempt,
  isLevelComplete,
  starsFor,
} from "../src/game/engine.ts";
import { ALL_LEVELS, getLevel } from "../src/game/levels.ts";
import { DICTIONARY_PROBLEMS, getDefinition } from "../src/game/dictionary.ts";
import {
  defaultSave,
  emptyLevelSave,
  isLevelUnlocked,
  parseSave,
  totalStars,
} from "../src/game/progress.ts";

test("dictionary entries are all well formed", () => {
  assert.deepEqual(DICTIONARY_PROBLEMS, []);
});

test("letter matching respects repeated letters", () => {
  const bottle = ["b", "o", "t", "t", "l", "e"];
  assert.equal(canFormFromLetters("bottle", bottle), true);
  assert.equal(canFormFromLetters("tote", bottle), true);
  assert.equal(canFormFromLetters("toot", bottle), false, "only one o in bottle");
  assert.equal(canFormFromLetters("lot", bottle), true);
  assert.equal(canFormFromLetters("tab", ["t", "a", "p"]), false);
});

test("every required word is spelled from the level letters and defined", () => {
  for (const level of ALL_LEVELS) {
    for (const word of level.required) {
      assert.ok(
        canFormFromLetters(word, level.letters),
        `${level.id}: ${word} cannot be spelled from ${level.letters.join("")}`,
      );
      assert.ok(getDefinition(word), `${level.id}: missing definition for ${word}`);
      assert.ok(word.length >= MIN_WORD_LENGTH);
    }
  }
});

test("bonus words never overlap required words and always have definitions", () => {
  for (const level of ALL_LEVELS) {
    const required = new Set(level.required);
    for (const word of bonusWordsForLevel(level)) {
      assert.equal(required.has(word), false, `${level.id}: ${word} is required`);
      assert.ok(getDefinition(word), `missing definition for bonus word ${word}`);
      assert.ok(canFormFromLetters(word, level.letters));
    }
  }
});

test("evaluateAttempt classifies every outcome", () => {
  const level = getLevel("first-light-2");
  assert.ok(level);
  const found = new Set(["east"]);

  assert.equal(evaluateAttempt("E", level, found).status, "short");
  assert.equal(evaluateAttempt("east", level, found).status, "duplicate");
  assert.equal(evaluateAttempt("zoom", level, found).status, "impossible");
  assert.equal(evaluateAttempt("tea", level, found).status, "required");
  assert.equal(evaluateAttempt("sea", level, found).status, "bonus");
  assert.equal(evaluateAttempt("zoo", level, found).status, "impossible");
  assert.equal(evaluateAttempt("puzzle", level, found).status, "impossible");

  const unknown = evaluateAttempt("ates", level, found);
  assert.equal(unknown.status, "unknown");
  assert.equal(unknown.coins, 0);

  const bonus = evaluateAttempt("sea", level, new Set());
  assert.equal(bonus.coins, BONUS_WORD_COINS);
  assert.ok(bonus.definition?.definition);
});

test("a level completes only when every required word is found", () => {
  const level = getLevel("first-light-10");
  assert.ok(level);
  const allButOne = new Set(level.required.slice(1));
  assert.equal(isLevelComplete(level, allButOne), false);
  assert.equal(isLevelComplete(level, new Set(level.required)), true);
});

test("stars reward solving without hints and hunting bonus words", () => {
  assert.equal(starsFor({ hints: 0, bonusFound: 5, bonusTotal: 10 }), 3);
  assert.equal(starsFor({ hints: 0, bonusFound: 0, bonusTotal: 10 }), 2);
  assert.equal(starsFor({ hints: 1, bonusFound: 9, bonusTotal: 10 }), 1);
  // A level with no bonus words cannot be improved on, so clearing it hint-free
  // is already worth three stars.
  assert.equal(starsFor({ hints: 0, bonusFound: 0, bonusTotal: 0 }), 3);
  assert.equal(completionCoins(3), 30);
});

test("a corrupt save is repaired instead of locking the player out", () => {
  assert.deepEqual(parseSave("not json"), defaultSave());
  const repaired = parseSave(
    JSON.stringify({
      coins: -50,
      levels: {
        x: { found: "nope", stars: 99, revealed: { tea: 2, bad: -3 } },
        y: { found: ["sea"] },
      },
      learned: { tea: "later", sea: 123 },
      settings: { sound: "yes" },
    }),
  );
  assert.equal(repaired.coins, 0);
  assert.equal(repaired.levels.x.stars, 3);
  assert.deepEqual(repaired.levels.x.found, []);
  assert.deepEqual(repaired.levels.x.revealed, { tea: 2 });
  // Only words the player actually spelled on a level stay in the Word Book.
  assert.deepEqual(Object.keys(repaired.learned), ["sea"]);
  assert.equal(repaired.settings.sound, true);

  const purged = parseSave(JSON.stringify({ learned: { sugar: 1, coast: 2 } }));
  assert.deepEqual(purged.learned, {});
});

test("levels unlock in order across pack boundaries", () => {
  const save = defaultSave();
  assert.equal(isLevelUnlocked(save, "first-light-1"), true);
  assert.equal(isLevelUnlocked(save, "first-light-2"), false);

  save.levels["first-light-1"] = { ...emptyLevelSave(), completedAt: Date.now(), stars: 3 };
  assert.equal(isLevelUnlocked(save, "first-light-2"), true);
  assert.equal(isLevelUnlocked(save, "first-light-3"), false);

  save.levels["first-light-10"] = { ...emptyLevelSave(), completedAt: Date.now(), stars: 2 };
  assert.equal(isLevelUnlocked(save, "everyday-1"), true);
  assert.equal(totalStars(save), 5);
});
