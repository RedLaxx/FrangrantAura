import { useMemo, useState } from "react";

import { getDefinition } from "../game/dictionary.ts";
import { learnedCount, type SaveState } from "../game/progress.ts";
import { WordCard } from "../components/WordCard.tsx";
import { BackIcon, BookIcon } from "../components/icons.tsx";

interface WordBookScreenProps {
  state: SaveState;
  onBack: () => void;
}

export function WordBookScreen({ state, onBack }: WordBookScreenProps) {
  const [query, setQuery] = useState("");
  const total = learnedCount(state);

  const groups = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const words = Object.keys(state.learned)
      .sort()
      .filter((word) => {
        if (!needle) return true;
        if (word.includes(needle)) return true;
        const definition = getDefinition(word);
        return Boolean(
          definition &&
            (definition.definition.toLowerCase().includes(needle) ||
              definition.pos.toLowerCase().includes(needle)),
        );
      });

    const map = new Map<string, string[]>();
    for (const word of words) {
      const letter = word[0].toUpperCase();
      const bucket = map.get(letter);
      if (bucket) bucket.push(word);
      else map.set(letter, [word]);
    }
    return [...map.entries()];
  }, [query, state.learned]);

  const shown = groups.reduce((sum, [, words]) => sum + words.length, 0);

  return (
    <div className="screen book-screen">
      <header className="topbar">
        <button type="button" className="icon-btn" onClick={onBack} aria-label="Back">
          <BackIcon />
        </button>
        <div className="topbar-titles">
          <span className="topbar-eyebrow">Everything you have learned</span>
          <h1 className="topbar-title">Word Book</h1>
        </div>
        <span className="count-pill">{total}</span>
      </header>

      <main className="book-main">
        {total === 0 ? (
          <section className="book-empty">
            <span className="book-empty-icon" aria-hidden="true">
              <BookIcon size={30} />
            </span>
            <h2>Your book is still empty</h2>
            <p>
              Finish your first level and every word from it lands here, with its meaning and an
              example sentence. The words are yours to keep.
            </p>
            <button type="button" className="btn btn-primary" onClick={onBack}>
              Back to the game
            </button>
          </section>
        ) : (
          <>
            <div className="book-toolbar">
              <label className="search">
                <span className="visually-hidden">Search your words</span>
                <input
                  type="search"
                  value={query}
                  placeholder="Search a word or a meaning"
                  onChange={(event) => setQuery(event.target.value)}
                />
              </label>
              <span className="book-result">
                {shown} {shown === 1 ? "word" : "words"}
              </span>
            </div>

            {groups.length === 0 ? (
              <p className="empty-note">No words match “{query}”.</p>
            ) : (
              <div className="book-groups">
                {groups.map(([letter, words]) => (
                  <section key={letter} className="book-group">
                    <h2 className="book-letter">{letter}</h2>
                    <div className="word-list">
                      {words.map((word) => (
                        <WordCard key={word} word={word} compact />
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
