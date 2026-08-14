import React, { useEffect, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';

export default function AnswerInput({ value, onChange, onSubmit, diff, disabled, mode }) {
    const { t } = useLanguage();
    const inputRef = useRef(null);
    
    useEffect(() => {
        if (!disabled && mode === 'ja-to-ro') {
            inputRef.current?.focus();
        }
    }, [disabled, mode]);

    const renderDiff = () => {
        if (!diff || diff.length === 0) return null;
        return (
            <div className="mt-2 text-lg font-mono tracking-widest flex justify-center space-x-[2px] bg-zen-surface-container dark:bg-zen-dark-surface p-2.5 rounded-xl border border-zen-border/40 dark:border-zen-dark-border shadow-zen-sm">
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
        <div className="w-full max-w-md mx-auto mt-6">
            <form 
                onSubmit={(e) => {
                    e.preventDefault();
                    if (!disabled && value.trim()) onSubmit();
                }}
                className="relative"
            >
                <input
                    ref={inputRef}
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    disabled={disabled || mode === 'ro-to-ja'}
                    placeholder={mode === 'ja-to-ro' ? t('activeStudy.inputPlaceholderJaToRo') : t('activeStudy.inputPlaceholderRoToJa')}
                    className="w-full bg-white dark:bg-zen-dark-surface border-2 border-zen-border/60 dark:border-zen-dark-border rounded-2xl py-3.5 px-6 text-xl text-center text-zen-text dark:text-zen-dark-text placeholder:text-zen-text-muted dark:placeholder:text-zen-dark-text-muted focus:outline-none focus:border-zen-primary dark:focus:border-zen-dark-primary transition-colors disabled:opacity-50 font-mono shadow-zen-sm"
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck="false"
                />
                
                {renderDiff()}
            </form>
        </div>
    );
}
