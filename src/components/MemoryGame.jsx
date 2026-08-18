import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Brain, 
  Sparkles, 
  RotateCcw, 
  Play, 
  Volume2, 
  Trophy, 
  Clock, 
  Flame, 
  ArrowLeft, 
  BookOpen, 
  Grid3X3,
  Headphones,
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { HIRAGANA_BASIC, KANA_DAKUTEN, KANA_COMBINATION } from '../data/kanaData';
import { VOCABULARY } from '../data/vocabulary';
import VocabIllustration from './common/VocabIllustration';
import { playKanaSound } from '../utils/audio';
import { useLanguage } from '../context/LanguageContext';

export default function MemoryGame() {
  const { lang, t } = useLanguage();

  // Setup Options
  const [gameState, setGameState] = useState('setup'); // 'setup' | 'playing' | 'completed'
  const [gameMode, setGameMode] = useState('vocab'); // 'vocab' | 'kana' | 'audio'
  const [scriptMode, setScriptMode] = useState('both'); // 'hiragana' | 'katakana' | 'both'
  const [difficulty, setDifficulty] = useState('medium'); // 'easy' (6 pairs), 'medium' (8 pairs), 'hard' (12 pairs)

  // In-Game State
  const [cards, setCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedIds, setMatchedIds] = useState(new Set());
  const [moves, setMoves] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  // Best scores from localStorage
  const [bestScores, setBestScores] = useState(() => {
    try {
      const saved = localStorage.getItem('zen_kana_memory_best');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

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

  // Pair counts mapping
  const pairCounts = {
    easy: 6,
    medium: 8,
    hard: 12
  };

  // Generate Memory Deck based on mode, script, and difficulty
  const startNewGame = () => {
    const totalPairs = pairCounts[difficulty] || 8;
    let selectedItems = [];

    if (gameMode === 'vocab') {
      // Filter vocabulary by script
      let pool = VOCABULARY;
      if (scriptMode === 'hiragana') {
        pool = VOCABULARY.filter(w => w.script === 'hiragana');
      } else if (scriptMode === 'katakana') {
        pool = VOCABULARY.filter(w => w.script === 'katakana');
      }

      // Shuffle and pick random items
      const shuffled = [...pool].sort(() => Math.random() - 0.5);
      selectedItems = shuffled.slice(0, totalPairs);

      // Create card pairs: Card A (Kana Word) & Card B (Illustration/Meaning)
      const deck = [];
      selectedItems.forEach((item, idx) => {
        const pairId = `pair-${idx}`;
        deck.push({
          uid: `${pairId}-a`,
          pairId,
          type: 'kana',
          kana: item.kana,
          romaji: item.romaji,
          italian: item.italian,
          english: item.english,
          id: item.id,
          keyword: item.imageKeyword,
          script: item.script
        });
        deck.push({
          uid: `${pairId}-b`,
          pairId,
          type: 'illustration',
          kana: item.kana,
          romaji: item.romaji,
          italian: item.italian,
          english: item.english,
          id: item.id,
          keyword: item.imageKeyword,
          script: item.script
        });
      });

      setCards(deck.sort(() => Math.random() - 0.5));
    } else if (gameMode === 'kana') {
      // Filter Kana dataset
      let pool = [...HIRAGANA_BASIC, ...KANA_DAKUTEN, ...KANA_COMBINATION].filter(x => x && x.romaji);
      if (scriptMode === 'hiragana') {
        pool = pool.filter(x => x.hiragana);
      } else if (scriptMode === 'katakana') {
        pool = pool.filter(x => x.katakana);
      }

      const shuffled = [...pool].sort(() => Math.random() - 0.5);
      selectedItems = shuffled.slice(0, totalPairs);

      const deck = [];
      selectedItems.forEach((item, idx) => {
        const pairId = `pair-${idx}`;
        const char = scriptMode === 'katakana' 
          ? (item.katakana || item.hiragana)
          : (scriptMode === 'both' ? (Math.random() > 0.5 ? item.katakana : item.hiragana) : item.hiragana);

        deck.push({
          uid: `${pairId}-a`,
          pairId,
          type: 'kana-char',
          kana: char,
          romaji: item.romaji,
          example: item.exampleIt || item.example
        });
        deck.push({
          uid: `${pairId}-b`,
          pairId,
          type: 'romaji',
          kana: char,
          romaji: item.romaji,
          example: item.exampleIt || item.example
        });
      });

      setCards(deck.sort(() => Math.random() - 0.5));
    } else if (gameMode === 'audio') {
      // Audio Mystery card vs Kana character/word
      let pool = VOCABULARY;
      if (scriptMode === 'hiragana') {
        pool = VOCABULARY.filter(w => w.script === 'hiragana');
      } else if (scriptMode === 'katakana') {
        pool = VOCABULARY.filter(w => w.script === 'katakana');
      }

      const shuffled = [...pool].sort(() => Math.random() - 0.5);
      selectedItems = shuffled.slice(0, totalPairs);

      const deck = [];
      selectedItems.forEach((item, idx) => {
        const pairId = `pair-${idx}`;
        deck.push({
          uid: `${pairId}-a`,
          pairId,
          type: 'audio',
          kana: item.kana,
          romaji: item.romaji,
          italian: item.italian,
          english: item.english,
          id: item.id,
          keyword: item.imageKeyword
        });
        deck.push({
          uid: `${pairId}-b`,
          pairId,
          type: 'kana',
          kana: item.kana,
          romaji: item.romaji,
          italian: item.italian,
          english: item.english,
          id: item.id,
          keyword: item.imageKeyword
        });
      });

      setCards(deck.sort(() => Math.random() - 0.5));
    }

    // Reset game state
    setFlippedIndices([]);
    setMatchedIds(new Set());
    setMoves(0);
    setTimerSeconds(0);
    setStreak(0);
    setMaxStreak(0);
    setIsLocked(false);
    setIsTimerRunning(true);
    setGameState('playing');
  };

  // Card click handler
  const handleCardClick = (index) => {
    if (isLocked) return;
    if (flippedIndices.includes(index)) return;
    if (matchedIds.has(cards[index].pairId)) return;

    const clickedCard = cards[index];

    // Play pronunciation only for illustration or audio mystery cards
    // Text cards (kana, kana-char, romaji) do NOT play audio so the player has to read the text
    const shouldPlayAudio = clickedCard.type === 'illustration' || clickedCard.type === 'audio';
    if (shouldPlayAudio && clickedCard.kana) {
      playKanaSound(clickedCard.kana);
    }

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setIsLocked(true);
      setMoves(prev => prev + 1);

      const [firstIdx, secondIdx] = newFlipped;
      const card1 = cards[firstIdx];
      const card2 = cards[secondIdx];

      if (card1.pairId === card2.pairId) {
        // MATCH!
        const newMatched = new Set(matchedIds);
        newMatched.add(card1.pairId);
        setMatchedIds(newMatched);
        setStreak(prev => {
          const next = prev + 1;
          if (next > maxStreak) setMaxStreak(next);
          return next;
        });

        setFlippedIndices([]);
        setIsLocked(false);

        // Check if game complete
        const totalPairs = pairCounts[difficulty] || 8;
        if (newMatched.size >= totalPairs) {
          handleVictory();
        }
      } else {
        // NO MATCH -> Reset combo streak & flip back after delay
        setStreak(0);
        setTimeout(() => {
          setFlippedIndices([]);
          setIsLocked(false);
        }, 1100);
      }
    }
  };

  const handleVictory = () => {
    setIsTimerRunning(false);
    setGameState('completed');

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch {
      // safe fallback
    }

    // Save best score
    const key = `${gameMode}-${difficulty}-${scriptMode}`;
    const currentBest = bestScores[key];
    const newScore = {
      moves: moves + 1,
      seconds: timerSeconds,
      date: new Date().toISOString()
    };

    if (!currentBest || newScore.moves < currentBest.moves || (newScore.moves === currentBest.moves && newScore.seconds < currentBest.seconds)) {
      const updated = { ...bestScores, [key]: newScore };
      setBestScores(updated);
      try {
        localStorage.setItem('zen_kana_memory_best', JSON.stringify(updated));
      } catch {}
    }
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  const totalPairs = pairCounts[difficulty] || 8;
  const progressPercent = Math.round((matchedIds.size / totalPairs) * 100);

  // Dynamic grid classes based on total cards
  const gridClasses = useMemo(() => {
    const count = totalPairs * 2;
    if (count === 12) {
      return 'grid-cols-3 sm:grid-cols-4 md:grid-cols-4 gap-2.5 sm:gap-4 max-w-2xl';
    }
    if (count === 16) {
      return 'grid-cols-4 sm:grid-cols-4 md:grid-cols-4 gap-2 sm:gap-3.5 max-w-3xl';
    }
    return 'grid-cols-4 sm:grid-cols-6 md:grid-cols-6 gap-2 sm:gap-3 max-w-4xl';
  }, [totalPairs]);

  return (
    <div className="space-y-6 pb-20 xl:pb-8">
      {/* ======================= SETUP SCREEN ======================= */}
      {gameState === 'setup' && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="zen-card p-6 sm:p-8 border border-zen-border/40 dark:border-zen-dark-border bg-zen-surface-lowest dark:bg-zen-dark-surface text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-zen-primary/10 dark:bg-zen-dark-primary/20 px-3.5 py-1.5 text-xs font-bold text-zen-primary dark:text-zen-dark-primary uppercase tracking-widest mb-3">
              <Brain className="w-4 h-4" /> {t('memory.badge') || 'Dojo della Memoria'}
            </div>
            <h2 className="font-headline text-3xl sm:text-4xl font-bold text-zen-text dark:text-zen-dark-text">
              {t('memory.title') || 'Memory Zen'}
            </h2>
            <p className="mt-2 text-sm text-zen-text-muted dark:text-zen-dark-text-muted max-w-xl mx-auto">
              {t('memory.subtitle') || 'Allena il riconoscimento visivo e uditivo associando carte Kana, vocaboli illustrati e pronunce autentiche.'}
            </p>
          </div>

          {/* Configuration Card */}
          <div className="zen-card p-6 sm:p-7 border border-zen-border/40 dark:border-zen-dark-border bg-zen-surface-lowest dark:bg-zen-dark-surface space-y-6">
            {/* Mode Selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-zen-text-muted dark:text-zen-dark-text-muted mb-2.5">
                {t('memory.selectMode') || '1. Seleziona Modalità di Gioco'}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    id: 'vocab',
                    icon: BookOpen,
                    title: t('memory.modeVocab') || 'Vocaboli & Illustrazioni',
                    desc: t('memory.modeVocabDesc') || 'Abbina la parola in Kana alla sua illustrazione'
                  },
                  {
                    id: 'kana',
                    icon: Grid3X3,
                    title: t('memory.modeKana') || 'Sillabario (Kana ↔ Romaji)',
                    desc: t('memory.modeKanaDesc') || 'Abbina il carattere al suo suono Romaji'
                  },
                  {
                    id: 'audio',
                    icon: Headphones,
                    title: t('memory.modeAudio') || 'Ascolto (Audio ↔ Parola)',
                    desc: t('memory.modeAudioDesc') || 'Ascolta la voce giapponese e trova la carta'
                  }
                ].map(mode => {
                  const Icon = mode.icon;
                  const isSelected = gameMode === mode.id;
                  return (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setGameMode(mode.id)}
                      className={`p-4 rounded-2xl border-2 text-left transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-zen-primary dark:border-zen-dark-primary bg-zen-primary/5 dark:bg-zen-dark-primary/10 shadow-zen-sm'
                          : 'border-zen-border/40 dark:border-zen-dark-border hover:border-zen-border-hover dark:hover:border-zen-dark-border-hover'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`p-2 rounded-xl ${isSelected ? 'bg-zen-primary text-white dark:bg-zen-dark-primary dark:text-zen-dark-on-primary' : 'bg-zen-surface-container dark:bg-zen-dark-surface-high text-zen-text-muted'}`}>
                          <Icon className="w-5 h-5" />
                        </span>
                        {isSelected && <CheckCircle2 className="w-5 h-5 text-zen-primary dark:text-zen-dark-primary" />}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-zen-text dark:text-zen-dark-text">{mode.title}</div>
                        <div className="text-2xs text-zen-text-muted dark:text-zen-dark-text-muted mt-1">{mode.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Script Selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-zen-text-muted dark:text-zen-dark-text-muted mb-2.5">
                {t('memory.selectScript') || '2. Sistema di Scrittura'}
              </label>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {[
                  { id: 'hiragana', label: 'Hiragana (あ)' },
                  { id: 'katakana', label: 'Katakana (ア)' },
                  { id: 'both', label: t('memory.scriptBoth') || 'Entrambi (あ/ア)' }
                ].map(s => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setScriptMode(s.id)}
                    className={`py-2.5 px-3 rounded-xl font-bold text-xs transition-all border ${
                      scriptMode === s.id
                        ? 'bg-zen-primary dark:bg-zen-dark-primary text-white dark:text-zen-dark-on-primary border-zen-primary dark:border-zen-dark-primary shadow-zen-sm'
                        : 'bg-zen-surface-container dark:bg-zen-dark-surface-high border-zen-border/40 dark:border-zen-dark-border text-zen-text-muted dark:text-zen-dark-text-muted hover:text-zen-text'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty Selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-zen-text-muted dark:text-zen-dark-text-muted mb-2.5">
                {t('memory.selectDifficulty') || '3. Difficoltà & Dimensione Griglia'}
              </label>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {[
                  { id: 'easy', label: t('memory.easy') || 'Facile', desc: '6 Coppie (12 Carte)' },
                  { id: 'medium', label: t('memory.medium') || 'Medio', desc: '8 Coppie (16 Carte)' },
                  { id: 'hard', label: t('memory.hard') || 'Difficile', desc: '12 Coppie (24 Carte)' }
                ].map(d => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setDifficulty(d.id)}
                    className={`p-3 rounded-xl font-bold text-left transition-all border ${
                      difficulty === d.id
                        ? 'bg-zen-primary dark:bg-zen-dark-primary text-white dark:text-zen-dark-on-primary border-zen-primary dark:border-zen-dark-primary shadow-zen-sm'
                        : 'bg-zen-surface-container dark:bg-zen-dark-surface-high border-zen-border/40 dark:border-zen-dark-border text-zen-text-muted dark:text-zen-dark-text-muted hover:text-zen-text'
                    }`}
                  >
                    <div className="text-xs sm:text-sm">{d.label}</div>
                    <div className={`text-2xs mt-0.5 ${difficulty === d.id ? 'text-white/80 dark:text-zen-dark-on-primary/80' : 'text-zen-text-muted/70 dark:text-zen-dark-text-muted/70'}`}>
                      {d.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Start Action */}
            <button
              type="button"
              onClick={startNewGame}
              className="w-full py-4 rounded-2xl bg-zen-primary dark:bg-zen-dark-primary hover:bg-zen-primary-dark dark:hover:bg-zen-dark-primary-hover text-white dark:text-zen-dark-on-primary font-bold text-base flex items-center justify-center gap-2.5 shadow-zen-md hover:scale-[1.01] active:scale-[0.99] transition-all"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>{t('memory.startGame') || 'Inizia Partita'}</span>
            </button>
          </div>
        </div>
      )}

      {/* ======================= IN-GAME SCREEN ======================= */}
      {gameState === 'playing' && (
        <div className="space-y-5">
          {/* Header Bar */}
          <div className="zen-card p-4 sm:p-5 border border-zen-border/40 dark:border-zen-dark-border bg-zen-surface-lowest dark:bg-zen-dark-surface flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setGameState('setup')}
                className="p-2 rounded-xl bg-zen-surface-container dark:bg-zen-dark-surface-high text-zen-text-muted hover:text-zen-text transition-colors"
                title={t('memory.backToSetup') || 'Torna alle impostazioni'}
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h3 className="font-headline font-bold text-lg text-zen-text dark:text-zen-dark-text">
                  {gameMode === 'vocab' ? t('memory.modeVocab') : gameMode === 'kana' ? t('memory.modeKana') : t('memory.modeAudio')}
                </h3>
                <p className="text-2xs text-zen-text-muted dark:text-zen-dark-text-muted uppercase tracking-wider font-bold">
                  {difficulty} • {scriptMode}
                </p>
              </div>
            </div>

            {/* Live Stats */}
            <div className="flex items-center gap-3 sm:gap-5">
              {/* Timer */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zen-surface-container/80 dark:bg-zen-dark-surface-high text-zen-text dark:text-zen-dark-text text-xs font-mono font-bold">
                <Clock className="w-3.5 h-3.5 text-zen-secondary dark:text-zen-dark-secondary" />
                <span>{formatTime(timerSeconds)}</span>
              </div>

              {/* Moves */}
              <div className="text-xs font-bold text-zen-text-muted dark:text-zen-dark-text-muted">
                {t('memory.moves') || 'Mosse'}: <span className="text-zen-text dark:text-zen-dark-text font-mono font-bold">{moves}</span>
              </div>

              {/* Streak */}
              {streak > 1 && (
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-bold animate-bounce">
                  <Flame className="w-3.5 h-3.5 fill-current" />
                  <span>x{streak}</span>
                </div>
              )}

              {/* Reset */}
              <button
                type="button"
                onClick={startNewGame}
                className="p-2 rounded-xl bg-zen-surface-container dark:bg-zen-dark-surface-high text-zen-text-muted hover:text-zen-text hover:rotate-180 transition-all duration-300"
                title={t('memory.restart') || 'Ricomincia'}
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-zen-surface-container dark:bg-zen-dark-surface-high h-2.5 rounded-full overflow-hidden">
            <div 
              className="bg-zen-primary dark:bg-zen-dark-primary h-full transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* 3D Card Grid Container */}
          <div className="flex justify-center">
            <div className={`grid ${gridClasses} w-full`}>
              {cards.map((card, idx) => {
                const isFlipped = flippedIndices.includes(idx) || matchedIds.has(card.pairId);
                const isMatched = matchedIds.has(card.pairId);

                return (
                  <div
                    key={card.uid}
                    onClick={() => handleCardClick(idx)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleCardClick(idx)}
                    className="aspect-square cursor-pointer [perspective:1000px] select-none"
                  >
                    <div
                      className={`relative w-full h-full duration-500 transition-transform [transform-style:preserve-3d] rounded-2xl ${
                        isFlipped ? '[transform:rotateY(180deg)]' : ''
                      }`}
                    >
                      {/* ============ FRONT: CARD BACK (FACE DOWN) ============ */}
                      <div className="absolute inset-0 w-full h-full rounded-2xl [backface-visibility:hidden] bg-gradient-to-br from-zen-primary to-zen-primary-dark dark:from-zen-dark-primary dark:to-zen-dark-primary-hover border-2 border-zen-primary/40 dark:border-zen-dark-primary/60 shadow-zen-sm flex items-center justify-center p-2 text-white dark:text-zen-dark-on-primary hover:scale-[1.02] active:scale-[0.98] transition-transform">
                        <div className="w-full h-full rounded-xl border border-white/20 dark:border-black/20 flex items-center justify-center relative overflow-hidden">
                          <span className="font-kana text-2xl sm:text-3xl font-bold opacity-30 select-none">
                            和
                          </span>
                          <Sparkles className="w-4 h-4 absolute top-2 right-2 opacity-40" />
                        </div>
                      </div>

                      {/* ============ BACK: CARD FACE (REVEALED) ============ */}
                      <div
                        className={`absolute inset-0 w-full h-full rounded-2xl [backface-visibility:hidden] [transform:rotateY(180deg)] p-2 sm:p-3 flex flex-col items-center justify-between border-2 transition-all ${
                          isMatched
                            ? 'bg-emerald-500/10 dark:bg-emerald-500/15 border-emerald-500/60 dark:border-emerald-400 shadow-zen-sm'
                            : 'bg-zen-surface-lowest dark:bg-zen-dark-surface border-zen-primary/50 dark:border-zen-dark-primary shadow-zen-md'
                        }`}
                      >
                        {/* Audio / Top indicator */}
                        <div className="w-full flex items-center justify-between text-2xs">
                          {card.type === 'audio' ? (
                            <span className="px-2 py-0.5 rounded-full bg-zen-primary/15 dark:bg-zen-dark-primary/20 text-zen-primary dark:text-zen-dark-primary font-bold">
                              Audio
                            </span>
                          ) : (
                            <span className="text-2xs font-bold text-zen-text-muted/60 dark:text-zen-dark-text-muted/60 uppercase">
                              {card.script || 'Kana'}
                            </span>
                          )}
                          {isMatched && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                        </div>

                        {/* Card Content based on type */}
                        <div className="my-auto flex flex-col items-center justify-center text-center">
                          {card.type === 'illustration' ? (
                            <div className="flex flex-col items-center gap-1">
                              <VocabIllustration 
                                id={card.id} 
                                keyword={card.keyword} 
                                alt={card.english} 
                                className="w-12 h-12 sm:w-16 sm:h-16" 
                                iconClassName="w-6 h-6 sm:w-8 sm:h-8"
                              />
                              <span className="text-2xs sm:text-xs font-bold text-zen-text dark:text-zen-dark-text leading-tight mt-0.5">
                                {lang === 'it' ? card.italian : card.english}
                              </span>
                            </div>
                          ) : card.type === 'audio' ? (
                            <div className="flex flex-col items-center gap-1.5">
                              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-zen-primary dark:bg-zen-dark-primary text-white dark:text-zen-dark-on-primary flex items-center justify-center shadow-zen-sm animate-pulse">
                                <Volume2 className="w-6 h-6" />
                              </div>
                              <span className="text-2xs font-semibold text-zen-text-muted dark:text-zen-dark-text-muted">
                                {t('memory.listenHint') || 'Ascolta'}
                              </span>
                            </div>
                          ) : card.type === 'romaji' ? (
                            <div className="flex flex-col items-center">
                              <span className="font-mono text-xl sm:text-3xl font-extrabold text-zen-primary dark:text-zen-dark-primary uppercase tracking-wider">
                                {card.romaji}
                              </span>
                            </div>
                          ) : (
                            // Kana text card
                            <div className="flex flex-col items-center">
                              <span className="font-kana text-2xl sm:text-4xl font-bold text-zen-primary dark:text-zen-dark-primary leading-tight">
                                {card.kana}
                              </span>
                              <span className="text-2xs sm:text-xs font-mono font-semibold text-zen-text-muted dark:text-zen-dark-text-muted uppercase mt-0.5">
                                {card.romaji}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Bottom Sound hint */}
                        <div className="w-full flex justify-end">
                          <Volume2 className="w-3 h-3 text-zen-text-muted/40" />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ======================= VICTORY MODAL ======================= */}
      {gameState === 'completed' && (
        <div className="max-w-lg mx-auto zen-card p-6 sm:p-8 border-2 border-emerald-500/40 bg-zen-surface-lowest dark:bg-zen-dark-surface text-center space-y-6 animate-fade-in shadow-zen-xl">
          <div className="w-20 h-20 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center border-2 border-emerald-500/30">
            <Trophy className="w-10 h-10" />
          </div>

          <div>
            <h2 className="font-headline text-3xl font-bold text-zen-text dark:text-zen-dark-text">
              {t('memory.victoryTitle') || 'Congratulazioni!'}
            </h2>
            <p className="text-sm text-zen-text-muted dark:text-zen-dark-text-muted mt-1">
              {t('memory.victorySubtitle') || 'Hai completato con successo la sessione di Memory Zen!'}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-zen-surface-container/60 dark:bg-zen-dark-surface-high border border-zen-border/40 dark:border-zen-dark-border">
            <div>
              <div className="text-2xs font-bold uppercase tracking-wider text-zen-text-muted dark:text-zen-dark-text-muted">
                {t('memory.time') || 'Tempo'}
              </div>
              <div className="font-mono text-lg sm:text-xl font-bold text-zen-text dark:text-zen-dark-text mt-0.5">
                {formatTime(timerSeconds)}
              </div>
            </div>

            <div>
              <div className="text-2xs font-bold uppercase tracking-wider text-zen-text-muted dark:text-zen-dark-text-muted">
                {t('memory.moves') || 'Mosse'}
              </div>
              <div className="font-mono text-lg sm:text-xl font-bold text-zen-text dark:text-zen-dark-text mt-0.5">
                {moves}
              </div>
            </div>

            <div>
              <div className="text-2xs font-bold uppercase tracking-wider text-zen-text-muted dark:text-zen-dark-text-muted">
                {t('memory.maxStreak') || 'Max Streak'}
              </div>
              <div className="font-mono text-lg sm:text-xl font-bold text-amber-500 mt-0.5">
                x{maxStreak}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={startNewGame}
              className="flex-1 py-3.5 rounded-xl bg-zen-primary dark:bg-zen-dark-primary hover:bg-zen-primary-dark dark:hover:bg-zen-dark-primary-hover text-white dark:text-zen-dark-on-primary font-bold text-sm flex items-center justify-center gap-2 shadow-zen-sm transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{t('memory.playAgain') || 'Gioca Ancora'}</span>
            </button>
            <button
              type="button"
              onClick={() => setGameState('setup')}
              className="flex-1 py-3.5 rounded-xl bg-zen-surface-container dark:bg-zen-dark-surface-high hover:bg-zen-surface-container-high text-zen-text dark:text-zen-dark-text font-bold text-sm transition-all border border-zen-border/40 dark:border-zen-dark-border"
            >
              <span>{t('memory.changeSettings') || 'Altre Modalità'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
