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

- **🎨 Zen Design System**: Kyoto Lacquer Red & Warm Rice Paper light theme, paired with a Deep Warm Charcoal & Sun Gold nocturnal sanctuary theme.
- **🌍 Bilingual Interface (i18n)**: Full support for **Italian** and **English** with seamless in-app language switcher (`IT` / `EN`) across all learning modules and menus.
- **📑 Unified 5-Category Kana Matrix**: Reference tables and virtual keyboard organized into **Base (46)**, **Dakuten (゛)**, **Handakuten (゜)**, **Yōon (拗音)**, and **Small/Sokuon (っ/ー)** with 100% bilingual example coverage.
- **🧠 Multi-Sensory Learning**: Combines visual flashcards, native Japanese audio pronunciation, and interactive handwriting canvas for maximum retention.
- **⚡ Advanced Active Study**: Train muscle memory and script-to-romaji transliteration with immediate visual feedback, 3 difficulty tiers (Easy, Medium, Hard), and automatic audio playback.
- **⌨️ Enhanced Virtual Kana Keyboard**: 5-category layout, toggleable Romaji sub-labels, and responsive mobile key sizing.
- **📱 Progressive Web App (PWA)**: Fully installable on mobile devices (Android/iOS) and desktop browsers with header install button and offline Service Worker caching.
- **🖥️ Cross-Platform Desktop Support**: Packaged with **Tauri v2** for lightweight, ultra-fast native Windows, macOS, and Linux desktop builds.
- **🔊 Hybrid Speech Engine**: Uses native Web Speech API (`ja-JP`) with automatic fallback to online TTS audio when local speech packs are missing.
- **📅 10-Day Guided Curriculum**: Step-by-step daily lessons covering 5 Kana characters per day with integrated writing practice, vocabulary, and reviews.
- **🌐 Local Network Testing**: Built-in support to run and test on your local Wi-Fi network from any smartphone or tablet.

---

## 📚 Learning Modules

| Module | Description |
| :--- | :--- |
| **📊 Dashboard** | Overview of your study stats, daily streak, progress metrics, and quick navigation to all study tools. |
| **📑 Kana Tables** | Interactive coordinate matrix across 5 categories (Base, Dakuten, Handakuten, Yōon, Small) with instant pronunciation and bilingual examples. |
| **🎴 Flashcards** | Practice Hiragana and Katakana with 3D flip card animations, bilingual example words (IT/EN), audio pronunciation, and *Mastered / Needs Practice* sorting. |
| **⚡ Active Study** | Transliteration training supporting Read Kana, Write Kana, and Mixed modes with 3 difficulty levels, virtual keyboard consultation, and accepted Romaji variants. |
| **✍️ Writing Canvas** | Practice handwriting Kana with stroke order guides, clear canvas, and real-time visual feedback. |
| **📖 Structured Lessons** | 10-day step-by-step curriculum covering 5 Kana characters daily, including character writing and vocabulary practice. |
| **💬 Vocabulary Studio** | Explore 100+ Japanese vocabulary words categorized with Romaji, Italian and English translations, Kana breakdowns, and audio playback. |
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
