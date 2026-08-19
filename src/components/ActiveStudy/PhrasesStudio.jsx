import React, { useState } from 'react';
import { phrasesData, phraseCategories } from '../../data/phrasesData';
import FuriganaText from '../common/FuriganaText';
import { playKanaSound } from '../../utils/audio';
import { useLanguage } from '../../context/LanguageContext';
import { Volume2, ArrowRight, ArrowLeft, RefreshCw, Sparkles, Filter } from 'lucide-react';

export default function PhrasesStudio() {
    const { lang } = useLanguage();
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    // Filter phrases
    const filteredPhrases = selectedCategory === 'All' 
        ? phrasesData 
        : phrasesData.filter(p => p.category === selectedCategory);
        
    const currentPhrase = filteredPhrases[currentIndex];

    const handleNext = () => {
        setIsFlipped(false);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev + 1) % filteredPhrases.length);
        }, 150);
    };

    const handlePrev = () => {
        setIsFlipped(false);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev - 1 + filteredPhrases.length) % filteredPhrases.length);
        }, 150);
    };

    const handlePlayAudio = (e) => {
        e.stopPropagation();
        // Remove furigana syntax { } [ ] before sending to TTS
        const cleanText = currentPhrase.japanese.replace(/\{([^}]+)\}\[([^\]]+)\]/g, '$1');
        playKanaSound(cleanText, 0.85); // slightly faster than kana
    };

    return (
        <div className="w-full max-w-2xl mx-auto p-4 flex flex-col pt-2 pb-20">
            {/* Category Filter */}
            <div className="mb-6 flex overflow-x-auto pb-2 scrollbar-hide gap-2 mask-linear-fade">
                <button
                    onClick={() => { setSelectedCategory('All'); setCurrentIndex(0); setIsFlipped(false); }}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                        selectedCategory === 'All'
                            ? 'bg-zen-primary dark:bg-zen-dark-primary text-white dark:text-zen-dark-on-primary shadow-sm'
                            : 'bg-zen-surface-container dark:bg-zen-dark-surface-high text-zen-text-muted dark:text-zen-dark-text-muted'
                    }`}
                >
                    {lang === 'it' ? 'Tutte' : 'All'}
                </button>
                {phraseCategories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => { setSelectedCategory(cat); setCurrentIndex(0); setIsFlipped(false); }}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                            selectedCategory === cat
                                ? 'bg-zen-primary dark:bg-zen-dark-primary text-white dark:text-zen-dark-on-primary shadow-sm'
                                : 'bg-zen-surface-container dark:bg-zen-dark-surface-high text-zen-text-muted dark:text-zen-dark-text-muted'
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Progress & Category */}
            <div className="flex items-center justify-between text-sm mb-3 px-1">
                <span className="font-headline font-bold text-zen-text dark:text-zen-dark-text flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-zen-primary dark:text-zen-dark-primary" />
                    {currentPhrase?.category}
                </span>
                <span className="font-semibold text-zen-text-muted dark:text-zen-dark-text-muted font-mono">
                    {currentIndex + 1} / {filteredPhrases.length}
                </span>
            </div>

            {/* Phrase Card Container */}
            {filteredPhrases.length > 0 ? (
                <div className="perspective-1000 min-h-[300px] w-full">
                    <div className="h-[300px] w-full rounded-3xl">
                        <div
                            onClick={() => setIsFlipped(!isFlipped)}
                            className={`relative h-full w-full cursor-pointer rounded-3xl transition-transform duration-500 transform-style-3d shadow-zen-lg dark:shadow-zen-dark-lg ${
                                isFlipped ? 'rotate-y-180' : ''
                            }`}
                        >
                            {/* FRONT OF CARD (Japanese) */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center border-2 border-zen-border/40 bg-zen-surface-lowest p-8 backface-hidden zen-card dark:border-zen-dark-border dark:bg-zen-dark-surface rounded-3xl">
                                <div className="absolute top-6 right-6">
                                    <button
                                        onClick={handlePlayAudio}
                                        className="rounded-full bg-zen-primary/10 p-3 text-zen-primary dark:bg-zen-dark-primary/20 dark:text-zen-dark-primary hover:scale-110 transition-transform active:scale-95"
                                        title="Play Japanese audio"
                                    >
                                        <Volume2 className="h-6 w-6" />
                                    </button>
                                </div>
                                
                                <div className="text-center w-full px-4 mt-8">
                                    <FuriganaText 
                                        text={currentPhrase.japanese} 
                                        className="font-kana font-bold tracking-wide text-4xl sm:text-5xl text-zen-text dark:text-zen-dark-text text-balance leading-loose" 
                                    />
                                </div>
                                
                                <div className="absolute bottom-6 flex w-full justify-center text-xs font-semibold text-zen-text-muted/60 dark:text-zen-dark-text-muted/60">
                                    <span className="flex items-center gap-1">
                                        <RefreshCw className="w-3.5 h-3.5" />
                                        {lang === 'it' ? 'Tocca per la traduzione' : 'Tap for translation'}
                                    </span>
                                </div>
                            </div>

                            {/* BACK OF CARD (Translation & Romaji) */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center border-2 border-zen-border/40 bg-zen-surface-container p-8 backface-hidden rotate-y-180 zen-card dark:border-zen-dark-border dark:bg-zen-dark-surface-high rounded-3xl">
                                <div className="text-center space-y-6 w-full px-4">
                                    <div>
                                        <div className="text-sm font-bold text-zen-text-muted dark:text-zen-dark-text-muted uppercase tracking-widest mb-2">Romaji</div>
                                        <div className="font-mono text-xl sm:text-2xl text-zen-primary dark:text-zen-dark-primary font-medium tracking-tight">
                                            {currentPhrase.romaji}
                                        </div>
                                    </div>
                                    <div className="h-px w-16 bg-zen-border dark:bg-zen-dark-border mx-auto"></div>
                                    <div>
                                        <div className="text-sm font-bold text-zen-text-muted dark:text-zen-dark-text-muted uppercase tracking-widest mb-2">Traduzione</div>
                                        <div className="font-headline font-bold text-2xl sm:text-3xl text-zen-text dark:text-zen-dark-text text-balance">
                                            {lang === 'it' ? currentPhrase.it : currentPhrase.en}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center min-h-[300px] text-zen-text-muted">
                    No phrases found.
                </div>
            )}

            {/* Navigation Controls */}
            {filteredPhrases.length > 0 && (
                <div className="flex items-center justify-between mt-8 gap-4 px-2">
                    <button
                        onClick={handlePrev}
                        className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-zen-surface-container dark:bg-zen-dark-surface border border-zen-border/40 dark:border-zen-dark-border hover:bg-zen-surface-high dark:hover:bg-zen-dark-surface-high transition-all active:scale-95 font-bold text-zen-text dark:text-zen-dark-text"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        {lang === 'it' ? 'Precedente' : 'Previous'}
                    </button>
                    <button
                        onClick={handleNext}
                        className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-zen-primary dark:bg-zen-dark-primary text-white dark:text-zen-dark-on-primary hover:shadow-zen-md transition-all active:scale-95 font-bold"
                    >
                        {lang === 'it' ? 'Prossima' : 'Next'}
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            )}
        </div>
    );
}
