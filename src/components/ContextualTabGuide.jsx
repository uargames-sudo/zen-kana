import React, { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp, Sparkles, X, Info } from 'lucide-react';
import { TAB_GUIDES } from '../data/tabGuideData';
import { useLanguage } from '../context/LanguageContext';

/**
 * Contextual Tab Mini-Guide
 * Displays focused educational explanations for the active table or keyboard category.
 */
export default function ContextualTabGuide({ 
  category = 'basic', 
  scriptMode = 'hiragana',
  defaultExpanded = false,
  variant = 'accordion' // 'accordion' | 'modal' | 'banner'
}) {
  const { lang } = useLanguage();
  const [isOpen, setIsOpen] = useState(defaultExpanded);

  const guideCategory = TAB_GUIDES[category] || TAB_GUIDES.basic;
  const guide = guideCategory[scriptMode] || guideCategory.hiragana;

  const title = lang === 'it' ? guide.titleIt : guide.titleEn;
  const subtitle = lang === 'it' ? guide.subtitleIt : guide.subtitleEn;
  const points = lang === 'it' ? guide.pointsIt : guide.pointsEn;
  const tip = lang === 'it' ? guide.tipIt : guide.tipEn;

  if (variant === 'banner') {
    return (
      <div className="zen-card p-4 sm:p-5 rounded-2xl bg-zen-surface-container/40 dark:bg-zen-dark-surface-high/60 border border-zen-border/60 dark:border-zen-dark-border shadow-zen-sm space-y-3 animate-fade-in">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-xl bg-zen-primary/10 dark:bg-zen-dark-primary/20 text-zen-primary dark:text-zen-dark-primary shrink-0">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <span className="text-3xs font-bold uppercase tracking-wider text-zen-primary dark:text-zen-dark-primary font-mono">
                {guideCategory.badge}
              </span>
              <h4 className="text-sm font-bold font-headline text-zen-text dark:text-zen-dark-text leading-tight">
                {title}
              </h4>
            </div>
          </div>
        </div>

        <p className="text-xs text-zen-text/90 dark:text-zen-dark-text/90 font-medium leading-relaxed">
          {subtitle}
        </p>

        <div className="space-y-1.5 pt-1">
          {points.map((pt, idx) => (
            <div 
              key={idx}
              className="text-xs text-zen-text dark:text-zen-dark-text flex items-start gap-2 bg-zen-surface-lowest/70 dark:bg-zen-dark-surface/70 p-2.5 rounded-xl border border-zen-border/30 dark:border-zen-dark-border/40"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-zen-primary dark:bg-zen-dark-primary mt-1.5 shrink-0" />
              <span className="leading-snug">{pt}</span>
            </div>
          ))}
        </div>

        {tip && (
          <div className="text-2xs sm:text-xs text-zen-text-muted dark:text-zen-dark-text-muted p-2.5 rounded-xl bg-zen-primary/10 dark:bg-zen-dark-primary/15 border border-zen-primary/20 leading-relaxed font-medium">
            {tip}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="zen-card overflow-hidden rounded-2xl border border-zen-border/60 dark:border-zen-dark-border bg-zen-surface-lowest dark:bg-zen-dark-surface shadow-zen-sm transition-all">
      {/* Header / Accordion trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-3.5 sm:p-4 flex items-center justify-between gap-3 text-left hover:bg-zen-surface-container/30 dark:hover:bg-zen-dark-surface-high/30 transition-colors cursor-pointer"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-1.5 rounded-xl bg-zen-primary/10 dark:bg-zen-dark-primary/20 text-zen-primary dark:text-zen-dark-primary shrink-0">
            <Info className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-3xs font-bold uppercase tracking-wider text-zen-primary dark:text-zen-dark-primary font-mono px-2 py-0.5 rounded-md bg-zen-primary/10 dark:bg-zen-dark-primary/20">
                {guideCategory.badge}
              </span>
              <span className="text-3xs font-semibold text-zen-text-muted dark:text-zen-dark-text-muted uppercase">
                {lang === 'it' ? 'Miniguida' : 'Quick Guide'}
              </span>
            </div>
            <h4 className="text-xs sm:text-sm font-bold font-headline text-zen-text dark:text-zen-dark-text truncate mt-0.5">
              {title}
            </h4>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-2xs font-bold text-zen-primary dark:text-zen-dark-primary hidden sm:inline">
            {isOpen ? (lang === 'it' ? 'Nascondi' : 'Hide') : (lang === 'it' ? 'Leggi spiegazione' : 'Read guide')}
          </span>
          <div className="p-1 rounded-lg bg-zen-surface-container dark:bg-zen-dark-surface-high text-zen-text-muted">
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </button>

      {/* Expandable Content Body */}
      {isOpen && (
        <div className="p-4 sm:p-5 border-t border-zen-border/40 dark:border-zen-dark-border bg-zen-surface-container/20 dark:bg-zen-dark-surface-high/30 space-y-3.5 animate-fadeIn">
          <p className="text-xs sm:text-sm text-zen-text/90 dark:text-zen-dark-text/90 font-medium leading-relaxed">
            {subtitle}
          </p>

          <div className="grid gap-2 sm:grid-cols-1">
            {points.map((pt, idx) => (
              <div 
                key={idx}
                className="text-xs text-zen-text dark:text-zen-dark-text flex items-start gap-2.5 bg-zen-surface-lowest dark:bg-zen-dark-surface p-3 rounded-xl border border-zen-border/40 dark:border-zen-dark-border shadow-2xs"
              >
                <span className="w-2 h-2 rounded-full bg-zen-primary dark:bg-zen-dark-primary mt-1 shrink-0" />
                <span className="leading-relaxed font-medium">{pt}</span>
              </div>
            ))}
          </div>

          {tip && (
            <div className="text-2xs sm:text-xs text-zen-text dark:text-zen-dark-text p-3 rounded-xl bg-zen-primary/10 dark:bg-zen-dark-primary/20 border border-zen-primary/20 leading-relaxed font-medium">
              {tip}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
