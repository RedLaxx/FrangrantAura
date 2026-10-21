import { ALL_LEVELS, PACKS } from "../game/levels.ts";
import {
  completedLevelCount,
  currentLevel,
  getLevelSave,
  isLevelUnlocked,
  learnedCount,
  totalStars,
  type SaveState,
} from "../game/progress.ts";
import {
  ArrowRightIcon,
  BookIcon,
  CoinIcon,
  LockIcon,
  StarIcon,
  VolumeOffIcon,
  VolumeOnIcon,
} from "../components/icons.tsx";

interface HomeScreenProps {
  state: SaveState;
  onContinue: () => void;
  onOpenPack: (packId: string) => void;
  onOpenBook: () => void;
  onToggleSound: () => void;
  onToggleHaptics: () => void;
  onReset: () => void;
}

export function HomeScreen({
  state,
  onContinue,
  onOpenPack,
  onOpenBook,
  onToggleSound,
  onToggleHaptics,
  onReset,
}: HomeScreenProps) {
  const current = currentLevel(state);
  const cleared = completedLevelCount(state);
  const learned = learnedCount(state);
  const stars = totalStars(state);

  return (
    <div className="screen home-screen">
      <header className="home-head">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">
            W
          </span>
          <div>
            <div className="brand-name">Word Aura</div>
            <div className="brand-sub">Play, then learn</div>
          </div>
        </div>
        <div className="home-head-actions">
          <span className="coin-chip" aria-label={`${state.coins} coins`}>
            <CoinIcon size={16} />
            {state.coins}
          </span>
          <button type="button" className="icon-btn soft" onClick={onOpenBook} aria-label="Open Word Book">
            <BookIcon size={19} />
          </button>
        </div>
      </header>

      <section className="hero">
        <p className="eyebrow">A word game with a takeaway</p>
        <h1>
          Every level ends with
          <br />
          <em>something you can keep.</em>
        </h1>
        <p className="hero-copy">
          Spell the words, clear the pan. Then every word you touched comes back with its meaning
          and an example — so you finish every level knowing a little more.
        </p>
        <button type="button" className="btn btn-primary hero-cta" onClick={onContinue}>
          Continue · {current.packName} {current.index}
          <ArrowRightIcon size={18} />
        </button>
        <div className="hero-meta">
          <span>
            {cleared}/{ALL_LEVELS.length} levels cleared
          </span>
          <span className="dot" aria-hidden="true" />
          <span>{learned} words learned</span>
        </div>
      </section>

      <section className="stats">
        <div className="stat">
          <span className="stat-value">{cleared}</span>
          <span className="stat-label">Levels</span>
        </div>
        <div className="stat">
          <span className="stat-value">{learned}</span>
          <span className="stat-label">Words learned</span>
        </div>
        <div className="stat">
          <span className="stat-value stat-value-icon">
            {stars}
            <StarIcon size={14} />
          </span>
          <span className="stat-label">Stars</span>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>Packs</h2>
          <button type="button" className="link-btn" onClick={onOpenBook}>
            <BookIcon size={16} />
            Word Book
          </button>
        </div>

        <div className="pack-list">
          {PACKS.map((pack, index) => {
            const unlocked = isLevelUnlocked(state, pack.levels[0].id);
            const done = pack.levels.filter(
              (level) => getLevelSave(state, level.id).completedAt !== null,
            ).length;
            const percent = Math.round((done / pack.levels.length) * 100);

            return (
              <button
                key={pack.id}
                type="button"
                className={`pack-row ${unlocked ? "" : "is-locked"}`}
                onClick={() => unlocked && onOpenPack(pack.id)}
                disabled={!unlocked}
              >
                <span className="pack-index" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="pack-body">
                  <span className="pack-title">
                    {pack.name}
                    {unlocked ? null : <LockIcon size={13} />}
                  </span>
                  <span className="pack-blurb">{pack.blurb}</span>
                  <span className="pack-progress" aria-hidden="true">
                    <span className="pack-progress-fill" style={{ width: `${percent}%` }} />
                  </span>
                </span>
                <span className="pack-count">
                  {done}/{pack.levels.length}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="section">
        <h2>How it plays</h2>
        <ol className="steps">
          <li>
            <span className="step-index">1</span>
            <div>
              <h3>Swipe to spell</h3>
              <p>Drag across the letters, then let go. Find every word the pan is asking for.</p>
            </div>
          </li>
          <li>
            <span className="step-index">2</span>
            <div>
              <h3>Chase bonus words</h3>
              <p>
                Hidden extras earn coins and stars. Every one of them is a real word with a
                definition waiting.
              </p>
            </div>
          </li>
          <li>
            <span className="step-index">3</span>
            <div>
              <h3>Learn what you played</h3>
              <p>
                The moment a level clears, each word is laid out with its meaning, its part of
                speech and a sentence you can borrow.
              </p>
            </div>
          </li>
        </ol>
      </section>

      <footer className="home-foot">
        <div className="foot-settings">
          <button
            type="button"
            className={`toggle ${state.settings.sound ? "is-on" : ""}`}
            onClick={onToggleSound}
            aria-pressed={state.settings.sound}
          >
            {state.settings.sound ? <VolumeOnIcon size={17} /> : <VolumeOffIcon size={17} />}
            Sound
          </button>
          <button
            type="button"
            className={`toggle ${state.settings.haptics ? "is-on" : ""}`}
            onClick={onToggleHaptics}
            aria-pressed={state.settings.haptics}
          >
            Haptics
          </button>
        </div>
        <button type="button" className="link-btn subtle" onClick={onReset}>
          Reset progress
        </button>
        <p className="foot-note">
          {learned > 0
            ? `${learned} words are already in your Word Book.`
            : "Your Word Book fills up as you play."}
        </p>
      </footer>
    </div>
  );
}
