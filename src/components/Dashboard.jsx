import React from 'react';
import { Layers, PenTool, Volume2, Award, Grid, Flame, CheckCircle, TrendingUp, Play, BookOpen, ListChecks, Sparkles, Brain } from 'lucide-react';
import { playKanaSound } from '../utils/audio';
import { useLanguage } from '../context/LanguageContext';

export default function Dashboard({ setActiveTab, scriptMode, stats, resetStats }) {
  const { lang, t } = useLanguage();
  const isHiragana = scriptMode === 'hiragana';
  const sampleKana = isHiragana ? 'あ' : 'ア';

  const quickActionCards = [
    {
      id: 'flashcards',
      title: t('nav.flashcards'),
      description: t('nav.flashcardsDesc'),
      icon: Layers,
      badge: lang === 'it' ? 'Consigliato' : 'Recommended',
      color: 'bg-zen-primary dark:bg-zen-dark-primary text-white dark:text-zen-dark-on-primary',
    },
    {
      id: 'activeStudy',
      title: t('nav.activeStudy'),
      description: t('nav.activeStudyDesc'),
      icon: Sparkles,
      badge: lang === 'it' ? 'Allenamento' : 'Training',
      color: 'bg-zen-accent dark:bg-zen-dark-primary text-white dark:text-zen-dark-on-primary',
    },
    {
      id: 'memory',
      title: t('nav.memory'),
      description: t('nav.memoryDesc'),
      icon: Brain,
      badge: lang === 'it' ? 'Gioco Zen' : 'Zen Game',
      color: 'bg-zen-secondary dark:bg-zen-dark-secondary text-white dark:text-zen-dark-on-primary',
    },
    {
      id: 'writing',
      title: t('nav.writing'),
      description: t('nav.writingDesc'),
      icon: PenTool,
      badge: lang === 'it' ? 'Interattivo' : 'Interactive',
      color: 'bg-zen-secondary dark:bg-zen-dark-secondary text-white dark:text-zen-dark-on-primary',
    },
    {
      id: 'vocabulary',
      title: t('nav.vocabulary'),
      description: t('nav.vocabularyDesc'),
      icon: BookOpen,
      badge: '100 words',
      color: 'bg-zen-primary dark:bg-zen-dark-primary text-white dark:text-zen-dark-on-primary',
    },
    {
      id: 'lessons',
      title: t('nav.lessons'),
      description: t('nav.lessonsDesc'),
      icon: ListChecks,
      badge: '10 days',
      color: 'bg-zen-secondary dark:bg-zen-dark-secondary text-white dark:text-zen-dark-on-primary',
    },
    {
      id: 'listening',
      title: t('nav.listening'),
      description: t('nav.listeningDesc'),
      icon: Volume2,
      badge: 'Audio',
      color: 'bg-zen-accent dark:bg-zen-dark-primary text-white dark:text-zen-dark-on-primary',
    },
    {
      id: 'table',
      title: t('nav.table'),
      description: t('nav.tableDesc'),
      icon: Grid,
      badge: lang === 'it' ? 'Consultazione' : 'Reference',
      color: 'bg-zen-primary-dark dark:bg-zen-dark-surface-high text-white dark:text-zen-dark-primary',
    },
    {
      id: 'quiz',
      title: t('nav.quiz'),
      description: t('nav.quizDesc'),
      icon: Award,
      badge: 'Test',
      color: 'bg-zen-secondary-dark dark:bg-zen-dark-surface-high text-white dark:text-zen-dark-secondary',
    }
  ];

  const handleReset = () => {
    if (window.confirm(t('dashboard.resetConfirm'))) {
      resetStats();
    }
  };

  return (
    <div className="space-y-8 pb-20 xl:pb-8">
      {/* Hero Zen Banner */}
      <div className="zen-card p-6 sm:p-8 bg-zen-surface-lowest dark:bg-zen-dark-surface border border-zen-border/40 dark:border-zen-dark-border">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zen-secondary/15 dark:bg-zen-dark-primary/20 text-zen-secondary dark:text-zen-dark-primary text-xs font-semibold">
              <Flame className="w-4 h-4 fill-current" /> {lang === 'it' ? 'Serie di Studio Attiva' : 'Study Streak Active'}
            </div>
            <h2 className="text-3xl sm:text-4xl font-headline font-bold text-zen-text dark:text-zen-dark-text leading-tight">
              {t('dashboard.welcome')}
            </h2>
            <p className="text-zen-text-muted dark:text-zen-dark-text-muted text-sm sm:text-base max-w-xl">
              {t('dashboard.welcomeSubtitle')}
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-4">
              <button
                onClick={() => setActiveTab('activeStudy')}
                className="px-6 py-3 rounded-xl bg-zen-primary dark:bg-zen-dark-primary hover:bg-zen-primary-dark dark:hover:bg-zen-dark-primary-hover text-white dark:text-zen-dark-on-primary font-bold text-sm shadow-zen-md transition-all flex items-center gap-2"
              >
                <Play className="w-4 h-4 fill-current" /> {t('dashboard.startActiveStudy')}
              </button>

              <button
                onClick={() => playKanaSound(sampleKana)}
                className="px-5 py-3 rounded-xl bg-zen-surface-lowest dark:bg-zen-dark-surface hover:bg-zen-surface-container dark:hover:bg-zen-dark-surface-high text-zen-primary dark:text-zen-dark-primary font-medium text-sm border border-zen-border dark:border-zen-dark-border transition-all flex items-center gap-2"
              >
                <Volume2 className="w-4 h-4 text-zen-primary dark:text-zen-dark-primary" /> {sampleKana} (Audio)
              </button>
            </div>
          </div>

          {/* Featured Kana Display Badge */}
          <div 
            className="w-36 h-36 sm:w-44 sm:h-44 rounded-3xl bg-zen-surface-lowest dark:bg-zen-dark-surface border border-zen-border/60 dark:border-zen-dark-border shadow-zen-md flex flex-col items-center justify-center relative group cursor-pointer"
            onClick={() => playKanaSound(sampleKana)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && playKanaSound(sampleKana)}
            aria-label={`${sampleKana} specimen - click to hear pronunciation`}
          >
            <span className="text-6xl sm:text-7xl font-kana font-bold text-zen-primary dark:text-zen-dark-primary group-hover:scale-110 transition-transform">
              {sampleKana}
            </span>
            <span className="text-xs font-semibold text-zen-text-muted dark:text-zen-dark-text-muted mt-1 uppercase tracking-widest">
              {isHiragana ? 'hiragana - a' : 'katakana - a'}
            </span>
            <div className="absolute top-3 right-3 p-1.5 rounded-full bg-zen-surface-container dark:bg-zen-dark-surface-high text-zen-primary dark:text-zen-dark-primary opacity-0 group-hover:opacity-100 transition-opacity">
              <Volume2 className="w-4 h-4" />
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
            className="text-xs font-bold text-zen-text-muted dark:text-zen-dark-text-muted hover:text-rose-500 dark:hover:text-rose-400 transition-colors px-3 py-1.5 border border-zen-border/40 dark:border-zen-dark-border rounded-lg min-h-[36px] flex items-center bg-zen-surface-lowest dark:bg-zen-dark-surface"
          >
            {t('dashboard.resetStats')}
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="zen-card p-5 border border-zen-border/40 dark:border-zen-dark-border flex items-center gap-4 bg-zen-surface-lowest dark:bg-zen-dark-surface">
            <div className="w-12 h-12 rounded-2xl bg-zen-primary/15 dark:bg-zen-dark-primary/20 text-zen-primary dark:text-zen-dark-primary flex items-center justify-center">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-zen-text dark:text-zen-dark-text">{stats?.reviewedCount ?? 0} / 46</div>
              <div className="text-xs text-zen-text-muted dark:text-zen-dark-text-muted">{t('dashboard.reviewedKana')}</div>
            </div>
          </div>

          <div className="zen-card p-5 border border-zen-border/40 dark:border-zen-dark-border flex items-center gap-4 bg-zen-surface-lowest dark:bg-zen-dark-surface">
            <div className="w-12 h-12 rounded-2xl bg-zen-secondary/15 dark:bg-zen-dark-secondary/20 text-zen-secondary dark:text-zen-dark-secondary flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-zen-text dark:text-zen-dark-text">{stats?.accuracy ?? 0}%</div>
              <div className="text-xs text-zen-text-muted dark:text-zen-dark-text-muted">{t('dashboard.accuracy')}</div>
            </div>
          </div>

          <div className="zen-card p-5 border border-zen-border/40 dark:border-zen-dark-border flex items-center gap-4 bg-zen-surface-lowest dark:bg-zen-dark-surface">
            <div className="w-12 h-12 rounded-2xl bg-zen-accent/15 dark:bg-zen-dark-primary/20 text-zen-accent dark:text-zen-dark-primary flex items-center justify-center">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-zen-text dark:text-zen-dark-text">{stats?.totalAttempts ?? 0}</div>
              <div className="text-xs text-zen-text-muted dark:text-zen-dark-text-muted">{t('dashboard.totalAttempts')}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Grid */}
      <div>
        <h3 className="text-xl font-headline font-bold text-zen-text dark:text-zen-dark-text mb-4 flex items-center gap-2">
          {t('dashboard.quickActions')}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {quickActionCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                onClick={() => setActiveTab(card.id)}
                className="zen-card p-6 border border-zen-border/40 dark:border-zen-dark-border bg-zen-surface-lowest dark:bg-zen-dark-surface hover:border-zen-primary dark:hover:border-zen-dark-primary cursor-pointer group flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-2xl ${card.color} flex items-center justify-center shadow-zen-sm group-hover:scale-105 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs-plus font-semibold px-2.5 py-1 rounded-full bg-zen-surface-container dark:bg-zen-dark-surface-high text-zen-text-muted dark:text-zen-dark-text-muted">
                      {card.badge}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-headline font-bold text-lg text-zen-text dark:text-zen-dark-text group-hover:text-zen-primary dark:group-hover:text-zen-dark-primary transition-colors">
                      {card.title}
                    </h4>
                    <p className="text-sm text-zen-text-muted dark:text-zen-dark-text-muted mt-1 leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-zen-border/40 dark:border-zen-dark-border flex items-center justify-between text-xs font-semibold text-zen-primary dark:text-zen-dark-primary group-hover:translate-x-1 transition-transform">
                  <span>{lang === 'it' ? 'Apri modulo' : 'Open Module'}</span>
                  <span>→</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
