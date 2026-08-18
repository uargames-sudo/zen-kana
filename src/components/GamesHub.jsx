import React, { useState } from 'react';
import { Gamepad2, Brain, Puzzle } from 'lucide-react';
import MemoryGame from './MemoryGame';
import KanaPuzzle from './KanaPuzzle';
import { useLanguage } from '../context/LanguageContext';

export default function GamesHub({ scriptMode = 'hiragana' }) {
  const { t } = useLanguage();
  const [activeGame, setActiveGame] = useState('puzzle'); // 'puzzle' | 'memory'

  return (
    <div className="space-y-6">
      {/* Games Dojo Header & Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zen-border/30 dark:border-zen-dark-border/40">
        <div>
          <h2 className="text-2xl sm:text-3xl font-headline font-bold text-zen-text dark:text-zen-dark-text flex items-center gap-2.5">
            <Gamepad2 className="w-7 h-7 text-zen-primary dark:text-zen-dark-primary" />
            <span>{t('games.title') || 'Dojo Giochi'}</span>
          </h2>
          <p className="text-sm text-zen-text-muted dark:text-zen-dark-text-muted mt-0.5">
            {t('games.subtitle') || 'Impara il giapponese giocando: scegli una sfida interattiva'}
          </p>
        </div>

        {/* Sub-game navigation tabs */}
        <div className="flex items-center gap-1.5 bg-zen-surface-container dark:bg-zen-dark-surface p-1 rounded-2xl border border-zen-border/40 dark:border-zen-dark-border self-start sm:self-auto shrink-0 shadow-zen-sm">
          <button
            type="button"
            onClick={() => setActiveGame('puzzle')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 min-h-[38px] ${
              activeGame === 'puzzle'
                ? 'bg-zen-surface-lowest dark:bg-zen-dark-primary text-zen-primary dark:text-zen-dark-on-primary shadow-zen-sm'
                : 'text-zen-text-muted dark:text-zen-dark-text-muted hover:text-zen-text dark:hover:text-zen-dark-text'
            }`}
          >
            <Puzzle className="w-4 h-4" />
            <span>{t('games.tabPuzzle') || 'Kana Puzzle'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveGame('memory')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 min-h-[38px] ${
              activeGame === 'memory'
                ? 'bg-zen-surface-lowest dark:bg-zen-dark-primary text-zen-primary dark:text-zen-dark-on-primary shadow-zen-sm'
                : 'text-zen-text-muted dark:text-zen-dark-text-muted hover:text-zen-text dark:hover:text-zen-dark-text'
            }`}
          >
            <Brain className="w-4 h-4" />
            <span>{t('games.tabMemory') || 'Memory Zen'}</span>
          </button>
        </div>
      </div>

      {/* Render Active Game */}
      <div>
        {activeGame === 'puzzle' ? (
          <KanaPuzzle defaultScriptMode={scriptMode} />
        ) : (
          <MemoryGame />
        )}
      </div>
    </div>
  );
}
