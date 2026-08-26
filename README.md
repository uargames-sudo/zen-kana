# Zen Kana 🎌

A calm, focused, and intuitive Japanese character learning studio designed as a Progressive Web App (PWA) and Desktop Application powered by Tauri v2. Master Hiragana and Katakana through visual, auditory, and kinesthetic learning modules.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite)
![Tauri](https://img.shields.io/badge/Tauri-v2-FFC131?logo=tauri)
![PWA Ready](https://img.shields.io/badge/PWA-Ready-5A0FC8?logo=pwa)
![Bilingual](https://img.shields.io/badge/i18n-IT%20%7C%20EN-emerald)

---

## ✨ Features

- **🎨 Zen Design System**: Kyoto Lacquer Red & Warm Rice Paper light theme, paired with a Deep Warm Charcoal & Sun Gold nocturnal sanctuary theme with high-contrast readability.
- **🀄 Kana Mahjong Zen Solitaire**: Multi-layer 3D Mahjong Solitaire tile-matching game (match Kana with its corresponding Romaji) with 3 layouts (*Zen Turtle*, *Classic Pyramid*, *Imperial Dragon*), free-tile collision detection, hints, shuffle, and combo multipliers.
- **🧩 Kana Word Puzzle**: Reconstruct Japanese vocabulary words by placing syllable tiles in correct order with distractor tiles, translation hints, difficulty tiers, customizable session lengths (5, 10, 15, 25, or All words), and senior-accessible high-contrast typography.
- **🎴 Zen Memory Game**: Interactive Matching Game with 3 study modes (*Vocabulary & Illustrations*, *Syllabary Kana ↔ Romaji*, and *Audio Listening*), 3 difficulty tiers, 3D flip card animations, combo streak multipliers, and celebration confetti.
- **📖 4 Comprehensive Guided Courses**:
  1. *5 Kana a Day* (10 Days • 46 Basic Gojūon)
  2. *Dakuten & Handakuten* (5 Days • 25 Voiced/Semi-voiced sounds)
  3. *Yōon Combinations* (6 Days • 33 Contracted sounds)
  4. *Special Phonetics & Rhythm* (3 Days • Sokuon, Chōonpu, Particles & Nasal)
- **💡 Contextual Mini-Guides**: Live educational explanations embedded right inside Kana Reference Tables and the Virtual Keyboard matching the active script and category.
- **🃏 Enhanced Flashcards & Shuffle Mode**: Spaced repetition cards with category filters (*All*, *Basic*, *Dakuten*, *Yōon*, *Vocabulary*), Shuffle / Random order toggle, and instant error revision mode.
- **📚 Shufflable Vocabulary Studio**: 100 essential Japanese words with authentic 2D vector illustrations, Romaji, Italian and English translations, pronunciation audio, and random shuffle mode.
- **🔊 High-Fidelity Speech & Audio Engine**: Instant pre-warming on user gesture (zero first-click latency), maximum volume output (`1.0`), learner-calibrated cadence (0.75 for Kana, 0.80 for vocabulary), and Chromium GC protection.
- **🌍 Bilingual Interface (i18n)**: Full runtime switching between **Italian** and **English** with seamless in-app language switcher (`IT` / `EN`) across all learning modules and menus.
- **📑 Unified 5-Category Kana Matrix**: Reference tables and virtual keyboard organized into **Base (46)**, **Dakuten (゛)**, **Handakuten (゜)**, **Yōon (拗音)**, and **Small/Sokuon (っ/ー)** with 100% bilingual example coverage.
- **⚡ Advanced Active Study Hub**: A comprehensive 3-pillar learning hub:
  - *Kana Study*: Train muscle memory and transliteration with 3 difficulty tiers and a virtual keyboard.
  - *Phrases Studio*: Interactive flashcards for survival Japanese (Greetings, Transport, Restaurant) with flip-to-reveal translation and TTS audio.
  - *Story Reader*: N5-level short stories presented line-by-line with progressive reveals (Romaji → Translation) and per-line playback.
- **🇯🇵 Native Furigana Engine**: Full support for HTML5 `<ruby>` tags to display perfectly aligned Furigana over Kanji characters.
- **✍️ Interactive Writing Canvas**: Practice handwriting Kana with stroke order guides, clear canvas, and real-time visual feedback.
- **📱 Progressive Web App (PWA)**: Fully installable on mobile devices (Android/iOS) and desktop browsers with header install button and offline Service Worker caching.
- **🖥️ Cross-Platform Desktop Support**: Packaged with **Tauri v2** for lightweight, ultra-fast native Windows, macOS, and Linux desktop builds.

---

## 📚 Learning & Gaming Modules

| Module | Description |
| :--- | :--- |
| **📊 Dashboard** | Overview of your study stats, daily streak, progress metrics, and quick navigation to all study tools. |
| **🀄 Kana Mahjong** | 3D multi-layered Mahjong Solitaire matching Kana with Romaji, featuring hints, shuffle, combos, and board layouts. |
| **🧩 Kana Puzzle** | Interactive word construction puzzle: assemble Kana syllables into words against distractor tiles. |
| **🎴 Zen Memory** | Memory matching game with 3 modes (Vocab & Illustrations, Kana ↔ Romaji, Audio Listening), combo streaks, and confetti. |
| **📖 Structured Lessons** | 4 complete step-by-step curriculum tracks with daily theory, flashcards, handwriting canvas, and verification quizzes. |
| **📑 Kana Tables** | Interactive coordinate matrix across 5 categories with contextual mini-guides, instant pronunciation, and examples. |
| **🃏 Flashcards** | 3D flip flashcards supporting Kana subsets & Vocabulary with Shuffle mode, mistake review, and mastery counters. |
| **⚡ Active Study** | A 3-pillar study hub featuring timed Kana transliteration, survival Phrases Studio, and a guided N5 Story Reader. |
| **✍️ Writing Canvas** | Practice handwriting Kana with stroke order guides, clear canvas, and real-time visual feedback. |
| **💬 Vocabulary Studio** | Explore 100+ Japanese vocabulary words categorized with Romaji, translations, 2D vector illustrations, and audio. |
| **🎧 Listening Quiz** | Train your auditory recognition: listen to native Japanese audio and select the matching Kana character. |
| **🎯 Verification Quiz** | Test your character recognition (Kana to Romaji and Romaji to Kana) with score tracking and celebration animations. |

---

## 🛠️ Tech Stack

- **Frontend**: [React 18](https://reactjs.org/)
- **Build Tool**: [Vite 6](https://vitejs.dev/)
- **Desktop Framework**: [Tauri v2](https://tauri.app/) (Rust-backed lightweight native app container)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations & Interaction**: [Framer Motion](https://www.framer.com/motion/) & [Canvas Confetti](https://github.com/lukePeavey/canvas-confetti)
- **PWA Capabilities**: Custom Service Worker & Web App Manifest

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [Rust](https://www.rust-lang.org/) *(only required if building Tauri desktop binaries)*

### Installation

```bash
# Clone the repository
git clone https://github.com/uargames-sudo/zen-kana
cd zen-kana

# Install dependencies
npm install
```

### NPM Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts Vite local development server (`http://localhost:3000`) |
| `npm run dev:host` | Starts Vite server listening on local Wi-Fi network (for smartphone testing) |
| `npm run build` | Builds production web bundle in `dist/` |
| `npm run tauri:dev` | Launches Tauri native desktop app in development mode |
| `npm run tauri:build` | Compiles production native desktop installer (`.msi` / `.exe` / `.app`) |

---

## 🔊 Audio System & Voice Diagnostics

Zen Kana includes a resilient hybrid audio system:
1. It first attempts to use native Web Speech API (`ja-JP`).
2. If no native Japanese TTS voice is found (e.g. in WebView2 without installed language packs), it automatically falls back to online TTS.

### Voice Check Command

You can verify which system voices are detected by opening the browser DevTools (`F12`) in the app and running:

```javascript
window.__checkKanaVoices()
```

---

## 🌐 Deployment to GitHub Pages

This project includes a **GitHub Actions workflow** (`.github/workflows/deploy.yml`) for automatic deployment.

1. Push your code to the `main` branch on GitHub:
   ```bash
   git push -u origin main
   ```
2. On GitHub, go to **Settings** $\rightarrow$ **Pages** $\rightarrow$ set **Source** to **GitHub Actions**.
3. Your PWA will be live at: `https://uargames-sudo.github.io/zen-kana/`

---

## ⚖️ License

This project is licensed under the [MIT License](LICENSE).
