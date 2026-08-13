import React from 'react';
import { motion } from 'framer-motion';

export default function SolutionCard({ item, onNext }) {
    if (!item) return null;

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md mx-auto mt-8 bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden"
        >
            <div className="bg-slate-900/50 p-6 text-center border-b border-slate-700">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Solution</h3>
                
                {/* Furigana + Kanji/Kana */}
                {item.furigana && Array.isArray(item.furigana) ? (
                    <div className="flex justify-center items-end space-x-1 mb-2">
                        {item.furigana.map((f, i) => (
                            <div key={i} className="flex flex-col items-center">
                                <span className="text-slate-400 text-sm h-5">{f.reading || ''}</span>
                                <span className="text-5xl font-japanese font-bold text-slate-100">{f.text}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-5xl font-japanese font-bold text-slate-100 mb-2">
                        {item.japanese || item.kana}
                    </div>
                )}
                
                <div className="text-2xl font-mono text-indigo-400 font-bold mt-4">
                    {item.romaji}
                </div>
            </div>

            <div className="p-6 space-y-4">
                {item.acceptedRomaji && item.acceptedRomaji.length > 1 && (
                    <div className="flex justify-between items-center text-sm border-b border-slate-700/50 pb-2">
                        <span className="text-slate-500">Accepted Variants</span>
                        <span className="text-slate-300 font-mono">
                            {item.acceptedRomaji.filter(r => r !== item.romaji).join(', ')}
                        </span>
                    </div>
                )}
                
                <div className="flex justify-between items-center text-sm border-b border-slate-700/50 pb-2">
                    <span className="text-slate-500">Italian</span>
                    <span className="text-slate-200 font-semibold">{item.italian}</span>
                </div>
                
                <div className="flex justify-between items-center text-sm border-b border-slate-700/50 pb-2">
                    <span className="text-slate-500">English</span>
                    <span className="text-slate-200 font-semibold">{item.english}</span>
                </div>

                <button
                    onClick={onNext}
                    className="w-full mt-6 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold uppercase tracking-widest transition-colors shadow-lg shadow-indigo-900/20 active:scale-95"
                >
                    Next
                </button>
            </div>
        </motion.div>
    );
}
