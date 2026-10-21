/**
 * Renders the real app in jsdom and plays a level through the UI, so the
 * screens, navigation and the end-of-level teaching panel are all exercised
 * without a browser.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { JSDOM } from "jsdom";

const dom = new JSDOM("<!doctype html><html><body><div id='root'></div></body></html>", {
  url: "https://wordaura.test/",
  pretendToBeVisual: true,
});

const g = globalThis as unknown as Record<string, unknown>;
g.window = dom.window;
g.document = dom.window.document;
Object.defineProperty(globalThis, "navigator", {
  value: dom.window.navigator,
  configurable: true,
  writable: true,
});
g.HTMLElement = dom.window.HTMLElement;
g.Node = dom.window.Node;
g.Event = dom.window.Event;
g.MouseEvent = dom.window.MouseEvent;
g.PointerEvent = dom.window.MouseEvent;
g.localStorage = dom.window.localStorage;
g.requestAnimationFrame = (cb: FrameRequestCallback) => setTimeout(() => cb(0), 0) as unknown as number;
g.cancelAnimationFrame = (id: number) => clearTimeout(id);
g.IS_REACT_ACT_ENVIRONMENT = true;
// jsdom stubs
dom.window.scrollTo = () => undefined;
dom.window.HTMLElement.prototype.scrollIntoView = () => undefined;

const React = await import("react");
const { createRoot } = await import("react-dom/client");
const { act } = await import("react");
const App = (await import("../src/App.tsx")).default;

const root = createRoot(document.getElementById("root")!);

function text(): string {
  return document.getElementById("root")?.textContent ?? "";
}

function buttonByText(label: string): HTMLButtonElement {
  const buttons = [...document.querySelectorAll("button")];
  const match = buttons.find((button) => (button.textContent ?? "").includes(label));
  assert.ok(match, `no button containing "${label}" in: ${text().slice(0, 400)}`);
  return match as HTMLButtonElement;
}

async function click(element: Element) {
  await act(async () => {
    element.dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true }));
  });
}

async function typeWord(word: string) {
  for (const letter of word) {
    await act(async () => {
      dom.window.dispatchEvent(
        new dom.window.KeyboardEvent("keydown", { key: letter, bubbles: true }) as unknown as KeyboardEvent,
      );
    });
  }
  await act(async () => {
    dom.window.dispatchEvent(
      new dom.window.KeyboardEvent("keydown", { key: "Enter", bubbles: true }) as unknown as KeyboardEvent,
    );
  });
}

test("the app boots to the home screen", async () => {
  await act(async () => {
    root.render(React.createElement(App));
  });
  assert.match(text(), /Word Aura/);
  assert.match(text(), /Every level ends with/);
  assert.match(text(), /First Light/);
});

test("a level can be played and ends with every word explained", async () => {
  await click(buttonByText("Continue"));

  assert.match(text(), /Level 1/);
  assert.match(text(), /The pan/);

  // First Light 1 uses the letters T, A, P, E and asks for tape, tap, pat, tea.
  for (const word of ["tape", "tap", "pat", "tea"]) {
    await typeWord(word);
  }

  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 2200));
  });

  const after = text();
  assert.match(after, /Here is what you just played/);
  assert.match(after, /The words in this level/);
  // Every required word is explained, not just the ones the player found.
  assert.match(after, /To hit something lightly/);
  assert.match(after, /A narrow strip used for sticking or recording/);
  // Bonus words the player skipped are still counted and explained afterwards.
  assert.match(after, /still hiding/);
  assert.match(after, /Bonus words you found/);
});

test("the word book remembers what was learned", async () => {
  const book = [...document.querySelectorAll("button")].find((button) =>
    (button.textContent ?? "").includes("Word Book"),
  );
  assert.ok(book, "expected a Word Book button after finishing a level");
  await click(book);

  const bookText = text();
  assert.match(bookText, /Word Book/);
  assert.match(bookText, /tap/);
  assert.match(bookText, /pat/);
});
