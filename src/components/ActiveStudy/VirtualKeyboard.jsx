import React, { useState } from 'react';
import { HIRAGANA_GRID, DAKUTEN_HIRAGANA_GRID, KATAKANA_GRID, DAKUTEN_KATAKANA_GRID } from '../../data/kanaTables';

export default function VirtualKeyboard({ onKeyPress, onBackspace, disabled }) {
    const [script, setScript] = useState('hiragana'); // 'hiragana' or 'katakana'
    const [showDakuten, setShowDakuten] = useState(false);

    let activeGrid = HIRAGANA_GRID;
    if (script === 'hiragana' && showDakuten) activeGrid = DAKUTEN_HIRAGANA_GRID;
    if (script === 'katakana' && !showDakuten) activeGrid = KATAKANA_GRID;
    if (script === 'katakana' && showDakuten) activeGrid = DAKUTEN_KATAKANA_GRID;

    return (
        <div className="w-full max-w-2xl mx-auto mt-8 bg-slate-800 p-4 rounded-2xl shadow-xl border border-slate-700 select-none">
            
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4 px-2 gap-3">
                <div className="flex space-x-2">
                    <button
                        onClick={() => setScript('hiragana')}
                        className={`px-3 py-1.5 rounded-lg font-bold text-xs uppercase tracking-widest transition-colors ${
                            script === 'hiragana' 
                                ? 'bg-indigo-600 text-white' 
                                : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                        }`}
                    >
                        Hiragana
                    </button>
                    <button
                        onClick={() => setScript('katakana')}
                        className={`px-3 py-1.5 rounded-lg font-bold text-xs uppercase tracking-widest transition-colors ${
                            script === 'katakana' 
                                ? 'bg-indigo-600 text-white' 
                                : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                        }`}
                    >
                        Katakana
                    </button>
                </div>
                
                <div className="flex space-x-2 items-center">
                    <label className="flex items-center cursor-pointer space-x-2 text-sm text-slate-300 font-bold uppercase tracking-widest">
                        <span>Dakuten</span>
                        <div className="relative">
                            <input 
                                type="checkbox" 
                                className="sr-only" 
                                checked={showDakuten}
                                onChange={() => setShowDakuten(!showDakuten)}
                            />
                            <div className={`block w-10 h-6 rounded-full transition-colors ${showDakuten ? 'bg-indigo-500' : 'bg-slate-600'}`}></div>
                            <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${showDakuten ? 'transform translate-x-4' : ''}`}></div>
                        </div>
                    </label>
                    
                    <button
                        onClick={onBackspace}
                        disabled={disabled}
                        className="ml-2 px-3 py-1.5 bg-rose-600/20 text-rose-300 rounded-lg hover:bg-rose-600/40 transition-colors font-bold text-xs uppercase tracking-widest border border-rose-500/30 disabled:opacity-50"
                    >
                        Del
                    </button>
                </div>
            </div>

            <div className="grid gap-2">
                {activeGrid.map((row, rIdx) => (
                    <div key={rIdx} className="grid grid-cols-5 gap-2">
                        {row.map((item, cIdx) => (
                            <button
                                key={`${rIdx}-${cIdx}`}
                                onClick={() => item && onKeyPress(item.k)}
                                disabled={!item || disabled}
                                className={`
                                    h-12 sm:h-14 rounded-lg flex items-center justify-center transition-all font-japanese text-xl sm:text-2xl
                                    ${item 
                                        ? 'bg-slate-700 hover:bg-slate-600 text-slate-100 shadow-sm active:scale-95 border-b-2 border-slate-900 active:border-t-2 active:border-b-0' 
                                        : 'invisible'}
                                    disabled:opacity-50 disabled:active:scale-100 disabled:active:border-b-2
                                `}
                            >
                                {item ? item.k : null}
                            </button>
                        ))}
                    </div>
                ))}
            </div>
            
        </div>
    );
}
