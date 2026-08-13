import React, { useMemo, useState } from 'react';
import { Volume2, RotateCw, CheckCircle, XCircle, ArrowRight, ArrowLeft, Layers, BookOpen } from 'lucide-react';
import { HIRAGANA_BASIC, KANA_DAKUTEN } from '../data/kanaData';
import { VOCABULARY, getVocabularyIcon } from '../data/vocabulary';
import { playKanaSound } from '../utils/audio';

export default function Flashcards({ scriptMode, updateStats }) {
  const [deckType, setDeckType] = useState('kana');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredCount, setMasteredCount] = useState(0);
  const [needPracticeCount, setNeedPracticeCount] = useState(0);

  const fullDeck = useMemo(() => {
    if (deckType === 'vocabulary') return VOCABULARY;
    return [...HIRAGANA_BASIC.filter((item) => item.hiragana), ...KANA_DAKUTEN];
  }, [deckType]);
  const currentItem = fullDeck[currentIndex];
  const isVocabulary = deckType === 'vocabulary';
  const char = isVocabulary ? currentItem.kana : (scriptMode === 'hiragana' ? currentItem.hiragana : currentItem.katakana);
  const Icon = isVocabulary ? getVocabularyIcon(currentItem.imageKeyword) : null;

  const resetDeck = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setMasteredCount(0);
    setNeedPracticeCount(0);
  };
  const changeDeck = (nextDeck) => {
    setDeckType(nextDeck);
    resetDeck();
  };
  const handleCardClick = () => {
    setIsFlipped((flipped) => !flipped);
    playKanaSound(char);
  };
  const handleRating = (gotIt) => {
    if (gotIt) setMasteredCount((count) => count + 1);
    else setNeedPracticeCount((count) => count + 1);
    updateStats?.(gotIt);
    setIsFlipped(false);
    if (currentIndex < fullDeck.length - 1) setCurrentIndex((index) => index + 1);
  };
  const move = (direction) => {
    setIsFlipped(false);
    setCurrentIndex((index) => Math.max(0, Math.min(fullDeck.length - 1, index + direction)));
  };
  const progressPercent = Math.round(((currentIndex + 1) / fullDeck.length) * 100);

  return (
    <div className="mx-auto max-w-2xl space-y-6 pb-20 lg:pb-8">
      <div className="flex rounded-2xl border border-zen-surface-high bg-white p-1 dark:border-zen-dark-border dark:bg-zen-dark-surface">
        <button onClick={() => changeDeck('kana')} className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold ${deckType === 'kana' ? 'bg-zen-primary text-white dark:bg-zen-dark-primary dark:text-zen-dark-on-primary' : 'text-zen-text-muted dark:text-zen-dark-text-muted'}`}><Layers className="h-4 w-4" /> Kana</button>
        <button onClick={() => changeDeck('vocabulary')} className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold ${deckType === 'vocabulary' ? 'bg-zen-primary text-white dark:bg-zen-dark-primary dark:text-zen-dark-on-primary' : 'text-zen-text-muted dark:text-zen-dark-text-muted'}`}><BookOpen className="h-4 w-4" /> Vocabulary (100)</button>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm"><span className="font-headline font-bold text-zen-text dark:text-zen-dark-text">{isVocabulary ? 'Vocabulary Flashcards' : `Flashcard Deck (${scriptMode.toUpperCase()})`}</span><span className="font-semibold text-zen-text-muted dark:text-zen-dark-text-muted">{currentIndex + 1} of {fullDeck.length}</span></div>
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-zen-surface-container dark:bg-zen-dark-surface-high"><div className="h-full rounded-full bg-zen-primary transition-all duration-300 dark:bg-zen-dark-primary" style={{ width: `${progressPercent}%` }} /></div>
      </div>

      <div className="perspective-1000 min-h-[340px] w-full sm:min-h-[400px]">
        <div className="flashcard-hover h-[340px] w-full rounded-3xl sm:h-[400px]">
        <div onClick={handleCardClick} className={`relative h-full w-full cursor-pointer rounded-3xl transition-transform duration-500 transform-style-3d shadow-zen-lg dark:shadow-zen-dark-lg ${isFlipped ? 'rotate-y-180' : ''}`}>
          <div className="absolute inset-0 flex flex-col items-center justify-between border-2 border-zen-surface-high bg-white p-8 backface-hidden zen-card dark:border-zen-dark-border dark:bg-zen-dark-surface-high">
            <div className="flex w-full items-center justify-between text-xs text-zen-text-muted dark:text-zen-dark-text-muted"><span className="rounded-full bg-zen-surface-container px-3 py-1 font-semibold dark:bg-zen-dark-surface">Tap card to flip & listen</span><button onClick={(event) => { event.stopPropagation(); playKanaSound(char); }} className="rounded-full bg-zen-primary/10 p-2.5 text-zen-primary dark:bg-zen-dark-primary/20 dark:text-zen-dark-primary" title="Play Japanese audio"><Volume2 className="h-5 w-5" /></button></div>
            <div className="my-auto text-center"><span className="font-kana text-8xl font-bold tracking-tight text-zen-primary dark:text-white sm:text-9xl">{char}</span>{isVocabulary && <div className="mt-4 text-xl font-headline font-bold text-zen-text dark:text-zen-dark-text">{currentItem.romaji}</div>}</div>
            <div className="flex items-center gap-1.5 text-xs font-medium text-zen-text-muted dark:text-zen-dark-text-muted"><RotateCw className="h-3.5 w-3.5" /> {isVocabulary ? 'Tap to reveal icon & translations' : 'Tap to reveal Romaji & Example'}</div>
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-between border-2 border-zen-primary-light bg-gradient-to-b from-zen-surface-lowest to-zen-surface-container/30 p-8 backface-hidden rotate-y-180 zen-card dark:border-zen-dark-primary/60 dark:from-zen-dark-surface-high dark:to-zen-dark-surface">
            <div className="flex w-full items-center justify-between text-xs text-zen-text-muted dark:text-zen-dark-text-muted"><span className="rounded-full bg-zen-primary/10 px-3 py-1 font-semibold text-zen-primary dark:bg-zen-dark-primary/20 dark:text-zen-dark-primary">Answer Revealed</span><button onClick={(event) => { event.stopPropagation(); playKanaSound(char); }} className="rounded-full bg-zen-primary p-2.5 text-white shadow-zen-sm dark:bg-zen-dark-primary dark:text-zen-dark-on-primary"><Volume2 className="h-5 w-5" /></button></div>
            <div className="my-auto space-y-3 text-center">{isVocabulary ? <><div className="mx-auto w-fit rounded-3xl bg-zen-primary/10 p-5 text-zen-primary dark:bg-zen-dark-primary/20 dark:text-zen-dark-primary"><Icon className="h-14 w-14" /></div><div className="font-kana text-5xl font-bold text-zen-primary dark:text-zen-dark-primary">{char}</div><div className="text-2xl font-headline font-bold text-zen-text dark:text-zen-dark-text">{currentItem.italian}</div><p className="text-sm text-zen-text-muted dark:text-zen-dark-text-muted">{currentItem.english} · {currentItem.romaji}</p></> : <><div className="font-kana text-6xl font-bold text-zen-primary dark:text-zen-dark-primary">{char}</div><div className="text-3xl font-headline font-bold capitalize text-zen-text dark:text-zen-dark-text">{currentItem.romaji}</div><p className="mx-auto max-w-xs rounded-xl border border-zen-border/40 bg-white/80 px-4 py-2 text-sm text-zen-text-muted dark:border-zen-dark-border dark:bg-zen-dark-bg/80 dark:text-zen-dark-text-muted">{currentItem.example}</p></>}</div>
            <div className="text-xs font-medium text-zen-text-muted dark:text-zen-dark-text-muted">Rate your memory recall below</div>
          </div>
        </div>
        </div>
      </div>

      {isFlipped ? <div className="grid grid-cols-2 gap-4"><button onClick={() => handleRating(false)} className="flex items-center justify-center gap-2 rounded-2xl border border-zen-border/40 bg-zen-surface-container px-4 py-3.5 text-sm font-bold text-zen-text dark:border-zen-dark-border dark:bg-zen-dark-surface-high dark:text-zen-dark-text"><XCircle className="h-5 w-5 text-zen-secondary dark:text-zen-dark-secondary" /> Ancora</button><button onClick={() => handleRating(true)} className="flex items-center justify-center gap-2 rounded-2xl bg-zen-primary px-4 py-3.5 text-sm font-bold text-white shadow-zen-md dark:bg-zen-dark-primary dark:text-zen-dark-on-primary"><CheckCircle className="h-5 w-5" /> Conosciuto</button></div> : <div className="flex items-center justify-between"><button onClick={() => move(-1)} disabled={currentIndex === 0} className="flex items-center gap-1.5 rounded-xl border border-zen-border/60 px-4 py-2.5 text-sm font-semibold text-zen-text disabled:cursor-not-allowed disabled:opacity-40 dark:border-zen-dark-border dark:text-zen-dark-text"><ArrowLeft className="h-4 w-4" /> Previous</button><button onClick={resetDeck} className="text-xs font-semibold text-zen-text-muted hover:text-zen-primary dark:text-zen-dark-text-muted dark:hover:text-zen-dark-primary">Restart Deck</button><button onClick={() => move(1)} disabled={currentIndex === fullDeck.length - 1} className="flex items-center gap-1.5 rounded-xl bg-zen-surface-container px-4 py-2.5 text-sm font-semibold text-zen-primary disabled:cursor-not-allowed disabled:opacity-40 dark:bg-zen-dark-surface-high dark:text-zen-dark-primary">Next <ArrowRight className="h-4 w-4" /></button></div>}

      <div className="flex items-center justify-around rounded-2xl border border-zen-surface-high bg-white p-4 text-xs font-semibold text-zen-text-muted dark:border-zen-dark-border dark:bg-zen-dark-surface dark:text-zen-dark-text-muted"><span className="flex items-center gap-1.5 text-zen-primary dark:text-zen-dark-primary"><CheckCircle className="h-4 w-4" /> Conosciuto: {masteredCount}</span><span className="flex items-center gap-1.5 text-zen-secondary dark:text-zen-dark-secondary"><XCircle className="h-4 w-4" /> Ancora: {needPracticeCount}</span></div>
    </div>
  );
}
