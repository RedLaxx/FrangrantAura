import { useEffect, useMemo, useRef, useState } from "react";

import {
  BONUS_WORD_COINS,
  HINT_COST,
  MIN_WORD_LENGTH,
  bonusWordsForLevel,
  completionCoins,
  evaluateAttempt,
  isLevelComplete,
  starsFor,
} from "../game/engine.ts";
import type { Level } from "../game/levels.ts";
import { emptyLevelSave, getLevelSave, type SaveState } from "../game/progress.ts";
import { sfx } from "../lib/sfx.ts";
import type { SaveApi } from "../useSave.ts";
import { WordCard } from "../components/WordCard.tsx";
import { Toast, type ToastMessage, type ToastTone } from "../components/Toast.tsx";
import { WordPan } from "../components/WordPan.tsx";
import { WordWheel, type WheelTile } from "../components/WordWheel.tsx";
import {
  BackIcon,
  BulbIcon,
  CoinIcon,
  ShuffleIcon,
  SparkIcon,
  StarIcon,
} from "../components/icons.tsx";

interface GameScreenProps {
  level: Level;
  state: SaveState;
  update: SaveApi["update"];
  onExit: () => void;
  onFinished: () => void;
  onReview: () => void;
}

function makeTiles(letters: string[]): WheelTile[] {
  return letters.map((char, id) => ({ id, char }));
}

export function GameScreen({ level, state, update, onExit, onFinished, onReview }: GameScreenProps) {
  const levelSave = getLevelSave(state, level.id);
  const foundSet = useMemo(() => new Set(levelSave.found), [levelSave.found]);
  const bonusAll = useMemo(() => bonusWordsForLevel(level), [level]);
  const everyKnownWord = useMemo(
    () => new Set([...levelSave.found, ...levelSave.bonus]),
    [levelSave.found, levelSave.bonus],
  );

  const [tiles, setTiles] = useState<WheelTile[]>(() => makeTiles(level.letters));
  const [selected, setSelected] = useState<number[]>([]);
  const selectedRef = useRef<number[]>([]);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [peek, setPeek] = useState<string | null>(null);
  const [finishing, setFinishing] = useState<{ stars: number; coins: number } | null>(null);
  const toastId = useRef(0);
  const finishTimer = useRef<number | null>(null);

  const tileById = useMemo(() => new Map(tiles.map((tile) => [tile.id, tile])), [tiles]);
  const currentWord = selected
    .map((id) => tileById.get(id)?.char ?? "")
    .join("");

  useEffect(() => {
    return () => {
      if (finishTimer.current !== null) window.clearTimeout(finishTimer.current);
    };
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  function say(text: string, tone: ToastTone = "info") {
    toastId.current += 1;
    setToast({ id: toastId.current, text, tone });
  }

  function setSelection(next: number[]) {
    selectedRef.current = next;
    setSelected(next);
  }

  function extend(slot: number) {
    if (finishing) return;
    const tile = tiles[slot];
    if (!tile) return;
    const current = selectedRef.current;
    const index = current.indexOf(tile.id);
    if (index === -1) {
      setSelection([...current, tile.id]);
      return;
    }
    if (index === current.length - 1) return;
    if (index === current.length - 2) setSelection(current.slice(0, -1));
  }

  function maybeComplete() {
    const alreadyDone = getLevelSave(state, level.id).completedAt !== null;
    if (alreadyDone) return;

    const stars = starsFor({
      hints: levelSave.hints,
      bonusFound: levelSave.bonus.length,
      bonusTotal: bonusAll.length,
    });
    const coins = completionCoins(stars);

    update((draft) => {
      const saved = draft.levels[level.id] ?? emptyLevelSave();
      saved.found = [...level.required];
      saved.stars = stars;
      saved.completedAt = Date.now();
      draft.levels[level.id] = saved;
      draft.coins += coins;
      for (const word of [...level.required, ...saved.bonus]) {
        if (draft.learned[word] === undefined) draft.learned[word] = Date.now();
      }
    });

    sfx.win();
    setFinishing({ stars, coins });
    finishTimer.current = window.setTimeout(() => onFinished(), 1500);
  }

  function submit() {
    const word = selectedRef.current.map((id) => tileById.get(id)?.char ?? "").join("");
    setSelection([]);

    // A stray tap produces one letter; staying quiet keeps the screen calm.
    if (word.length < MIN_WORD_LENGTH) return;
    if (finishing) return;

    const result = evaluateAttempt(word, level, everyKnownWord);

    if (result.status === "required" || result.status === "bonus") {
      const isBonus = result.status === "bonus";
      update((draft) => {
        const saved = draft.levels[level.id] ?? emptyLevelSave();
        if (isBonus) {
          if (!saved.bonus.includes(word)) {
            saved.bonus = [...saved.bonus, word];
            draft.coins += result.coins;
          }
        } else if (!saved.found.includes(word)) {
          saved.found = [...saved.found, word];
        }
        delete saved.revealed[word];
        draft.levels[level.id] = saved;
        // A word you have played is a word you can keep, even before the level ends.
        if (draft.learned[word] === undefined) draft.learned[word] = Date.now();
      });

      if (isBonus) {
        sfx.bonus();
        say(`Bonus word · +${BONUS_WORD_COINS} coins`, "ok");
      } else {
        sfx.found();
        const remaining = level.required.filter((w) => w !== word && !foundSet.has(w)).length;
        say(
          remaining === 0
            ? `${word.toUpperCase()} — that was the last one!`
            : `${word.toUpperCase()} found · ${remaining} to go`,
          "ok",
        );
        if (isLevelComplete(level, new Set([...levelSave.found, word]))) {
          maybeComplete();
        }
      }
      return;
    }

    if (result.status === "impossible" || result.status === "short") {
      sfx.error();
      say(result.message, "error");
    } else {
      say(result.message, "info");
    }
  }

  function buyHint() {
    const candidates = level.required.filter((word) => !foundSet.has(word));
    if (candidates.length === 0) {
      say("Every word in this level is already on the pan.", "info");
      return;
    }
    if (state.coins < HINT_COST) {
      sfx.error();
      say("Not enough coins. Bonus words earn 5 coins each.", "error");
      return;
    }

    const target = [...candidates].sort(
      (a, b) =>
        (levelSave.revealed[a] ?? 0) - (levelSave.revealed[b] ?? 0) || a.localeCompare(b),
    )[0];
    const revealedCount = Math.min((levelSave.revealed[target] ?? 0) + 1, target.length);

    update((draft) => {
      const saved = draft.levels[level.id] ?? emptyLevelSave();
      saved.revealed = { ...saved.revealed, [target]: revealedCount };
      saved.hints += 1;
      draft.levels[level.id] = saved;
      draft.coins = Math.max(0, draft.coins - HINT_COST);
    });

    sfx.found();
    say(`One letter revealed · ${revealedCount}/${target.length}`, "ok");
  }

  function shuffle() {
    setTiles((previous) => {
      const next = [...previous];
      for (let i = next.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [next[i], next[j]] = [next[j], next[i]];
      }
      return next;
    });
    setSelection([]);
    sfx.pick();
  }

  const submitRef = useRef(submit);
  submitRef.current = submit;
  const extendRef = useRef(extend);
  extendRef.current = extend;

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;

      if (event.key === "Enter") {
        event.preventDefault();
        submitRef.current();
        return;
      }
      if (event.key === "Backspace") {
        event.preventDefault();
        const current = selectedRef.current;
        setSelection(current.slice(0, -1));
        return;
      }
      if (/^[a-zA-Z]$/.test(event.key)) {
        const char = event.key.toLowerCase();
        const openSlot = tiles.findIndex(
          (tile) => tile.char === char && !selectedRef.current.includes(tile.id),
        );
        if (openSlot >= 0) extendRef.current(openSlot);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [tiles]);

  const foundCount = level.required.filter((word) => foundSet.has(word)).length;

  return (
    <div className="screen game-screen">
      <header className="topbar">
        <button type="button" className="icon-btn" onClick={onExit} aria-label="Back to the pack">
          <BackIcon />
        </button>
        <div className="topbar-titles">
          <span className="topbar-eyebrow">{level.packName}</span>
          <h1 className="topbar-title">Level {level.index}</h1>
        </div>
        <span className="coin-chip" aria-label={`${state.coins} coins`}>
          <CoinIcon size={16} />
          {state.coins}
        </span>
      </header>

      <main className="game-main">
        <WordPan
          words={level.required}
          found={foundSet}
          revealed={levelSave.revealed}
          onSelectWord={(word) => setPeek(word)}
        />

        <div className="current-word" aria-live="polite">
          {currentWord ? (
            currentWord.toUpperCase()
          ) : (
            <span className="current-word-hint">Swipe the letters to spell a word</span>
          )}
        </div>

        <WordWheel
          key={`wheel-${level.id}`}
          tiles={tiles}
          selectedIds={selected}
          onExtend={extend}
          onSubmit={submit}
          disabled={Boolean(finishing)}
        />

        <div className="game-actions">
          <button type="button" className="action-btn" onClick={shuffle}>
            <ShuffleIcon size={18} />
            Shuffle
          </button>
          <button
            type="button"
            className="action-btn"
            onClick={buyHint}
            disabled={state.coins < HINT_COST || foundCount === level.required.length}
          >
            <BulbIcon size={18} />
            Hint
            <span className="action-price">
              <CoinIcon size={13} />
              {HINT_COST}
            </span>
          </button>
          {levelSave.found.length > 0 ? (
            <button type="button" className="action-btn" onClick={onReview}>
              <SparkIcon size={15} />
              Words
            </button>
          ) : null}
        </div>

        <p className="bonus-meter">
          Bonus words found: {levelSave.bonus.length}
          <span className="bonus-meter-total"> / {bonusAll.length} in this level</span>
        </p>
      </main>

      <Toast toast={toast} />

      {peek ? (
        <div className="sheet-backdrop" role="dialog" aria-modal="true" onClick={() => setPeek(null)}>
          <div className="sheet" onClick={(event) => event.stopPropagation()}>
            <span className="sheet-grabber" aria-hidden="true" />
            <WordCard word={peek} badge="found" />
            <button type="button" className="btn btn-secondary" onClick={() => setPeek(null)}>
              Back to the wheel
            </button>
          </div>
        </div>
      ) : null}

      {finishing ? (
        <div className="win-backdrop" role="status" aria-live="assertive">
          <div className="win-card">
            <div className="win-stars">
              {[1, 2, 3].map((star) => (
                <StarIcon
                  key={star}
                  size={30}
                  className={star <= finishing.stars ? "win-star is-on" : "win-star"}
                />
              ))}
            </div>
            <h2>Level complete</h2>
            <p className="win-reward">
              <CoinIcon size={16} /> +{finishing.coins} coins
            </p>
            <p className="win-note">Opening the words you just played…</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
