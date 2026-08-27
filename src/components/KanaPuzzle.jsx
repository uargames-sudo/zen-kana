import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Puzzle, 
  Sparkles, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  Volume2, 
  Trophy, 
  Shuffle, 
  Trash2, 
  Lightbulb, 
  ArrowRight,
  Flame,
  HelpCircle,
  Play,
  Heart,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { VOCABULARY, getSyllablesDataset } from '../data/vocabulary';
import { tokenizeKana, generateDistractors } from '../utils/kanaTokenizer';
import VocabIllustration from './common/VocabIllustration';
import { playKanaSound } from '../utils/audio';
import { useLanguage } from '../context/LanguageContext';

export default function KanaPuzzle({ defaultScriptMode = 'hiragana' }) {
  const { lang, t } = useLanguage();

  // Settings
  const [gameMode, setGameMode] = useState('kana-to-romaji'); // 'kana-to-romaji' | 'romaji-to-kana'
  const [difficulty, setDifficulty] = useState('easy'); // 'easy' (+0), 'medium' (+2), 'hard' (+5)
  const [categoryFilter, setCategoryFilter] = useState('vocab'); // 'vocab' | 'syllables' | 'basic' | 'dakuten-yoon'
  const [scriptFilter, setScriptFilter] = useState(defaultScriptMode || 'all'); // 'all' | 'hiragana' | 'katakana'
  const [wordCount, setWordCount] = useState(10); // 5 | 10 | 15 | 25 | 'all'

  // Game lifecycle
  const [gameState, setGameState] = useState('setup'); // 'setup' | 'playing' | 'completed'
  const [wordList, setWordList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Active Word Puzzle State
  const [currentTokens, setCurrentTokens] = useState([]); // [{ kana, romaji, id, uid }]
  const [availableTiles, setAvailableTiles] = useState([]); // pool of tiles available to click
  const [placedSlots, setPlacedSlots] = useState([]); // array matching token length [tile | null]
  const [attemptsLeft, setAttemptsLeft] = useState(3);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isFailed, setIsFailed] = useState(false);

  // Session stats & mistakes
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [mistakes, setMistakes] = useState([]); // array of { word, expectedTokens, userSlots, gameMode }
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const MAX_ATTEMPTS = 3;

  // Timer Effect
  useEffect(() => {
    let interval;
    if (isTimerRunning && gameState === 'playing') {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, gameState]);

  // Difficulty Distractor mapping
  const distractorCount = useMemo(() => {
    switch (difficulty) {
      case 'hard': return 5;
      case 'medium': return 2;
      default: return 0;
    }
  }, [difficulty]);

  // Prepare a single puzzle word
  const setupPuzzleWord = useCallback((wordObj) => {
    if (!wordObj) return;

    const tokens = tokenizeKana(wordObj.kana).map((tok, idx) => ({
      ...tok,
      slotId: idx,
      uid: `target-${idx}-${tok.kana}-${tok.romaji}`
    }));

    setCurrentTokens(tokens);

    // Generate distractors if needed
    const distractors = generateDistractors(tokens, wordObj.script || 'hiragana', distractorCount);

    // Combine and shuffle available tiles
    const allTiles = [...tokens, ...distractors].sort(() => Math.random() - 0.5);
    setAvailableTiles(allTiles);

    // Empty slots array & reset attempts
    setPlacedSlots(new Array(tokens.length).fill(null));
    setAttemptsLeft(MAX_ATTEMPTS);
    setIsSuccess(false);
    setIsError(false);
    setIsFailed(false);
  }, [distractorCount]);

  // Start new game session
  const startSession = () => {
    let pool = [];
    if (categoryFilter === 'vocab') {
      pool = VOCABULARY;
      if (scriptFilter === 'hiragana') {
        pool = VOCABULARY.filter(w => w.script === 'hiragana');
      } else if (scriptFilter === 'katakana') {
        pool = VOCABULARY.filter(w => w.script === 'katakana');
      }
    } else if (categoryFilter === 'syllables') {
      pool = getSyllablesDataset(scriptFilter, 'all');
    } else if (categoryFilter === 'basic') {
      pool = getSyllablesDataset(scriptFilter, 'basic');
    } else if (categoryFilter === 'dakuten-yoon') {
      pool = [
        ...getSyllablesDataset(scriptFilter, 'dakuten'),
        ...getSyllablesDataset(scriptFilter, 'yoon')
      ];
    }

    if (!pool || pool.length === 0) {
      pool = VOCABULARY;
    }

    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const targetCount = wordCount === 'all' ? pool.length : Math.min(Number(wordCount), pool.length);
    const selected = shuffled.slice(0, targetCount);

    setWordList(selected);
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setHintsUsed(0);
    setMistakes([]);
    setTimerSeconds(0);
    setIsTimerRunning(true);
    setGameState('playing');

    if (selected.length > 0) {
      setupPuzzleWord(selected[0]);
    }
  };

  const currentWord = wordList[currentIndex];

  // Tile Click -> Place in first empty slot
  const handleTileClick = (tile) => {
    if (isSuccess || isFailed) return;
    setIsError(false);

    // Find first empty slot
    const emptySlotIdx = placedSlots.findIndex(s => s === null);
    if (emptySlotIdx === -1) return; // All slots full

    // Place tile into slot
    const newSlots = [...placedSlots];
    newSlots[emptySlotIdx] = tile;
    setPlacedSlots(newSlots);

    // Remove tile from available pool
    setAvailableTiles(prev => prev.filter(t => t.uid !== tile.uid));

    // Check if slots are fully filled
    checkSolution(newSlots);
  };

  // Slot Click -> Remove tile from slot back to pool
  const handleSlotClick = (slotIdx) => {
    if (isSuccess || isFailed) return;
    const tile = placedSlots[slotIdx];
    if (!tile) return;

    setIsError(false);

    // Remove from slot
    const newSlots = [...placedSlots];
    newSlots[slotIdx] = null;
    setPlacedSlots(newSlots);

    // Return to available pool
    setAvailableTiles(prev => [...prev, tile]);
  };

  // Clear all slots
  const handleClearSlots = () => {
    if (isSuccess || isFailed) return;
    const tilesToReturn = placedSlots.filter(Boolean);
    setAvailableTiles(prev => [...prev, ...tilesToReturn]);
    setPlacedSlots(new Array(currentTokens.length).fill(null));
    setIsError(false);
  };

  // Shuffle available pool tiles visually
  const handleShufflePool = () => {
    if (isSuccess || isFailed) return;
    setAvailableTiles(prev => [...prev].sort(() => Math.random() - 0.5));
  };

  // Advance to next word or finish session
  const advanceToNextWord = useCallback(() => {
    if (currentIndex + 1 < wordList.length) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setupPuzzleWord(wordList[nextIdx]);
    } else {
      // Completed all words in session!
      handleSessionVictory();
    }
  }, [currentIndex, wordList, setupPuzzleWord]);

  // Hint button -> place next correct tile
  const handleUseHint = () => {
    if (isSuccess || isFailed) return;

    // Find first incorrectly placed or empty slot
    let targetSlotIdx = -1;
    for (let i = 0; i < currentTokens.length; i++) {
      const placed = placedSlots[i];
      const target = currentTokens[i];
      const isMatch = gameMode === 'kana-to-romaji' 
        ? placed?.romaji === target.romaji
        : placed?.kana === target.kana;

      if (!placed || !isMatch) {
        targetSlotIdx = i;
        break;
      }
    }

    if (targetSlotIdx === -1) return;

    const expectedToken = currentTokens[targetSlotIdx];

    // If there's currently an incorrect tile in this slot, remove it first
    if (placedSlots[targetSlotIdx]) {
      const wrongTile = placedSlots[targetSlotIdx];
      setAvailableTiles(prev => [...prev, wrongTile]);
    }

    // Find the correct tile from available pool or from other wrong slots
    let foundTile = availableTiles.find(t => 
      gameMode === 'kana-to-romaji' 
        ? t.romaji === expectedToken.romaji && !t.isDistractor
        : t.kana === expectedToken.kana && !t.isDistractor
    );

    let newAvailable = [...availableTiles];
    let newSlots = [...placedSlots];

    if (foundTile) {
      newAvailable = newAvailable.filter(t => t.uid !== foundTile.uid);
    } else {
      // Tile might be wrongly placed in another slot
      for (let s = 0; s < newSlots.length; s++) {
        if (s !== targetSlotIdx && newSlots[s]) {
          const t = newSlots[s];
          const isTarget = gameMode === 'kana-to-romaji' 
            ? t.romaji === expectedToken.romaji && !t.isDistractor
            : t.kana === expectedToken.kana && !t.isDistractor;

          if (isTarget) {
            foundTile = t;
            newSlots[s] = null;
            break;
          }
        }
      }
    }

    if (foundTile) {
      newSlots[targetSlotIdx] = foundTile;
      setPlacedSlots(newSlots);
      setAvailableTiles(newAvailable);
      setHintsUsed(prev => prev + 1);
      checkSolution(newSlots);
    }
  };

  // Check Solution
  const checkSolution = (slots) => {
    const isFull = slots.every(s => s !== null);
    if (!isFull) return;

    let isCorrect = true;
    for (let i = 0; i < currentTokens.length; i++) {
      const placed = slots[i];
      const target = currentTokens[i];

      if (gameMode === 'kana-to-romaji') {
        if (placed.romaji !== target.romaji) {
          isCorrect = false;
          break;
        }
      } else {
        if (placed.kana !== target.kana) {
          isCorrect = false;
          break;
        }
      }
    }

    if (isCorrect) {
      // VICTORY ON THIS WORD
      setIsSuccess(true);
      setIsError(false);
      setIsFailed(false);
      setScore(prev => prev + 100 + streak * 10);
      setStreak(prev => {
        const next = prev + 1;
        if (next > maxStreak) setMaxStreak(next);
        return next;
      });

      // Play audio of the word
      if (currentWord?.kana) {
        playKanaSound(currentWord.kana);
      }

      // Transition to next word after delay
      setTimeout(() => {
        advanceToNextWord();
      }, 1100);
    } else {
      // INCORRECT ATTEMPT
      const nextAttempts = attemptsLeft - 1;
      setAttemptsLeft(nextAttempts);
      setStreak(0);

      if (nextAttempts <= 0) {
        // EXHAUSTED ALL 3 ATTEMPTS FOR THIS WORD
        setIsFailed(true);
        setIsError(false);

        // Record into mistakes list
        setMistakes(prev => [
          ...prev, 
          {
            word: currentWord,
            tokens: currentTokens,
            userSlots: slots,
            gameMode
          }
        ]);

        // Reveal correct answer in slots
        setPlacedSlots(currentTokens);

        // Play native voice so user learns pronunciation
        if (currentWord?.kana) {
          playKanaSound(currentWord.kana);
        }

        // Advance to next word after giving time to study correct answer
        setTimeout(() => {
          advanceToNextWord();
        }, 2200);
      } else {
        // Still have attempts left
        setIsError(true);
      }
    }
  };

  // Final Session Victory
  const handleSessionVictory = () => {
    setIsTimerRunning(false);
    setGameState('completed');

    try {
      confetti({
        particleCount: 85,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // Safe fallback
    }
  };

  const progressPercent = wordList.length > 0 
    ? Math.round(((currentIndex + (isSuccess || isFailed ? 1 : 0)) / wordList.length) * 100) 
    : 0;

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // ======================= SETUP SCREEN =======================
  if (gameState === 'setup') {
    return (
      <div className="max-w-xl mx-auto space-y-6 pb-20 xl:pb-8 animate-fade-in">
        <div className="zen-card p-6 sm:p-8 bg-zen-surface-lowest dark:bg-zen-dark-surface border border-zen-border/40 dark:border-zen-dark-border text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-zen-primary/10 dark:bg-zen-dark-primary/20 text-zen-primary dark:text-zen-dark-primary mx-auto flex items-center justify-center shadow-zen-sm">
            <Puzzle className="w-8 h-8" />
          </div>

          <div>
            <h2 className="font-headline text-2xl sm:text-3xl font-bold text-zen-text dark:text-zen-dark-text">
              {t('puzzle.title')}
            </h2>
            <p className="text-sm sm:text-base text-zen-text-muted dark:text-zen-dark-text-muted mt-1 max-w-md mx-auto">
              {t('puzzle.subtitle')}
            </p>
          </div>

          {/* Configuration Options */}
          <div className="space-y-4 pt-4 text-left">
            {/* 1. Game Mode Switcher */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-zen-text-muted dark:text-zen-dark-text-muted uppercase tracking-wider mb-2">
                {t('puzzle.modeLabel')}
              </label>
              <div className="grid grid-cols-2 gap-2 bg-zen-surface-container/60 dark:bg-zen-dark-surface-high p-1 rounded-2xl border border-zen-border/40 dark:border-zen-dark-border">
                <button
                  type="button"
                  onClick={() => setGameMode('kana-to-romaji')}
                  className={`py-3 px-3.5 rounded-xl text-sm font-bold transition-all flex flex-col items-center gap-1 ${
                    gameMode === 'kana-to-romaji'
                      ? 'bg-zen-surface-lowest dark:bg-zen-dark-primary text-zen-primary dark:text-zen-dark-on-primary shadow-zen-sm'
                      : 'text-zen-text-muted hover:text-zen-text dark:text-zen-dark-text-muted dark:hover:text-zen-dark-text'
                  }`}
                >
                  <span>Kana ➔ Romaji</span>
                  <span className="text-xs opacity-85 font-normal">{t('puzzle.modeKanaToRomajiDesc')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setGameMode('romaji-to-kana')}
                  className={`py-3 px-3.5 rounded-xl text-sm font-bold transition-all flex flex-col items-center gap-1 ${
                    gameMode === 'romaji-to-kana'
                      ? 'bg-zen-surface-lowest dark:bg-zen-dark-primary text-zen-primary dark:text-zen-dark-on-primary shadow-zen-sm'
                      : 'text-zen-text-muted hover:text-zen-text dark:text-zen-dark-text-muted dark:hover:text-zen-dark-text'
                  }`}
                >
                  <span>Romaji ➔ Kana</span>
                  <span className="text-xs opacity-85 font-normal">{t('puzzle.modeRomajiToKanaDesc')}</span>
                </button>
              </div>
            </div>

            {/* 2. Difficulty Tier */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-zen-text-muted dark:text-zen-dark-text-muted uppercase tracking-wider mb-2">
                {t('puzzle.difficultyLabel')}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'easy', label: t('puzzle.diffEasy'), desc: t('puzzle.diffEasyDesc'), hint: t('puzzle.diffEasyHint') },
                  { id: 'medium', label: t('puzzle.diffMed'), desc: t('puzzle.diffMedDesc'), hint: t('puzzle.diffMedHint') },
                  { id: 'hard', label: t('puzzle.diffHard'), desc: t('puzzle.diffHardDesc'), hint: t('puzzle.diffHardHint') }
                ].map((diff) => (
                  <button
                    key={diff.id}
                    type="button"
                    onClick={() => setDifficulty(diff.id)}
                    className={`p-3 sm:p-3.5 rounded-2xl border text-center transition-all flex flex-col items-center justify-between gap-1.5 ${
                      difficulty === diff.id
                        ? 'bg-zen-primary/10 dark:bg-zen-dark-primary/20 border-zen-primary dark:border-zen-dark-primary text-zen-primary dark:text-zen-dark-primary font-bold shadow-zen-sm'
                        : 'bg-zen-surface-container/30 dark:bg-zen-dark-surface-high/30 border-zen-border/40 dark:border-zen-dark-border text-zen-text-muted hover:border-zen-primary/40'
                    }`}
                  >
                    <span className="text-sm font-bold">{diff.label}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-zen-surface-lowest dark:bg-zen-dark-surface border border-zen-border/40 font-mono">
                      {diff.desc}
                    </span>
                    <span className="text-2xs sm:text-xs text-zen-text-muted dark:text-zen-dark-text-muted leading-tight text-center">
                      {diff.hint}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Content Category Filter */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-zen-text-muted dark:text-zen-dark-text-muted uppercase tracking-wider mb-2">
                {t('puzzle.categoryLabel')}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'vocab', label: t('puzzle.catVocab') },
                  { id: 'syllables', label: t('puzzle.catSyllables') },
                  { id: 'basic', label: t('puzzle.catBasic') },
                  { id: 'dakuten-yoon', label: t('puzzle.catDakutenYoon') }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategoryFilter(cat.id)}
                    className={`py-2.5 px-2 rounded-xl text-xs sm:text-sm font-bold transition-all border text-center ${
                      categoryFilter === cat.id
                        ? 'bg-zen-surface-lowest dark:bg-zen-dark-primary text-zen-primary dark:text-zen-dark-on-primary border-zen-primary/40 dark:border-zen-dark-primary shadow-zen-sm'
                        : 'bg-zen-surface-container/30 dark:bg-zen-dark-surface border-zen-border/40 dark:border-zen-dark-border text-zen-text-muted hover:text-zen-text hover:border-zen-primary/30'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Script Filter */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-zen-text-muted dark:text-zen-dark-text-muted uppercase tracking-wider mb-2">
                {t('puzzle.scriptFilterLabel')}
              </label>
              <div className="flex items-center gap-2">
                {[
                  { id: 'all', label: t('puzzle.filterAll') },
                  { id: 'hiragana', label: 'Hiragana (ひらがな)' },
                  { id: 'katakana', label: 'Katakana (カタカナ)' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setScriptFilter(item.id)}
                    className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all border ${
                      scriptFilter === item.id
                        ? 'bg-zen-surface-lowest dark:bg-zen-dark-primary text-zen-primary dark:text-zen-dark-on-primary border-zen-primary/40 dark:border-zen-dark-primary font-bold shadow-zen-sm'
                        : 'bg-zen-surface-container/30 dark:bg-zen-dark-surface border-zen-border/40 dark:border-zen-dark-border text-zen-text-muted hover:text-zen-text'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 5. Word Count Selector */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-zen-text-muted dark:text-zen-dark-text-muted uppercase tracking-wider mb-2">
                {t('puzzle.wordCountLabel')}
              </label>
              <div className="grid grid-cols-5 gap-2">
                {[
                  { id: 5, label: '5' },
                  { id: 10, label: '10' },
                  { id: 15, label: '15' },
                  { id: 25, label: '25' },
                  { id: 'all', label: t('puzzle.wordCountAll') }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setWordCount(item.id)}
                    className={`py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-bold transition-all border text-center ${
                      wordCount === item.id
                        ? 'bg-zen-surface-lowest dark:bg-zen-dark-primary text-zen-primary dark:text-zen-dark-on-primary border-zen-primary/40 dark:border-zen-dark-primary shadow-zen-sm'
                        : 'bg-zen-surface-container/30 dark:bg-zen-dark-surface border-zen-border/40 dark:border-zen-dark-border text-zen-text-muted hover:text-zen-text hover:border-zen-primary/30'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Launch Button */}
          <div className="pt-4">
            <button
              type="button"
              onClick={startSession}
              className="w-full py-4 px-6 rounded-2xl bg-zen-primary dark:bg-zen-dark-primary hover:bg-zen-primary-dark dark:hover:bg-zen-dark-primary-hover text-white dark:text-zen-dark-on-primary font-headline font-bold text-lg shadow-zen-md hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>{t('puzzle.startBtn')}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ======================= PLAYING SCREEN =======================
  if (gameState === 'playing' && currentWord) {
    const isKanaToRomaji = gameMode === 'kana-to-romaji';
    const showTranslation = difficulty === 'easy' || isSuccess || isFailed;
    const showIllustration = difficulty !== 'hard' || isSuccess || isFailed;
    const translationText = lang === 'it' ? currentWord.italian : currentWord.english;

    return (
      <div className="max-w-xl mx-auto space-y-5 pb-24 xl:pb-8 animate-fade-in">
        {/* Top Header: Navigation & Stats */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-zen-text-muted dark:text-zen-dark-text-muted">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setGameState('setup')}
                className="px-3.5 py-1.5 rounded-xl bg-zen-surface-lowest dark:bg-zen-dark-surface border border-zen-border/60 dark:border-zen-dark-border text-zen-text-muted hover:text-zen-text transition-colors shadow-zen-sm font-bold text-xs uppercase tracking-wider cursor-pointer"
              >
                {t('puzzle.exit')}
              </button>
              <span>{t('puzzle.wordCounter')} {currentIndex + 1} / {wordList.length}</span>
            </div>

            <div className="flex items-center gap-3">
              {/* Hearts / Attempts Indicators */}
              <div className="flex items-center gap-1.5 bg-zen-surface-lowest dark:bg-zen-dark-surface px-3 py-1.5 rounded-full border border-zen-border/40 dark:border-zen-dark-border shadow-zen-sm" title={`${attemptsLeft} / ${MAX_ATTEMPTS} ${t('puzzle.attemptsRemaining')}`}>
                {[...Array(MAX_ATTEMPTS)].map((_, i) => (
                  <Heart
                    key={i}
                    className={`w-4 h-4 transition-all ${
                      i < attemptsLeft 
                        ? 'fill-rose-500 text-rose-500 scale-100' 
                        : 'fill-transparent text-zen-border/60 dark:text-zen-dark-border scale-90'
                    }`}
                  />
                ))}
              </div>

              {streak > 1 && (
                <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 font-bold text-xs animate-pulse">
                  <Flame className="w-3.5 h-3.5 fill-current" />
                  <span>x{streak}</span>
                </div>
              )}

              <span className="font-mono text-sm sm:text-base font-bold text-zen-text dark:text-zen-dark-text">
                {formatTime(timerSeconds)}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-zen-surface-container dark:bg-zen-dark-surface-high h-2.5 rounded-full overflow-hidden">
            <div 
              className="bg-zen-primary dark:bg-zen-dark-primary h-full transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Word Target Card with Illustration */}
        <div className={`zen-card p-4 sm:p-6 rounded-3xl border-2 transition-all duration-300 flex items-center justify-between gap-4 ${
          isSuccess 
            ? 'bg-emerald-500/10 dark:bg-emerald-500/15 border-emerald-500/60 shadow-zen-lg scale-102' 
            : isFailed
            ? 'bg-amber-500/10 dark:bg-amber-500/15 border-amber-500/60 shadow-zen-md'
            : isError 
            ? 'bg-rose-500/10 dark:bg-rose-500/15 border-rose-500/60 animate-shake' 
            : 'bg-zen-surface-lowest dark:bg-zen-dark-surface border-zen-border/40 dark:border-zen-dark-border shadow-zen-md'
        }`}>
          <div className="min-w-0 flex-1 space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-zen-surface-container dark:bg-zen-dark-surface-high text-zen-text-muted">
                {currentWord.script}
              </span>
              <button
                type="button"
                onClick={() => playKanaSound(currentWord.kana)}
                className="p-2 rounded-xl bg-zen-primary/10 dark:bg-zen-dark-primary/20 text-zen-primary dark:text-zen-dark-primary hover:scale-110 transition-transform cursor-pointer"
                title="Ascolta pronuncia giapponese"
              >
                <Volume2 className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Prompt Target Display */}
            {isKanaToRomaji ? (
              <div>
                <div className="font-kana text-4xl sm:text-5xl font-extrabold text-zen-primary dark:text-zen-dark-primary leading-tight tracking-wide">
                  {currentWord.kana}
                </div>
                {showTranslation ? (
                  <div className="text-base sm:text-lg text-zen-text-muted dark:text-zen-dark-text-muted font-medium mt-1 animate-fadeIn capitalize">
                    {translationText}
                  </div>
                ) : (
                  <div className="text-xs font-bold uppercase tracking-widest text-zen-text-muted/50 dark:text-zen-dark-text-muted/50 mt-1">
                    • • •
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div className="text-3xl sm:text-4xl font-headline font-bold text-zen-text dark:text-zen-dark-text leading-tight capitalize">
                  {currentWord.romaji}
                </div>
                {showTranslation ? (
                  <div className="text-base sm:text-lg text-zen-primary dark:text-zen-dark-primary font-semibold mt-1 animate-fadeIn capitalize">
                    {translationText}
                  </div>
                ) : (
                  <div className="text-xs font-bold uppercase tracking-widest text-zen-text-muted/50 dark:text-zen-dark-text-muted/50 mt-1">
                    • • •
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Illustration Box */}
          <div className="shrink-0">
            {showIllustration ? (
              <VocabIllustration
                id={currentWord.id}
                keyword={currentWord.imageKeyword}
                alt={currentWord.english}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-zen-surface-container/30 dark:bg-zen-dark-surface-high/30 p-1 shadow-sm transition-all duration-300 animate-fadeIn"
                iconClassName="w-10 h-10 sm:w-12 sm:h-12"
              />
            ) : (
              <div 
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-zen-surface-container/30 dark:bg-zen-dark-surface-high/30 border-2 border-dashed border-zen-border/50 dark:border-zen-dark-border/50 flex flex-col items-center justify-center text-zen-text-muted/50 p-2 text-center"
                title="Illustrazione nascosta in modalità Difficile"
              >
                <HelpCircle className="w-6 h-6 sm:w-7 sm:h-7 opacity-40 mb-1" />
                <span className="text-xs font-bold uppercase tracking-wider opacity-60">Hard</span>
              </div>
            )}
          </div>
        </div>

        {/* ================= Target Placed Slots ================= */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-zen-text-muted uppercase tracking-wider px-1">
            <span>{t('puzzle.slotsLabel')} ({placedSlots.filter(Boolean).length}/{currentTokens.length})</span>
            
            {isError && (
              <span className="text-rose-500 dark:text-rose-400 font-bold animate-pulse flex items-center gap-1.5 text-xs sm:text-sm">
                <AlertCircle className="w-4 h-4" />
                {t('puzzle.incorrectTryAgain')} ({attemptsLeft} {t('puzzle.attemptsRemaining')})
              </span>
            )}

            {isFailed && (
              <span className="text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1.5 text-xs sm:text-sm">
                <AlertCircle className="w-4 h-4" />
                {t('puzzle.attemptsExhausted')}
              </span>
            )}

            {isSuccess && (
              <span className="text-emerald-500 dark:text-emerald-400 font-bold flex items-center gap-1.5 text-xs sm:text-sm">
                <CheckCircle2 className="w-4 h-4" /> {t('puzzle.correct')}!
              </span>
            )}
          </div>

          {/* Slot boxes */}
          <div className="flex items-center justify-center gap-2.5 sm:gap-3.5 flex-wrap">
            {placedSlots.map((tile, slotIdx) => {
              const hasTile = tile !== null;
              const displayText = hasTile 
                ? (isKanaToRomaji ? tile.romaji : tile.kana) 
                : '';

              return (
                <button
                  key={`slot-${slotIdx}`}
                  type="button"
                  onClick={() => handleSlotClick(slotIdx)}
                  className={`w-16 h-16 sm:w-20 sm:h-20 min-w-[64px] min-h-[64px] rounded-2xl border-2 transition-all duration-200 flex flex-col items-center justify-center relative cursor-pointer ${
                    hasTile
                      ? isSuccess
                        ? 'bg-emerald-500 text-white border-emerald-600 shadow-zen-md scale-105'
                        : isFailed
                        ? 'bg-amber-500 text-white border-amber-600 shadow-zen-md scale-102'
                        : isError
                        ? 'bg-rose-500/15 border-rose-500 text-rose-600 dark:text-rose-400'
                        : 'bg-zen-primary dark:bg-zen-dark-primary text-white dark:text-zen-dark-on-primary border-zen-primary shadow-zen-sm scale-102'
                      : 'bg-white/60 dark:bg-zen-dark-surface/60 border-dashed border-zen-border dark:border-zen-dark-border text-zen-text-muted/40 hover:border-zen-primary/50'
                  }`}
                  title={hasTile ? 'Tocca per rimuovere' : `Slot vuoto ${slotIdx + 1}`}
                >
                  <span className="text-xs absolute top-1.5 left-2 opacity-60 font-mono font-bold">
                    {slotIdx + 1}
                  </span>

                  {hasTile ? (
                    <span className={`font-extrabold leading-none ${isKanaToRomaji ? 'font-headline text-lg sm:text-xl uppercase' : 'font-kana text-3xl sm:text-4xl'}`}>
                      {displayText}
                    </span>
                  ) : (
                    <span className="text-base text-zen-border dark:text-zen-dark-border font-mono">•</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ================= Available Syllable Tiles Pool ================= */}
        <div className="zen-card p-4 sm:p-5 rounded-3xl border border-zen-border/40 dark:border-zen-dark-border bg-zen-surface-container/30 dark:bg-zen-dark-surface-high/30 space-y-3.5">
          <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-zen-text-muted uppercase tracking-wider">
            <span>{t('puzzle.availableTilesLabel')}</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleShufflePool}
                disabled={isSuccess || isFailed}
                className="p-2 rounded-xl bg-zen-surface-lowest dark:bg-zen-dark-surface text-zen-text-muted hover:text-zen-text transition-colors shadow-zen-sm disabled:opacity-50 cursor-pointer"
                title={t('puzzle.shuffle')}
              >
                <Shuffle className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleClearSlots}
                disabled={isSuccess || isFailed}
                className="p-2 rounded-xl bg-zen-surface-lowest dark:bg-zen-dark-surface text-zen-text-muted hover:text-rose-500 transition-colors shadow-zen-sm disabled:opacity-50 cursor-pointer"
                title={t('puzzle.clearAll')}
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleUseHint}
                disabled={isSuccess || isFailed}
                className="p-2 px-2.5 rounded-xl bg-zen-surface-lowest dark:bg-zen-dark-surface text-amber-500 hover:text-amber-600 transition-colors shadow-zen-sm flex items-center gap-1.5 text-xs font-bold disabled:opacity-50 cursor-pointer"
                title={t('puzzle.hint')}
              >
                <Lightbulb className="w-4 h-4" />
                <span>{t('puzzle.hint')}</span>
              </button>
            </div>
          </div>

          {/* Tiles Grid */}
          <div className="flex items-center justify-center gap-2.5 sm:gap-3 flex-wrap min-h-[72px]">
            {availableTiles.map((tile) => {
              const displayText = isKanaToRomaji ? tile.romaji : tile.kana;

              return (
                <button
                  key={tile.uid}
                  type="button"
                  onClick={() => handleTileClick(tile)}
                  disabled={isSuccess || isFailed}
                  className="w-16 h-16 sm:w-18 sm:h-18 min-w-[64px] min-h-[64px] rounded-2xl bg-zen-surface-lowest dark:bg-zen-dark-surface border-2 border-zen-border/70 dark:border-zen-dark-border text-zen-text dark:text-zen-dark-text font-bold shadow-zen-sm hover:border-zen-primary dark:hover:border-zen-dark-primary hover:scale-108 active:scale-95 transition-all flex items-center justify-center cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                >
                  <span className={isKanaToRomaji ? 'font-headline text-lg sm:text-xl font-bold uppercase tracking-wider' : 'font-kana text-3xl sm:text-4xl font-extrabold text-zen-primary dark:text-zen-dark-primary leading-none'}>
                    {displayText}
                  </span>
                </button>
              );
            })}

            {availableTiles.length === 0 && (
              <span className="text-sm text-zen-text-muted italic py-3 font-medium">
                {t('puzzle.allTilesPlaced')}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ======================= COMPLETED SCREEN =======================
  if (gameState === 'completed') {
    const totalWords = wordList.length;
    const correctWordsCount = totalWords - mistakes.length;
    const accuracy = totalWords > 0 ? Math.round((correctWordsCount / totalWords) * 100) : 100;

    return (
      <div className="max-w-xl mx-auto space-y-6 pb-20 xl:pb-8 animate-fade-in">
        {/* Victory Card */}
        <div className="zen-card p-6 sm:p-8 border-2 border-emerald-500/40 bg-zen-surface-lowest dark:bg-zen-dark-surface text-center space-y-6 shadow-zen-xl">
          <div className="w-20 h-20 rounded-3xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center border-2 border-emerald-500/30 shadow-zen-md">
            <Trophy className="w-10 h-10" />
          </div>

          <div>
            <h2 className="font-headline text-3xl sm:text-4xl font-bold text-zen-text dark:text-zen-dark-text">
              {t('puzzle.victoryTitle')}
            </h2>
            <p className="text-base text-zen-text-muted dark:text-zen-dark-text-muted mt-1.5">
              {t('puzzle.victorySubtitle')}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3.5 rounded-2xl bg-zen-surface-container/50 dark:bg-zen-dark-surface-high border border-zen-border/40">
              <span className="text-xs font-bold text-zen-text-muted uppercase">{t('puzzle.statScore')}</span>
              <div className="text-2xl font-bold font-mono text-zen-primary dark:text-zen-dark-primary mt-0.5">{score}</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-zen-surface-container/50 dark:bg-zen-dark-surface-high border border-zen-border/40">
              <span className="text-xs font-bold text-zen-text-muted uppercase">{t('puzzle.statAccuracy')}</span>
              <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">{accuracy}%</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-zen-surface-container/50 dark:bg-zen-dark-surface-high border border-zen-border/40">
              <span className="text-xs font-bold text-zen-text-muted uppercase">{t('puzzle.statMistakes')}</span>
              <div className="text-2xl font-bold font-mono text-rose-500 mt-0.5">{mistakes.length}</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-zen-surface-container/50 dark:bg-zen-dark-surface-high border border-zen-border/40">
              <span className="text-xs font-bold text-zen-text-muted uppercase">{t('puzzle.statTime')}</span>
              <div className="text-2xl font-bold font-mono text-zen-text dark:text-zen-dark-text mt-0.5">{formatTime(timerSeconds)}</div>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={startSession}
              className="w-full py-4 rounded-2xl bg-zen-primary dark:bg-zen-dark-primary hover:bg-zen-primary-dark dark:hover:bg-zen-dark-primary-hover text-white dark:text-zen-dark-on-primary font-bold text-base shadow-zen-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-5 h-5" />
              <span>{t('puzzle.playAgain')}</span>
            </button>

            <button
              type="button"
              onClick={() => setGameState('setup')}
              className="w-full py-3.5 rounded-2xl bg-zen-surface-container dark:bg-zen-dark-surface hover:bg-zen-surface-container-high text-zen-text-muted hover:text-zen-text text-sm font-bold transition-all cursor-pointer"
            >
              {t('puzzle.changeSettings')}
            </button>
          </div>
        </div>

        {/* ================= Mistakes Review Section ================= */}
        {mistakes.length > 0 ? (
          <div className="zen-card p-5 sm:p-6 border border-zen-border/40 dark:border-zen-dark-border bg-zen-surface-lowest dark:bg-zen-dark-surface space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 border-b border-zen-border/30 dark:border-zen-dark-border/40 pb-4 text-center">
              <AlertCircle className="w-5 h-5 text-rose-500 hidden sm:block" />
              <h3 className="font-headline text-lg sm:text-xl font-bold text-zen-text dark:text-zen-dark-text">
                {t('puzzle.reviewTitle')} ({mistakes.length})
              </h3>
            </div>

            <div className="space-y-3">
              {mistakes.map((item, idx) => {
                const isKanaToRomaji = item.gameMode === 'kana-to-romaji';

                return (
                  <div
                    key={`mistake-${idx}-${item.word.id}`}
                    className="p-4 rounded-2xl bg-zen-surface-container/30 dark:bg-zen-dark-surface-high/30 border border-zen-border/40 dark:border-zen-dark-border flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-zen-surface-container dark:bg-zen-dark-surface text-zen-text-muted">
                          {item.word.script}
                        </span>
                        <span className="text-sm font-bold text-zen-text-muted">
                          {lang === 'it' ? item.word.italian : item.word.english}
                        </span>
                        <button
                          type="button"
                          onClick={() => playKanaSound(item.word.kana)}
                          className="p-1.5 rounded-lg bg-zen-primary/10 dark:bg-zen-dark-primary/20 text-zen-primary dark:text-zen-dark-primary hover:scale-110 transition-transform cursor-pointer ml-auto"
                          title="Ascolta pronuncia"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-baseline gap-2.5">
                        <span className="font-kana text-3xl font-extrabold text-zen-primary dark:text-zen-dark-primary">
                          {item.word.kana}
                        </span>
                        <span className="text-base sm:text-lg font-bold font-headline text-zen-text dark:text-zen-dark-text">
                          {item.word.romaji}
                        </span>
                      </div>

                      {/* Correct syllable sequence tokens */}
                      <div className="flex items-center gap-1.5 pt-0.5 flex-wrap">
                        <span className="text-xs font-bold text-zen-text-muted uppercase mr-1">
                          {t('puzzle.correctSequence')}:
                        </span>
                        {item.tokens.map((tok, tIdx) => (
                          <span
                            key={`tok-${tIdx}`}
                            className="px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-sm font-bold"
                          >
                            {isKanaToRomaji ? tok.romaji.toUpperCase() : tok.kana}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Word illustration */}
                    <div className="shrink-0">
                      <VocabIllustration
                        id={item.word.id}
                        keyword={item.word.imageKeyword}
                        alt={item.word.english}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-zen-surface-lowest dark:bg-zen-dark-surface p-1 shadow-sm"
                        iconClassName="w-8 h-8 sm:w-10 sm:h-10"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="zen-card p-5 border border-emerald-500/30 bg-emerald-500/5 text-center flex items-center justify-center gap-2 text-base font-bold text-emerald-600 dark:text-emerald-400">
            <Sparkles className="w-5 h-5" />
            <span>{t('puzzle.noMistakes')}</span>
          </div>
        )}
      </div>
    );
  }

  return null;
}
