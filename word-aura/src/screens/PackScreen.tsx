import type { Pack } from "../game/levels.ts";
import { getLevelSave, isLevelUnlocked, type SaveState } from "../game/progress.ts";
import { BackIcon, BookIcon, CoinIcon, LockIcon, StarIcon } from "../components/icons.tsx";

interface PackScreenProps {
  pack: Pack;
  state: SaveState;
  onBack: () => void;
  onPlay: (levelId: string) => void;
  onOpenBook: () => void;
}

export function PackScreen({ pack, state, onBack, onPlay, onOpenBook }: PackScreenProps) {
  const done = pack.levels.filter((level) => getLevelSave(state, level.id).completedAt !== null).length;
  const percent = Math.round((done / pack.levels.length) * 100);

  return (
    <div className="screen pack-screen">
      <header className="topbar">
        <button type="button" className="icon-btn" onClick={onBack} aria-label="Back home">
          <BackIcon />
        </button>
        <div className="topbar-titles">
          <span className="topbar-eyebrow">Pack</span>
          <h1 className="topbar-title">{pack.name}</h1>
        </div>
        <button type="button" className="icon-btn soft" onClick={onOpenBook} aria-label="Open Word Book">
          <BookIcon size={19} />
        </button>
      </header>

      <main className="pack-main">
        <section className="pack-intro">
          <p className="pack-blurb-lead">{pack.blurb}</p>
          <div className="pack-progress large" aria-hidden="true">
            <span className="pack-progress-fill" style={{ width: `${percent}%` }} />
          </div>
          <div className="pack-intro-meta">
            <span>
              {done} of {pack.levels.length} cleared
            </span>
            <span className="coin-inline">
              <CoinIcon size={14} /> {state.coins}
            </span>
          </div>
        </section>

        <div className="level-grid">
          {pack.levels.map((level) => {
            const saved = getLevelSave(state, level.id);
            const unlocked = isLevelUnlocked(state, level.id);
            const complete = saved.completedAt !== null;

            return (
              <button
                key={level.id}
                type="button"
                className={`level-card ${unlocked ? "" : "is-locked"} ${complete ? "is-complete" : ""}`}
                onClick={() => onPlay(level.id)}
                disabled={!unlocked}
                aria-label={`Level ${level.index}${complete ? `, ${saved.stars} stars` : ""}${
                  unlocked ? "" : ", locked"
                }`}
              >
                <span className="level-number">{level.index}</span>
                {complete ? (
                  <span className="level-stars">
                    {[1, 2, 3].map((star) => (
                      <StarIcon
                        key={star}
                        size={11}
                        className={star <= saved.stars ? "is-on" : "level-star-off"}
                      />
                    ))}
                  </span>
                ) : unlocked ? (
                  <span className="level-meta">Play</span>
                ) : (
                  <LockIcon size={14} />
                )}
              </button>
            );
          })}
        </div>

        <p className="pack-note">
          Finish a level and its words are explained before the next one unlocks. Only the words
          you found are added to your Word Book.
        </p>
      </main>
    </div>
  );
}
