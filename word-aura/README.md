# Word Aura

A word puzzle for Android with a learning hook: **every level ends by explaining the words you
just played.**

Swipe the letters to fill the pan like any word game — then, the moment the level clears, each
word (including the ones you missed) comes back with its part of speech, a plain-language
definition and an example sentence. Everything you unlock is stored in a **Word Book** you can
search and read later. Words are also read aloud through the device's text-to-speech.

Built with React + TypeScript + Vite, wrapped for Android with **Capacitor**.

---

## Quick start

```bash
cd word-aura
npm install
npm run dev        # http://localhost:5175
```

| Command | What it does |
| --- | --- |
| `npm run dev` | Vite dev server (also works as a phone-friendly web build) |
| `npm run build` | Type-check, then build to `dist/` |
| `npm test` | Engine, save-file and full UI tests (jsdom) |
| `npm run validate` | Content check: every level solvable, every word defined |
| `npm run cap:sync` | Build, then copy web assets into the Android project |

---

## How the game works

- **Letters and the pan.** A level is a small multiset of letters (3–8). The pan shows the
  required words as blank slots grouped by length; a hint can reveal letters left to right.
- **Swipe or type.** Drag across the wheel (pointer events, so it works with touch and mouse) or
  type on a keyboard and press Enter.
- **Bonus words.** Any other dictionary word that can be spelled from the same letters counts as
  a bonus word: **+5 coins** each, and it appears in the teaching panel at the end.
- **Hints** cost **30 coins** and reveal one letter of the word that needs the most help.
- **Stars.** 3 stars = no hints and at least half the bonus words; 2 = no hints; otherwise 1.
  Clearing a level pays `15 + 5 × stars`.
- **Unlocking.** Levels open in order, across pack boundaries. Beating one opens the next and its
  words are explained before you move on.
- **Progress** lives in `localStorage` and is repaired on read, so a half-written save can never
  lock a player out.

## Content model

Two files hold all teaching content, both hand-written:

**`src/game/definitions/*.ts`** — one word per line:

```
word|part of speech|definition|example sentence
silence|noun|The complete absence of sound.|A deep silence fell over the room.
```

**`src/game/levels.ts`** — packs, and inside them `{ letters, required }`. Bonus words are derived
at runtime from the dictionary, which is what guarantees that anything a player can find already
has a definition.

`npm run validate` fails the build when:

- a required word cannot be spelled from the level's letters,
- a required or bonus word has no definition,
- letters are outside 3–8 characters, or
- a duplicate dictionary entry exists.

The tests in `tests/engine.test.ts` re-check the same invariants, plus save repair and unlock
order; `tests/ui.test.ts` renders the app in jsdom, plays a level to completion and asserts the
teaching panel and Word Book appear.

---

## Android builds

The native project lives in `android/` and was created with Capacitor
(`appId: com.wordaura.game`). `android/app/src/main/assets/public` is generated — it is
git-ignored and recreated by `npx cap sync android`.

### Build locally

```bash
npm run build
npx cap sync android
cd android && ./gradlew assembleDebug   # app/build/outputs/apk/debug/app-debug.apk
```

Requires JDK 17+ and the Android SDK (compileSdk 35, AGP 8.7, Gradle 8.9).

### Get an installable APK without a build machine

Every push to `main` or an `arena/**` branch builds, signs and publishes the app. The finished
files live on the **`word-aura-builds`** branch, which only ever holds the latest build:

```bash
git fetch origin word-aura-builds:word-aura-builds
git show word-aura-builds:word-aura-release.apk > word-aura-release.apk
```

| File | Use |
| --- | --- |
| `word-aura-release.apk` | Signed release build — copy to a phone and install |
| `word-aura-debug.apk` | Debug build, handy for quick tests |
| `word-aura-release.aab` | Upload this to Google Play |
| `SHA256SUMS.txt` | Checksums to verify the download |

The same files are also attached to the workflow run as the `word-aura-apk` artifact.

### Signing

Android only accepts updates signed with the **same key**, so the key matters more than any
single build.

- **With secrets configured** (see table below) the workflow signs with your keystore. This is
  what you want for Play releases.
- **With no secrets** the workflow mints a 4096-bit RSA self-signed key, signs the release build
  with it, verifies the result with `apksigner`, and uploads both the keystore and its password as
  the `word-aura-signing-key` artifact. Download that artifact once, keep it offline, and add
  `ANDROID_KEYSTORE_BASE64`/`ANDROID_KEYSTORE_PASSWORD`/`ANDROID_KEY_ALIAS`/`ANDROID_KEY_PASSWORD`
  as repository secrets so later builds keep the same identity. If you lose it you can still ship
  builds, but Play will treat them as a different app.

Current build facts (first successful CI run): `com.wordaura.game`, minSdk 22, targetSdk 35,
release APK ~3.1 MB, signed with a v1+v2/v3 signature.

### Build in CI

`.github/workflows/android.yml` runs on every push and pull request that touches `word-aura/`:

1. `npm run validate` (content gate), `npm test`, `npm run build`
2. Provision the signing key — repository secrets if present, otherwise a freshly minted one
3. `assembleDebug`, `assembleRelease`, `bundleRelease`
4. `apksigner verify --print-certs` plus SHA-256 checksums in the job summary
5. Force-push the APK/AAB to `word-aura-builds` so the latest installable build is always
   fetchable over git, and upload it as a workflow artifact
6. On tags starting with `word-aura-v`, attach the same files to a GitHub release

Signing is entirely environment-driven, so no keystore is committed. Add these repository
secrets to ship a signed build:

| Secret | Meaning |
| --- | --- |
| `ANDROID_KEYSTORE_BASE64` | `base64 -w0 release.keystore` output |
| `ANDROID_KEYSTORE_PASSWORD` | Keystore password |
| `ANDROID_KEY_ALIAS` | Key alias |
| `ANDROID_KEY_PASSWORD` | Key password |

Create a keystore once and keep it somewhere safe — Play Console will not accept a different one
for updates:

```bash
keytool -genkeypair -v -keystore release.keystore -alias wordaura \
  -keyalg RSA -keysize 2048 -validity 10000
base64 -w0 release.keystore
```

To publish an installable release:

```bash
git tag word-aura-v1.0.0 && git push origin word-aura-v1.0.0
```

### Store checklist

- `android/app/build.gradle` → bump `versionCode` / `versionName` for each upload.
- Store listing needs the `.aab` (release), not the debug APK.
- Play Console asks for a privacy policy; the game collects nothing and requests only `INTERNET`
  (an unneeded permission here can be removed from `AndroidManifest.xml` if you prefer).

---

## Architecture

```
src/
  game/
    definitions/   curated word → definition data (4 files, ~1,000 words)
    dictionary.ts  parser + index, reports malformed lines instead of crashing
    levels.ts      packs and levels, play order, unlocking helpers
    engine.ts      letter matching, attempt classification, bonus words, stars
    progress.ts    save schema, migration/repair, unlock rules
  screens/         Home, Pack, Game, Wisdom (the teaching screen), Word Book
  components/      WordWheel (pointer trail), WordPan, WordCard, Toast, icons
  lib/             Web Audio sound effects, text-to-speech
  useSave.ts       state + persistence
scripts/
  validate-levels.ts     content gate used by CI
  generate-*.py          icon and splash generation
tests/                   engine, save and jsdom UI tests
```

Sound effects are synthesised with the Web Audio API, so there are no audio assets, and the whole
web bundle is ~120 kB gzipped. The game is fully offline: no network calls at runtime.

---

## Roadmap ideas

- Daily puzzle with a streak that draws from the same dictionary
- Spaced repetition in the Word Book (re-surface words you got wrong)
- More packs, and per-word audio recordings instead of device TTS
- Optional cloud save
