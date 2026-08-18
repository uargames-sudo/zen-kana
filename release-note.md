# Release Notes: Zen Kana

## Version 1.4.0 — Kana Mahjong Zen, 4 Structured Courses, Contextual Mini-Guides & Shuffle Modes

**Release Date:** August 2026  
**Status:** Stable Release  

---

### 🌟 Highlights & Major New Features

#### 1. 🀄 Kana Mahjong Zen Solitaire ("Dojo Giochi")
A brand new multi-layered 3D tile matching game designed specifically for Japanese language learners:
- **Kana ↔ Romaji Pairing**: Match each Kana tile (Hiragana or Katakana) with its corresponding Romaji sound tile.
- **Classic Mahjong Solitaire Physics**: Layer-based 3D collision check (`z-index` height) and lateral freedom checks. Blocked tiles are subtly dimmed.
- **3 Dynamic Board Layouts**:
  - 🐢 *Tartaruga Zen (Easy)*: 24 tiles across 2 layers.
  - 🔺 *Piramide Classica (Medium)*: 48 tiles across 3 layers.
  - 🐉 *Dragone Imperiale (Hard)*: 72 tiles across 4 intricate layers.
- **Kana Subsets & Assists**: Select between *Basic Gojūon*, *Dakuten*, *Yōon*, or *All Kana*, with in-game **Hint** (💡) and **Board Shuffle** (🔀), combo streak multipliers, and celebration confetti.

---

#### 2. 📖 4 Complete Structured Learning Tracks
Expanded the guided curriculum into 4 dedicated, progressive course tracks:
1. **5 Kana al Giorno** (10 Days • 46 Basic Characters)
2. **Dakuten & Handakuten** (5 Days • 25 Voiced & Semi-Voiced Sounds)
3. **Combinazioni Yōon** (6 Days • 33 Contracted Sounds)
4. **Fonetica Speciale & Ritmo** (3 Days • Sokuon, Chōonpu, Historical Particles & Nasal)
- Complete script isolation: Dedicated theory, illustrations, handwriting pad, and quizzes for both Hiragana and Katakana modes.

---

#### 3. 💡 Contextual Mini-Guides & Syllabary Reference Overhaul
- **Interactive Matrix Mini-Guides**: Added an expandable quick-guide accordion in `KanaTable.jsx` explaining the active category (Base, Dakuten, Handakuten, Yōon, or Phonetics).
- **Virtual Keyboard Guide**: Instant access to contextual explanations right from the study toolbar in `VirtualKeyboard.jsx`.
- **High-Contrast Global Guide**: Redesigned the Japanese Syllabary Guide modal with all 5 writing system pillars and perfected Dark/Light mode contrast.

---

#### 4. 🎴 Flashcards & Vocabulary Shuffle Modes
- **Customizable Flashcard Sets**: Filter review decks by *All (104)*, *Basic (46)*, *Dakuten (25)*, *Yōon (33)*, or *Vocabulary (100)*.
- **Shuffle / Random Order**: One-tap toggle and instant reshuffle for both Flashcards and the Vocabulary Studio.
- **Dark Mode Card Harmony**: Fixed example badge contrast on the back of flashcards for seamless dark mode immersion.

---

## Version 1.3.1 — UI/UX Refinements, Responsive Matrix Scaling & Audio Logic Optimization

**Release Date:** August 2026  
**Status:** Stable Release  

---

### 🌟 Highlights & Fixes

#### 1. 📑 Kana Reference Tables & Special Category Clean-up
- **Gojūon Base Clean-up**: Removed redundant symbols from the `N` row in both Hiragana and Katakana tables.
- **Special Tab Specialization**:
  - Hiragana: Dedicated **`Sokuon (促音)`** tab containing `っ` (*tsu* gemination mark).
  - Katakana: Dedicated **`Chōonpu / Sokuon (ー/ッ)`** tab containing both `ー` (*chōonpu* vowel elongation) and `ッ` (*sokuon* gemination).
  - Updated Katakana `ッ` example word to authentic Japanese vocabulary `ベッド` (*beddo* - letto).
- **Mobile Grid Overflow & Alignment Fix**: Converted CSS grid columns to `minmax(0, 1fr)` and fine-tuned responsive gaps, eliminating horizontal column clipping and aligning headers with all 5 vowel columns (*A, I, U, E, O*).
- **Desktop Card Constraints**: Applied proportional max-width bounds (`max-w-[120px]` and `max-w-3xl` container) to prevent cards from over-expanding on wide screens.

---

#### 2. 🔊 Floating Detail Bar & Dual Audio Playback
- **Dual Pronunciation**:
  - Clicking the Kana badge plays the **single syllable sound** (e.g. `ゆ` → *YU*).
  - Clicking the Audio button or example word plays the **full authentic Japanese example word** (e.g. `ゆき` → *yuki*).
- **Responsive Stacking & Word Wrap**: Implemented multi-line text wrapping preventing text from overlapping control buttons.
- **Bottom Navigation Clearance**: Sticky bar positioning calibrated (`bottom-24` on mobile/tablet viewports, `xl:bottom-6` on desktop) ensuring it never sits behind the navigation bar.

---

#### 3. 🖥️ Desktop Header Compact Dock Mode
- Implemented an elegant navigation dock: **icon-only** for inactive tabs to save horizontal space, expanding smoothly on hover (`hover:max-w-[160px]`), and **icon + label** for the active tab.

---

#### 4. 📊 Dashboard Responsive Grid Scalability
- Refined breakpoint transitions for Quick Activity modules (4 columns on wide desktop → 3 columns on laptop → 2 columns on tablet → 1 column on mobile).

---

#### 5. 📝 Quiz Mistakes Review Formatting
- Fixed Japanese character vertical splitting (`whitespace-nowrap`) in Mistakes Review across both Listening Quiz and Verification Quiz.

---

#### 6. 🎴 Memory Zen Audio & Icon Refinements
- Audio is now triggered exclusively when revealing **Illustration** cards or **Audio Mystery** cards.
- Text/writing cards (Kana, Romaji) no longer auto-play audio or display speaker icons, preserving the reading and recall challenge.

---

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
