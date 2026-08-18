import React, { useState } from 'react';
import { Volume2, Info, X } from 'lucide-react';
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
import { getKanaExample, getKanaExampleWord } from '../data/kanaData';
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
          columns: isHiragana ? ['促音 (Sokuon)'] : ['長音符 (Chōonpu)', '促音 (Sokuon)'],
          rowLabels: [isHiragana ? 'っ' : '•'],
          colCount: isHiragana ? 1 : 2,
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
    : colCount === 2
    ? 'grid-cols-[36px_repeat(2,minmax(110px,180px))] sm:grid-cols-[48px_repeat(2,minmax(130px,200px))]'
    : colCount === 1
    ? 'grid-cols-[36px_minmax(120px,200px)] sm:grid-cols-[48px_minmax(140px,220px)]'
    : 'grid-cols-[36px_repeat(5,1fr)] sm:grid-cols-[48px_repeat(5,1fr)]';

  const categories = [
    { id: 'basic', label: t('table.tabBasic') },
    { id: 'dakuten', label: t('table.tabDakuten') },
    { id: 'handakuten', label: t('table.tabHandakuten') },
    { id: 'yoon', label: t('table.tabYoon') },
    { id: 'small', label: isHiragana ? t('table.tabSokuon') : t('table.tabChoonpu') }
  ];

  return (
    <div className="space-y-6 pb-36 xl:pb-28">
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

      {/* Floating Sticky Detail Bar when character is selected */}
      {selectedKana && (() => {
        const exampleText = getKanaExample(selectedKana.k, lang);
        const exampleWord = getKanaExampleWord(selectedKana.k);

        return (
          <div className="fixed bottom-20 sm:bottom-6 left-3 right-3 sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-xl z-30 animate-fade-in">
            <div className="zen-card p-3 sm:p-4 rounded-2xl border-2 border-zen-primary/40 dark:border-zen-dark-primary/50 bg-white/95 dark:bg-zen-dark-surface/95 backdrop-blur-md shadow-2xl flex items-center justify-between gap-3 sm:gap-4">
              <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                {/* Kana badge: click to replay single kana syllable */}
                <button
                  type="button"
                  onClick={() => playKanaSound(selectedKana.k)}
                  title={`Riascolta sillaba ${selectedKana.k}`}
                  aria-label={`Riascolta sillaba ${selectedKana.k}`}
                  className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-2xl bg-zen-primary dark:bg-zen-dark-primary hover:bg-zen-primary-dark dark:hover:bg-zen-dark-primary-hover text-white dark:text-zen-dark-on-primary flex items-center justify-center font-kana text-2xl sm:text-3xl font-bold shadow-zen-sm transition-transform active:scale-95 cursor-pointer relative group"
                >
                  {selectedKana.k}
                  <Volume2 className="w-3 h-3 absolute top-1 right-1 opacity-60 group-hover:opacity-100 transition-opacity" />
                </button>

                <div className="min-w-0">
                  <div className="text-base sm:text-lg font-bold font-headline text-zen-text dark:text-zen-dark-text leading-tight">
                    Romaji: <span className="text-zen-primary dark:text-zen-dark-primary uppercase">{selectedKana.r}</span>
                  </div>
                  {exampleText && (
                    <button
                      type="button"
                      onClick={() => playKanaSound(exampleWord || selectedKana.k)}
                      title={`Ascolta parola d'esempio: ${exampleWord || selectedKana.k}`}
                      className="text-xs text-zen-text-muted dark:text-zen-dark-text-muted hover:text-zen-primary dark:hover:text-zen-dark-primary flex items-center gap-1.5 mt-0.5 truncate text-left transition-colors group cursor-pointer"
                    >
                      <Info className="w-3.5 h-3.5 text-zen-secondary dark:text-zen-dark-secondary shrink-0 group-hover:scale-110 transition-transform" />
                      <span className="truncate">
                        {t('table.exampleWord')}: <strong className="text-zen-text dark:text-zen-dark-text group-hover:text-zen-primary dark:group-hover:text-zen-dark-primary font-medium">{exampleText}</strong>
                      </span>
                    </button>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {/* Audio button dedicated to the example word */}
                <button
                  type="button"
                  onClick={() => playKanaSound(exampleWord || selectedKana.k)}
                  title={`Ascolta parola d'esempio: ${exampleWord || selectedKana.k}`}
                  aria-label="Riproduci parola d'esempio"
                  className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-zen-primary dark:bg-zen-dark-primary hover:bg-zen-primary-dark dark:hover:bg-zen-dark-primary-hover text-white dark:text-zen-dark-on-primary font-bold text-xs flex items-center gap-1.5 shadow-zen-sm transition-transform active:scale-95 cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" />
                  <span className="hidden xs:inline">Audio</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedKana(null)}
                  aria-label="Chiudi dettaglio"
                  className="p-2 rounded-xl text-zen-text-muted dark:text-zen-dark-text-muted hover:text-zen-text dark:hover:text-zen-dark-text hover:bg-zen-surface-container dark:hover:bg-zen-dark-bg/60 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

