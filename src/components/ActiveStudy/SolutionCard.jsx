import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Volume2 } from 'lucide-react';
import { playKanaSound } from '../../utils/audio';
import { useLanguage } from '../../context/LanguageContext';

export default function SolutionCard({ item, onNext }) {
    const { lang, t } = useLanguage();
    if (!item) return null;

    const japaneseText = item.japanese || item.kana || item.romaji;

    useEffect(() => {
        if (japaneseText) {
            playKanaSound(japaneseText);
        }
    }, [item]);

    const handlePlayAudio = () => {
        if (japaneseText) {
            playKanaSound(japaneseText);
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md mx-auto mt-6 zen-card bg-white dark:bg-zen-dark-surface-high rounded-3xl shadow-zen-xl dark:shadow-zen-dark-lg border-2 border-zen-surface-high dark:border-zen-dark-border overflow-hidden"
        >
            <div className="bg-zen-surface-container/40 dark:bg-zen-dark-surface p-6 text-center border-b border-zen-border/40 dark:border-zen-dark-border">
                <h3 className="text-xs font-bold text-zen-text-muted dark:text-zen-dark-text-muted uppercase tracking-widest mb-4">
                    {t('activeStudy.solutionTitle')}
                </h3>
                
                {/* Furigana + Kanji/Kana & Audio button */}
                <div className="flex items-center justify-center gap-3 mb-2">
                    {item.furigana && Array.isArray(item.furigana) ? (
                        <div className="flex justify-center items-end space-x-1">
                            {item.furigana.map((f, i) => (
                                <div key={i} className="flex flex-col items-center">
                                    <span className="text-zen-text-muted dark:text-zen-dark-text-muted text-sm h-5">{f.reading || ''}</span>
                                    <span className="text-5xl font-kana font-bold text-zen-primary dark:text-white">{f.text}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-5xl font-kana font-bold text-zen-primary dark:text-white">
                            {item.japanese || item.kana}
                        </div>
                    )}
                    
                    <button
                        type="button"
                        onClick={handlePlayAudio}
                        className="p-2.5 bg-zen-primary/10 dark:bg-zen-dark-primary/20 text-zen-primary dark:text-zen-dark-primary hover:bg-zen-primary/20 rounded-full border border-zen-primary/20 dark:border-zen-dark-border transition-all active:scale-95 shadow-sm"
                        title="Pronounce word"
                        aria-label="Pronounce word"
                    >
                        <Volume2 className="w-5 h-5" />
                    </button>
                </div>
                
                <div className="text-2xl font-headline font-bold text-zen-text dark:text-zen-dark-primary mt-2">
                    {item.romaji}
                </div>
            </div>

            <div className="p-6 space-y-3.5">
                {item.acceptedRomaji && item.acceptedRomaji.length > 1 && (
                    <div className="flex justify-between items-center text-xs border-b border-zen-border/30 dark:border-zen-dark-border/40 pb-2">
                        <span className="text-zen-text-muted dark:text-zen-dark-text-muted">{t('activeStudy.acceptedVariants')}</span>
                        <span className="text-zen-text dark:text-zen-dark-text font-mono font-bold">
                            {item.acceptedRomaji.filter(r => r !== item.romaji).join(', ')}
                        </span>
                    </div>
                )}
                
                {lang === 'it' ? (
                    <>
                        <div className="flex justify-between items-center text-xs border-b border-zen-border/30 dark:border-zen-dark-border/40 pb-2">
                            <span className="text-zen-text-muted dark:text-zen-dark-text-muted">{t('activeStudy.italianTranslation')}</span>
                            <span className="text-zen-text dark:text-zen-dark-text font-bold">{item.italian}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs border-b border-zen-border/30 dark:border-zen-dark-border/40 pb-2">
                            <span className="text-zen-text-muted dark:text-zen-dark-text-muted">{t('activeStudy.englishTranslation')}</span>
                            <span className="text-zen-text-muted dark:text-zen-dark-text-muted">{item.english}</span>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="flex justify-between items-center text-xs border-b border-zen-border/30 dark:border-zen-dark-border/40 pb-2">
                            <span className="text-zen-text-muted dark:text-zen-dark-text-muted">{t('activeStudy.englishTranslation')}</span>
                            <span className="text-zen-text dark:text-zen-dark-text font-bold">{item.english}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs border-b border-zen-border/30 dark:border-zen-dark-border/40 pb-2">
                            <span className="text-zen-text-muted dark:text-zen-dark-text-muted">{t('activeStudy.italianTranslation')}</span>
                            <span className="text-zen-text-muted dark:text-zen-dark-text-muted">{item.italian}</span>
                        </div>
                    </>
                )}

                <div className="pt-2">
                    <button
                        onClick={onNext}
                        className="w-full py-3.5 rounded-2xl bg-zen-primary hover:bg-zen-primary-dark dark:bg-zen-dark-primary dark:hover:bg-zen-dark-primary-hover text-white dark:text-zen-dark-on-primary font-bold text-xs uppercase tracking-widest transition-all shadow-zen-sm active:scale-95"
                    >
                        {t('activeStudy.continueNext')}
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
