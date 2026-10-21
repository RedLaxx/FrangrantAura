import { useCallback, useEffect, useRef, useState } from "react";

import { getLevel, getPack, nextLevel as findNextLevel } from "./game/levels.ts";
import { currentLevel, isLevelUnlocked } from "./game/progress.ts";
import { sfx } from "./lib/sfx.ts";
import { stopSpeaking } from "./lib/speech.ts";
import { useSave } from "./useSave.ts";
import { HomeScreen } from "./screens/HomeScreen.tsx";
import { PackScreen } from "./screens/PackScreen.tsx";
import { GameScreen } from "./screens/GameScreen.tsx";
import { WisdomScreen } from "./screens/WisdomScreen.tsx";
import { WordBookScreen } from "./screens/WordBookScreen.tsx";

type Screen =
  | { name: "home" }
  | { name: "pack"; packId: string }
  | { name: "play"; levelId: string }
  | { name: "wisdom"; levelId: string; mode: "complete" | "review" }
  | { name: "book" };

export default function App() {
  const { state, update, reset } = useSave();
  const [stack, setStack] = useState<Screen[]>([{ name: "home" }]);
  const stackRef = useRef(stack);
  stackRef.current = stack;

  const screen = stack[stack.length - 1];

  useEffect(() => {
    sfx.setSoundEnabled(state.settings.sound);
    sfx.setHapticsEnabled(state.settings.haptics);
  }, [state.settings.sound, state.settings.haptics]);

  /* Keep the Android hardware back button (and the browser's) in sync with
     our own navigation stack: every push adds a history entry, every back pops
     one screen instead of closing the app. */
  useEffect(() => {
    function onPopState() {
      setStack((previous) => (previous.length > 1 ? previous.slice(0, -1) : previous));
    }
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    stopSpeaking();
    window.scrollTo(0, 0);
  }, [screen]);

  const push = useCallback((next: Screen) => {
    window.history.pushState({ aura: true }, "");
    setStack((previous) => [...previous, next]);
  }, []);

  const replaceTop = useCallback((next: Screen) => {
    setStack((previous) => [...previous.slice(0, -1), next]);
  }, []);

  const goBack = useCallback(() => {
    if (stackRef.current.length > 1) window.history.back();
  }, []);

  const openLevel = useCallback(
    (levelId: string) => {
      if (!isLevelUnlocked(state, levelId)) return;
      push({ name: "play", levelId });
    },
    [push, state],
  );

  function handleReset() {
    const confirmed = window.confirm(
      "Reset all progress? Levels, coins and everything in your Word Book will be cleared.",
    );
    if (!confirmed) return;
    reset();
    setStack([{ name: "home" }]);
  }

  function renderScreen() {
    if (screen.name === "pack") {
      const pack = getPack(screen.packId);
      if (pack) {
        return (
          <PackScreen
            pack={pack}
            state={state}
            onBack={goBack}
            onPlay={openLevel}
            onOpenBook={() => push({ name: "book" })}
          />
        );
      }
    }

    if (screen.name === "play") {
      const level = getLevel(screen.levelId);
      if (level) {
        return (
          <GameScreen
            key={level.id}
            level={level}
            state={state}
            update={update}
            onExit={goBack}
            onFinished={() =>
              replaceTop({ name: "wisdom", levelId: level.id, mode: "complete" })
            }
            onReview={() => replaceTop({ name: "wisdom", levelId: level.id, mode: "review" })}
          />
        );
      }
    }

    if (screen.name === "wisdom") {
      const level = getLevel(screen.levelId);
      if (level) {
        const upcoming = findNextLevel(level.id);
        const next = upcoming && isLevelUnlocked(state, upcoming.id) ? upcoming : undefined;
        return (
          <WisdomScreen
            key={`${level.id}-${screen.mode}`}
            level={level}
            state={state}
            mode={screen.mode}
            nextLevel={next}
            onBack={goBack}
            onNext={next ? () => replaceTop({ name: "play", levelId: next.id }) : undefined}
            onOpenBook={() => push({ name: "book" })}
          />
        );
      }
    }

    if (screen.name === "book") {
      return <WordBookScreen state={state} onBack={goBack} />;
    }

    return (
      <HomeScreen
        state={state}
        onContinue={() => push({ name: "play", levelId: currentLevel(state).id })}
        onOpenPack={(packId) => push({ name: "pack", packId })}
        onOpenBook={() => push({ name: "book" })}
        onToggleSound={() =>
          update((draft) => {
            draft.settings.sound = !draft.settings.sound;
          })
        }
        onToggleHaptics={() =>
          update((draft) => {
            draft.settings.haptics = !draft.settings.haptics;
          })
        }
        onReset={handleReset}
      />
    );
  }

  return renderScreen();
}
