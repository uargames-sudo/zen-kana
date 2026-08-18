# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Primary Audience:** Italian and English speaking learners who want to learn, practice, and master the Japanese writing systems (**Hiragana** and **Katakana**).
- **Usage Situation:** Daily study habits, quick 2-5 minute micro-sessions on mobile during commutes, or focused 15-30 minute writing/listening practice on desktop and tablets.
- **Job to be Done:** Memorize, recognize, pronounce, write, and recall all 46 basic Kana, dakuten, handakuten, and combination (Yōon) characters rapidly and reliably.

## Product Purpose

Zen Kana is an **offline-first, zero-login Progressive Web App (PWA)** engineered for focused Japanese Kana learning. It eliminates distractions, subscriptions, and intrusive gamification in favor of clean, multi-modal active recall (typing, drawing, listening, and spaced flashcards).

## Positioning

Unlike bloated language learning platforms that require accounts, online connectivity, and push ads, Zen Kana offers an **instant, privacy-first, fully local PWA** with comprehensive bilingual support (Italian & English), precision canvas writing with stroke order guidelines, and an interactive virtual keyboard designed for Kana typing.

## Operating Context

- **Devices:** Mobile phones (installed PWA on iOS/Android home screens), tablets (iPad / Android tablets with touch/stylus support for writing practice), and desktop browsers.
- **Environments:** Offline environments (trains, planes, low-connectivity zones) as well as daily desktop study setups.
- **Data Privacy:** 100% local client-side storage (LocalStorage); no user accounts, telemetry trackers, or external database dependencies.

## Capabilities and Constraints

- **Multi-Modal Learning & Gaming Modules:**
  1. *Dashboard:* Overview of streak, mastered Kana, and quick practice launch.
  2. *Kana Mahjong Zen:* 3D multi-layered tile matching solitaire game pairing Kana with Romaji across 3 difficulty layouts.
  3. *Kana Word Puzzle:* Interactive syllable tile reconstruction puzzle with distractors and hint mechanics.
  4. *Zen Memory:* Visual, auditory, and illustrated vocabulary memory matching game with combo streaks.
  5. *Kana Matrix (Table):* Interactive reference tables with contextual mini-guides, audio pronunciation, and stroke order modals.
  6. *Structured Lessons (4 Courses):* Comprehensive curriculum covering 5 Kana/day, Dakuten/Handakuten, Yōon combinations, and Special Phonetics.
  7. *Active Study:* Active recall prompt system with virtual and physical keyboard input modes, difficulty filters, and instant feedback.
  8. *Flashcards:* Spaced repetition recall cards with category filters, shuffle mode, keyboard shortcuts (`Space`, `1`, `2`, `Arrows`), and mastery tracking.
  9. *Writing Canvas:* Interactive HTML5 drawing pad with stroke order reference guide, guidelines, and clearing tools.
  10. *Listening Quiz:* Auditory recognition quiz with customizable question counts and vocabulary integration.
  11. *Verification Quiz:* Multiple-choice recognition tests with celebration animations.
  12. *Vocabulary Studio:* Top 100 essential Japanese words with authentic 2D vector illustrations, translations, pronunciation, and random shuffle.
- **Internationalization (i18n):** Complete runtime switching between Italian (`it`) and English (`en`).
- **Audio Engine:** Web Audio API synthesis and native Japanese voice playback.
- **Theme Architecture:** Dual-mode theme system (Light & Dark) with local persistence.

## Brand Commitments

- **Name:** Zen Kana (PWA Kana)
- **Aesthetic Identity:** Minimalist, disciplined, distraction-free interface combining modern readability with Japanese cultural aesthetics.
- **Tone of Voice:** Direct, encouraging, technical, and precise.

## Evidence on Hand

- Complete 46-character Hiragana & Katakana datasets with romaji and audio mappings in `src/data/kanaTables.js`.
- Curated 100-word essential Japanese vocabulary list with bilingual Italian/English translations.
- Full offline Service Worker PWA configuration with install prompts and manifest.

## Product Principles

1. **Frictionless Entry:** Zero login, zero paywalls, zero ads. Start practicing in one tap.
2. **Multi-Sensory Reinforcement:** Learn by seeing, hearing, typing, and physically drawing each character.
3. **Rock-Solid Offline Capability:** Every single core feature operates flawlessly without network connectivity.
4. **Focused Simplicity:** Clean interface that keeps attention on learning rather than UI clutter.
