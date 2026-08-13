import { HIRAGANA_GRID, KATAKANA_GRID, DAKUTEN_HIRAGANA_GRID, DAKUTEN_KATAKANA_GRID } from '../../data/kanaTables';

export default function KanaSidePanel({ isOpen, onClose }) {
    if (!isOpen) return null;

    const renderGrid = (grid, title) => (
        <div className="mb-8">
            <h3 className="text-xl font-bold text-slate-300 mb-4">{title}</h3>
            <div className="grid gap-2">
                {grid.map((row, rIdx) => (
                    <div key={rIdx} className="grid grid-cols-5 gap-2">
                        {row.map((item, cIdx) => (
                            <div 
                                key={`${rIdx}-${cIdx}`}
                                className={`
                                    h-16 flex flex-col items-center justify-center rounded-lg
                                    ${item ? 'bg-slate-800 text-slate-100 border border-slate-700' : ''}
                                `}
                            >
                                {item ? (
                                    <>
                                        <span className="font-japanese text-xl">{item.k}</span>
                                        <span className="text-[10px] text-slate-400 font-mono tracking-widest">{item.r}</span>
                                    </>
                                ) : null}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-md bg-slate-900 h-full overflow-y-auto shadow-2xl border-l border-slate-700 flex flex-col">
                <div className="p-6 border-b border-slate-800 flex justify-between items-center sticky top-0 bg-slate-900/90 backdrop-blur-md z-10">
                    <h2 className="text-2xl font-bold text-slate-100 uppercase tracking-wider">Kana Tables</h2>
                    <button 
                        onClick={onClose}
                        className="p-2 bg-slate-800 text-slate-400 hover:text-slate-100 rounded-lg transition-colors"
                    >
                        Close
                    </button>
                </div>
                
                <div className="p-6">
                    {renderGrid(HIRAGANA_GRID, 'Hiragana')}
                    {renderGrid(DAKUTEN_HIRAGANA_GRID, 'Hiragana Dakuten')}
                    {renderGrid(KATAKANA_GRID, 'Katakana')}
                    {renderGrid(DAKUTEN_KATAKANA_GRID, 'Katakana Dakuten')}
                </div>
            </div>
        </div>
    );
}
