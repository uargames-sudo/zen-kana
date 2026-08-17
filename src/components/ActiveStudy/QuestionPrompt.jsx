import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';

export default function QuestionPrompt({ currentWord, mode, difficulty }) {
    const { t } = useLanguage();
    if (!currentWord) return null;

    // mode: 'ja-to-ro' or 'ro-to-ja'
    const isJaToRo = mode === 'ja-to-ro';
    const showScriptHint = difficulty === 'easy';
    
    return (
        <div className="flex flex-col items-center justify-center p-8 zen-card bg-zen-surface-lowest dark:bg-zen-dark-surface rounded-3xl shadow-zen-lg dark:shadow-zen-dark-lg border-2 border-zen-border/40 dark:border-zen-dark-border min-h-[220px]">
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={currentWord.id + mode}
                className="text-center"
            >
                {isJaToRo ? (
                    <>
                        {currentWord.furigana && Array.isArray(currentWord.furigana) ? (
                            <div className="flex justify-center items-end space-x-1 mb-2">
                                {currentWord.furigana.map((f, i) => (
                                    <div key={i} className="flex flex-col items-center">
                                        <span className="text-zen-text-muted dark:text-zen-dark-text-muted text-sm h-5">{f.reading || ''}</span>
                                        <span className="text-5xl font-kana font-bold text-zen-text dark:text-zen-dark-text">{f.text}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-6xl sm:text-7xl font-kana font-bold text-zen-primary dark:text-zen-dark-primary tracking-wider">
                                {currentWord.japanese || currentWord.kana}
                            </div>
                        )}
                        <div className="mt-4 text-zen-text-muted dark:text-zen-dark-text-muted text-xs font-semibold uppercase tracking-widest">
                            {t('activeStudy.translateToRomaji')}
                        </div>
                    </>
                ) : (
                    <>
                        <div className="text-5xl sm:text-6xl font-headline font-bold text-zen-text dark:text-zen-dark-text tracking-wider">
                            {currentWord.romaji}
                        </div>
                        <div className="mt-4 text-zen-text-muted dark:text-zen-dark-text-muted text-xs font-semibold uppercase tracking-widest">
                            {t('activeStudy.writeInJapanese')}
                        </div>
                        {showScriptHint && (
                            <div className="mt-2.5 inline-block px-3 py-1 bg-zen-primary/10 dark:bg-zen-dark-primary/20 text-zen-primary dark:text-zen-dark-primary rounded-full text-xs font-bold uppercase tracking-widest border border-zen-primary/20 dark:border-zen-dark-border">
                                {t('activeStudy.scriptHint')} {currentWord.script || 'hiragana'}
                            </div>
                        )}
                    </>
                )}
            </motion.div>
        </div>
    );
}
