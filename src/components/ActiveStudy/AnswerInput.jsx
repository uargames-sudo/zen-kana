import React, { useEffect, useRef } from 'react';
import { CornerDownLeft } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function AnswerInput({ value, onChange, onSubmit, diff, disabled, mode, attempts = 0, maxAttempts = 3 }) {
    const { t } = useLanguage();
    const inputRef = useRef(null);
    
    useEffect(() => {
        if (!disabled && mode === 'ja-to-ro') {
            inputRef.current?.focus();
        }
    }, [disabled, mode]);

    const remainingAttempts = Math.max(0, maxAttempts - attempts);

    const renderDiff = () => {
        if (!diff || diff.length === 0) return null;
        return (
            <div className="mt-2 text-lg font-mono tracking-widest flex justify-center space-x-[2px] bg-zen-surface-container dark:bg-zen-dark-surface-high p-2.5 rounded-xl border border-zen-border/40 dark:border-zen-dark-border shadow-zen-sm">
                {diff.map((token, idx) => (
                    <span 
                        key={idx} 
                        className={token.err ? "text-rose-500 font-bold underline decoration-rose-500/50" : "text-emerald-600 dark:text-emerald-400 opacity-60"}
                    >
                        {token.err ? `[${token.char}]` : token.char}
                    </span>
                ))}
            </div>
        );
    };

    return (
        <div className="w-full max-w-xl mx-auto space-y-2.5">
            <form 
                onSubmit={(e) => {
                    e.preventDefault();
                    if (!disabled && value.trim()) onSubmit();
                }}
                className="relative"
            >
                <div className="relative w-full">
                    <input
                        ref={inputRef}
                        type="text"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        disabled={disabled || mode === 'ro-to-ja'}
                        placeholder={mode === 'ja-to-ro' ? t('activeStudy.inputPlaceholderJaToRo') : t('activeStudy.inputPlaceholderRoToJa')}
                        className="w-full bg-zen-surface-lowest dark:bg-zen-dark-surface border-2 border-zen-border/60 dark:border-zen-dark-border rounded-2xl py-3.5 pl-6 pr-14 text-xl text-center text-zen-text dark:text-zen-dark-text placeholder:text-zen-text-muted dark:placeholder:text-zen-dark-text-muted focus:outline-none focus:border-zen-primary dark:focus:border-zen-dark-primary transition-colors disabled:opacity-75 font-mono shadow-zen-sm"
                        autoComplete="off"
                        autoCorrect="off"
                        spellCheck="false"
                    />

                    {/* Integrated Submit / Enter Icon Button */}
                    <button
                        type="submit"
                        disabled={disabled || !value.trim()}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-xl bg-zen-primary hover:bg-zen-primary-dark dark:bg-zen-dark-primary dark:hover:bg-zen-dark-primary-hover text-white dark:text-zen-dark-on-primary shadow-zen-sm transition-all disabled:opacity-30 disabled:pointer-events-none active:scale-95 flex items-center justify-center"
                        title={t('activeStudy.submitAnswer')}
                        aria-label={t('activeStudy.submitAnswer')}
                    >
                        <CornerDownLeft className="w-4 h-4 stroke-[2.5]" />
                    </button>
                </div>
                
                {renderDiff()}
            </form>

            {/* Attempts Indicator Bar */}
            <div className="flex items-center justify-center gap-2 text-2xs uppercase tracking-widest font-bold text-zen-text-muted dark:text-zen-dark-text-muted">
                <span>{t('activeStudy.attemptsRemaining')}</span>
                <div className="flex items-center gap-1">
                    {Array.from({ length: maxAttempts }).map((_, idx) => {
                        const isAvailable = idx < remainingAttempts;
                        return (
                            <span 
                                key={idx}
                                className={`w-2 h-2 rounded-full transition-all ${
                                    isAvailable 
                                        ? 'bg-zen-primary dark:bg-zen-dark-primary ring-2 ring-zen-primary/20 dark:ring-zen-dark-primary/30' 
                                        : 'bg-zen-surface-container dark:bg-zen-dark-surface-high border border-zen-border/40 dark:border-zen-dark-border'
                                }`}
                                title={`Tentativo ${idx + 1}`}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
