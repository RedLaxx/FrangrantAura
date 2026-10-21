import { bonusWordsForLevel, completionCoins } from "../game/engine.ts";
import type { Level } from "../game/levels.ts";
import { getLevelSave, type SaveState } from "../game/progress.ts";
import { speechAvailable } from "../lib/speech.ts";
import { WordCard } from "../components/WordCard.tsx";
import {
  ArrowRightIcon,
  BackIcon,
  BookIcon,
  CoinIcon,
  SpeakerIcon,
  StarIcon,
} from "../components/icons.tsx";

interface WisdomScreenProps {
  level: Level;
  state: SaveState;
  mode: "complete" | "review";
  nextLevel?: Level;
  onBack: () => void;
  onNext?: () => void;
  onOpenBook: () => void;
}

export function WisdomScreen({
  level,
  state,
  mode,
  nextLevel,
  onBack,
  onNext,
  onOpenBook,
}: WisdomScreenProps) {
  const saved = getLevelSave(state, level.id);
  const found = new Set(saved.found);
  const bonusWords = bonusWordsForLevel(level);
  const bonusFound = saved.bonus.filter((word) => bonusWords.includes(word));
  const bonusRemaining = Math.max(0, bonusWords.length - bonusFound.length);
  const coins = completionCoins(saved.stars);

  return (
    <div className="screen wisdom-screen">
      <header className="topbar">
        <button type="button" className="icon-btn" onClick={onBack} aria-label="Back to the pack">
          <BackIcon />
        </button>
        <div className="topbar-titles">
          <span className="topbar-eyebrow">
            {level.packName} · Level {level.index}
          </span>
          <h1 className="topbar-title">{mode === "complete" ? "Level complete" : "Word review"}</h1>
        </div>
        <button type="button" className="icon-btn soft" onClick={onOpenBook} aria-label="Open Word Book">
          <BookIcon size={19} />
        </button>
      </header>

      <main className="wisdom-main">
        {mode === "complete" ? (
          <section className="wisdom-hero">
            <div className="wisdom-stars" aria-label={`${saved.stars} out of 3 stars`}>
              {[1, 2, 3].map((star) => (
                <StarIcon
                  key={star}
                  size={26}
                  className={star <= saved.stars ? "is-on" : "level-star-off"}
                />
              ))}
            </div>
            <h2>Here is what you just played.</h2>
            <p className="wisdom-lede">
              {level.required.length} words, explained. Words you found have been added to your
              Word Book; the ones you missed stay hidden there until you find them.
            </p>
            <div className="reward-pill">
              <CoinIcon size={15} /> +{coins} coins
            </div>
          </section>
        ) : (
          <section className="wisdom-hero review">
            <p className="eyebrow">Words from this level</p>
            <h2>Words you have met before.</h2>
            <p className="wisdom-lede">
              Read them again, or hear them spoken. Only the words you actually found are kept in
              your Word Book.
            </p>
          </section>
        )}

        {speechAvailable() ? (
          <p className="wisdom-tip">
            <SpeakerIcon size={15} />
            Tap the speaker on any card to hear it read aloud.
          </p>
        ) : null}

        <section className="word-section">
          <div className="word-section-head">
            <h2>The words in this level</h2>
            <span className="count-pill">{level.required.length}</span>
          </div>
          <div className="word-list">
            {level.required.map((word) => (
              <WordCard key={word} word={word} badge={found.has(word) ? "found" : "missed"} />
            ))}
          </div>
        </section>

        <section className="word-section">
          <div className="word-section-head">
            <h2>Bonus words you found</h2>
            <span className="count-pill">
              {bonusFound.length}/{bonusWords.length}
            </span>
          </div>
          {bonusFound.length > 0 ? (
            <div className="word-list">
              {bonusFound.map((word) => (
                <WordCard key={word} word={word} badge="bonus" />
              ))}
            </div>
          ) : (
            <p className="empty-note">
              None this time. Bonus words are hidden inside the same letters and they pay coins —
              worth a replay.
            </p>
          )}
          {bonusRemaining > 0 ? (
            <p className="bonus-note">
              {bonusRemaining} more bonus {bonusRemaining === 1 ? "word is" : "words are"} still
              hiding in these letters.
            </p>
          ) : null}
        </section>

        <div className="wisdom-actions">
          {nextLevel && onNext ? (
            <button type="button" className="btn btn-primary" onClick={onNext}>
              Next level · {nextLevel.packName} {nextLevel.index}
              <ArrowRightIcon size={18} />
            </button>
          ) : (
            <button type="button" className="btn btn-primary" onClick={onBack}>
              Back to the packs
              <ArrowRightIcon size={18} />
            </button>
          )}
          <div className="wisdom-secondary">
            <button type="button" className="btn btn-secondary" onClick={onOpenBook}>
              <BookIcon size={17} />
              Word Book
            </button>
            <button type="button" className="btn btn-ghost" onClick={onBack}>
              Pack list
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
