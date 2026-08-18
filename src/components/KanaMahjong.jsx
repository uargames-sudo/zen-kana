import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Gamepad2, 
  Sparkles, 
  RotateCcw, 
  Play, 
  Volume2, 
  Trophy, 
  Clock, 
  Flame, 
  ArrowLeft, 
  Shuffle, 
  Lightbulb, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  Layers
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { HIRAGANA_BASIC, KANA_DAKUTEN } from '../data/kanaData';
import { YOON_HIRAGANA_GRID, YOON_KATAKANA_GRID } from '../data/kanaTables';
import { playKanaSound } from '../utils/audio';
import { useLanguage } from '../context/LanguageContext';

// ==========================================
// 3D TILE POSITION TEMPLATES (x, y, z)
// ==========================================

// 24 Tiles (12 pairs) - Zen Turtle
const TEMPLATE_EASY = [
  // Layer 0 (Base - 18 tiles)
  { x: 2, y: 0, z: 0 }, { x: 3, y: 0, z: 0 }, { x: 4, y: 0, z: 0 }, { x: 5, y: 0, z: 0 },
  { x: 1, y: 1, z: 0 }, { x: 2, y: 1, z: 0 }, { x: 3, y: 1, z: 0 }, { x: 4, y: 1, z: 0 }, { x: 5, y: 1, z: 0 }, { x: 6, y: 1, z: 0 },
  { x: 1, y: 2, z: 0 }, { x: 2, y: 2, z: 0 }, { x: 3, y: 2, z: 0 }, { x: 4, y: 2, z: 0 }, { x: 5, y: 2, z: 0 }, { x: 6, y: 2, z: 0 },
  { x: 2, y: 3, z: 0 }, { x: 3, y: 3, z: 0 }, { x: 4, y: 3, z: 0 }, { x: 5, y: 3, z: 0 },
  // Layer 1 (Stack - 4 tiles)
  { x: 3, y: 1, z: 1 }, { x: 4, y: 1, z: 1 },
  { x: 3, y: 2, z: 1 }, { x: 4, y: 2, z: 1 },
]; // 22 tiles -> let's make it exactly 24 tiles (12 pairs):
TEMPLATE_EASY.push({ x: 0, y: 1.5, z: 0 }, { x: 7, y: 1.5, z: 0 });

// 48 Tiles (24 pairs) - Classic Pyramid
const TEMPLATE_MEDIUM = [
  // Layer 0 (Base 6x5 with corners trimmed = 32 tiles)
  { x: 2, y: 0, z: 0 }, { x: 3, y: 0, z: 0 }, { x: 4, y: 0, z: 0 }, { x: 5, y: 0, z: 0 },
  { x: 1, y: 1, z: 0 }, { x: 2, y: 1, z: 0 }, { x: 3, y: 1, z: 0 }, { x: 4, y: 1, z: 0 }, { x: 5, y: 1, z: 0 }, { x: 6, y: 1, z: 0 },
  { x: 0, y: 2, z: 0 }, { x: 1, y: 2, z: 0 }, { x: 2, y: 2, z: 0 }, { x: 3, y: 2, z: 0 }, { x: 4, y: 2, z: 0 }, { x: 5, y: 2, z: 0 }, { x: 6, y: 2, z: 0 }, { x: 7, y: 2, z: 0 },
  { x: 0, y: 3, z: 0 }, { x: 1, y: 3, z: 0 }, { x: 2, y: 3, z: 0 }, { x: 3, y: 3, z: 0 }, { x: 4, y: 3, z: 0 }, { x: 5, y: 3, z: 0 }, { x: 6, y: 3, z: 0 }, { x: 7, y: 3, z: 0 },
  { x: 1, y: 4, z: 0 }, { x: 2, y: 4, z: 0 }, { x: 3, y: 4, z: 0 }, { x: 4, y: 4, z: 0 }, { x: 5, y: 4, z: 0 }, { x: 6, y: 4, z: 0 },
  { x: 2, y: 5, z: 0 }, { x: 3, y: 5, z: 0 }, { x: 4, y: 5, z: 0 }, { x: 5, y: 5, z: 0 },

  // Layer 1 (Mid Pyramid - 12 tiles)
  { x: 2, y: 1.5, z: 1 }, { x: 3, y: 1.5, z: 1 }, { x: 4, y: 1.5, z: 1 }, { x: 5, y: 1.5, z: 1 },
  { x: 2, y: 2.5, z: 1 }, { x: 3, y: 2.5, z: 1 }, { x: 4, y: 2.5, z: 1 }, { x: 5, y: 2.5, z: 1 },
  { x: 2, y: 3.5, z: 1 }, { x: 3, y: 3.5, z: 1 }, { x: 4, y: 3.5, z: 1 }, { x: 5, y: 3.5, z: 1 },

  // Layer 2 (Top Crown - 4 tiles)
  { x: 3, y: 2, z: 2 }, { x: 4, y: 2, z: 2 },
  { x: 3, y: 3, z: 2 }, { x: 4, y: 3, z: 2 },
]; // 34 + 12 + 4 = 50 tiles -> adjust to 48 tiles
TEMPLATE_MEDIUM.splice(0, 2); // exactly 48 tiles

// 72 Tiles (36 pairs) - Imperial Dragon
const TEMPLATE_HARD = [];
// Generate robust 72 tiles 4-layer layout
// Layer 0: 44 tiles
for (let y = 0; y <= 5; y++) {
  for (let x = 0; x <= 7; x++) {
    if ((x === 0 || x === 7) && (y === 0 || y === 5)) continue;
    TEMPLATE_HARD.push({ x, y, z: 0 });
  }
}
// Layer 1: 20 tiles
for (let y = 1; y <= 4; y++) {
  for (let x = 1.5; x <= 5.5; x += 1) {
    TEMPLATE_HARD.push({ x, y, z: 1 });
  }
}
// Layer 2: 6 tiles
TEMPLATE_HARD.push(
  { x: 2.5, y: 2, z: 2 }, { x: 3.5, y: 2, z: 2 }, { x: 4.5, y: 2, z: 2 },
  { x: 2.5, y: 3, z: 2 }, { x: 3.5, y: 3, z: 2 }, { x: 4.5, y: 3, z: 2 }
);
// Layer 3: 2 Apex tiles
TEMPLATE_HARD.push(
  { x: 3.5, y: 2.5, z: 3 }, { x: 4.5, y: 2.5, z: 3 }
);
// Trim to exactly 72 tiles
while (TEMPLATE_HARD.length > 72) TEMPLATE_HARD.pop();
while (TEMPLATE_HARD.length < 72) TEMPLATE_HARD.push({ x: 3.5, y: 1.5, z: 2 });

export default function KanaMahjong({ defaultScriptMode = 'hiragana' }) {
  const { lang, t } = useLanguage();

  // Setup Options
  const [gameState, setGameState] = useState('setup'); // 'setup' | 'playing' | 'completed'
  const [scriptMode, setScriptMode] = useState(defaultScriptMode || 'hiragana'); // 'hiragana' | 'katakana' | 'both'
  const [category, setCategory] = useState('basic'); // 'basic' | 'dakuten' | 'yoon' | 'all'
  const [difficulty, setDifficulty] = useState('easy'); // 'easy' (24), 'medium' (48), 'hard' (72)

  // In-Game State
  const [tiles, setTiles] = useState([]);
  const [selectedTileId, setSelectedTileId] = useState(null);
  const [hintPair, setHintPair] = useState(null);
  const [isErrorShake, setIsErrorShake] = useState(null); // id of tile that caused mismatch shake
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [shufflesUsed, setShufflesUsed] = useState(0);
  const [matchedPairsCount, setMatchedPairsCount] = useState(0);
  const [totalPairs, setTotalPairs] = useState(12);

  // Timer Effect
  useEffect(() => {
    let interval = null;
    if (isTimerRunning && gameState === 'playing') {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, gameState]);

  // Pre-calculate sub-pools of Kana items
  const kanaPools = useMemo(() => {
    const basic = HIRAGANA_BASIC.filter(item => item.hiragana);
    const dakuten = KANA_DAKUTEN;
    const yoonH = YOON_HIRAGANA_GRID.flat();
    const yoonK = YOON_KATAKANA_GRID.flat();
    const yoon = yoonH.map((h, idx) => ({
      hiragana: h.k,
      katakana: yoonK[idx]?.k || h.k,
      romaji: h.r
    }));
    const all = [...basic, ...dakuten, ...yoon];
    return { basic, dakuten, yoon, all };
  }, []);

  // Check if a tile is free (not covered from above, and at least one side left/right is open)
  const isTileFree = useCallback((targetTile, allTiles) => {
    if (!targetTile) return false;

    // 1. Check if covered by any tile directly above on a higher layer (z > targetTile.z)
    const isCovered = allTiles.some(other => {
      if (other.id === targetTile.id) return false;
      if (other.z <= targetTile.z) return false;
      // Overlap condition in grid units (standard tile has width ~1, height ~1)
      return Math.abs(other.x - targetTile.x) < 0.95 && Math.abs(other.y - targetTile.y) < 0.95;
    });

    if (isCovered) return false;

    // 2. Check if left neighbor blocks
    const hasLeftNeighbor = allTiles.some(other => {
      if (other.id === targetTile.id) return false;
      if (other.z !== targetTile.z) return false;
      if (Math.abs(other.y - targetTile.y) >= 0.8) return false;
      // other is to the left if distance is roughly 1 unit (0.5 to 1.1)
      return (targetTile.x - other.x) > 0.4 && (targetTile.x - other.x) <= 1.05;
    });

    // 3. Check if right neighbor blocks
    const hasRightNeighbor = allTiles.some(other => {
      if (other.id === targetTile.id) return false;
      if (other.z !== targetTile.z) return false;
      if (Math.abs(other.y - targetTile.y) >= 0.8) return false;
      // other is to the right if distance is roughly 1 unit (0.5 to 1.1)
      return (other.x - targetTile.x) > 0.4 && (other.x - targetTile.x) <= 1.05;
    });

    // Free if at least one lateral side is open
    return (!hasLeftNeighbor || !hasRightNeighbor);
  }, []);

  // Compute set of free tile IDs
  const freeTileIds = useMemo(() => {
    const freeSet = new Set();
    tiles.forEach(tile => {
      if (isTileFree(tile, tiles)) {
        freeSet.add(tile.id);
      }
    });
    return freeSet;
  }, [tiles, isTileFree]);

  // Compute all available valid matching pairs among currently free tiles
  const availableFreeMatches = useMemo(() => {
    const freeTiles = tiles.filter(t => freeTileIds.has(t.id));
    const matches = [];

    for (let i = 0; i < freeTiles.length; i++) {
      for (let j = i + 1; j < freeTiles.length; j++) {
        const a = freeTiles[i];
        const b = freeTiles[j];
        if (a.pairKey === b.pairKey && a.type !== b.type) {
          matches.push([a, b]);
        }
      }
    }
    return matches;
  }, [tiles, freeTileIds]);

  // Start / Generate New Game
  const startNewGame = useCallback(() => {
    let template = TEMPLATE_EASY;
    if (difficulty === 'medium') template = TEMPLATE_MEDIUM;
    if (difficulty === 'hard') template = TEMPLATE_HARD;

    const numTiles = template.length;
    const numPairs = numTiles / 2;
    setTotalPairs(numPairs);

    // Select candidate Kana items
    const pool = kanaPools[category] || kanaPools.basic;
    // Shuffle pool
    const shuffledPool = [...pool].sort(() => Math.random() - 0.5);
    
    // Pick required distinct characters (or repeat if pool is smaller than numPairs)
    const selectedKana = [];
    while (selectedKana.length < numPairs) {
      for (const item of shuffledPool) {
        if (selectedKana.length < numPairs) {
          selectedKana.push(item);
        }
      }
    }

    // Build the pair tiles: 1 Kana tile + 1 Romaji tile per item
    const rawTiles = [];
    selectedKana.forEach((item, pairIndex) => {
      const pairKey = `pair_${pairIndex}_${item.romaji}`;
      
      // Determine script for Kana tile
      let currentScript = scriptMode;
      if (scriptMode === 'both') {
        currentScript = Math.random() > 0.5 ? 'hiragana' : 'katakana';
      }
      const kanaChar = currentScript === 'katakana' ? (item.katakana || item.hiragana) : (item.hiragana || item.katakana);

      // Tile 1: KANA
      rawTiles.push({
        pairKey,
        type: 'kana',
        display: kanaChar,
        kanaChar,
        romaji: item.romaji,
        script: currentScript
      });

      // Tile 2: ROMAJI
      rawTiles.push({
        pairKey,
        type: 'romaji',
        display: item.romaji.toUpperCase(),
        kanaChar,
        romaji: item.romaji,
        script: currentScript
      });
    });

    // Shuffle the raw tiles randomly and map them onto the 3D position template
    const shuffledRaw = rawTiles.sort(() => Math.random() - 0.5);
    const initialTiles = template.map((pos, idx) => ({
      id: `tile_${idx}`,
      ...shuffledRaw[idx],
      x: pos.x,
      y: pos.y,
      z: pos.z
    }));

    setTiles(initialTiles);
    setSelectedTileId(null);
    setHintPair(null);
    setIsErrorShake(null);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setHintsUsed(0);
    setShufflesUsed(0);
    setMatchedPairsCount(0);
    setTimerSeconds(0);
    setIsTimerRunning(true);
    setGameState('playing');
  }, [difficulty, category, scriptMode, kanaPools]);

  // Handle Tile Click
  const handleTileClick = (clickedTile) => {
    if (gameState !== 'playing') return;
    if (!freeTileIds.has(clickedTile.id)) return; // tile is locked/blocked

    setHintPair(null); // clear any active hint

    // If clicking already selected tile, deselect it
    if (selectedTileId === clickedTile.id) {
      setSelectedTileId(null);
      return;
    }

    // If no tile selected yet, select this one
    if (!selectedTileId) {
      setSelectedTileId(clickedTile.id);
      playKanaSound(clickedTile.kanaChar);
      return;
    }

    // A tile was already selected: check for MATCH!
    const firstTile = tiles.find(t => t.id === selectedTileId);
    if (!firstTile) {
      setSelectedTileId(clickedTile.id);
      return;
    }

    // MATCH SUCCESS! (Same pairKey and opposite types: Kana ↔ Romaji)
    if (firstTile.pairKey === clickedTile.pairKey && firstTile.type !== clickedTile.type) {
      playKanaSound(clickedTile.kanaChar || firstTile.kanaChar);

      // Trigger score & combo
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > maxStreak) setMaxStreak(newStreak);
      const points = 100 + (newStreak * 25);
      setScore(prev => prev + points);

      // Remove both tiles from board
      const remaining = tiles.filter(t => t.id !== firstTile.id && t.id !== clickedTile.id);
      setTiles(remaining);
      setSelectedTileId(null);
      const newMatchedCount = matchedPairsCount + 1;
      setMatchedPairsCount(newMatchedCount);

      // CHECK FOR VICTORY!
      if (remaining.length === 0) {
        setIsTimerRunning(false);
        setGameState('completed');
        try {
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 }
          });
        } catch {
          // fallback
        }
      }
    } else {
      // MISMATCH: Shake feedback & reset selection
      setIsErrorShake(clickedTile.id);
      setStreak(0);
      setTimeout(() => {
        setIsErrorShake(null);
        setSelectedTileId(null);
      }, 450);
    }
  };

  // Provide Hint: highlight an available matching pair among free tiles
  const handleHint = () => {
    if (availableFreeMatches.length > 0) {
      const [a, b] = availableFreeMatches[0];
      setHintPair([a.id, b.id]);
      setHintsUsed(prev => prev + 1);
    }
  };

  // Shuffle remaining tiles on board (preserving spatial slots)
  const handleShuffle = () => {
    if (tiles.length <= 1) return;
    setSelectedTileId(null);
    setHintPair(null);
    setShufflesUsed(prev => prev + 1);

    // Extract current payloads
    const payloads = tiles.map(t => ({
      pairKey: t.pairKey,
      type: t.type,
      display: t.display,
      kanaChar: t.kanaChar,
      romaji: t.romaji,
      script: t.script
    }));

    // Shuffle payloads
    const shuffledPayloads = [...payloads].sort(() => Math.random() - 0.5);

    // Reassign back to the exact current spatial coordinates
    const newTiles = tiles.map((t, idx) => ({
      ...t,
      ...shuffledPayloads[idx]
    }));

    setTiles(newTiles);
  };

  // Format Time display MM:SS
  const formatTime = (totalSec) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate board dimensions for responsive scaling
  const boardBounds = useMemo(() => {
    if (tiles.length === 0) return { minX: 0, maxX: 7, minY: 0, maxY: 5, width: 8, height: 6 };
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    tiles.forEach(t => {
      if (t.x < minX) minX = t.x;
      if (t.x > maxX) maxX = t.x;
      if (t.y < minY) minY = t.y;
      if (t.y > maxY) maxY = t.y;
    });
    return { minX, maxX, minY, maxY, width: maxX - minX + 1.5, height: maxY - minY + 1.5 };
  }, [tiles]);

  return (
    <div className="space-y-6 select-none max-w-5xl mx-auto pb-24 xl:pb-12">
      {/* ==================================================== */}
      {/* VIEW 1: GAME SETUP */}
      {/* ==================================================== */}
      {gameState === 'setup' && (
        <div className="zen-card p-6 sm:p-8 rounded-3xl border border-zen-border/40 bg-zen-surface-lowest dark:bg-zen-dark-surface shadow-zen-md space-y-7 animate-fadeIn">
          {/* Header */}
          <div className="flex items-center gap-3.5 pb-4 border-b border-zen-border/30 dark:border-zen-dark-border/40">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 dark:bg-zen-dark-primary/20 text-amber-600 dark:text-zen-dark-primary flex items-center justify-center border border-amber-500/30 shrink-0 shadow-sm">
              <Gamepad2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-3xs font-bold uppercase tracking-wider text-amber-600 dark:text-zen-dark-primary font-mono">
                {t('mahjong.badge') || 'Solitario Mahjong'}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold font-headline text-zen-text dark:text-zen-dark-text">
                {t('mahjong.title') || 'Kana Mahjong Zen'}
              </h2>
              <p className="text-xs sm:text-sm text-zen-text-muted dark:text-zen-dark-text-muted mt-0.5 font-medium">
                {t('mahjong.subtitle') || 'Abbina ogni tessera Kana con il suo Romaji corrispondente per liberare il tavolo!'}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* 1. Script selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zen-text-muted dark:text-zen-dark-text-muted mb-2.5">
                {t('mahjong.selectScript') || '1. Sistema di Scrittura'}
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { id: 'hiragana', label: t('mahjong.scriptHiragana') || 'Hiragana (あ)' },
                  { id: 'katakana', label: t('mahjong.scriptKatakana') || 'Katakana (ア)' },
                  { id: 'both', label: t('mahjong.scriptBoth') || 'Entrambi (Misto)' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setScriptMode(opt.id)}
                    className={`p-3 rounded-2xl border text-xs sm:text-sm font-bold transition-all text-center cursor-pointer ${
                      scriptMode === opt.id
                        ? 'bg-zen-primary text-white dark:bg-zen-dark-primary dark:text-zen-dark-on-primary border-zen-primary dark:border-zen-dark-primary shadow-zen-sm'
                        : 'bg-zen-surface-container/50 dark:bg-zen-dark-surface-high/60 text-zen-text dark:text-zen-dark-text border-zen-border/40 dark:border-zen-dark-border hover:bg-zen-surface-container'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Kana Category Set */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zen-text-muted dark:text-zen-dark-text-muted mb-2.5">
                {t('mahjong.selectCategory') || '2. Set di Kana'}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: 'basic', label: t('mahjong.catBasic') || 'Base (46)' },
                  { id: 'dakuten', label: t('mahjong.catDakuten') || 'Dakuten (25)' },
                  { id: 'yoon', label: t('mahjong.catYoon') || 'Yōon (33)' },
                  { id: 'all', label: t('mahjong.catAll') || 'Tutti i Kana (104)' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setCategory(opt.id)}
                    className={`p-3 rounded-2xl border text-xs sm:text-sm font-bold transition-all text-center cursor-pointer ${
                      category === opt.id
                        ? 'bg-zen-primary text-white dark:bg-zen-dark-primary dark:text-zen-dark-on-primary border-zen-primary dark:border-zen-dark-primary shadow-zen-sm'
                        : 'bg-zen-surface-container/50 dark:bg-zen-dark-surface-high/60 text-zen-text dark:text-zen-dark-text border-zen-border/40 dark:border-zen-dark-border hover:bg-zen-surface-container'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Difficulty / Board Layout */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zen-text-muted dark:text-zen-dark-text-muted mb-2.5">
                {t('mahjong.selectDifficulty') || '3. Layout & Difficoltà'}
              </label>
              <div className="grid sm:grid-cols-3 gap-3">
                {[
                  { 
                    id: 'easy', 
                    title: t('mahjong.diffEasy') || 'Tartaruga Zen (Facile)', 
                    desc: t('mahjong.diffEasyDesc') || '24 Tessere • 2 Livelli' 
                  },
                  { 
                    id: 'medium', 
                    title: t('mahjong.diffMedium') || 'Piramide Classica (Medio)', 
                    desc: t('mahjong.diffMediumDesc') || '48 Tessere • 3 Livelli' 
                  },
                  { 
                    id: 'hard', 
                    title: t('mahjong.diffHard') || 'Dragone Imperiale (Difficile)', 
                    desc: t('mahjong.diffHardDesc') || '72 Tessere • 4 Livelli' 
                  }
                ].map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setDifficulty(opt.id)}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer space-y-1 ${
                      difficulty === opt.id
                        ? 'bg-zen-primary/10 dark:bg-zen-dark-primary/15 border-zen-primary dark:border-zen-dark-primary shadow-sm'
                        : 'bg-zen-surface-container/40 dark:bg-zen-dark-surface-high/50 border-zen-border/40 dark:border-zen-dark-border hover:bg-zen-surface-container/70'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-xs sm:text-sm text-zen-text dark:text-zen-dark-text">
                        {opt.title}
                      </h4>
                      <span className={`w-3 h-3 rounded-full ${difficulty === opt.id ? 'bg-zen-primary dark:bg-zen-dark-primary' : 'border border-zen-text-muted/40'}`} />
                    </div>
                    <p className="text-2xs sm:text-xs text-zen-text-muted dark:text-zen-dark-text-muted font-medium">
                      {opt.desc}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Start Game CTA */}
          <button
            type="button"
            onClick={startNewGame}
            className="w-full py-4 rounded-2xl bg-zen-primary dark:bg-zen-dark-primary text-white dark:text-zen-dark-on-primary font-bold text-sm uppercase tracking-wider shadow-zen-md hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>{t('mahjong.startGame') || 'Inizia Partita Mahjong'}</span>
          </button>
        </div>
      )}

      {/* ==================================================== */}
      {/* VIEW 2: ACTIVE GAME BOARD */}
      {/* ==================================================== */}
      {gameState === 'playing' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Top Control Stats Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-3xl bg-zen-surface-lowest dark:bg-zen-dark-surface border border-zen-border/40 dark:border-zen-dark-border shadow-zen-sm">
            {/* Left: Back + Stats */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => { setIsTimerRunning(false); setGameState('setup'); }}
                className="p-2 rounded-xl bg-zen-surface-container dark:bg-zen-dark-surface-high text-zen-text-muted hover:text-zen-text transition-colors cursor-pointer"
                title={t('mahjong.backToSetup') || 'Cambia Tavolo'}
              >
                <ArrowLeft className="w-4 h-4" />
              </button>

              {/* Pairs Progress Badge */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zen-surface-container/60 dark:bg-zen-dark-surface-high/60 border border-zen-border/40 dark:border-zen-dark-border text-xs font-bold">
                <Layers className="w-3.5 h-3.5 text-zen-primary dark:text-zen-dark-primary" />
                <span className="text-zen-text dark:text-zen-dark-text">
                  {matchedPairsCount} / {totalPairs}
                </span>
                <span className="text-3xs text-zen-text-muted uppercase">
                  {t('mahjong.pairsMatched') || 'Coppie'}
                </span>
              </div>

              {/* Timer Badge */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zen-surface-container/60 dark:bg-zen-dark-surface-high/60 border border-zen-border/40 dark:border-zen-dark-border text-xs font-bold text-zen-text dark:text-zen-dark-text font-mono">
                <Clock className="w-3.5 h-3.5 text-zen-text-muted" />
                <span>{formatTime(timerSeconds)}</span>
              </div>

              {/* Streak Combo Badge */}
              {streak > 1 && (
                <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 text-xs font-bold animate-bounce">
                  <Flame className="w-3.5 h-3.5 fill-current" />
                  <span>{streak}x {t('mahjong.combo') || 'Combo'}</span>
                </div>
              )}
            </div>

            {/* Right: Assist Actions (Hint & Shuffle) */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleHint}
                disabled={availableFreeMatches.length === 0}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 dark:bg-zen-dark-primary/20 text-amber-700 dark:text-zen-dark-primary border border-amber-500/30 text-xs font-bold hover:bg-amber-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                title={t('mahjong.hint') || 'Suggerimento'}
              >
                <Lightbulb className="w-3.5 h-3.5" />
                <span>{t('mahjong.hint') || 'Aiuto'}</span>
                <span className="text-3xs font-mono opacity-80">({availableFreeMatches.length})</span>
              </button>

              <button
                type="button"
                onClick={handleShuffle}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zen-surface-container dark:bg-zen-dark-surface-high text-zen-text dark:text-zen-dark-text border border-zen-border/40 dark:border-zen-dark-border text-xs font-bold hover:opacity-90 transition-all cursor-pointer"
                title={t('mahjong.shuffle') || 'Mescola Tavolo'}
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t('mahjong.shuffle') || 'Mescola'}</span>
              </button>
            </div>
          </div>

          {/* No moves alert banner */}
          {availableFreeMatches.length === 0 && tiles.length > 0 && (
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-800 dark:text-amber-200 text-xs font-bold animate-pulse">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{t('mahjong.noMovesNotice') || 'Nessuna mossa libera rimasta! Usa "Mescola" per sbloccare nuove combinazioni.'}</span>
              </div>
              <button
                onClick={handleShuffle}
                className="px-3 py-1 bg-amber-500 text-white rounded-lg font-bold text-2xs uppercase tracking-wider cursor-pointer"
              >
                {t('mahjong.shuffle') || 'Mescola'}
              </button>
            </div>
          )}

          {/* ==================================================== */}
          {/* 3D MAHJONG SOLITAIRE TABLE BOARD CANVAS */}
          {/* ==================================================== */}
          <div className="relative w-full rounded-3xl border-2 border-zen-border/60 dark:border-zen-dark-border bg-[#e9e3d5] dark:bg-[#121316] p-4 sm:p-8 shadow-zen-lg overflow-hidden min-h-[480px] sm:min-h-[560px] flex items-center justify-center">
            
            {/* Subtle tatami / bamboo weave table background grid */}
            <div 
              className="absolute inset-0 opacity-15 dark:opacity-5 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(#864e5a 1px, transparent 1px)',
                backgroundSize: '24px 24px'
              }}
            />

            {/* Isometric Scaled Tile Layout Board */}
            <div 
              className="relative mx-auto transition-all"
              style={{
                width: '100%',
                maxWidth: '740px',
                height: '420px',
                // Responsive layout container
              }}
            >
              {tiles.map((tile) => {
                const isFree = freeTileIds.has(tile.id);
                const isSelected = selectedTileId === tile.id;
                const isHinted = hintPair && (hintPair[0] === tile.id || hintPair[1] === tile.id);
                const isShaking = isErrorShake === tile.id;

                // Responsive coordinate mapping percentages
                const leftPercent = ((tile.x - boardBounds.minX) / (boardBounds.width || 1)) * 82 + 5;
                const topPercent = ((tile.y - boardBounds.minY) / (boardBounds.height || 1)) * 74 + 8;
                const layerOffset = tile.z * 6; // 3D elevation offset in pixels
                const zIndexValue = tile.z * 10 + Math.round(tile.y * 2) + 2;

                return (
                  <div
                    key={tile.id}
                    onClick={() => handleTileClick(tile)}
                    style={{
                      position: 'absolute',
                      left: `${leftPercent}%`,
                      top: `calc(${topPercent}% - ${layerOffset}px)`,
                      zIndex: zIndexValue,
                    }}
                    className={`
                      w-13 h-17 sm:w-16 sm:h-22 select-none transition-transform duration-200
                      ${isShaking ? 'animate-bounce text-rose-500' : ''}
                      ${isFree ? 'cursor-pointer' : 'cursor-not-allowed'}
                    `}
                  >
                    {/* 3D Mahjong Ivory/Obsidian Tile Container */}
                    <div
                      className={`
                        relative w-full h-full rounded-2xl flex flex-col items-center justify-between p-1.5 sm:p-2 transition-all duration-200
                        ${/* Base 3D bevel shadow & border */ ''}
                        border-2
                        ${isFree 
                          ? isSelected
                            ? 'bg-amber-100 dark:bg-zen-dark-surface-high border-amber-500 dark:border-zen-dark-primary shadow-xl ring-3 ring-amber-400 dark:ring-zen-dark-primary -translate-y-2 scale-105'
                            : isHinted
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 dark:border-emerald-400 ring-3 ring-emerald-400 animate-pulse shadow-lg -translate-y-1'
                            : 'bg-gradient-to-b from-[#fffefc] to-[#f4eee1] dark:from-[#26282e] dark:to-[#17181c] border-[#d8cfbe] dark:border-[#383a42] shadow-[0_5px_0_#b8ac96] dark:shadow-[0_5px_0_#0b0c0e] hover:-translate-y-1 hover:shadow-lg'
                          : 'bg-[#ebe5d8] dark:bg-[#1c1d22] border-[#cfc6b5] dark:border-[#2a2b30] shadow-[0_3px_0_#b8ac96] dark:shadow-[0_3px_0_#0b0c0e] opacity-65 grayscale-[25%]'
                        }
                      `}
                    >
                      {/* Top Header Tag: Kana script or Romaji badge */}
                      <div className="w-full flex items-center justify-between text-3xs font-mono font-bold leading-none">
                        <span className={`px-1 py-0.5 rounded ${tile.type === 'kana' ? 'text-zen-primary dark:text-zen-dark-primary' : 'text-zen-text-muted dark:text-zen-dark-text-muted'}`}>
                          {tile.type === 'kana' ? (tile.script === 'katakana' ? '片' : '平') : 'RO'}
                        </span>
                        {/* Audio mini icon for kana */}
                        {tile.type === 'kana' && (
                          <Volume2 className="w-2.5 h-2.5 opacity-50 text-zen-primary dark:text-zen-dark-primary" />
                        )}
                      </div>

                      {/* Main Center Glyph */}
                      <div className="my-auto text-center flex items-center justify-center">
                        {tile.type === 'kana' ? (
                          <span className={`font-kana font-bold text-zen-primary dark:text-zen-dark-primary leading-none ${tile.display.length > 2 ? 'text-lg sm:text-xl' : tile.display.length === 2 ? 'text-xl sm:text-2xl' : 'text-2xl sm:text-3xl'}`}>
                            {tile.display}
                          </span>
                        ) : (
                          <span className="font-headline font-extrabold text-xs sm:text-sm text-zen-text dark:text-zen-dark-text uppercase tracking-wider leading-none">
                            {tile.display}
                          </span>
                        )}
                      </div>

                      {/* Bottom Micro Indicator */}
                      <div className="w-full text-center">
                        <div className={`h-1 w-4 mx-auto rounded-full ${tile.type === 'kana' ? 'bg-zen-primary/40 dark:bg-zen-dark-primary/40' : 'bg-zen-text-muted/30'}`} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom helper tip */}
          <div className="flex items-center justify-center gap-2 text-2xs text-zen-text-muted dark:text-zen-dark-text-muted font-medium text-center">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{t('mahjong.freeTilesNotice') || 'Solo le tessere con i lati liberi e non coperte possono essere selezionate.'}</span>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* VIEW 3: VICTORY & SUMMARY MODAL */}
      {/* ==================================================== */}
      {gameState === 'completed' && (
        <div className="zen-card p-6 sm:p-8 rounded-3xl border-2 border-zen-primary/40 dark:border-zen-dark-primary/50 bg-zen-surface-lowest dark:bg-zen-dark-surface shadow-zen-lg text-center space-y-6 animate-fadeIn">
          {/* Trophy Icon with Stars */}
          <div className="w-20 h-20 rounded-3xl bg-amber-500/15 dark:bg-zen-dark-primary/20 text-amber-600 dark:text-zen-dark-primary flex items-center justify-center mx-auto border-2 border-amber-500/30 shadow-md">
            <Trophy className="w-10 h-10" />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-headline font-bold text-zen-text dark:text-zen-dark-text">
              {t('mahjong.victoryTitle') || 'Tavolo Completato!'}
            </h2>
            <p className="text-xs sm:text-sm text-zen-text-muted dark:text-zen-dark-text-muted max-w-md mx-auto font-medium">
              {t('mahjong.victorySubtitle') || 'Hai liberato tutte le tessere del solitario Mahjong con maestria!'}
            </p>
          </div>

          {/* Stat summary grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg mx-auto">
            <div className="p-3 rounded-2xl bg-zen-surface-container/60 dark:bg-zen-dark-surface-high/60 border border-zen-border/40 dark:border-zen-dark-border text-center space-y-0.5">
              <span className="text-3xs font-bold uppercase text-zen-text-muted tracking-wider">
                {t('mahjong.statTime') || 'Tempo'}
              </span>
              <div className="text-base sm:text-lg font-bold font-mono text-zen-text dark:text-zen-dark-text">
                {formatTime(timerSeconds)}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-zen-surface-container/60 dark:bg-zen-dark-surface-high/60 border border-zen-border/40 dark:border-zen-dark-border text-center space-y-0.5">
              <span className="text-3xs font-bold uppercase text-zen-text-muted tracking-wider">
                {t('mahjong.statPairs') || 'Coppie'}
              </span>
              <div className="text-base sm:text-lg font-bold font-mono text-zen-primary dark:text-zen-dark-primary">
                {totalPairs}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-zen-surface-container/60 dark:bg-zen-dark-surface-high/60 border border-zen-border/40 dark:border-zen-dark-border text-center space-y-0.5">
              <span className="text-3xs font-bold uppercase text-zen-text-muted tracking-wider">
                {t('mahjong.statMaxCombo') || 'Max Combo'}
              </span>
              <div className="text-base sm:text-lg font-bold font-mono text-amber-600 dark:text-amber-400">
                {maxStreak}x
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-zen-surface-container/60 dark:bg-zen-dark-surface-high/60 border border-zen-border/40 dark:border-zen-dark-border text-center space-y-0.5">
              <span className="text-3xs font-bold uppercase text-zen-text-muted tracking-wider">
                Punti
              </span>
              <div className="text-base sm:text-lg font-bold font-mono text-zen-text dark:text-zen-dark-text">
                {score}
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={startNewGame}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-zen-primary dark:bg-zen-dark-primary text-white dark:text-zen-dark-on-primary font-bold text-xs uppercase tracking-wider shadow-zen-md hover:scale-105 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{t('mahjong.playAgain') || 'Gioca Ancora'}</span>
            </button>

            <button
              type="button"
              onClick={() => setGameState('setup')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-zen-surface-container dark:bg-zen-dark-surface-high text-zen-text dark:text-zen-dark-text font-bold text-xs uppercase tracking-wider hover:bg-zen-surface-high transition-all cursor-pointer"
            >
              <span>{t('mahjong.backToSetup') || 'Cambia Tavolo'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
