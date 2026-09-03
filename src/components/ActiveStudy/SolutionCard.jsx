import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Volume2, CheckCircle2, XCircle } from 'lucide-react';
import { playKanaSound } from '../../utils/audio';
import { useLanguage } from '../../context/LanguageContext';

export default function SolutionCard({ item, onNext, status }) {
    const { lang, t } = useLanguage();
    const buttonRef = useRef(null);
    if (!item) return null;

    const japaneseText = item.japanese || item.kana || item.romaji;

    useEffect(() => {
        if (japaneseText) {
            playKanaSound(japaneseText);
        }
    }, [item]);

    // Handle Enter key to proceed to next question
    useEffect(() => {
        buttonRef.current?.focus();

        const handleKeyDown = (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                onNext?.();
            }
        };

        // Small timeout to prevent catching the Enter key that submitted the answer
        const timer = setTimeout(() => {
            window.addEventListener('keydown', handleKeyDown);
        }, 80);

        return () => {
            clearTimeout(timer);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onNext]);

    const handlePlayAudio = () => {
        if (japaneseText) {
            playKanaSound(japaneseText);
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl mx-auto zen-card bg-zen-surface-lowest dark:bg-zen-dark-surface rounded-3xl shadow-zen-xl dark:shadow-zen-dark-lg border-2 border-zen-border/40 dark:border-zen-dark-border overflow-hidden"
        >
            {/* Integrated Outcome Status Banner */}
            {status && (
                <div className={`py-3 px-6 text-center text-xs font-extrabold uppercase tracking-widest flex items-center justify-center gap-2 border-b ${
                    status === 'success' 
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30' 
                        : 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30'
                }`}>
                    {status === 'success' ? (
                        <>
                            <CheckCircle2 className="w-4 h-4" />
                            <span>{t('activeStudy.correct')}</span>
                        </>
                    ) : (
                        <>
                            <XCircle className="w-4 h-4" />
                            <span>{t('activeStudy.wrong')}</span>
                        </>
                    )}
                </div>
            )}

            <div className="relative bg-zen-surface-container/40 dark:bg-zen-dark-surface-high p-6 text-center border-b border-zen-border/40 dark:border-zen-dark-border">
                <h3 className="text-xs font-bold text-zen-text-muted dark:text-zen-dark-text-muted uppercase tracking-widest mb-4">
                    {t('activeStudy.solutionTitle')}
                </h3>
                
                <button
                    type="button"
                    onClick={handlePlayAudio}
                    className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2.5 bg-zen-primary/10 dark:bg-zen-dark-primary/20 text-zen-primary dark:text-zen-dark-primary hover:bg-zen-primary/20 rounded-full border border-zen-primary/20 dark:border-zen-dark-border transition-all active:scale-95 shadow-sm"
                    title="Pronounce word"
                    aria-label="Pronounce word"
                >
                    <Volume2 className="w-5 h-5" />
                </button>

                {/* Furigana + Kanji/Kana */}
                <div className="flex items-center justify-center mb-2">
                    {item.furigana && Array.isArray(item.furigana) ? (
                        <div className="flex justify-center items-end space-x-1">
                            {item.furigana.map((f, i) => (
                                <div key={i} className="flex flex-col items-center">
                                    <span className="text-zen-text-muted dark:text-zen-dark-text-muted text-sm h-5">{f.reading || ''}</span>
                                    <span className="text-5xl font-kana font-bold text-zen-primary dark:text-zen-dark-primary">{f.text}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-5xl font-kana font-bold text-zen-primary dark:text-zen-dark-primary">
                            {item.japanese || item.kana}
                        </div>
                    )}
                </div>
                
                <div className="text-2xl font-headline font-bold text-zen-text dark:text-zen-dark-primary mt-2">
                    {item.romaji}
                </div>
                {item.script && (
                    <div className="mt-2">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-2xs uppercase tracking-wider font-extrabold bg-zen-primary/10 dark:bg-zen-dark-primary/20 text-zen-primary dark:text-zen-dark-primary border border-zen-primary/20 dark:border-zen-dark-border">
                            {item.script === 'katakana' ? (t('activeStudy.scriptKatakanaShort') || 'Katakana') : (t('activeStudy.scriptHiraganaShort') || 'Hiragana')}
                        </span>
                    </div>
                )}
            </div>

            <div className="p-6 sm:p-8 space-y-6 text-center">
                {/* Meaning in current active language */}
                <div className="py-2">
                    <span className="block text-2xs uppercase tracking-widest font-extrabold text-zen-text-muted dark:text-zen-dark-text-muted mb-2">
                        {lang === 'it' ? 'Significato' : 'Meaning'}
                    </span>
                    <div className="text-2xl sm:text-3xl font-headline font-bold text-zen-text dark:text-zen-dark-text capitalize">
                        {lang === 'it' ? (item.italian || item.english) : (item.english || item.italian)}
                    </div>
                </div>

                {/* Accepted Romaji variants (if any) */}
                {item.acceptedRomaji && item.acceptedRomaji.length > 1 && (
                    <div className="pt-3 border-t border-zen-border/30 dark:border-zen-dark-border/40 flex items-center justify-between text-xs px-2">
                        <span className="text-zen-text-muted dark:text-zen-dark-text-muted">{t('activeStudy.acceptedVariants')}</span>
                        <span className="text-zen-text dark:text-zen-dark-text font-mono font-bold">
                            {item.acceptedRomaji.filter(r => r !== item.romaji).join(', ')}
                        </span>
                    </div>
                )}

                <div className="pt-2">
                    <button
                        ref={buttonRef}
                        type="button"
                        onClick={onNext}
                        className="w-full py-4 rounded-2xl bg-zen-primary hover:bg-zen-primary-dark dark:bg-zen-dark-primary dark:hover:bg-zen-dark-primary-hover text-white dark:text-zen-dark-on-primary font-bold text-xs uppercase tracking-widest transition-all shadow-zen-sm active:scale-95 cursor-pointer"
                    >
                        {t('activeStudy.continueNext')}
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
