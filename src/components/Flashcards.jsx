import React, { useMemo, useState } from 'react';
import { Volume2, RotateCw, CheckCircle, XCircle, ArrowRight, ArrowLeft, Layers, BookOpen } from 'lucide-react';
import { HIRAGANA_BASIC, KANA_DAKUTEN, getKanaExample } from '../data/kanaData';
import { VOCABULARY } from '../data/vocabulary';
import VocabIllustration from './common/VocabIllustration';
import { playKanaSound } from '../utils/audio';
import { useLanguage } from '../context/LanguageContext';

export default function Flashcards({ scriptMode, updateStats }) {
  const { lang, t } = useLanguage();
  const [deckType, setDeckType] = useState('kana');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredCount, setMasteredCount] = useState(0);
  const [needPracticeCount, setNeedPracticeCount] = useState(0);
  const [failedItems, setFailedItems] = useState([]);
  const [isReviewOnly, setIsReviewOnly] = useState(false);

  const rawDeck = useMemo(() => {
    if (deckType === 'vocabulary') return VOCABULARY;
    return [...HIRAGANA_BASIC.filter((item) => item.hiragana), ...KANA_DAKUTEN];
  }, [deckType]);

  const fullDeck = useMemo(() => {
    if (isReviewOnly && failedItems.length > 0) return failedItems;
    return rawDeck;
  }, [isReviewOnly, failedItems, rawDeck]);

  const currentItem = fullDeck[currentIndex] || fullDeck[0];
  const isVocabulary = deckType === 'vocabulary';
  const char = currentItem ? (isVocabulary ? currentItem.kana : (scriptMode === 'hiragana' ? currentItem.hiragana : currentItem.katakana)) : '';

  const resetDeck = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setMasteredCount(0);
    setNeedPracticeCount(0);
    setFailedItems([]);
    setIsReviewOnly(false);
  };

  const changeDeck = (nextDeck) => {
    setDeckType(nextDeck);
    resetDeck();
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
      if (currentItem && !failedItems.some(item => (item.id || item.romaji) === (currentItem.id || currentItem.romaji))) {
        setFailedItems(prev => [...prev, currentItem]);
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
  React.useEffect(() => {
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

  const progressPercent = Math.round(((currentIndex + 1) / fullDeck.length) * 100);

  return (
    <div className="mx-auto max-w-2xl space-y-6 pb-20 xl:pb-8">
      <div className="flex rounded-2xl border border-zen-border/40 bg-zen-surface-lowest p-1 dark:border-zen-dark-border dark:bg-zen-dark-surface">
        <button onClick={() => changeDeck('kana')} className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold transition-all ${deckType === 'kana' ? 'bg-zen-primary text-white dark:bg-zen-dark-primary dark:text-zen-dark-on-primary' : 'text-zen-text-muted dark:text-zen-dark-text-muted'}`}>
          <Layers className="h-4 w-4" /> Kana
        </button>
        <button onClick={() => changeDeck('vocabulary')} className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold transition-all ${deckType === 'vocabulary' ? 'bg-zen-primary text-white dark:bg-zen-dark-primary dark:text-zen-dark-on-primary' : 'text-zen-text-muted dark:text-zen-dark-text-muted'}`}>
          <BookOpen className="h-4 w-4" /> {t('nav.vocabulary')} (100)
        </button>
      </div>

      {/* Review mistakes filter pill */}
      {failedItems.length > 0 && (
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-zen-secondary/10 dark:bg-zen-dark-secondary/20 border border-zen-secondary/20 dark:border-zen-dark-secondary/30 animate-fadeIn">
          <div className="flex items-center gap-2 text-xs font-bold text-zen-secondary dark:text-zen-dark-secondary">
            <XCircle className="w-4 h-4" />
            <span>
              {lang === 'it' 
                ? `${failedItems.length} carte da rivedere` 
                : `${failedItems.length} cards need review`}
            </span>
          </div>
          <button
            onClick={() => {
              setIsReviewOnly(!isReviewOnly);
              setCurrentIndex(0);
              setIsFlipped(false);
            }}
            className="px-3 py-1.5 rounded-xl bg-zen-secondary dark:bg-zen-dark-secondary text-white dark:text-zen-dark-bg text-xs font-bold shadow-zen-sm transition-all hover:opacity-90 active:scale-95"
          >
            {isReviewOnly 
              ? (lang === 'it' ? 'Mostra Tutte' : 'Show All')
              : (lang === 'it' ? 'Ripeti Solo Errori' : 'Review Errors Only')}
          </button>
        </div>
      )}

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-headline font-bold text-zen-text dark:text-zen-dark-text">
            {isReviewOnly
              ? (lang === 'it' ? 'Revisione Errori' : 'Mistakes Review')
              : (isVocabulary ? `${t('nav.vocabulary')} Flashcards` : `${t('nav.flashcards')} (${scriptMode.toUpperCase()})`)}
          </span>
          <span className="font-semibold text-zen-text-muted dark:text-zen-dark-text-muted">
            {currentIndex + 1} / {fullDeck.length}
          </span>
        </div>
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-zen-surface-container dark:bg-zen-dark-surface-high">
          <div className="h-full rounded-full bg-zen-primary transition-all duration-300 dark:bg-zen-dark-primary" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>

      <div className="perspective-1000 min-h-[340px] w-full sm:min-h-[400px]">
        <div className="flashcard-hover h-[340px] w-full rounded-3xl sm:h-[400px]">
          <div onClick={handleCardClick} className={`relative h-full w-full cursor-pointer rounded-3xl transition-transform duration-500 transform-style-3d shadow-zen-lg dark:shadow-zen-dark-lg ${isFlipped ? 'rotate-y-180' : ''}`}>
            <div className="absolute inset-0 flex flex-col items-center justify-between border-2 border-zen-border/40 bg-zen-surface-lowest p-8 backface-hidden zen-card dark:border-zen-dark-border dark:bg-zen-dark-surface">
              <div className="flex w-full items-center justify-between text-xs text-zen-text-muted dark:text-zen-dark-text-muted">
                <span className="rounded-full bg-zen-surface-container px-3 py-1 font-semibold dark:bg-zen-dark-surface-high">
                  {t('flashcards.flipHint')}
                </span>
                <button onClick={(event) => { event.stopPropagation(); playKanaSound(char); }} className="rounded-full bg-zen-primary/10 p-2.5 text-zen-primary dark:bg-zen-dark-primary/20 dark:text-zen-dark-primary" title="Play Japanese audio">
                  <Volume2 className="h-5 w-5" />
                </button>
              </div>
              <div className="my-auto text-center">
                <span className="font-kana text-8xl font-bold tracking-tight text-zen-primary dark:text-zen-dark-primary sm:text-9xl">{char}</span>
                {isVocabulary && <div className="mt-4 text-xl font-headline font-bold text-zen-text dark:text-zen-dark-text">{currentItem.romaji}</div>}
              </div>
              <div className="flex items-center gap-1.5 text-xs font-medium text-zen-text-muted dark:text-zen-dark-text-muted">
                <RotateCw className="h-3.5 w-3.5" /> {isVocabulary ? (lang === 'it' ? 'Tocca per scoprire traduzioni' : 'Tap to reveal translations') : (lang === 'it' ? 'Tocca per scoprire Romaji ed Esempio' : 'Tap to reveal Romaji & Example')}
              </div>
            </div>

            <div className="absolute inset-0 flex flex-col items-center justify-between border-2 border-zen-border/60 bg-zen-surface-lowest p-8 backface-hidden rotate-y-180 zen-card dark:border-zen-dark-border dark:bg-zen-dark-surface">
              <div className="flex w-full items-center justify-between text-xs text-zen-text-muted dark:text-zen-dark-text-muted">
                <span className="rounded-full bg-zen-primary/15 px-3 py-1 font-semibold text-zen-primary dark:bg-zen-dark-primary/20 dark:text-zen-dark-primary">
                  {lang === 'it' ? 'Risultato' : 'Answer'}
                </span>
                <button onClick={(event) => { event.stopPropagation(); playKanaSound(char); }} className="rounded-full bg-zen-primary p-2.5 text-white shadow-zen-sm dark:bg-zen-dark-primary dark:text-zen-dark-on-primary">
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
                    <div className="font-kana text-4xl sm:text-5xl font-bold text-zen-primary dark:text-zen-dark-primary">{char}</div>
                    <div className="text-xl sm:text-2xl font-headline font-bold text-zen-text dark:text-zen-dark-text">{lang === 'it' ? currentItem.italian : currentItem.english}</div>
                    <p className="text-sm font-mono text-zen-text-muted dark:text-zen-dark-text-muted uppercase">{currentItem.romaji}</p>
                  </>
                ) : (
                  <>
                    <div className="font-kana text-6xl font-bold text-zen-primary dark:text-zen-dark-primary">{char}</div>
                    <div className="text-3xl font-headline font-bold capitalize text-zen-text dark:text-zen-dark-text">{currentItem.romaji}</div>
                    <p className="mx-auto max-w-xs rounded-xl border border-zen-border/40 bg-white/80 px-4 py-2 text-sm text-zen-text-muted dark:border-zen-dark-border dark:bg-zen-dark-bg/80 dark:text-zen-dark-text-muted">
                      {getKanaExample(currentItem, lang)}
                    </p>
                  </>
                )}
              </div>
              <div className="text-xs font-medium text-zen-text-muted dark:text-zen-dark-text-muted">
                {lang === 'it' ? 'Valuta la tua memorizzazione:' : 'Rate your memory recall below:'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {isFlipped ? (
        <div className="grid grid-cols-2 gap-4">
          <button onClick={() => handleRating(false)} className="flex items-center justify-center gap-2 rounded-2xl border border-zen-border/40 bg-zen-surface-container px-4 py-3.5 text-sm font-bold text-zen-text dark:border-zen-dark-border dark:bg-zen-dark-surface-high dark:text-zen-dark-text hover:opacity-90 transition-opacity">
            <XCircle className="h-5 w-5 text-zen-secondary dark:text-zen-dark-secondary" /> {t('flashcards.forgot')}
          </button>
          <button onClick={() => handleRating(true)} className="flex items-center justify-center gap-2 rounded-2xl bg-zen-primary px-4 py-3.5 text-sm font-bold text-white shadow-zen-md dark:bg-zen-dark-primary dark:text-zen-dark-on-primary hover:opacity-90 transition-opacity">
            <CheckCircle className="h-5 w-5" /> {t('flashcards.knewIt')}
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <button onClick={() => move(-1)} disabled={currentIndex === 0} className="flex items-center gap-1.5 rounded-xl border border-zen-border/60 px-4 py-2.5 text-sm font-semibold text-zen-text disabled:cursor-not-allowed disabled:opacity-40 dark:border-zen-dark-border dark:text-zen-dark-text">
            <ArrowLeft className="h-4 w-4" /> {lang === 'it' ? 'Precedente' : 'Previous'}
          </button>
          <button onClick={resetDeck} className="text-xs font-semibold text-zen-text-muted hover:text-zen-primary dark:text-zen-dark-text-muted dark:hover:text-zen-dark-primary">
            {t('flashcards.resetDeck')}
          </button>
          <button onClick={() => move(1)} disabled={currentIndex === fullDeck.length - 1} className="flex items-center gap-1.5 rounded-xl bg-zen-surface-container px-4 py-2.5 text-sm font-semibold text-zen-primary disabled:cursor-not-allowed disabled:opacity-40 dark:bg-zen-dark-surface-high dark:text-zen-dark-primary">
            {lang === 'it' ? 'Successivo' : 'Next'} <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="flex items-center justify-around rounded-2xl border border-zen-surface-high bg-white p-4 text-xs font-semibold text-zen-text-muted dark:border-zen-dark-border dark:bg-zen-dark-surface dark:text-zen-dark-text-muted">
        <span className="flex items-center gap-1.5 text-zen-primary dark:text-zen-dark-primary">
          <CheckCircle className="h-4 w-4" /> {lang === 'it' ? 'Memorizzati' : 'Mastered'}: {masteredCount}
        </span>
        <span className="flex items-center gap-1.5 text-zen-secondary dark:text-zen-dark-secondary">
          <XCircle className="h-4 w-4" /> {lang === 'it' ? 'Da rivedere' : 'Need Review'}: {needPracticeCount}
        </span>
      </div>
    </div>
  );
}
