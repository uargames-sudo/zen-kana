import React from 'react';
import { motion } from 'framer-motion';

export default function QuestionPrompt({ currentWord, mode, difficulty, easyMode }) {
    if (!currentWord) return null;

    // mode: 'ja-to-ro' or 'ro-to-ja'
    const isJaToRo = mode === 'ja-to-ro';
    const showScriptHint = difficulty === 'easy' || easyMode;
    
    // For MVP, furigana might be an array of objects or just null, as per spec.
    // The normalized data doesn't have furigana for MVP (just hiragana/katakana words), 
    // but we can prepare it for the future.
    
    return (
        <div className="flex flex-col items-center justify-center p-8 bg-slate-800/50 rounded-2xl shadow-inner border border-slate-700/50 min-h-[200px]">
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={currentWord.id + mode}
                className="text-center"
            >
                {isJaToRo ? (
                    <>
                        {currentWord.furigana && Array.isArray(currentWord.furigana) ? (
                            <div className="flex justify-center items-end space-x-1 mb-2">
                                {currentWord.furigana.map((f, i) => (
                                    <div key={i} className="flex flex-col items-center">
                                        <span className="text-slate-400 text-sm h-5">{f.reading || ''}</span>
                                        <span className="text-5xl font-japanese font-bold text-slate-100">{f.text}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-6xl font-japanese font-bold text-slate-100 tracking-wider">
                                {currentWord.japanese || currentWord.kana}
                            </div>
                        )}
                        <div className="mt-4 text-slate-400 text-sm font-medium uppercase tracking-widest">
                            Translate to Romaji
                        </div>
                    </>
                ) : (
                    <>
                        <div className="text-6xl font-bold text-slate-100 tracking-wider font-mono">
                            {currentWord.romaji}
                        </div>
                        <div className="mt-4 text-slate-400 text-sm font-medium uppercase tracking-widest">
                            Write in Japanese (Kana)
                        </div>
                        {showScriptHint && (
                            <div className="mt-2 inline-block px-3 py-1 bg-indigo-900/50 text-indigo-300 rounded-full text-xs font-bold uppercase tracking-widest border border-indigo-500/30">
                                Hint: {currentWord.script || 'hiragana'}
                            </div>
                        )}
                    </>
                )}
            </motion.div>
        </div>
    );
}
