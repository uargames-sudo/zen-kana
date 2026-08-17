---
name: Zen Kana
description: Offline-first Japanese Kana training PWA with Japanese Lacquer Red & Warm Rice Paper light mode and Warm Charcoal & Sun Gold dark mode
colors:
  primary: "#981701"
  primary-light: "#e86b54"
  primary-dark: "#721000"
  secondary: "#864e5a"
  secondary-light: "#feb6c4"
  accent: "#76574e"
  neutral-bg: "#f6f4ee"
  neutral-surface: "#ffffff"
  neutral-container: "#ebe7dd"
  neutral-text: "#161d1f"
  neutral-text-muted: "#5c574f"
  neutral-border: "#d4cdc0"
  dark-bg: "#141517"
  dark-surface: "#1a1b1e"
  dark-surface-high: "#24252a"
  dark-text: "#f4f3f0"
  dark-text-muted: "#9a9994"
  dark-border: "#31333a"
  dark-primary: "#f0b000"
  dark-secondary: "#fbbf24"
typography:
  display:
    fontFamily: "Literata, Georgia, serif"
    fontSize: "clamp(2rem, 5vw, 3rem)"
    fontWeight: 700
    lineHeight: 1.1
  headline:
    fontFamily: "Literata, Georgia, serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.2
  title:
    fontFamily: "Inter, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.3
  body:
    fontFamily: "Inter, sans-serif"
    fontSize: "0.875rem"
  fontFamily:
    display: "Literata, serif"
    body: "Inter, sans-serif"
    japanese: "Literata, serif"
  fontSize:
    "2xs": "0.625rem"
    "xs-plus": "0.6875rem"
    xs: "0.75rem"
    sm: "0.875rem"
    base: "1rem"
    lg: "1.125rem"
    xl: "1.25rem"
    "2xl": "1.5rem"
    "3xl": "1.875rem"
    "4xl": "2.25rem"
    "5xl": "3rem"
    "6xl": "3.75rem"
    "kana-sm": "2rem"
    "kana-md": "3rem"
    "kana-lg": "4.5rem"
    "kana-xl": "6rem"
  lineHeight:
    tight: 1.15
    snug: 1.3
    normal: 1.5
    relaxed: 1.6
  fontWeight:
    normal: 400
    medium: 500
    semibold: 600
    bold: 700
rounded:
  sm: "0.5rem"
  md: "0.75rem"
  lg: "1rem"
  xl: "1.5rem"
  full: "9999px"
spacing:
  xs: "0.25rem"
  sm: "0.5rem"
  md: "1rem"
  lg: "1.5rem"
  xl: "2rem"
---

# Design System: Zen Kana

## Overview

**Creative North Star: "Kyoto Lacquer & Golden Amber Sanctuary"**

Zen Kana pairs the focused discipline of traditional Japanese calligraphy with the precision of modern responsive learning tools. The interface evokes a serene Kyoto study atmosphere in light mode—using warm rice-paper canvases (`#f6f4ee`), pristine white cards (`#ffffff`), deep lacquer red accents (`#981701`), and soft mineral borders (`#d4cdc0`)—and transitions into an immersive nocturnal sanctuary in dark mode, built on warm deep charcoal (`#141517` / `#1a1b1e`) and radiant golden amber (`#f0b000`).

Every surface is designed to minimize cognitive load, creating an environment where learning Hiragana and Katakana feels peaceful, tactile, and natural.

**Key Characteristics:**
- Organic, softly rounded cards (`rounded-zen` / 16px radius) paired with gentle diffused elevation.
- Dual-font typography: **Literata** for authoritative Japanese Kana display and hero headlines; **Inter** for crisp, effortless multilingual reading.
- Tactile, friendly micro-interactions with smooth 3D card flips, subtle hover lifts, and responsive keyboard controls.

## Colors

The palette uses grounding mineral hues inspired by Kyoto lacquerware, traditional washi paper, and nocturnal gold leaf.

### Light Mode (Lacquer Red & Warm Rice Paper)
- **Canvas (Sfondo Pagina):** `#f6f4ee` (Warm rice paper tone).
- **Surface (Sfondo Card):** `#ffffff` (Pure white for elevated content cards).
- **Primary:** `#981701` (Japanese lacquer red for buttons, active tabs, and primary emphasis).
- **Border:** `#d4cdc0` (Warm mineral tone for hairline dividers and card outlines).
- **Text:** `#161d1f` (High-legibility ink black).
- **Muted Text:** `#5c574f` (Soft charcoal for secondary labels and hints).

### Dark Mode (Warm Charcoal & Golden Amber)
- **Canvas (Sfondo Pagina):** `#141517` (Deep warm charcoal).
- **Surface (Sfondo Card):** `#1a1b1e` (Slightly elevated warm dark surface).
- **Surface High:** `#24252a` (Elevated controls and hover states).
- **Primary:** `#f0b000` (Radiant solar gold / amber for active states, glyph strokes, and CTA buttons).
- **Border:** `#31333a` (Hairline dark slate border).
- **Text:** `#f4f3f0` (Warm luminous white text).
- **Muted Text:** `#9a9994` (Calm slate grey for metadata).

### Named Rules
**The Sanctuary Balance Rule.** Color accents never overpower content. Surfaces remain neutral, warm, and expansive; lacquer red and golden amber are reserved for actionable targets, active selections, and meaningful feedback.

## Typography

**Display Font:** Literata (serif, weights 600, 700)
**Body Font:** Inter (sans-serif, weights 400, 500, 600)
**Japanese Glyph Font:** Literata (serif, bold weights for organic stroke curves)

### Hierarchy
- **Display** (700, `clamp(2rem, 5vw, 3rem)`, `1.15`): Hero titles and celebratory completion screens.
- **Headline** (700, `1.5rem`, `1.2`): Section headings and module titles.
- **Title** (600, `1.125rem`, `1.3`): Card headers and active mode selectors.
- **Body** (400, `0.875rem`, `1.5`): Explanations, vocabulary definitions, and flashcard examples.
- **Label / Tag** (600, `0.75rem` / `0.625rem`, uppercase): Progress indicators, badges, and navigation items.

## Elevation & Depth

Zen Kana utilizes **soft diffused shadows and tonal layering** to create tactile warmth.

### Shadow Vocabulary
- **Zen Ambient Low** (`box-shadow: 0px 4px 16px rgba(45, 52, 70, 0.04)`): Subtle depth for resting cards.
- **Zen Floating Card** (`box-shadow: 0px 8px 24px rgba(45, 52, 70, 0.06)`): Resting state for interactive study cards.
- **Zen Lifted Hover** (`box-shadow: 0px 12px 32px rgba(45, 52, 70, 0.1)`): Elevation response during hover.
- **Zen Dark Deep** (`box-shadow: 0px 4px 24px rgba(0, 0, 0, 0.5)`): Atmospheric depth on dark surfaces.

## Components

### Buttons
- **Shape:** Rounded rectangle (`rounded-xl` / 12px or `rounded-2xl` / 16px).
- **Primary:** Solid Lacquer Red (`#981701`) in light mode; Solid Golden Amber (`#f0b000`) with dark text in dark mode.
- **Secondary / Surface:** Neutral surface container with subtle border and text color transition.
- **Hover:** Smooth opacity and slight elevation lift with primary border accent.

### Flashcards
- **Shape:** Soft card (`rounded-3xl` / 24px) with 3D flip animation (`perspective: 1000px`, `transform-style: preserve-3d`).
- **Interactive Feel:** Large centered Kana glyph with tactile rating buttons on flip.

### Kana Grid Cells & Virtual Keyboard
- **Style:** Compact square cards with clear Kana character, romaji subtitle, and instant audio feedback.
