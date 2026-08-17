import React, { useState } from 'react';
import { Volume2, Info } from 'lucide-react';
import { 
  HIRAGANA_GRID, 
  KATAKANA_GRID, 
  DAKUTEN_HIRAGANA_GRID, 
  DAKUTEN_KATAKANA_GRID,
  HANDAKUTEN_HIRAGANA_GRID,
  HANDAKUTEN_KATAKANA_GRID,
  YOON_HIRAGANA_GRID,
  YOON_KATAKANA_GRID,
  SMALL_HIRAGANA_GRID,
  SMALL_KATAKANA_GRID
} from '../data/kanaTables';
import { getKanaExample } from '../data/kanaData';
import { playKanaSound } from '../utils/audio';
import { useLanguage } from '../context/LanguageContext';

export default function KanaTable({ scriptMode }) {
  const { lang, t } = useLanguage();
  const [activeTab, setActiveTab] = useState('basic');
  const [selectedKana, setSelectedKana] = useState(null);

  const isHiragana = scriptMode === 'hiragana';

  const getTableData = () => {
    switch (activeTab) {
      case 'dakuten':
        return {
          columns: ['A', 'I', 'U', 'E', 'O'],
          rowLabels: ['G', 'Z', 'D', 'B'],
          colCount: 5,
          grid: isHiragana ? DAKUTEN_HIRAGANA_GRID : DAKUTEN_KATAKANA_GRID
        };
      case 'handakuten':
        return {
          columns: ['A', 'I', 'U', 'E', 'O'],
          rowLabels: ['P'],
          colCount: 5,
          grid: isHiragana ? HANDAKUTEN_HIRAGANA_GRID : HANDAKUTEN_KATAKANA_GRID
        };
      case 'yoon':
        return {
          columns: ['A', 'U', 'O'],
          rowLabels: ['KY', 'SH', 'CH', 'NY', 'HY', 'MY', 'RY', 'GY', 'J', 'BY', 'PY'],
          colCount: 3,
          grid: isHiragana ? YOON_HIRAGANA_GRID : YOON_KATAKANA_GRID
        };
      case 'small':
        return {
          columns: ['1', '2', '3', '4', '5'],
          rowLabels: ['•', '•', '•'],
          colCount: 5,
          grid: isHiragana ? SMALL_HIRAGANA_GRID : SMALL_KATAKANA_GRID
        };
      default:
        return {
          columns: ['A', 'I', 'U', 'E', 'O'],
          rowLabels: ['—', 'K', 'S', 'T', 'N', 'H', 'M', 'Y', 'R', 'W', 'N'],
          colCount: 5,
          grid: isHiragana ? HIRAGANA_GRID : KATAKANA_GRID
        };
    }
  };

  const { columns, rowLabels, colCount, grid } = getTableData();

  const handleCardClick = (cell) => {
    if (!cell || !cell.k) return;
    setSelectedKana(cell);
    playKanaSound(cell.k);
  };

  const gridColsClass = colCount === 3 
    ? 'grid-cols-[36px_repeat(3,1fr)] sm:grid-cols-[48px_repeat(3,1fr)]' 
    : 'grid-cols-[36px_repeat(5,1fr)] sm:grid-cols-[48px_repeat(5,1fr)]';

  const categories = [
    { id: 'basic', label: t('table.tabBasic') },
    { id: 'dakuten', label: t('table.tabDakuten') },
    { id: 'handakuten', label: t('table.tabHandakuten') },
    { id: 'yoon', label: t('table.tabYoon') },
    { id: 'small', label: t('table.tabSmall') }
  ];

  return (
    <div className="space-y-6 pb-20 xl:pb-8">
      {/* Header & Tabs */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-headline font-bold text-zen-text dark:text-zen-dark-text">
            {isHiragana ? 'Hiragana (ひらがな)' : 'Katakana (カタカナ)'} {t('table.title')}
          </h2>
          <p className="text-sm text-zen-text-muted dark:text-zen-dark-text-muted mt-1">
            {t('table.subtitle')}
          </p>
        </div>

        {/* 5 Sub-tabs matching VirtualKeyboard */}
        <div className="flex flex-wrap items-center gap-1.5 bg-zen-surface-container dark:bg-zen-dark-surface p-1 rounded-2xl border border-zen-border/40 dark:border-zen-dark-border self-start xl:self-auto">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => { setActiveTab(cat.id); setSelectedKana(null); }}
              aria-label={cat.label}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all min-h-[38px] flex items-center ${
                activeTab === cat.id
                  ? 'bg-zen-surface-lowest dark:bg-zen-dark-primary text-zen-primary dark:text-zen-dark-on-primary shadow-zen-sm'
                  : 'text-zen-text-muted dark:text-zen-dark-text-muted hover:text-zen-text dark:hover:text-zen-dark-text'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Coordinate Matrix Container */}
      <div className="space-y-2.5 sm:space-y-3">
        {/* Top Header Row: Vowels / Columns */}
        <div className={`grid ${gridColsClass} gap-2 sm:gap-3.5 items-center`}>
          <div className="flex items-center justify-center text-2xs font-bold font-mono text-zen-text-muted/60 dark:text-zen-dark-text-muted/60 uppercase">
            {/* Corner anchor */}
          </div>
          {columns.map((colName, cIdx) => (
            <div 
              key={`${colName}-${cIdx}`} 
              className="py-2 text-center font-extrabold text-sm sm:text-base font-mono text-zen-text dark:text-zen-dark-primary bg-white dark:bg-zen-dark-surface rounded-xl border-2 border-zen-text/70 dark:border-zen-dark-primary/60 shadow-zen-sm uppercase tracking-wider"
            >
              {colName}
            </div>
          ))}
        </div>

        {/* Matrix Rows with Left Consonant Header */}
        <div className="space-y-2 sm:space-y-3">
          {grid.map((rowItems, rIdx) => (
            <div key={`row-${rIdx}`} className={`grid ${gridColsClass} gap-2 sm:gap-3.5 items-stretch`}>
              {/* Left Consonant Header Badge */}
              <div 
                className="flex items-center justify-center rounded-2xl bg-white dark:bg-zen-dark-surface border-2 border-zen-text/70 dark:border-zen-dark-primary/60 text-zen-text dark:text-zen-dark-primary font-mono font-extrabold text-sm sm:text-base select-none"
                title={`Riga ${rowLabels[rIdx] || ''}`}
              >
                {rowLabels[rIdx] || '—'}
              </div>

              {/* Kana Cards */}
              {rowItems.map((cell, cIdx) => {
                if (!cell || !cell.k) {
                  return (
                    <div
                      key={`empty-${rIdx}-${cIdx}`}
                      className="aspect-square rounded-2xl bg-transparent border border-dashed border-zen-border/30 dark:border-zen-dark-border/40"
                    />
                  );
                }

                const isSelected = selectedKana?.k === cell.k;

                return (
                  <div
                    key={`${cell.k}-${rIdx}-${cIdx}`}
                    onClick={() => handleCardClick(cell)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleCardClick(cell)}
                    aria-label={`Kana ${cell.k}, romaji ${cell.r}`}
                    className={`aspect-square rounded-2xl p-1.5 sm:p-3.5 flex flex-col items-center justify-between cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? 'bg-zen-primary dark:bg-zen-dark-primary text-white dark:text-zen-dark-on-primary ring-4 ring-zen-primary/20 dark:ring-zen-dark-primary/40 shadow-zen-lg scale-105'
                        : 'zen-card bg-zen-surface-lowest dark:bg-zen-dark-surface border border-zen-border/40 dark:border-zen-dark-border hover:border-zen-primary dark:hover:border-zen-dark-primary hover:scale-102'
                    }`}
                  >
                    <div className="w-full flex justify-end">
                      <Volume2 className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${isSelected ? 'text-white dark:text-zen-dark-on-primary' : 'text-zen-primary/60 dark:text-zen-dark-text-muted'}`} />
                    </div>

                    <span className={`font-kana font-bold ${activeTab === 'yoon' ? 'text-xl sm:text-3xl md:text-4xl' : 'text-2xl sm:text-4xl md:text-5xl'} leading-none ${isSelected ? 'text-white dark:text-zen-dark-on-primary' : 'text-zen-primary dark:text-zen-dark-text'}`}>
                      {cell.k}
                    </span>

                    <span className={`text-2xs sm:text-xs font-semibold font-mono tracking-wider uppercase ${isSelected ? 'text-white/90 dark:text-zen-dark-on-primary/90' : 'text-zen-text-muted dark:text-zen-dark-text-muted'}`}>
                      {cell.r}
                    </span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Detail info bar when character is selected */}
      {selectedKana && (
        <div className="zen-card p-4 sm:p-5 border border-zen-border/60 dark:border-zen-dark-border bg-zen-surface-lowest dark:bg-zen-dark-surface flex items-center justify-between gap-4 animate-fade-in">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-zen-primary dark:bg-zen-dark-primary text-white dark:text-zen-dark-on-primary flex items-center justify-center font-kana text-3xl font-bold">
              {selectedKana.k}
            </div>
            <div>
              <div className="text-lg font-bold font-headline text-zen-text dark:text-zen-dark-text">
                Romaji: <span className="text-zen-primary dark:text-zen-dark-primary uppercase">{selectedKana.r}</span>
              </div>
              <div className="text-xs text-zen-text-muted dark:text-zen-dark-text-muted flex items-center gap-1.5 mt-0.5">
                <Info className="w-3.5 h-3.5 text-zen-secondary dark:text-zen-dark-secondary" /> {t('table.exampleWord')}: {getKanaExample(selectedKana.k, lang)}
              </div>
            </div>
          </div>

          <button
            onClick={() => playKanaSound(selectedKana.k)}
            className="px-4 py-2.5 rounded-xl bg-zen-primary dark:bg-zen-dark-primary hover:bg-zen-primary-dark dark:hover:bg-zen-dark-primary-hover text-white dark:text-zen-dark-on-primary font-bold text-xs flex items-center gap-2 shadow-zen-sm"
          >
            <Volume2 className="w-4 h-4" /> Audio
          </button>
        </div>
      )}
    </div>
  );
}

