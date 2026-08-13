import React, { useMemo, useState } from 'react';
import { BookOpen, Search, Volume2 } from 'lucide-react';
import { VOCABULARY, getVocabularyIcon } from '../data/vocabulary';
import { playKanaSound } from '../utils/audio';

export default function Vocabulary() {
  const [scriptFilter, setScriptFilter] = useState('all');
  const [query, setQuery] = useState('');

  const visibleWords = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return VOCABULARY.filter((word) => (
      (scriptFilter === 'all' || word.script === scriptFilter)
      && (!normalizedQuery || [word.kana, word.romaji, word.english, word.italian]
        .some((value) => value && value.toLowerCase().includes(normalizedQuery)))
    ));
  }, [query, scriptFilter]);

  return (
    <section className="space-y-6 pb-20 lg:pb-8">
      <div className="zen-card p-6 sm:p-8 border border-zen-surface-high dark:border-zen-dark-border bg-gradient-to-br from-zen-surface-lowest via-zen-surface-container/50 to-zen-surface-high/60 dark:from-zen-dark-surface dark:via-zen-dark-surface-high/40 dark:to-zen-dark-bg">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-zen-primary/10 dark:bg-zen-dark-primary/20 px-3 py-1 text-xs font-semibold text-zen-primary dark:text-zen-dark-primary">
              <BookOpen className="h-4 w-4" /> 100 Japanese words
            </div>
            <h2 className="mt-3 font-headline text-3xl font-bold text-zen-text dark:text-zen-dark-text">Vocabulary</h2>
            <p className="mt-1 text-sm text-zen-text-muted dark:text-zen-dark-text-muted">Tap any card to hear its Japanese pronunciation.</p>
          </div>
          <label className="relative block w-full md:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zen-text-muted dark:text-zen-dark-text-muted" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search kana or translation" className="w-full rounded-xl border border-zen-border/60 bg-white py-3 pl-10 pr-3 text-sm text-zen-text outline-none placeholder:text-zen-text-muted focus:border-zen-primary dark:border-zen-dark-border dark:bg-zen-dark-surface dark:text-zen-dark-text dark:focus:border-zen-dark-primary" />
          </label>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {['all', 'hiragana', 'katakana'].map((filter) => (
            <button key={filter} onClick={() => setScriptFilter(filter)} className={`rounded-full px-4 py-2 text-xs font-bold capitalize transition-colors ${scriptFilter === filter ? 'bg-zen-primary text-white dark:bg-zen-dark-primary dark:text-zen-dark-on-primary' : 'bg-zen-surface-container text-zen-text-muted hover:text-zen-primary dark:bg-zen-dark-surface-high dark:text-zen-dark-text-muted dark:hover:text-zen-dark-primary'}`}>
              {filter}
            </button>
          ))}
        </div>
      </div>

      <p className="text-sm font-semibold text-zen-text-muted dark:text-zen-dark-text-muted">{visibleWords.length} words</p>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {visibleWords.map((word) => {
          const Icon = getVocabularyIcon(word.imageKeyword);
          return (
            <button key={word.id} onClick={() => playKanaSound(word.kana)} className="zen-card zen-card-active flex min-h-44 flex-col rounded-2xl border border-zen-surface-high p-5 text-left dark:border-zen-dark-border">
              <div className="flex items-start justify-between">
                <span className="rounded-full bg-zen-surface-container px-2.5 py-1 text-[11px] font-bold capitalize text-zen-text-muted dark:bg-zen-dark-surface-high dark:text-zen-dark-text-muted">{word.script}</span>
                <span className="rounded-xl bg-zen-primary/10 p-2 text-zen-primary dark:bg-zen-dark-primary/20 dark:text-zen-dark-primary"><Icon className="h-6 w-6" /></span>
              </div>
              <div className="mt-auto flex items-end justify-between gap-3">
                <div>
                  <div className="font-kana text-4xl font-bold text-zen-primary dark:text-zen-dark-primary">{word.kana}</div>
                  <div className="mt-1 text-sm font-semibold text-zen-text dark:text-zen-dark-text">{word.romaji}</div>
                  <div className="mt-1 text-xs text-zen-text-muted dark:text-zen-dark-text-muted">{word.italian} <span className="mx-1">•</span> {word.english}</div>
                </div>
                <Volume2 className="h-5 w-5 shrink-0 text-zen-primary dark:text-zen-dark-primary" />
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
