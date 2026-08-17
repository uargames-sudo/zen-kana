# Release Notes: Zen Kana

## Version 1.3.0 — Zen Memory Game, Vocabulary Illustrations & High-Fidelity Audio Engine

**Release Date:** August 2026  
**Status:** Stable Release  

---

### 🌟 Highlights & Major Improvements

#### 1. 🎴 Zen Memory Game Module ("Memory Dojo")
A brand new interactive game mode to boost Kana and vocabulary recall through active visual and auditory pairing:
- **3 Game Modes**:
  - 🖼️ *Vocabolario & Illustrazioni*: Match Kana words with authentic 2D Japanese vector illustrations and bilingual translations.
  - 🔤 *Sillabario (Kana ↔ Romaji)*: Match Kana characters with their Romaji sound.
  - 🎧 *Ascolto (Audio ↔ Carta)*: Listen to native Japanese speech to find the corresponding card.
- **3 Difficulty Tiers**: Easy (6 pairs / 12 cards), Medium (8 pairs / 16 cards), and Hard (12 pairs / 24 cards).
- **Tactile Polish**: 3D flip card animations with Kyoto Lacquer Red / Golden Amber traditional patterned backs, live moves counter, timer, combo streak multipliers (`x2`, `x3`...), and celebratory confetti upon victory.

---

#### 2. 🎨 2D Japanese Vector Vocabulary Illustrations Pipeline
- **Dedicated Vector Style**: Standardized Japanese minimalist aesthetic with clean bold outlines, Kyoto lacquer accents, warm cream, and neutral off-white backgrounds.
- **Resilient `<VocabIllustration />` Component**: Implemented with multi-format progressive fallback (`.jpg` → `.webp` → `.png` → Lucide vector icon), ensuring seamless experience across all 100 vocabulary words.
- **Integrated Across Views**: Displayed in the Vocabulary Studio, Flashcard answer reveals, and Zen Memory cards.
- **Full Prompt Catalog**: Created `vocab-prompts.json` covering 100% of vocabulary words.

---

#### 3. 🔊 High-Fidelity Speech & Audio Engine Overhaul
- **Zero First-Click Latency**: Eager audio pre-warming on user touch/mouse interactions eliminates initial loading delays.
- **Chromium Garbage Collection Fix**: Global reference tracking prevents Chromium browsers from cutting off short Kana audio.
- **Learner-Calibrated Cadence & Max Volume**: Single Kana characters calibrated to `0.75` speed and vocabulary words to `0.80` speed with 100% volume for crisp, resonant vowel and consonant clarity.
- **Intelligent Voice Selection**: Automatically prioritizes natural neural voices (*Google 日本語*, *Microsoft Natural*, *Apple Kyoko/Siri*).

---

## Version 1.2.0 — Kyoto Lacquer Design & Unified 5-Category Kana System

**Release Date:** August 2026  
**Status:** Stable Release  

---

### 🌟 Highlights & Major Improvements

#### 1. 🎨 Zen Design System Overhaul ("Kyoto Lacquer & Golden Amber Sanctuary")
- **Refined Color Palette**:
  - **Light Mode**: Warm Rice Paper background (`#f6f4ee`), pure white card surfaces (`#ffffff`), and traditional Japanese Lacquer Red accents (`#981701`).
  - **Dark Mode**: Deep Charcoal background (`#141517` / `#1a1b1e`) paired with luminous Sun Gold / Golden Amber accents (`#f0b000` / `#fbbf24`).
- **Typography & Proportions**:
  - Editorial serif headlines using *Literata* and ultra-clean modern UI typography using *Inter*.
  - Consistent organic rounded corners (`rounded-zen` / `16px`) and diffused elevation shadows.
- **Responsive Architecture**:
  - Fluid mobile-to-desktop header with integrated hamburger navigation drawer, PWA install prompt, language selector (`IT` / `EN`), and script switcher (Hiragana / Katakana).

---

#### 2. 📑 Unified 5-Category Kana Reference Tables
The interactive Kana Tables view has been completely restructured to match the 5-division taxonomy of the Active Study Virtual Keyboard:
1. **Base (46)**: Full Gojūon grid (*A, I, U, E, O* × 11 consonant rows).
2. **Dakuten (゛)**: Voiced consonant sounds (*G, Z, D, B* - 20 characters).
3. **Handakuten (゜)**: Semi-voiced plosive sounds (*P* - 5 characters).
4. **Yōon (拗音 / Combinations)**: 3-column contracted syllable matrix (*A, U, O* × 11 consonant combinations = 33 characters).
5. **Piccoli / Small Kana (っ/ー)**: Sokuon gemination mark (っ), long vowel mark (ー), small ya/yu/yo, and reduced vowels (ぁ, ぃ, ぅ, ぇ, ぉ, ゎ, ゔ).

---

#### 3. 📖 Comprehensive Bilingual Example Vocabulary (`IT` / `EN`)
- Added `KANA_EXAMPLES_MAP` covering **100% of characters** across all 5 categories.
- Every card selection in the reference tables and flashcards displays an authentic example word with native pronunciation and localized translations in Italian and English.

---

#### 4. ⚡ Active Study & Virtual Keyboard Refinements
- Consultation keyboard synchronized with the 5 Kana categories.
- Optimized touch targets and responsive key scaling across mobile, iPad, and desktop viewports.
- Enhanced inline submission, difficulty levels (Easy, Medium, Hard), and accepted Romaji variants.

---

#### 5. 🔊 Hybrid Audio System & PWA Resilience
- Web Speech API native engine with automatic fallback for seamless voice playback across desktop browsers, iOS Safari, and Tauri desktop apps.
- Updated Service Worker caching strategies ensuring instant offline availability.

---

## 🛠️ Verification & Build Status
- **Vite Build**: Production bundle verified and generated with 0 errors.
- **Compatibility**: Tested across Chrome, Safari iOS, Android PWA, and desktop viewports.
