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
  SMALL_KATAKANA_GRID,
  EXTENDED_KATAKANA_GRID
} from '../data/kanaTables';
import { getKanaExample, getKanaExampleWord } from '../data/kanaData';
import { playKanaSound } from '../utils/audio';
import { useLanguage } from '../context/LanguageContext';
import ContextualTabGuide from './ContextualTabGuide';

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
      case 'extended':
        return {
          columns: ['A / YA', 'I', 'U / YU', 'E', 'O / YO'],
          rowLabels: ['T/D', 'F', 'W', 'V', 'CH/SH/J', 'TS', 'KW/GW', 'S/Z/Y', 'TYU/DYU'],
          colCount: 5,
          grid: EXTENDED_KATAKANA_GRID
        };
      case 'small':
        return {
          columns: isHiragana ? ['A / 促音', 'I', 'U', 'E', 'O'] : ['A / ー', 'I / ッ', 'U', 'E', 'O'],
          rowLabels: isHiragana ? ['促音', '小母音', '修飾'] : ['記号', '小母音', '修飾'],
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
    ? 'grid-cols-[28px_repeat(3,minmax(0,1fr))] xs:grid-cols-[36px_repeat(3,minmax(0,1fr))] sm:grid-cols-[48px_repeat(3,minmax(0,1fr))]' 
    : colCount === 2
    ? 'grid-cols-[28px_repeat(2,minmax(0,1fr))] xs:grid-cols-[36px_repeat(2,minmax(0,1fr))] sm:grid-cols-[48px_repeat(2,minmax(120px,200px))]'
    : colCount === 1
    ? 'grid-cols-[28px_minmax(0,1fr)] xs:grid-cols-[36px_minmax(0,1fr)] sm:grid-cols-[48px_minmax(140px,220px)]'
    : 'grid-cols-[28px_repeat(5,minmax(0,1fr))] xs:grid-cols-[36px_repeat(5,minmax(0,1fr))] sm:grid-cols-[48px_repeat(5,minmax(0,1fr))]';

  const categories = isHiragana ? [
    { id: 'basic', label: t('table.tabBasic') },
    { id: 'dakuten', label: t('table.tabDakuten') },
    { id: 'handakuten', label: t('table.tabHandakuten') },
    { id: 'yoon', label: t('table.tabYoon') },
    { id: 'small', label: t('table.tabSokuon') || (lang === 'it' ? 'Piccoli & Espressivi (っ/ぁ)' : 'Small & Expressive (っ/ぁ)') }
  ] : [
    { id: 'basic', label: t('table.tabBasic') },
    { id: 'dakuten', label: t('table.tabDakuten') },
    { id: 'handakuten', label: t('table.tabHandakuten') },
    { id: 'yoon', label: t('table.tabYoon') },
    { id: 'extended', label: t('table.tabExtended') || (lang === 'it' ? 'Estesi (Gairaigo)' : 'Extended (Gairaigo)') },
    { id: 'small', label: t('table.tabChoonpu') || (lang === 'it' ? 'Piccoli & Segni (ー/ッ/ァ)' : 'Small & Symbols (ー/ッ/ァ)') }
  ];

  return (
    <div className="space-y-6 pb-40 xl:pb-28">
      {/* Header & Tabs */}
      <div className="flex flex-col items-center justify-center gap-4 max-w-2xl lg:max-w-3xl mx-auto w-full text-center">
        <div>
          <h2 className="text-2xl sm:text-3xl font-headline font-bold text-zen-text dark:text-zen-dark-text">
            {isHiragana ? 'Hiragana (ひらがな)' : 'Katakana (カタカナ)'} {t('table.title')}
          </h2>
          <p className="text-sm text-zen-text-muted dark:text-zen-dark-text-muted mt-1">
            {t('table.subtitle')}
          </p>
        </div>

        {/* 5 Sub-tabs matching VirtualKeyboard */}
        <div className="flex flex-wrap items-center justify-center gap-1 bg-zen-surface-container dark:bg-zen-dark-surface p-1 border border-zen-border/40 dark:border-zen-dark-border">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => { setActiveTab(cat.id); setSelectedKana(null); }}
              aria-label={cat.label}
              className={`px-3 sm:px-4 py-2 text-xs font-bold transition-all min-h-[38px] flex items-center cursor-pointer border ${
                activeTab === cat.id
                  ? 'bg-zen-surface-lowest dark:bg-zen-dark-primary text-zen-primary dark:text-zen-dark-on-primary border-zen-primary/40 dark:border-zen-dark-primary shadow-zen-sm'
                  : 'text-zen-text-muted dark:text-zen-dark-text-muted border-transparent hover:text-zen-text dark:hover:text-zen-dark-text hover:bg-zen-surface-high dark:hover:bg-zen-dark-bg'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Contextual Table Mini-Guide */}
      <div className="max-w-2xl lg:max-w-3xl mx-auto w-full">
        <ContextualTabGuide 
          category={activeTab} 
          scriptMode={scriptMode}
          defaultExpanded={false}
          variant="accordion"
        />
      </div>

      {/* Coordinate Matrix Container - Closed compact table grid */}
      <div className="max-w-2xl lg:max-w-3xl mx-auto w-full bg-zen-surface-lowest dark:bg-zen-dark-surface border-2 border-zen-border/70 dark:border-zen-dark-border shadow-zen-md overflow-hidden">
        {/* Top Header Row: Vowels / Columns */}
        <div className={`grid ${gridColsClass} border-b-2 border-zen-border/70 dark:border-zen-dark-border bg-zen-surface-container/60 dark:bg-zen-dark-surface-high`}>
          <div className="flex items-center justify-center p-2 text-2xs font-bold font-mono text-zen-text-muted/60 dark:text-zen-dark-text-muted/60 border-r border-zen-border/60 dark:border-zen-dark-border select-none">
            {/* Corner anchor */}
            Kana
          </div>
          {columns.map((colName, cIdx) => (
            <div 
              key={`${colName}-${cIdx}`} 
              className={`py-2 text-center font-extrabold text-xs xs:text-sm sm:text-base font-mono text-zen-primary dark:text-zen-dark-primary uppercase tracking-wider select-none ${
                cIdx < columns.length - 1 ? 'border-r border-zen-border/60 dark:border-zen-dark-border' : ''
              }`}
            >
              {colName}
            </div>
          ))}
        </div>

        {/* Matrix Rows with Left Consonant Header */}
        <div>
          {grid.map((rowItems, rIdx) => (
            <div 
              key={`row-${rIdx}`} 
              className={`grid ${gridColsClass} items-stretch ${
                rIdx < grid.length - 1 ? 'border-b border-zen-border/60 dark:border-zen-dark-border' : ''
              }`}
            >
              {/* Left Consonant Header Badge */}
              <div 
                className="flex items-center justify-center bg-zen-surface-container/40 dark:bg-zen-dark-surface-high/70 border-r border-zen-border/60 dark:border-zen-dark-border text-zen-text dark:text-zen-dark-primary font-mono font-extrabold text-xs xs:text-sm sm:text-base select-none py-2"
                title={`Riga ${rowLabels[rIdx] || ''}`}
              >
                {rowLabels[rIdx] || '—'}
              </div>

              {/* Kana Cells */}
              {rowItems.map((cell, cIdx) => {
                const isLastCol = cIdx === rowItems.length - 1;
                const borderRightClass = isLastCol ? '' : 'border-r border-zen-border/60 dark:border-zen-dark-border';

                if (!cell || !cell.k) {
                  return (
                    <div
                      key={`empty-${rIdx}-${cIdx}`}
                      className={`min-h-[58px] xs:min-h-[64px] sm:min-h-[72px] bg-zen-surface-container/15 dark:bg-zen-dark-bg/40 ${borderRightClass}`}
                    />
                  );
                }

                const isSelected = selectedKana?.k === cell.k;

                return (
                  <button
                    key={`${cell.k}-${rIdx}-${cIdx}`}
                    onClick={() => handleCardClick(cell)}
                    type="button"
                    aria-label={`Kana ${cell.k}, romaji ${cell.r}`}
                    className={`min-h-[58px] xs:min-h-[64px] sm:min-h-[72px] p-1 xs:p-1.5 sm:p-2 flex flex-col items-center justify-between cursor-pointer transition-colors select-none text-left relative ${borderRightClass} ${
                      isSelected
                        ? 'bg-zen-primary dark:bg-zen-dark-primary text-white dark:text-zen-dark-on-primary ring-2 ring-inset ring-zen-primary dark:ring-zen-dark-primary z-10'
                        : 'bg-zen-surface-lowest dark:bg-zen-dark-surface hover:bg-zen-surface-container/60 dark:hover:bg-zen-dark-surface-high'
                    }`}
                  >
                    <div className="w-full flex justify-end">
                      <Volume2 className={`w-2.5 h-2.5 xs:w-3 xs:h-3 ${isSelected ? 'text-white dark:text-zen-dark-on-primary' : 'text-zen-text-muted/40 group-hover:text-zen-primary'}`} />
                    </div>

                    <span className={`font-kana font-bold ${activeTab === 'yoon' ? 'text-lg xs:text-xl sm:text-2xl' : 'text-xl xs:text-2xl sm:text-3xl'} leading-none my-auto ${isSelected ? 'text-white dark:text-zen-dark-on-primary' : 'text-zen-primary dark:text-zen-dark-text'}`}>
                      {cell.k}
                    </span>

                    <span className={`text-[9px] xs:text-2xs sm:text-xs font-semibold font-mono tracking-wider uppercase ${isSelected ? 'text-white/90 dark:text-zen-dark-on-primary/90' : 'text-zen-text-muted dark:text-zen-dark-text-muted'}`}>
                      {cell.r}
                    </span>
                  </button>
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
          <div className="fixed bottom-24 xl:bottom-6 left-3 right-3 sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-xl z-30 animate-fade-in pointer-events-auto">
            <div className="zen-card p-3 sm:p-4 border-2 border-zen-primary dark:border-zen-dark-primary bg-white/95 dark:bg-zen-dark-surface/95 backdrop-blur-md shadow-2xl flex items-center justify-between gap-3 sm:gap-4">
              
              <div className="flex items-center gap-3 min-w-0 flex-1">
                {/* Kana badge: click to replay single kana syllable */}
                <button
                  type="button"
                  onClick={() => playKanaSound(selectedKana.k)}
                  title={`Riascolta sillaba ${selectedKana.k}`}
                  aria-label={`Riascolta sillaba ${selectedKana.k}`}
                  className="w-11 h-11 sm:w-13 sm:h-13 shrink-0 bg-zen-primary dark:bg-zen-dark-primary hover:bg-zen-primary-dark dark:hover:bg-zen-dark-primary-hover text-white dark:text-zen-dark-on-primary flex items-center justify-center font-kana text-2xl sm:text-3xl font-bold shadow-zen-sm transition-transform active:scale-95 cursor-pointer relative group border border-transparent"
                >
                  {selectedKana.k}
                  <Volume2 className="w-3 h-3 absolute top-1 right-1 opacity-60 group-hover:opacity-100 transition-opacity" />
                </button>

                <div className="min-w-0 flex-1 pr-1">
                  <div className="text-sm sm:text-base font-bold font-headline text-zen-text dark:text-zen-dark-text leading-tight">
                    Romaji: <span className="text-zen-primary dark:text-zen-dark-primary uppercase">{selectedKana.r}</span>
                  </div>
                  {exampleText && (
                    <button
                      type="button"
                      onClick={() => playKanaSound(exampleWord || selectedKana.k)}
                      title={`Ascolta parola d'esempio: ${exampleWord || selectedKana.k}`}
                      className="text-2xs sm:text-xs text-zen-text-muted dark:text-zen-dark-text-muted hover:text-zen-primary dark:hover:text-zen-dark-primary flex items-start gap-1.5 mt-0.5 text-left transition-colors group cursor-pointer w-full"
                    >
                      <Info className="w-3.5 h-3.5 text-zen-secondary dark:text-zen-dark-secondary shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                      <span className="break-words whitespace-normal leading-snug">
                        {t('table.exampleWord')}: <strong className="text-zen-text dark:text-zen-dark-text group-hover:text-zen-primary dark:group-hover:text-zen-dark-primary font-medium">{exampleText}</strong>
                      </span>
                    </button>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                {/* Audio button dedicated to the example word */}
                <button
                  type="button"
                  onClick={() => playKanaSound(exampleWord || selectedKana.k)}
                  title={`Ascolta parola d'esempio: ${exampleWord || selectedKana.k}`}
                  aria-label="Riproduci parola d'esempio"
                  className="px-2.5 sm:px-3.5 py-2 bg-zen-primary dark:bg-zen-dark-primary hover:bg-zen-primary-dark dark:hover:bg-zen-dark-primary-hover text-white dark:text-zen-dark-on-primary font-bold text-xs flex items-center gap-1.5 shadow-zen-sm transition-transform active:scale-95 cursor-pointer border border-transparent"
                >
                  <Volume2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Audio</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedKana(null)}
                  aria-label="Chiudi dettaglio"
                  className="p-1.5 sm:p-2 text-zen-text-muted dark:text-zen-dark-text-muted hover:text-zen-text dark:hover:text-zen-dark-text hover:bg-zen-surface-container dark:hover:bg-zen-dark-bg/60 transition-colors cursor-pointer border border-transparent"
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

