import React, { useMemo, useState, useEffect } from 'react';
import { Volume2, RotateCw, CheckCircle, XCircle, ArrowRight, ArrowLeft, Layers, BookOpen, Shuffle } from 'lucide-react';
import { HIRAGANA_BASIC, KANA_DAKUTEN, getKanaExample } from '../data/kanaData';
import { YOON_HIRAGANA_GRID, YOON_KATAKANA_GRID } from '../data/kanaTables';
import { VOCABULARY } from '../data/vocabulary';
import VocabIllustration from './common/VocabIllustration';
import { playKanaSound } from '../utils/audio';
import { useLanguage } from '../context/LanguageContext';

export default function Flashcards({ scriptMode = 'hiragana', updateStats }) {
  const { lang, t } = useLanguage();
  
  // Category selection: 'all', 'basic', 'dakuten', 'yoon', 'vocabulary'
  const [category, setCategory] = useState('all');
  
  // Shuffle state & random seed to trigger reshuffle
  const [isShuffled, setIsShuffled] = useState(false);
  const [shuffleSeed, setShuffleSeed] = useState(0);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredCount, setMasteredCount] = useState(0);
  const [needPracticeCount, setNeedPracticeCount] = useState(0);
  const [failedItems, setFailedItems] = useState([]);
  const [isReviewOnly, setIsReviewOnly] = useState(false);

  // Pre-calculate sub-decks
  const BASIC_ITEMS = useMemo(() => HIRAGANA_BASIC.filter((item) => item.hiragana), []);
  const DAKUTEN_ITEMS = useMemo(() => KANA_DAKUTEN, []);
  const YOON_ITEMS = useMemo(() => {
    const hFlat = YOON_HIRAGANA_GRID.flat();
    const kFlat = YOON_KATAKANA_GRID.flat();
    return hFlat.map((h, i) => ({
      hiragana: h.k,
      katakana: kFlat[i]?.k || h.k,
      romaji: h.r,
      group: 'yoon'
    }));
  }, []);

  // Base unfiltered deck according to category
  const baseDeck = useMemo(() => {
    switch (category) {
      case 'basic':
        return BASIC_ITEMS;
      case 'dakuten':
        return DAKUTEN_ITEMS;
      case 'yoon':
        return YOON_ITEMS;
      case 'vocabulary':
        return VOCABULARY;
      case 'all':
      default:
        return [...BASIC_ITEMS, ...DAKUTEN_ITEMS, ...YOON_ITEMS];
    }
  }, [category, BASIC_ITEMS, DAKUTEN_ITEMS, YOON_ITEMS]);

  // Apply shuffle if enabled
  const processedDeck = useMemo(() => {
    const deck = [...baseDeck];
    if (isShuffled) {
      // Fisher-Yates shuffle
      for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
      }
    }
    return deck;
  }, [baseDeck, isShuffled, shuffleSeed]);

  // Apply mistakes-only review filter if active
  const fullDeck = useMemo(() => {
    if (isReviewOnly && failedItems.length > 0) return failedItems;
    return processedDeck;
  }, [isReviewOnly, failedItems, processedDeck]);

  const currentItem = fullDeck[currentIndex] || fullDeck[0];
  const isVocabulary = category === 'vocabulary';
  
  const char = currentItem
    ? isVocabulary
      ? currentItem.kana
      : scriptMode === 'hiragana'
      ? currentItem.hiragana
      : currentItem.katakana
    : '';

  const resetDeck = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setMasteredCount(0);
    setNeedPracticeCount(0);
    setFailedItems([]);
    setIsReviewOnly(false);
  };

  const changeCategory = (nextCategory) => {
    setCategory(nextCategory);
    resetDeck();
  };

  const handleShuffleToggle = () => {
    setIsShuffled((prev) => !prev);
    setShuffleSeed((prev) => prev + 1);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const handleReshuffle = () => {
    setShuffleSeed((prev) => prev + 1);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const handleCardClick = () => {
    if (!char) return;
    setIsFlipped((flipped) => !flipped);
    playKanaSound(char);
  };

  const handleRating = (gotIt) => {
    if (gotIt) {
      setMasteredCount((count) => count + 1);
    } else {
      setNeedPracticeCount((count) => count + 1);
      if (
        currentItem &&
        !failedItems.some(
          (item) =>
            (item.id || item.romaji || item.hiragana) ===
            (currentItem.id || currentItem.romaji || currentItem.hiragana)
        )
      ) {
        setFailedItems((prev) => [...prev, currentItem]);
      }
    }
    updateStats?.(gotIt);
    setIsFlipped(false);
    if (currentIndex < fullDeck.length - 1) setCurrentIndex((index) => index + 1);
  };

  const move = (direction) => {
    setIsFlipped(false);
    setCurrentIndex((index) => Math.max(0, Math.min(fullDeck.length - 1, index + direction)));
  };

  // Keyboard navigation for Flashcards (Space/Enter to flip, 1/2 or Arrows to rate/move)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        handleCardClick();
      } else if (isFlipped) {
        if (e.key === '1' || e.key === 'ArrowLeft') {
          e.preventDefault();
          handleRating(false);
        } else if (e.key === '2' || e.key === 'ArrowRight') {
          e.preventDefault();
          handleRating(true);
        }
      } else {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          move(-1);
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          move(1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFlipped, currentIndex, fullDeck, char]);

  const progressPercent = fullDeck.length > 0 ? Math.round(((currentIndex + 1) / fullDeck.length) * 100) : 0;

  const categories = [
    { id: 'all', label: t('flashcards.allKana') || (lang === 'it' ? 'Tutti i Kana (104)' : 'All Kana (104)') },
    { id: 'basic', label: t('flashcards.basic') || (lang === 'it' ? 'Base (46)' : 'Basic (46)') },
    { id: 'dakuten', label: t('flashcards.dakuten') || (lang === 'it' ? 'Dakuten (25)' : 'Dakuten (25)') },
    { id: 'yoon', label: t('flashcards.yoon') || (lang === 'it' ? 'Yōon (33)' : 'Yōon (33)') },
    { id: 'vocabulary', label: t('flashcards.vocabulary') || (lang === 'it' ? 'Vocabolario (100)' : 'Vocabulary (100)') }
  ];

  return (
    <div className="mx-auto max-w-2xl space-y-5 pb-20 xl:pb-8">
      {/* Category Pills Header */}
      <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl border border-zen-border/40 bg-zen-surface-lowest dark:border-zen-dark-border dark:bg-zen-dark-surface shadow-zen-sm">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => changeCategory(cat.id)}
            className={`flex-1 min-w-[90px] py-2 px-2.5 rounded-xl text-xs font-bold transition-all text-center cursor-pointer ${
              category === cat.id
                ? 'bg-zen-primary text-white dark:bg-zen-dark-primary dark:text-zen-dark-on-primary shadow-zen-sm'
                : 'text-zen-text-muted hover:text-zen-text dark:text-zen-dark-text-muted dark:hover:text-zen-dark-text'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Toolbar: Shuffle Toggle & Reshuffle & Mistakes review */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 p-3 rounded-2xl bg-zen-surface-container/40 dark:bg-zen-dark-surface-high/50 border border-zen-border/40 dark:border-zen-dark-border">
        {/* Shuffle Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleShuffleToggle}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
              isShuffled
                ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/40 shadow-sm'
                : 'bg-zen-surface-lowest dark:bg-zen-dark-surface text-zen-text-muted dark:text-zen-dark-text-muted border-zen-border/40 dark:border-zen-dark-border hover:text-zen-text'
            }`}
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>
              {isShuffled
                ? t('flashcards.shuffle') || (lang === 'it' ? 'Casuale ON' : 'Shuffle ON')
                : t('flashcards.ordered') || (lang === 'it' ? 'Standard' : 'Ordered')}
            </span>
          </button>

          {isShuffled && (
            <button
              onClick={handleReshuffle}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-zen-surface-lowest dark:bg-zen-dark-surface text-zen-text-muted dark:text-zen-dark-text-muted hover:text-zen-text border border-zen-border/40 dark:border-zen-dark-border text-xs font-semibold transition-all cursor-pointer"
              title={t('flashcards.reshuffle') || (lang === 'it' ? 'Rimescola le carte' : 'Reshuffle cards')}
            >
              <RotateCw className="w-3 h-3" />
              <span className="hidden sm:inline">{t('flashcards.reshuffle') || (lang === 'it' ? 'Rimescola' : 'Reshuffle')}</span>
            </button>
          )}
        </div>

        {/* Failed items review button */}
        {failedItems.length > 0 && (
          <button
            onClick={() => {
              setIsReviewOnly(!isReviewOnly);
              setCurrentIndex(0);
              setIsFlipped(false);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zen-secondary/15 dark:bg-zen-dark-secondary/20 text-zen-secondary dark:text-zen-dark-secondary border border-zen-secondary/30 text-xs font-bold transition-all hover:bg-zen-secondary/25 cursor-pointer"
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>
              {isReviewOnly
                ? t('flashcards.showAll') || (lang === 'it' ? 'Mostra Tutte' : 'Show All')
                : `${failedItems.length} ${t('flashcards.cardsNeedReview') || (lang === 'it' ? 'da rivedere' : 'need review')}`}
            </span>
          </button>
        )}
      </div>

      {/* Progress & Counter */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-headline font-bold text-zen-text dark:text-zen-dark-text">
            {isReviewOnly
              ? t('flashcards.mistakesReview') || (lang === 'it' ? 'Revisione Errori' : 'Mistakes Review')
              : isVocabulary
              ? `${t('nav.vocabulary') || 'Vocabolario'} Flashcards`
              : `${categories.find((c) => c.id === category)?.label || 'Kana'} (${scriptMode.toUpperCase()})`}
          </span>
          <span className="font-semibold text-zen-text-muted dark:text-zen-dark-text-muted font-mono">
            {currentIndex + 1} / {fullDeck.length}
          </span>
        </div>
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-zen-surface-container dark:bg-zen-dark-surface-high">
          <div
            className="h-full rounded-full bg-zen-primary transition-all duration-300 dark:bg-zen-dark-primary"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Flashcard Flip Card Container */}
      <div className="perspective-1000 min-h-[340px] w-full sm:min-h-[400px]">
        <div className="flashcard-hover h-[340px] w-full rounded-3xl sm:h-[400px]">
          <div
            onClick={handleCardClick}
            className={`relative h-full w-full cursor-pointer rounded-3xl transition-transform duration-500 transform-style-3d shadow-zen-lg dark:shadow-zen-dark-lg ${
              isFlipped ? 'rotate-y-180' : ''
            }`}
          >
            {/* FRONT OF CARD */}
            <div className="absolute inset-0 flex flex-col items-center justify-between border-2 border-zen-border/40 bg-zen-surface-lowest p-8 backface-hidden zen-card dark:border-zen-dark-border dark:bg-zen-dark-surface rounded-3xl">
              <div className="flex w-full items-center justify-between text-xs text-zen-text-muted dark:text-zen-dark-text-muted">
                <span className="rounded-full bg-zen-surface-container px-3 py-1 font-semibold dark:bg-zen-dark-surface-high">
                  {t('flashcards.flipHint') || (lang === 'it' ? 'Tocca per girare' : 'Tap to flip')}
                </span>
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    playKanaSound(char);
                  }}
                  className="rounded-full bg-zen-primary/10 p-2.5 text-zen-primary dark:bg-zen-dark-primary/20 dark:text-zen-dark-primary hover:scale-110 transition-transform cursor-pointer"
                  title="Play Japanese audio"
                >
                  <Volume2 className="h-5 w-5" />
                </button>
              </div>

              <div className="my-auto text-center">
                <span
                  className={`font-kana font-bold tracking-tight text-zen-primary dark:text-zen-dark-primary ${
                    char.length > 2 ? 'text-6xl sm:text-7xl' : char.length === 2 ? 'text-7xl sm:text-8xl' : 'text-8xl sm:text-9xl'
                  }`}
                >
                  {char}
                </span>
                {isVocabulary && (
                  <div className="mt-4 text-xl font-headline font-bold text-zen-text dark:text-zen-dark-text">
                    {currentItem.romaji}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1.5 text-xs font-medium text-zen-text-muted dark:text-zen-dark-text-muted">
                <RotateCw className="h-3.5 w-3.5" />{' '}
                {isVocabulary
                  ? lang === 'it'
                    ? 'Tocca per scoprire traduzioni'
                    : 'Tap to reveal translations'
                  : lang === 'it'
                  ? 'Tocca per scoprire Romaji ed Esempio'
                  : 'Tap to reveal Romaji & Example'}
              </div>
            </div>

            {/* BACK OF CARD */}
            <div className="absolute inset-0 flex flex-col items-center justify-between border-2 border-zen-border/60 bg-zen-surface-lowest p-8 backface-hidden rotate-y-180 zen-card dark:border-zen-dark-border dark:bg-zen-dark-surface rounded-3xl">
              <div className="flex w-full items-center justify-between text-xs text-zen-text-muted dark:text-zen-dark-text-muted">
                <span className="rounded-full bg-zen-primary/15 px-3 py-1 font-semibold text-zen-primary dark:bg-zen-dark-primary/20 dark:text-zen-dark-primary">
                  {t('flashcards.revealedAnswer') || (lang === 'it' ? 'Risultato' : 'Answer')}
                </span>
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    playKanaSound(char);
                  }}
                  className="rounded-full bg-zen-primary p-2.5 text-white shadow-zen-sm dark:bg-zen-dark-primary dark:text-zen-dark-on-primary hover:scale-110 transition-transform cursor-pointer"
                >
                  <Volume2 className="h-5 w-5" />
                </button>
              </div>

              <div className="my-auto space-y-3 text-center">
                {isVocabulary ? (
                  <>
                    <VocabIllustration
                      id={currentItem.id}
                      keyword={currentItem.imageKeyword}
                      alt={currentItem.english}
                      className="w-24 h-24 sm:w-28 sm:h-28 mx-auto"
                      iconClassName="w-12 h-12"
                    />
                    <div className="font-kana text-4xl sm:text-5xl font-bold text-zen-primary dark:text-zen-dark-primary">
                      {char}
                    </div>
                    <div className="text-xl sm:text-2xl font-headline font-bold text-zen-text dark:text-zen-dark-text">
                      {lang === 'it' ? currentItem.italian : currentItem.english}
                    </div>
                    <p className="text-sm font-mono text-zen-text-muted dark:text-zen-dark-text-muted uppercase">
                      {currentItem.romaji}
                    </p>
                  </>
                ) : (
                  <>
                    <div className="font-kana text-6xl font-bold text-zen-primary dark:text-zen-dark-primary">
                      {char}
                    </div>
                    <div className="text-3xl font-headline font-bold capitalize text-zen-text dark:text-zen-dark-text">
                      {currentItem.romaji}
                    </div>
                    <p className="mx-auto max-w-xs rounded-xl border border-zen-border/40 bg-white/80 dark:bg-zen-dark-bg/80 px-4 py-2 text-sm text-zen-text-muted dark:border-zen-dark-border dark:text-zen-dark-text-muted font-medium">
                      {getKanaExample(currentItem, lang)}
                    </p>
                  </>
                )}
              </div>

              <div className="text-xs font-medium text-zen-text-muted dark:text-zen-dark-text-muted">
                {t('flashcards.rateRecall') || (lang === 'it' ? 'Valuta la tua memorizzazione:' : 'Rate your memory recall below:')}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Answer Controls or Navigation Buttons */}
      {isFlipped ? (
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleRating(false)}
            className="flex items-center justify-center gap-2 rounded-2xl border border-zen-border/40 bg-zen-surface-container px-4 py-3.5 text-sm font-bold text-zen-text dark:border-zen-dark-border dark:bg-zen-dark-surface-high dark:text-zen-dark-text hover:opacity-90 transition-opacity cursor-pointer"
          >
            <XCircle className="h-5 w-5 text-zen-secondary dark:text-zen-dark-secondary" />{' '}
            {t('flashcards.forgot') || (lang === 'it' ? 'Non lo sapevo' : 'Did not know')}
          </button>
          <button
            onClick={() => handleRating(true)}
            className="flex items-center justify-center gap-2 rounded-2xl bg-zen-primary px-4 py-3.5 text-sm font-bold text-white shadow-zen-md dark:bg-zen-dark-primary dark:text-zen-dark-on-primary hover:opacity-90 transition-opacity cursor-pointer"
          >
            <CheckCircle className="h-5 w-5" />{' '}
            {t('flashcards.knewIt') || (lang === 'it' ? 'Lo sapevo!' : 'Knew it!')}
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <button
            onClick={() => move(-1)}
            disabled={currentIndex === 0}
            className="flex items-center gap-1.5 rounded-xl border border-zen-border/60 px-4 py-2.5 text-sm font-semibold text-zen-text disabled:cursor-not-allowed disabled:opacity-40 dark:border-zen-dark-border dark:text-zen-dark-text cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" /> {t('flashcards.previous') || (lang === 'it' ? 'Precedente' : 'Previous')}
          </button>
          <button
            onClick={resetDeck}
            className="text-xs font-semibold text-zen-text-muted hover:text-zen-primary dark:text-zen-dark-text-muted dark:hover:text-zen-dark-primary cursor-pointer"
          >
            {t('flashcards.resetDeck') || (lang === 'it' ? 'Ricomincia da Capo' : 'Reset Deck')}
          </button>
          <button
            onClick={() => move(1)}
            disabled={currentIndex === fullDeck.length - 1}
            className="flex items-center gap-1.5 rounded-xl bg-zen-surface-container px-4 py-2.5 text-sm font-semibold text-zen-primary disabled:cursor-not-allowed disabled:opacity-40 dark:bg-zen-dark-surface-high dark:text-zen-dark-primary cursor-pointer"
          >
            {t('flashcards.next') || (lang === 'it' ? 'Successivo' : 'Next')}{' '}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Mastered / Need Review Stats Bar */}
      <div className="flex items-center justify-around rounded-2xl border border-zen-surface-high bg-white p-4 text-xs font-semibold text-zen-text-muted dark:border-zen-dark-border dark:bg-zen-dark-surface dark:text-zen-dark-text-muted shadow-2xs">
        <span className="flex items-center gap-1.5 text-zen-primary dark:text-zen-dark-primary font-bold">
          <CheckCircle className="h-4 w-4" />{' '}
          {t('flashcards.mastered') || (lang === 'it' ? 'Memorizzati' : 'Mastered')}: {masteredCount}
        </span>
        <span className="flex items-center gap-1.5 text-zen-secondary dark:text-zen-dark-secondary font-bold">
          <XCircle className="h-4 w-4" />{' '}
          {t('flashcards.needReview') || (lang === 'it' ? 'Da rivedere' : 'Need Review')}: {needPracticeCount}
        </span>
      </div>
    </div>
  );
}
