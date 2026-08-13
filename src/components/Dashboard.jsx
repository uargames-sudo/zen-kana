import React from 'react';
import { Layers, PenTool, Volume2, Award, Grid, Flame, CheckCircle, TrendingUp, Play, BookOpen, ListChecks } from 'lucide-react';
import { playKanaSound } from '../utils/audio';

export default function Dashboard({ setActiveTab, scriptMode, stats }) {
  const isHiragana = scriptMode === 'hiragana';
  const sampleKana = isHiragana ? 'あ' : 'ア';

  const quickActionCards = [
    {
      id: 'flashcards',
      title: 'Study Flashcards',
      description: 'Master characters with 3D flip flashcards & spaced repetition.',
      icon: Layers,
      badge: 'Recommended',
      color: 'bg-zen-primary dark:bg-zen-dark-primary text-white dark:text-zen-dark-on-primary',
    },
    {
      id: 'writing',
      title: 'Stroke Practice',
      description: 'Draw Kana with stroke guidance on interactive canvas.',
      icon: PenTool,
      badge: 'Interactive',
      color: 'bg-zen-secondary dark:bg-zen-dark-secondary text-white dark:text-zen-dark-on-primary',
    },
    {
      id: 'vocabulary',
      title: 'Vocabulary',
      description: 'Explore 100 Japanese words with icons, translations, and native pronunciation.',
      icon: BookOpen,
      badge: '100 words',
      color: 'bg-zen-primary dark:bg-zen-dark-primary text-white dark:text-zen-dark-on-primary',
    },
    {
      id: 'lessons',
      title: 'Structured Lessons',
      description: 'Follow a 10-day curriculum with five kana, vocabulary, writing, and verification each day.',
      icon: ListChecks,
      badge: '10 days',
      color: 'bg-zen-secondary dark:bg-zen-dark-secondary text-white dark:text-zen-dark-on-primary',
    },
    {
      id: 'listening',
      title: 'Listening Quiz',
      description: 'Test your Japanese speech recognition audio skills.',
      icon: Volume2,
      badge: 'Audio',
      color: 'bg-zen-accent dark:bg-zen-dark-primary text-white dark:text-zen-dark-on-primary',
    },
    {
      id: 'table',
      title: 'Kana Reference Grid',
      description: 'Explore the full grid of basic, dakuten & combination characters.',
      icon: Grid,
      badge: 'Reference',
      color: 'bg-zen-primary-dark dark:bg-zen-dark-surface-high text-white dark:text-zen-dark-primary',
    },
    {
      id: 'quiz',
      title: 'Verification Exercises',
      description: 'Take a comprehensive test to verify your learning accuracy.',
      icon: Award,
      badge: 'Test',
      color: 'bg-zen-secondary-dark dark:bg-zen-dark-surface-high text-white dark:text-zen-dark-secondary',
    }
  ];

  return (
    <div className="space-y-8 pb-20 lg:pb-8">
      {/* Hero Zen Banner */}
      <div className="zen-card p-6 sm:p-8 bg-gradient-to-br from-zen-surface-lowest via-zen-surface-container/50 to-zen-surface-high/60 dark:from-zen-dark-surface dark:via-zen-dark-surface-high/40 dark:to-zen-dark-bg border border-zen-surface-high dark:border-zen-dark-border">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zen-secondary/15 dark:bg-zen-dark-primary/20 text-zen-secondary dark:text-zen-dark-primary text-xs font-semibold">
              <Flame className="w-4 h-4 fill-current" /> 7 Day Study Streak Active
            </div>
            <h2 className="text-3xl sm:text-4xl font-headline font-bold text-zen-text dark:text-zen-dark-text leading-tight">
              Master <span className="text-zen-primary dark:text-zen-dark-primary">{isHiragana ? 'Hiragana' : 'Katakana'}</span> with Zen Mind
            </h2>
            <p className="text-zen-text-muted dark:text-zen-dark-text-muted text-sm sm:text-base max-w-xl">
              Calm, focused, and intuitive Japanese character learning studio. Hear sounds, write strokes, and test your memory.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-4">
              <button
                onClick={() => setActiveTab('flashcards')}
                className="px-6 py-3 rounded-xl bg-zen-primary dark:bg-zen-dark-primary hover:bg-zen-primary-dark dark:hover:bg-zen-dark-primary-hover text-white dark:text-zen-dark-on-primary font-bold text-sm shadow-zen-md transition-all flex items-center gap-2"
              >
                <Play className="w-4 h-4 fill-current" /> Start Practice Deck
              </button>

              <button
                onClick={() => playKanaSound(sampleKana)}
                className="px-5 py-3 rounded-xl bg-white dark:bg-zen-dark-surface-high hover:bg-zen-surface-container dark:hover:bg-zen-dark-surface text-zen-primary dark:text-zen-dark-text font-medium text-sm border border-zen-border/60 dark:border-zen-dark-border transition-all flex items-center gap-2"
              >
                <Volume2 className="w-4 h-4 text-zen-primary dark:text-zen-dark-primary" /> Hear '{sampleKana}' Sound
              </button>
            </div>
          </div>

          {/* Featured Kana Display Badge */}
          <div 
            className="w-36 h-36 sm:w-44 sm:h-44 rounded-3xl bg-white dark:bg-zen-dark-surface-high shadow-zen-lg border border-zen-primary-light/40 dark:border-zen-dark-border flex flex-col items-center justify-center relative group cursor-pointer"
            onClick={() => playKanaSound(sampleKana)}
          >
            <span className="text-6xl sm:text-7xl font-kana font-bold text-zen-primary dark:text-zen-dark-text group-hover:scale-110 transition-transform">
              {sampleKana}
            </span>
            <span className="text-xs font-semibold text-zen-text-muted dark:text-zen-dark-text-muted mt-1 uppercase tracking-widest">
              {isHiragana ? 'hiragana - a' : 'katakana - a'}
            </span>
            <div className="absolute top-3 right-3 p-1.5 rounded-full bg-zen-surface-container dark:bg-zen-dark-surface text-zen-primary dark:text-zen-dark-primary opacity-0 group-hover:opacity-100 transition-opacity">
              <Volume2 className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Progress & Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="zen-card p-5 border border-zen-surface-high dark:border-zen-dark-border flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-zen-primary/10 dark:bg-zen-dark-primary/20 text-zen-primary dark:text-zen-dark-primary flex items-center justify-center">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-zen-text dark:text-zen-dark-text">{stats?.reviewedCount || 28} / 46</div>
            <div className="text-xs text-zen-text-muted dark:text-zen-dark-text-muted">Characters Mastered</div>
          </div>
        </div>

        <div className="zen-card p-5 border border-zen-surface-high dark:border-zen-dark-border flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-zen-secondary/10 dark:bg-zen-dark-secondary/20 text-zen-secondary dark:text-zen-dark-secondary flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-zen-text dark:text-zen-dark-text">{stats?.accuracy || 94}%</div>
            <div className="text-xs text-zen-text-muted dark:text-zen-dark-text-muted">Quiz Accuracy Rate</div>
          </div>
        </div>

        <div className="zen-card p-5 border border-zen-surface-high dark:border-zen-dark-border flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-zen-accent/10 dark:bg-zen-dark-primary/20 text-zen-accent dark:text-zen-dark-primary flex items-center justify-center">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-zen-text dark:text-zen-dark-text">7 Days</div>
            <div className="text-xs text-zen-text-muted dark:text-zen-dark-text-muted">Consecutive Streak</div>
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Grid */}
      <div>
        <h3 className="text-xl font-headline font-bold text-zen-text dark:text-zen-dark-text mb-4 flex items-center gap-2">
          Study Modules
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {quickActionCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                onClick={() => setActiveTab(card.id)}
                className="zen-card p-6 border border-zen-surface-high dark:border-zen-dark-border hover:border-zen-primary-light dark:hover:border-zen-dark-primary cursor-pointer group flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-2xl ${card.color} flex items-center justify-center shadow-zen-sm group-hover:scale-105 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-zen-surface-container dark:bg-zen-dark-surface-high text-zen-text-muted dark:text-zen-dark-text-muted">
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

                <div className="pt-4 mt-4 border-t border-zen-surface-high dark:border-zen-dark-border flex items-center justify-between text-xs font-semibold text-zen-primary dark:text-zen-dark-primary group-hover:translate-x-1 transition-transform">
                  <span>Open Module</span>
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
