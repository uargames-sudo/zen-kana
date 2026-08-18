import React, { useMemo, useState } from 'react';
import { BookOpen, Search, Volume2, Shuffle, RotateCw } from 'lucide-react';
import { VOCABULARY } from '../data/vocabulary';
import VocabIllustration from './common/VocabIllustration';
import { playKanaSound } from '../utils/audio';
import { useLanguage } from '../context/LanguageContext';

export default function Vocabulary() {
  const { lang, t } = useLanguage();
  const [scriptFilter, setScriptFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [isShuffled, setIsShuffled] = useState(false);
  const [shuffleSeed, setShuffleSeed] = useState(0);

  const visibleWords = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const filtered = VOCABULARY.filter((word) => (
      (scriptFilter === 'all' || word.script === scriptFilter)
      && (!normalizedQuery || [word.kana, word.romaji, word.english, word.italian]
        .some((value) => value && value.toLowerCase().includes(normalizedQuery)))
    ));

    if (!isShuffled) return filtered;

    const shuffled = [...filtered];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, [query, scriptFilter, isShuffled, shuffleSeed]);

  const filterLabels = {
    all: t('vocabulary.filterAll') || (lang === 'it' ? 'Tutti' : 'All'),
    hiragana: t('vocabulary.filterHiragana') || 'Hiragana',
    katakana: t('vocabulary.filterKatakana') || 'Katakana',
  };

  const handleShuffleToggle = () => {
    setIsShuffled((prev) => !prev);
    setShuffleSeed((prev) => prev + 1);
  };

  const handleReshuffle = () => {
    setShuffleSeed((prev) => prev + 1);
  };

  return (
    <section className="space-y-6 pb-20 xl:pb-8">
      <div className="zen-card p-6 sm:p-8 border border-zen-border/40 dark:border-zen-dark-border bg-zen-surface-lowest dark:bg-zen-dark-surface shadow-zen-sm rounded-3xl">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-zen-primary/10 dark:bg-zen-dark-primary/20 px-3 py-1 text-xs font-semibold text-zen-primary dark:text-zen-dark-primary">
              <BookOpen className="h-4 w-4" /> {t('vocabulary.wordsCount') || (lang === 'it' ? '100 parole giapponesi' : '100 Japanese words')}
            </div>
            <h2 className="mt-3 font-headline text-3xl font-bold text-zen-text dark:text-zen-dark-text">
              {t('vocabulary.title') || (lang === 'it' ? 'Vocabolario' : 'Vocabulary')}
            </h2>
            <p className="mt-1 text-sm text-zen-text-muted dark:text-zen-dark-text-muted">
              {t('vocabulary.subtitle') || (lang === 'it' ? 'Tocca una scheda per ascoltare la pronuncia giapponese.' : 'Tap any card to hear its Japanese pronunciation.')}
            </p>
          </div>
          <label className="relative block w-full md:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zen-text-muted dark:text-zen-dark-text-muted" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t('vocabulary.searchPlaceholder') || (lang === 'it' ? 'Cerca per kana, romaji o significato...' : 'Search kana, romaji or translation...')}
              className="w-full rounded-2xl border border-zen-border/60 bg-zen-surface-lowest py-3 pl-10 pr-3 text-sm text-zen-text outline-none placeholder:text-zen-text-muted focus:border-zen-primary dark:border-zen-dark-border dark:bg-zen-dark-surface-high dark:text-zen-dark-text dark:focus:border-zen-dark-primary shadow-2xs"
            />
          </label>
        </div>

        {/* Filter Pills & Shuffle Controls */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-zen-border/30 dark:border-zen-dark-border/40">
          <div className="flex flex-wrap gap-2">
            {['all', 'hiragana', 'katakana'].map((filter) => (
              <button
                key={filter}
                onClick={() => setScriptFilter(filter)}
                className={`rounded-xl px-4 py-2 text-xs font-bold capitalize transition-colors cursor-pointer ${
                  scriptFilter === filter
                    ? 'bg-zen-primary text-white dark:bg-zen-dark-primary dark:text-zen-dark-on-primary shadow-sm'
                    : 'bg-zen-surface-container text-zen-text-muted hover:text-zen-primary dark:bg-zen-dark-surface-high dark:text-zen-dark-text-muted dark:hover:text-zen-dark-primary'
                }`}
              >
                {filterLabels[filter]}
              </button>
            ))}
          </div>

          {/* Shuffle Toggle & Reshuffle Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleShuffleToggle}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                isShuffled
                  ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/40 shadow-sm'
                  : 'bg-zen-surface-container dark:bg-zen-dark-surface-high text-zen-text-muted dark:text-zen-dark-text-muted border-zen-border/40 dark:border-zen-dark-border hover:text-zen-text'
              }`}
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>
                {isShuffled
                  ? t('vocabulary.shuffle') || (lang === 'it' ? 'Casuale ON' : 'Shuffle ON')
                  : t('vocabulary.ordered') || (lang === 'it' ? 'Standard' : 'Ordered')}
              </span>
            </button>

            {isShuffled && (
              <button
                onClick={handleReshuffle}
                className="flex items-center gap-1 px-3 py-2 rounded-xl bg-zen-surface-container dark:bg-zen-dark-surface-high text-zen-text-muted dark:text-zen-dark-text-muted hover:text-zen-text border border-zen-border/40 dark:border-zen-dark-border text-xs font-semibold transition-all cursor-pointer"
                title={t('vocabulary.reshuffle') || (lang === 'it' ? 'Rimescola le parole' : 'Reshuffle words')}
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t('vocabulary.reshuffle') || (lang === 'it' ? 'Rimescola' : 'Reshuffle')}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <p className="text-sm font-semibold text-zen-text-muted dark:text-zen-dark-text-muted">
        {visibleWords.length} {t('vocabulary.showingWords') || (lang === 'it' ? 'parole trovate' : 'words found')}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {visibleWords.map((word) => {
          return (
            <button 
              key={word.id} 
              onClick={() => playKanaSound(word.kana)} 
              className="zen-card zen-card-active flex flex-col justify-between rounded-2xl border border-zen-border/40 p-4 sm:p-5 text-left dark:border-zen-dark-border bg-zen-surface-lowest dark:bg-zen-dark-surface group relative overflow-hidden transition-all duration-200 hover:shadow-zen-md min-h-[170px] cursor-pointer"
            >
              {/* Top Row: Script badge + Audio volume icon */}
              <div className="flex items-center justify-between w-full mb-2">
                <span className="rounded-full bg-zen-surface-container px-2.5 py-0.5 text-2xs sm:text-xs-plus font-bold capitalize text-zen-text-muted dark:bg-zen-dark-surface-high dark:text-zen-dark-text-muted">
                  {word.script}
                </span>
                <Volume2 className="h-4 w-4 sm:h-5 sm:w-5 text-zen-primary/70 dark:text-zen-dark-primary/70 group-hover:text-zen-primary dark:group-hover:text-zen-dark-primary group-hover:scale-110 transition-all" />
              </div>

              {/* Middle Body: Left Text Info + Right Scalable Large Illustration */}
              <div className="flex items-center justify-between gap-3 sm:gap-4 my-auto w-full">
                {/* Left Info: Kana + Romaji + Translation */}
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="font-kana text-3xl sm:text-4xl font-bold text-zen-primary dark:text-zen-dark-primary group-hover:scale-102 transition-transform leading-tight truncate">
                    {word.kana}
                  </div>
                  <div className="text-sm font-bold font-headline text-zen-text dark:text-zen-dark-text tracking-wide">
                    {word.romaji}
                  </div>
                  <div className="text-xs text-zen-text-muted dark:text-zen-dark-text-muted font-medium truncate">
                    {lang === 'it' ? `${word.italian} • ${word.english}` : `${word.english} • ${word.italian}`}
                  </div>
                </div>

                {/* Right: Generous Scalable Illustration Box */}
                <div className="shrink-0 flex items-center justify-center">
                  <VocabIllustration 
                    id={word.id} 
                    keyword={word.imageKeyword} 
                    alt={word.english} 
                    className="w-24 h-24 xs:w-28 xs:h-28 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-2xl bg-zen-surface-container/30 dark:bg-zen-dark-surface-high/30 p-1.5 group-hover:scale-105 transition-transform duration-300 shadow-sm" 
                    iconClassName="w-12 h-12 sm:w-14 sm:h-14" 
                  />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
