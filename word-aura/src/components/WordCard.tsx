import { getDefinition } from "../game/dictionary.ts";
import { speak } from "../lib/speech.ts";
import { SpeakerIcon } from "./icons.tsx";

export type WordBadge = "found" | "bonus" | "missed";

interface WordCardProps {
  word: string;
  badge?: WordBadge;
  compact?: boolean;
}

const BADGE_LABEL: Record<WordBadge, string> = {
  found: "found",
  bonus: "bonus",
  missed: "still hiding",
};

export function WordCard({ word, badge, compact = false }: WordCardProps) {
  const definition = getDefinition(word);

  if (!definition) {
    return (
      <article className="word-card">
        <h3 className="word-card-word">{word}</h3>
        <p className="word-card-def">No definition yet — coming in a future update.</p>
      </article>
    );
  }

  return (
    <article className={`word-card ${compact ? "is-compact" : ""} ${badge === "missed" ? "is-missed" : ""}`}>
      <div className="word-card-head">
        <div className="word-card-title">
          <h3 className="word-card-word">{word}</h3>
          <span className="pos-chip">{definition.pos}</span>
          {badge ? <span className={`badge badge-${badge}`}>{BADGE_LABEL[badge]}</span> : null}
        </div>
        <button
          type="button"
          className="speak-btn"
          aria-label={`Hear the word ${word}`}
          onClick={() => speak(`${word}. ${definition.definition}`)}
        >
          <SpeakerIcon size={17} />
        </button>
      </div>
      <p className="word-card-def">{definition.definition}</p>
      {compact ? null : <p className="word-card-example">“{definition.example}”</p>}
    </article>
  );
}
