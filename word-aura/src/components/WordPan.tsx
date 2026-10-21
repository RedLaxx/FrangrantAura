import { groupByLength } from "../game/engine.ts";

interface WordPanProps {
  words: string[];
  found: ReadonlySet<string>;
  revealed: Readonly<Record<string, number>>;
  onSelectWord?: (word: string) => void;
}

export function WordPan({ words, found, revealed, onSelectWord }: WordPanProps) {
  const groups = groupByLength(words);
  const foundCount = words.filter((word) => found.has(word)).length;

  return (
    <section className="pan" aria-label="Words to find">
      <header className="pan-head">
        <span className="pan-label">The pan</span>
        <span className="pan-count">
          {foundCount}
          <span className="pan-count-total">/{words.length}</span>
        </span>
      </header>

      <div className="pan-groups">
        {[...groups.entries()].map(([length, groupWords]) => (
          <div className="pan-row" key={length}>
            <span className="pan-length" aria-hidden="true">
              {length}
            </span>
            <div className="pan-words">
              {groupWords.map((word) => {
                const isFound = found.has(word);
                const shown = isFound ? word.length : Math.min(revealed[word] ?? 0, word.length);
                return (
                  <button
                    key={word}
                    type="button"
                    className={`word-slot ${isFound ? "is-found" : ""}`}
                    onClick={() => isFound && onSelectWord?.(word)}
                    disabled={!isFound}
                    aria-label={
                      isFound ? `${word}. Tap to read the definition.` : `${word.length} letter word`
                    }
                  >
                    {word.split("").map((letter, i) => (
                      <span key={i} className={`slot-letter ${i < shown ? "is-shown" : ""}`}>
                        {i < shown ? letter.toUpperCase() : ""}
                      </span>
                    ))}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
