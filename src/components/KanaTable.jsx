import React, { useState } from 'react';
import { Volume2, Info } from 'lucide-react';
import { HIRAGANA_BASIC, KANA_DAKUTEN, KANA_COMBINATION, getKanaExample } from '../data/kanaData';
import { playKanaSound } from '../utils/audio';
import { useLanguage } from '../context/LanguageContext';

export default function KanaTable({ scriptMode }) {
  const { lang, t } = useLanguage();
  const [activeTab, setActiveTab] = useState('basic');
  const [selectedKana, setSelectedKana] = useState(null);

  const isHiragana = scriptMode === 'hiragana';

  const getKanaList = () => {
    switch (activeTab) {
      case 'dakuten':
        return KANA_DAKUTEN;
      case 'combination':
        return KANA_COMBINATION;
      default:
        return HIRAGANA_BASIC;
    }
  };

  const handleCardClick = (item) => {
    if (!item.hiragana && !item.katakana) return;
    const char = isHiragana ? item.hiragana : item.katakana;
    setSelectedKana(item);
    playKanaSound(char);
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-headline font-bold text-zen-text dark:text-zen-dark-text">
            {isHiragana ? 'Hiragana (ひらがな)' : 'Katakana (カタカナ)'} {t('table.title')}
          </h2>
          <p className="text-sm text-zen-text-muted dark:text-zen-dark-text-muted mt-1">
            {t('table.subtitle')}
          </p>
        </div>

        {/* Sub-tabs: Basic, Dakuten, Combination */}
        <div className="flex items-center bg-zen-surface-container dark:bg-zen-dark-surface p-1 rounded-xl border border-zen-border/40 dark:border-zen-dark-border self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('basic')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'basic'
                ? 'bg-white dark:bg-zen-dark-primary text-zen-primary dark:text-zen-dark-on-primary shadow-zen-sm'
                : 'text-zen-text-muted dark:text-zen-dark-text-muted hover:text-zen-text dark:hover:text-zen-dark-text'
            }`}
          >
            {t('table.tabBasic')}
          </button>
          <button
            onClick={() => setActiveTab('dakuten')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'dakuten'
                ? 'bg-white dark:bg-zen-dark-primary text-zen-primary dark:text-zen-dark-on-primary shadow-zen-sm'
                : 'text-zen-text-muted dark:text-zen-dark-text-muted hover:text-zen-text dark:hover:text-zen-dark-text'
            }`}
          >
            {t('table.tabDakuten')}
          </button>
          <button
            onClick={() => setActiveTab('combination')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'combination'
                ? 'bg-white dark:bg-zen-dark-primary text-zen-primary dark:text-zen-dark-on-primary shadow-zen-sm'
                : 'text-zen-text-muted dark:text-zen-dark-text-muted hover:text-zen-text dark:hover:text-zen-dark-text'
            }`}
          >
            {t('table.tabCombination')}
          </button>
        </div>
      </div>

      {/* Grid of Kana Cards */}
      <div className="grid grid-cols-5 sm:grid-cols-5 md:grid-cols-5 lg:grid-cols-5 gap-2.5 sm:gap-4">
        {getKanaList().map((item, idx) => {
          const char = isHiragana ? item.hiragana : item.katakana;
          if (!char) {
            return (
              <div
                key={`empty-${idx}`}
                className="aspect-square rounded-2xl bg-transparent border border-dashed border-zen-surface-high/60 dark:border-zen-dark-border/60"
              />
            );
          }

          const isSelected = selectedKana?.romaji === item.romaji;

          return (
            <div
              key={`${char}-${idx}`}
              onClick={() => handleCardClick(item)}
              className={`aspect-square rounded-2xl p-2 sm:p-4 flex flex-col items-center justify-between cursor-pointer transition-all duration-200 ${
                isSelected
                  ? 'bg-zen-primary dark:bg-zen-dark-primary text-white dark:text-zen-dark-on-primary ring-4 ring-zen-primary-light dark:ring-zen-dark-primary/40 shadow-zen-lg scale-105'
                  : 'zen-card bg-white dark:bg-zen-dark-surface-high border border-zen-surface-high dark:border-zen-dark-border hover:border-zen-primary-light dark:hover:border-zen-dark-primary hover:scale-102'
              }`}
            >
              <div className="w-full flex justify-end">
                <Volume2 className={`w-3.5 h-3.5 ${isSelected ? 'text-white dark:text-zen-dark-on-primary' : 'text-zen-primary/50 dark:text-zen-dark-text-muted'}`} />
              </div>

              <span className={`font-kana font-bold text-3xl sm:text-5xl ${isSelected ? 'text-white dark:text-zen-dark-on-primary' : 'text-zen-primary dark:text-zen-dark-text'}`}>
                {char}
              </span>

              <span className={`text-xs sm:text-sm font-semibold tracking-wider ${isSelected ? 'text-white/90 dark:text-zen-dark-on-primary/90' : 'text-zen-text-muted dark:text-zen-dark-text-muted'}`}>
                {item.romaji}
              </span>
            </div>
          );
        })}
      </div>

      {/* Detail info bar when character is selected */}
      {selectedKana && (
        <div className="zen-card p-4 sm:p-5 border border-zen-primary-light/60 dark:border-zen-dark-border bg-zen-surface-lowest dark:bg-zen-dark-surface flex items-center justify-between gap-4 animate-fade-in">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-zen-primary dark:bg-zen-dark-primary text-white dark:text-zen-dark-on-primary flex items-center justify-center font-kana text-3xl font-bold">
              {isHiragana ? selectedKana.hiragana : selectedKana.katakana}
            </div>
            <div>
              <div className="text-lg font-bold font-headline text-zen-text dark:text-zen-dark-text capitalize">
                Romaji: <span className="text-zen-primary dark:text-zen-dark-primary">{selectedKana.romaji}</span>
              </div>
              <div className="text-xs text-zen-text-muted dark:text-zen-dark-text-muted flex items-center gap-1.5 mt-0.5">
                <Info className="w-3.5 h-3.5 text-zen-secondary dark:text-zen-dark-secondary" /> {t('table.exampleWord')}: {getKanaExample(selectedKana, lang)}
              </div>
            </div>
          </div>

          <button
            onClick={() => playKanaSound(isHiragana ? selectedKana.hiragana : selectedKana.katakana)}
            className="px-4 py-2.5 rounded-xl bg-zen-primary dark:bg-zen-dark-primary hover:bg-zen-primary-dark dark:hover:bg-zen-dark-primary-hover text-white dark:text-zen-dark-on-primary font-bold text-xs flex items-center gap-2 shadow-zen-sm"
          >
            <Volume2 className="w-4 h-4" /> Audio
          </button>
        </div>
      )}
    </div>
  );
}
