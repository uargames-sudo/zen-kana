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
            <div className="mt-2 text-lg font-mono tracking-widest flex justify-center space-x-[2px] bg-slate-900 p-2 rounded-lg border border-slate-700">
                {diff.map((token, idx) => (
                    <span 
                        key={idx} 
                        className={token.err ? "text-red-400 font-bold underline decoration-red-400/50" : "text-emerald-400 opacity-50"}
                    >
                        {token.err ? `[${token.char}]` : token.char}
                    </span>
                ))}
            </div>
        );
    };

    return (
        <div className="w-full max-w-md mx-auto mt-8">
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
                    className="w-full bg-slate-900 border-2 border-slate-700 rounded-xl py-4 px-6 text-xl text-center text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors disabled:opacity-50 font-mono"
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck="false"
                />
                
                {renderDiff()}
            </form>
        </div>
    );
}
