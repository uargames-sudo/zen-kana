import React, { useState } from 'react';
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
} from '../../data/kanaTables';
import { Eye, EyeOff, BookOpen } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function VirtualKeyboard({ 
    onKeyPress, 
    onBackspace, 
    disabled = false, 
    readOnly = false,
    showRomaji = false,
    allowToggleRomaji = false
}) {
    const { t } = useLanguage();
    const [script, setScript] = useState('hiragana'); // 'hiragana' or 'katakana'
    const [category, setCategory] = useState('basic'); // 'basic', 'dakuten', 'handakuten', 'yoon', 'small'
    const [romajiToggled, setRomajiToggled] = useState(false);

    const isHiragana = script === 'hiragana';

    let activeGrid = HIRAGANA_GRID;
    let gridColsClass = 'grid-cols-5';

    switch (category) {
        case 'dakuten':
            activeGrid = isHiragana ? DAKUTEN_HIRAGANA_GRID : DAKUTEN_KATAKANA_GRID;
            gridColsClass = 'grid-cols-5';
            break;
        case 'handakuten':
            activeGrid = isHiragana ? HANDAKUTEN_HIRAGANA_GRID : HANDAKUTEN_KATAKANA_GRID;
            gridColsClass = 'grid-cols-5';
            break;
        case 'yoon':
            activeGrid = isHiragana ? YOON_HIRAGANA_GRID : YOON_KATAKANA_GRID;
            gridColsClass = 'grid-cols-3';
            break;
        case 'small':
            activeGrid = isHiragana ? SMALL_HIRAGANA_GRID : SMALL_KATAKANA_GRID;
            gridColsClass = 'grid-cols-5';
            break;
        default:
            activeGrid = isHiragana ? HIRAGANA_GRID : KATAKANA_GRID;
            gridColsClass = 'grid-cols-5';
            break;
    }

    const isRomajiVisible = showRomaji || (allowToggleRomaji && romajiToggled);

    const categories = [
        { id: 'basic', label: t('keyboard.basic') },
        { id: 'dakuten', label: t('keyboard.dakuten') },
        { id: 'handakuten', label: t('keyboard.handakuten') },
        { id: 'yoon', label: t('keyboard.yoon') },
        { id: 'small', label: t('keyboard.small') }
    ];

    return (
        <div className="w-full max-w-2xl mx-auto mt-6 zen-card bg-white dark:bg-zen-dark-surface-high p-4 sm:p-5 rounded-3xl shadow-zen-lg dark:shadow-zen-dark-lg border-2 border-zen-surface-high dark:border-zen-dark-border select-none">
            
            {readOnly && (
                <div className="flex items-center justify-center gap-2 mb-3 py-2 px-3 bg-zen-primary/10 dark:bg-zen-dark-primary/20 border border-zen-primary/20 dark:border-zen-dark-border rounded-xl text-zen-primary dark:text-zen-dark-primary text-xs font-bold uppercase tracking-wider">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{t('keyboard.consultationNotice')}</span>
                </div>
            )}

            {/* Top Toolbar: Script switch & Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-3 px-1 gap-2.5">
                <div className="flex space-x-2 bg-zen-surface-container/60 dark:bg-zen-dark-surface p-1 rounded-xl border border-zen-border/40 dark:border-zen-dark-border">
                    <button
                        type="button"
                        onClick={() => setScript('hiragana')}
                        className={`px-3 py-1.5 rounded-lg font-bold text-xs uppercase tracking-widest transition-all ${
                            script === 'hiragana' 
                                ? 'bg-zen-primary dark:bg-zen-dark-primary text-white dark:text-zen-dark-on-primary shadow-zen-sm' 
                                : 'text-zen-text-muted dark:text-zen-dark-text-muted hover:text-zen-text dark:hover:text-zen-dark-text'
                        }`}
                    >
                        {t('keyboard.hiragana')}
                    </button>
                    <button
                        type="button"
                        onClick={() => setScript('katakana')}
                        className={`px-3 py-1.5 rounded-lg font-bold text-xs uppercase tracking-widest transition-all ${
                            script === 'katakana' 
                                ? 'bg-zen-primary dark:bg-zen-dark-primary text-white dark:text-zen-dark-on-primary shadow-zen-sm' 
                                : 'text-zen-text-muted dark:text-zen-dark-text-muted hover:text-zen-text dark:hover:text-zen-dark-text'
                        }`}
                    >
                        {t('keyboard.katakana')}
                    </button>
                </div>
                
                <div className="flex flex-wrap items-center gap-2">
                    {allowToggleRomaji && (
                        <button
                            type="button"
                            onClick={() => setRomajiToggled(!romajiToggled)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all border ${
                                romajiToggled
                                    ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/40 shadow-sm'
                                    : 'bg-zen-surface-container dark:bg-zen-dark-surface text-zen-text-muted dark:text-zen-dark-text-muted border-zen-border/40 dark:border-zen-dark-border hover:text-zen-text'
                            }`}
                            title="Toggle Romaji sub-labels"
                        >
                            {romajiToggled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                            <span>{romajiToggled ? t('activeStudy.romajiOn') : t('activeStudy.romajiOff')}</span>
                        </button>
                    )}
                    
                    {!readOnly && (
                        <button
                            type="button"
                            onClick={onBackspace}
                            disabled={disabled}
                            className="px-3.5 py-1.5 bg-rose-500/10 text-rose-600 dark:text-rose-300 rounded-xl hover:bg-rose-500/20 transition-colors font-bold text-xs uppercase tracking-widest border border-rose-500/30 disabled:opacity-50"
                        >
                            {t('keyboard.del')}
                        </button>
                    )}
                </div>
            </div>

            {/* Category Navigation Pills */}
            <div className="flex flex-wrap gap-1 mb-4 p-1 bg-zen-surface-container/60 dark:bg-zen-dark-surface rounded-2xl border border-zen-border/40 dark:border-zen-dark-border">
                {categories.map(cat => (
                    <button
                        key={cat.id}
                        type="button"
                        onClick={() => setCategory(cat.id)}
                        className={`flex-1 min-w-[70px] py-1.5 px-2 rounded-xl text-xs font-bold transition-all text-center ${
                            category === cat.id
                                ? 'bg-white dark:bg-zen-dark-primary text-zen-primary dark:text-zen-dark-on-primary shadow-zen-sm'
                                : 'text-zen-text-muted dark:text-zen-dark-text-muted hover:text-zen-text dark:hover:text-zen-dark-text'
                        }`}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* Keys Grid */}
            <div className="grid gap-2">
                {activeGrid.map((row, rIdx) => (
                    <div key={rIdx} className={`grid ${gridColsClass} gap-2`}>
                        {row.map((item, cIdx) => (
                            <button
                                key={`${rIdx}-${cIdx}`}
                                type="button"
                                onClick={() => !readOnly && item && onKeyPress && onKeyPress(item.k)}
                                disabled={!item || (disabled && !readOnly)}
                                tabIndex={readOnly ? -1 : 0}
                                className={`
                                    h-14 sm:h-16 rounded-2xl flex flex-col items-center justify-center transition-all
                                    ${item 
                                        ? readOnly
                                            ? 'bg-zen-surface-container/50 dark:bg-zen-dark-surface/60 text-zen-text dark:text-zen-dark-text border border-zen-border/40 dark:border-zen-dark-border/40 cursor-default'
                                            : 'bg-white dark:bg-zen-dark-surface hover:bg-zen-surface-container dark:hover:bg-zen-dark-surface-high text-zen-text dark:text-zen-dark-text shadow-zen-sm active:scale-95 border border-zen-border/60 dark:border-zen-dark-border cursor-pointer'
                                        : 'invisible'}
                                    disabled:opacity-50 disabled:active:scale-100
                                `}
                            >
                                {item ? (
                                    <>
                                        <span className="font-kana text-xl sm:text-2xl font-bold leading-tight text-zen-primary dark:text-white">{item.k}</span>
                                        {isRomajiVisible && (
                                            <span className="text-[10px] sm:text-xs text-zen-text-muted dark:text-zen-dark-text-muted font-mono tracking-wider leading-none mt-0.5">
                                                {item.r}
                                            </span>
                                        )}
                                    </>
                                ) : null}
                            </button>
                        ))}
                    </div>
                ))}
            </div>
            
        </div>
    );
}
