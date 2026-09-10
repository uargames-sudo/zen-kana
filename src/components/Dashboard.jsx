import React, { useState } from 'react';
import { Layers, PenTool, Volume2, Award, Grid, Flame, CheckCircle, TrendingUp, BookOpen, ListChecks, Sparkles, Gamepad2, Info, X, Eye, Keyboard, Headphones, Compass } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Dashboard({ setActiveTab, scriptMode, stats, resetStats }) {
  const { lang, t } = useLanguage();
  const [showMethodModal, setShowMethodModal] = useState(false);

  const quickActionCards = [
    {
      id: 'flashcards',
      title: t('nav.flashcards'),
      description: t('nav.flashcardsDesc'),
      icon: Layers,
      color: 'bg-zen-primary dark:bg-zen-dark-primary text-white dark:text-zen-dark-on-primary',
    },
    {
      id: 'activeStudy',
      title: t('nav.activeStudy'),
      description: t('nav.activeStudyDesc'),
      icon: Sparkles,
      color: 'bg-zen-primary dark:bg-zen-dark-primary text-white dark:text-zen-dark-on-primary',
    },
    {
      id: 'games',
      title: t('nav.games'),
      description: t('nav.gamesDesc'),
      icon: Gamepad2,
      color: 'bg-zen-primary dark:bg-zen-dark-primary text-white dark:text-zen-dark-on-primary',
    },
    {
      id: 'writing',
      title: t('nav.writing'),
      description: t('nav.writingDesc'),
      icon: PenTool,
      color: 'bg-zen-primary dark:bg-zen-dark-primary text-white dark:text-zen-dark-on-primary',
    },
    {
      id: 'vocabulary',
      title: t('nav.vocabulary'),
      description: t('nav.vocabularyDesc'),
      icon: BookOpen,
      color: 'bg-zen-primary dark:bg-zen-dark-primary text-white dark:text-zen-dark-on-primary',
    },
    {
      id: 'lessons',
      title: t('nav.lessons'),
      description: t('nav.lessonsDesc'),
      icon: ListChecks,
      color: 'bg-zen-primary dark:bg-zen-dark-primary text-white dark:text-zen-dark-on-primary',
    },
    {
      id: 'listening',
      title: t('nav.listening'),
      description: t('nav.listeningDesc'),
      icon: Volume2,
      color: 'bg-zen-primary dark:bg-zen-dark-primary text-white dark:text-zen-dark-on-primary',
    },
    {
      id: 'table',
      title: t('nav.table'),
      description: t('nav.tableDesc'),
      icon: Grid,
      color: 'bg-zen-primary dark:bg-zen-dark-primary text-white dark:text-zen-dark-on-primary',
    },
    {
      id: 'quiz',
      title: t('nav.quiz'),
      description: t('nav.quizDesc'),
      icon: Award,
      color: 'bg-zen-primary dark:bg-zen-dark-primary text-white dark:text-zen-dark-on-primary',
    }
  ];

  const handleReset = () => {
    if (window.confirm(t('dashboard.resetConfirm'))) {
      resetStats();
    }
  };

  return (
    <div className="space-y-8 pb-20 xl:pb-8">
      {/* Hero Zen Banner - Option 2 (Hanko Seal + Vertical Separator + Right Content) */}
      <div className="zen-card p-6 sm:p-7 bg-zen-surface-lowest dark:bg-zen-dark-surface border border-zen-border/40 dark:border-zen-dark-border">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6">
          {/* Traditional Hanko Seal / Stamp on Left */}
          <div className="flex sm:flex-col items-center justify-center gap-2 p-3 sm:py-3.5 sm:px-4 border-2 border-zen-primary dark:border-zen-dark-primary bg-zen-primary/5 dark:bg-zen-dark-primary/10 flex-shrink-0 select-none">
            <span className="font-kana font-bold text-2xl sm:text-3xl text-zen-primary dark:text-zen-dark-primary leading-none">
              禅
            </span>
            <span className="text-3xs uppercase tracking-widest font-bold text-zen-primary dark:text-zen-dark-primary border-t sm:border-t border-zen-primary/40 dark:border-zen-dark-primary/40 pt-1">
              DOJO
            </span>
          </div>

          {/* Vertical Separator on sm+ screens */}
          <div className="hidden sm:block w-px self-stretch bg-zen-border/60 dark:bg-zen-dark-border flex-shrink-0" />

          {/* Main Content + Button */}
          <div className="flex-1 min-w-0 space-y-3">
            <div className="space-y-1.5">
              <h2 className="text-2xl sm:text-3xl font-headline font-bold text-zen-text dark:text-zen-dark-text leading-tight">
                {t('dashboard.welcome')}
              </h2>
              <p className="text-zen-text-muted dark:text-zen-dark-text-muted text-sm sm:text-base leading-relaxed max-w-2xl">
                {t('dashboard.welcomeSubtitle')}
              </p>
            </div>

            <div>
              <button
                onClick={() => setShowMethodModal(true)}
                className="px-5 py-2.5 bg-zen-primary dark:bg-zen-dark-primary hover:bg-zen-primary-dark dark:hover:bg-zen-dark-primary-hover text-white dark:text-zen-dark-on-primary font-bold text-sm shadow-zen-sm transition-all inline-flex items-center justify-center gap-2 border border-transparent"
              >
                <Info className="w-4 h-4" /> {t('dashboard.learnMore')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Progress & Stats Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-headline font-bold text-zen-text dark:text-zen-dark-text">{t('dashboard.statsOverview')}</h3>
          <button 
            onClick={handleReset}
            aria-label={t('dashboard.resetStats')}
            className="text-xs font-bold text-zen-text-muted dark:text-zen-dark-text-muted hover:text-rose-500 dark:hover:text-rose-400 transition-colors px-3 py-1.5 border border-zen-border/40 dark:border-zen-dark-border min-h-[36px] flex items-center bg-zen-surface-lowest dark:bg-zen-dark-surface"
          >
            {t('dashboard.resetStats')}
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          <div className="zen-card p-4 border border-zen-border/40 dark:border-zen-dark-border flex items-center gap-3.5 bg-zen-surface-lowest dark:bg-zen-dark-surface">
            <div className="w-11 h-11 bg-zen-primary/15 dark:bg-zen-dark-primary/20 text-zen-primary dark:text-zen-dark-primary flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xl font-bold text-zen-text dark:text-zen-dark-text leading-tight">{stats?.reviewedCount ?? 0} / 46</div>
              <div className="text-xs text-zen-text-muted dark:text-zen-dark-text-muted mt-0.5">{t('dashboard.reviewedKana')}</div>
            </div>
          </div>

          <div className="zen-card p-4 border border-zen-border/40 dark:border-zen-dark-border flex items-center gap-3.5 bg-zen-surface-lowest dark:bg-zen-dark-surface">
            <div className="w-11 h-11 bg-zen-primary/15 dark:bg-zen-dark-primary/20 text-zen-primary dark:text-zen-dark-primary flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xl font-bold text-zen-text dark:text-zen-dark-text leading-tight">{stats?.accuracy ?? 0}%</div>
              <div className="text-xs text-zen-text-muted dark:text-zen-dark-text-muted mt-0.5">{t('dashboard.accuracy')}</div>
            </div>
          </div>

          <div className="zen-card p-4 border border-zen-border/40 dark:border-zen-border/40 dark:border-zen-dark-border flex items-center gap-3.5 bg-zen-surface-lowest dark:bg-zen-dark-surface">
            <div className="w-11 h-11 bg-zen-primary/15 dark:bg-zen-dark-primary/20 text-zen-primary dark:text-zen-dark-primary flex items-center justify-center flex-shrink-0">
              <Flame className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xl font-bold text-zen-text dark:text-zen-dark-text leading-tight">{stats?.totalAttempts ?? 0}</div>
              <div className="text-xs text-zen-text-muted dark:text-zen-dark-text-muted mt-0.5">{t('dashboard.totalAttempts')}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Grid: strictly 3x3 on md+ screens, 1 col on mobile */}
      <div>
        <h3 className="text-xl font-headline font-bold text-zen-text dark:text-zen-dark-text mb-4 flex items-center gap-2">
          {t('dashboard.quickActions')}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {quickActionCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                onClick={() => setActiveTab(card.id)}
                className="zen-card p-4 border border-zen-border/40 dark:border-zen-dark-border bg-zen-surface-lowest dark:bg-zen-dark-surface hover:border-zen-primary dark:hover:border-zen-dark-primary cursor-pointer group flex items-start gap-3.5 transition-all"
              >
                <div className={`w-11 h-11 ${card.color} flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-headline font-bold text-base text-zen-text dark:text-zen-dark-text group-hover:text-zen-primary dark:group-hover:text-zen-dark-primary transition-colors truncate">
                    {card.title}
                  </h4>
                  <p className="text-xs text-zen-text-muted dark:text-zen-dark-text-muted mt-0.5 line-clamp-2 leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pop-up Modal: Metodologie di Apprendimento */}
      {showMethodModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="zen-card max-w-2xl w-full max-h-[90vh] overflow-y-auto bg-zen-surface-lowest dark:bg-zen-dark-surface border border-zen-border dark:border-zen-dark-border p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-zen-border/40 dark:border-zen-dark-border pb-4">
              <div>
                <h3 className="text-2xl font-headline font-bold text-zen-text dark:text-zen-dark-text">
                  {t('dashboard.methodModalTitle')}
                </h3>
                <p className="text-sm text-zen-text-muted dark:text-zen-dark-text-muted mt-1">
                  {t('dashboard.methodModalSubtitle')}
                </p>
              </div>
              <button
                onClick={() => setShowMethodModal(false)}
                className="p-2 text-zen-text-muted hover:text-zen-text dark:text-zen-dark-text-muted dark:hover:text-zen-dark-text hover:bg-zen-surface-container dark:hover:bg-zen-dark-surface-high transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Method 1: Visiva */}
              <div className="p-4 sm:p-5 border border-zen-border/40 dark:border-zen-dark-border bg-zen-surface-container/30 dark:bg-zen-dark-surface-high/30 space-y-2.5">
                <div className="flex items-center gap-3 text-zen-primary dark:text-zen-dark-primary font-bold text-base">
                  <div className="w-9 h-9 bg-zen-primary/15 dark:bg-zen-dark-primary/20 flex items-center justify-center flex-shrink-0">
                    <Eye className="w-5 h-5" />
                  </div>
                  <span>{t('dashboard.methodVisualTitle')}</span>
                </div>
                <p className="text-sm text-zen-text-muted dark:text-zen-dark-text-muted leading-relaxed">
                  {t('dashboard.methodVisualDesc')}
                </p>
              </div>

              {/* Method 2: Attiva */}
              <div className="p-4 sm:p-5 border border-zen-border/40 dark:border-zen-dark-border bg-zen-surface-container/30 dark:bg-zen-dark-surface-high/30 space-y-2.5">
                <div className="flex items-center gap-3 text-zen-primary dark:text-zen-dark-primary font-bold text-base">
                  <div className="w-9 h-9 bg-zen-primary/15 dark:bg-zen-dark-primary/20 flex items-center justify-center flex-shrink-0">
                    <Keyboard className="w-5 h-5" />
                  </div>
                  <span>{t('dashboard.methodActiveTitle')}</span>
                </div>
                <p className="text-sm text-zen-text-muted dark:text-zen-dark-text-muted leading-relaxed">
                  {t('dashboard.methodActiveDesc')}
                </p>
              </div>

              {/* Method 3: Ascolto & Tratti */}
              <div className="p-4 sm:p-5 border border-zen-border/40 dark:border-zen-dark-border bg-zen-surface-container/30 dark:bg-zen-dark-surface-high/30 space-y-2.5">
                <div className="flex items-center gap-3 text-zen-primary dark:text-zen-dark-primary font-bold text-base">
                  <div className="w-9 h-9 bg-zen-primary/15 dark:bg-zen-dark-primary/20 flex items-center justify-center flex-shrink-0">
                    <Headphones className="w-5 h-5" />
                  </div>
                  <span>{t('dashboard.methodAudioTitle')}</span>
                </div>
                <p className="text-sm text-zen-text-muted dark:text-zen-dark-text-muted leading-relaxed">
                  {t('dashboard.methodAudioDesc')}
                </p>
              </div>

              {/* Method 4: Ludico */}
              <div className="p-4 sm:p-5 border border-zen-border/40 dark:border-zen-dark-border bg-zen-surface-container/30 dark:bg-zen-dark-surface-high/30 space-y-2.5">
                <div className="flex items-center gap-3 text-zen-primary dark:text-zen-dark-primary font-bold text-base">
                  <div className="w-9 h-9 bg-zen-primary/15 dark:bg-zen-dark-primary/20 flex items-center justify-center flex-shrink-0">
                    <Compass className="w-5 h-5" />
                  </div>
                  <span>{t('dashboard.methodGameTitle')}</span>
                </div>
                <p className="text-sm text-zen-text-muted dark:text-zen-dark-text-muted leading-relaxed">
                  {t('dashboard.methodGameDesc')}
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowMethodModal(false)}
                className="px-6 py-2.5 bg-zen-primary dark:bg-zen-dark-primary hover:bg-zen-primary-dark dark:hover:bg-zen-dark-primary-hover text-white dark:text-zen-dark-on-primary font-bold text-sm shadow-zen-sm transition-all"
              >
                {t('dashboard.closeModal')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

