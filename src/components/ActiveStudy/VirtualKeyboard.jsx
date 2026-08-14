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
        <div className="w-full max-w-2xl mx-auto mt-6 bg-slate-800/90 p-4 rounded-2xl shadow-xl border border-slate-700/80 select-none">
            
            {readOnly && (
                <div className="flex items-center justify-center gap-2 mb-3 py-1.5 px-3 bg-indigo-950/50 border border-indigo-500/30 rounded-lg text-indigo-300 text-xs font-bold uppercase tracking-wider">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{t('keyboard.consultationNotice')}</span>
                </div>
            )}

            {/* Top Toolbar: Script switch & Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-3 px-1 gap-3">
                <div className="flex space-x-2">
                    <button
                        type="button"
                        onClick={() => setScript('hiragana')}
                        className={`px-3.5 py-1.5 rounded-lg font-bold text-xs uppercase tracking-widest transition-all ${
                            script === 'hiragana' 
                                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/30' 
                                : 'bg-slate-700 text-slate-400 hover:bg-slate-600 hover:text-slate-200'
                        }`}
                    >
                        {t('keyboard.hiragana')}
                    </button>
                    <button
                        type="button"
                        onClick={() => setScript('katakana')}
                        className={`px-3.5 py-1.5 rounded-lg font-bold text-xs uppercase tracking-widest transition-all ${
                            script === 'katakana' 
                                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/30' 
                                : 'bg-slate-700 text-slate-400 hover:bg-slate-600 hover:text-slate-200'
                        }`}
                    >
                        {t('keyboard.katakana')}
                    </button>
                </div>
                
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    {allowToggleRomaji && (
                        <button
                            type="button"
                            onClick={() => setRomajiToggled(!romajiToggled)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs uppercase tracking-wider transition-all border ${
                                romajiToggled
                                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                                    : 'bg-slate-700/60 text-slate-400 border-slate-600 hover:bg-slate-700 hover:text-slate-200'
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
                            className="px-3.5 py-1.5 bg-rose-600/20 text-rose-300 rounded-lg hover:bg-rose-600/40 transition-colors font-bold text-xs uppercase tracking-widest border border-rose-500/30 disabled:opacity-50"
                        >
                            {t('keyboard.del')}
                        </button>
                    )}
                </div>
            </div>

            {/* Category Navigation Pills */}
            <div className="flex flex-wrap gap-1.5 mb-4 p-1 bg-slate-900/60 rounded-xl border border-slate-700/50">
                {categories.map(cat => (
                    <button
                        key={cat.id}
                        type="button"
                        onClick={() => setCategory(cat.id)}
                        className={`flex-1 min-w-[80px] py-1.5 px-2 rounded-lg text-xs font-bold transition-all text-center ${
                            category === cat.id
                                ? 'bg-indigo-600 text-white shadow-sm'
                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
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
                                    h-14 sm:h-16 rounded-xl flex flex-col items-center justify-center transition-all
                                    ${item 
                                        ? readOnly
                                            ? 'bg-slate-700/80 text-slate-100 border border-slate-600/60 cursor-default'
                                            : 'bg-slate-700 hover:bg-slate-600 text-slate-100 shadow-sm active:scale-95 border-b-2 border-slate-900 active:border-t-2 active:border-b-0 cursor-pointer'
                                        : 'invisible'}
                                    disabled:opacity-50 disabled:active:scale-100 disabled:active:border-b-2
                                `}
                            >
                                {item ? (
                                    <>
                                        <span className="font-japanese text-xl sm:text-2xl font-bold leading-tight">{item.k}</span>
                                        {isRomajiVisible && (
                                            <span className="text-[10px] sm:text-xs text-slate-400 font-mono tracking-wider leading-none mt-0.5">
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
