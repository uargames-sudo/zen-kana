import React, { useState } from 'react';
import { storiesData } from '../../data/storiesData';
import FuriganaText from '../common/FuriganaText';
import { playKanaSound } from '../../utils/audio';
import { useLanguage } from '../../context/LanguageContext';
import { BookOpen, ArrowLeft, Volume2, ChevronRight } from 'lucide-react';

const StoryLine = ({ line, index }) => {
    const { lang } = useLanguage();
    // 0 = JP only, 1 = +Romaji, 2 = +Translation
    const [revealLevel, setRevealLevel] = useState(0);

    const handleLineClick = () => {
        setRevealLevel(prev => (prev >= 2 ? 0 : prev + 1));
    };

    const handlePlayAudio = (e) => {
        e.stopPropagation();
        const cleanText = line.japanese.replace(/\{([^}]+)\}\[([^\]]+)\]/g, '$1');
        playKanaSound(cleanText, 0.85);
    };

    return (
        <div 
            onClick={handleLineClick}
            className="group relative flex flex-col gap-3 p-5 rounded-2xl bg-zen-surface-lowest dark:bg-zen-dark-surface border border-zen-border/30 dark:border-zen-dark-border hover:border-zen-primary/30 transition-all cursor-pointer select-none"
        >
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                    <FuriganaText 
                        text={line.japanese} 
                        className="font-kana font-medium tracking-wide text-2xl text-zen-text dark:text-zen-dark-text leading-loose"
                    />
                </div>
                <button
                    onClick={handlePlayAudio}
                    className="shrink-0 p-2 rounded-xl bg-zen-surface-container dark:bg-zen-dark-surface-high text-zen-text-muted dark:text-zen-dark-text-muted hover:text-zen-primary dark:hover:text-zen-dark-primary active:scale-95 transition-all"
                    title="Play Audio"
                >
                    <Volume2 className="w-5 h-5" />
                </button>
            </div>

            {/* Reveals */}
            <div className={`overflow-hidden transition-all duration-300 ${revealLevel >= 1 ? 'max-h-40 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
                <div className="font-mono text-sm sm:text-base text-zen-primary dark:text-zen-dark-primary font-medium">
                    {line.romaji}
                </div>
                
                <div className={`overflow-hidden transition-all duration-300 ${revealLevel >= 2 ? 'max-h-40 opacity-100 mt-2 pt-2 border-t border-zen-border/20 dark:border-zen-dark-border/40' : 'max-h-0 opacity-0'}`}>
                    <div className="font-headline font-semibold text-zen-text-muted dark:text-zen-dark-text-muted text-sm sm:text-base">
                        {lang === 'it' ? line.it : line.en}
                    </div>
                </div>
            </div>

            {/* Hint Indicator */}
            {revealLevel < 2 && (
                <div className="absolute bottom-1 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px] text-zen-text-muted/50 dark:text-zen-dark-text-muted/50 uppercase font-bold tracking-widest">
                        {revealLevel === 0 ? 'Tap for Romaji' : 'Tap for Translation'}
                    </span>
                </div>
            )}
        </div>
    );
};

export default function StoryReader() {
    const { lang } = useLanguage();
    const [selectedStory, setSelectedStory] = useState(null);

    // List View
    if (!selectedStory) {
        return (
            <div className="w-full max-w-2xl mx-auto p-4 flex flex-col pt-2 pb-20">
                <div className="mb-6 flex items-center gap-2 px-1">
                    <BookOpen className="w-5 h-5 text-zen-primary dark:text-zen-dark-primary" />
                    <h2 className="font-headline font-bold text-xl text-zen-text dark:text-zen-dark-text">
                        {lang === 'it' ? 'Storie di Lettura' : 'Reading Stories'}
                    </h2>
                </div>

                <div className="flex flex-col gap-3">
                    {storiesData.map(story => (
                        <button
                            key={story.id}
                            onClick={() => setSelectedStory(story)}
                            className="flex items-center text-left p-5 rounded-3xl bg-zen-surface-lowest dark:bg-zen-dark-surface border border-zen-border/40 dark:border-zen-dark-border hover:shadow-zen-md dark:hover:shadow-zen-dark-md hover:border-zen-primary/40 dark:hover:border-zen-dark-primary/40 transition-all group"
                        >
                            <div className="flex-1 space-y-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="px-2 py-0.5 rounded-lg bg-zen-primary/10 dark:bg-zen-dark-primary/20 text-zen-primary dark:text-zen-dark-primary text-xs font-bold font-mono">
                                        {story.level}
                                    </span>
                                </div>
                                <div className="font-kana font-bold text-xl sm:text-2xl text-zen-text dark:text-zen-dark-text group-hover:text-zen-primary dark:group-hover:text-zen-dark-primary transition-colors">
                                    <FuriganaText text={story.title} showFurigana={true} furiganaClassName="text-zen-text-muted/70" />
                                </div>
                                <div className="text-sm font-headline font-semibold text-zen-text-muted dark:text-zen-dark-text-muted">
                                    {lang === 'it' ? story.titleIt : story.titleEn}
                                </div>
                            </div>
                            <div className="shrink-0 pl-4">
                                <div className="w-10 h-10 rounded-full bg-zen-surface-container dark:bg-zen-dark-surface-high flex items-center justify-center group-hover:bg-zen-primary dark:group-hover:bg-zen-dark-primary group-hover:text-white transition-colors">
                                    <ChevronRight className="w-5 h-5" />
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    // Story View
    return (
        <div className="w-full max-w-2xl mx-auto p-4 flex flex-col pt-2 pb-20">
            {/* Header */}
            <div className="relative flex flex-col items-center text-center mb-8">
                <div className="absolute left-0 top-0 sm:top-1">
                    <button
                        onClick={() => setSelectedStory(null)}
                        className="shrink-0 p-2.5 sm:p-3 rounded-2xl bg-zen-surface-container dark:bg-zen-dark-surface border border-zen-border/40 dark:border-zen-dark-border hover:bg-zen-surface-high dark:hover:bg-zen-dark-surface-high active:scale-95 transition-all text-zen-text dark:text-zen-dark-text"
                        aria-label="Back to stories"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                </div>
                <div className="flex flex-col items-center px-14 pt-1">
                    <span className="px-2 py-0.5 rounded-lg bg-zen-primary/10 dark:bg-zen-dark-primary/20 text-zen-primary dark:text-zen-dark-primary text-[10px] font-bold font-mono uppercase tracking-widest mb-2 inline-block">
                        {selectedStory.level} Story
                    </span>
                    <h2 className="font-kana font-bold text-2xl sm:text-3xl text-zen-text dark:text-zen-dark-text mb-1">
                        <FuriganaText text={selectedStory.title} showFurigana={true} />
                    </h2>
                    <p className="text-sm font-headline font-semibold text-zen-text-muted dark:text-zen-dark-text-muted">
                        {lang === 'it' ? selectedStory.titleIt : selectedStory.titleEn}
                    </p>
                    <p className="text-xs text-zen-text-muted/70 mt-3 italic max-w-sm">
                        {selectedStory.description}
                    </p>
                </div>
            </div>

            {/* Story Lines */}
            <div className="flex flex-col gap-4">
                {selectedStory.lines.map((line, idx) => (
                    <StoryLine key={idx} line={line} index={idx} />
                ))}
            </div>
            
            <div className="mt-12 text-center">
                <button
                    onClick={() => setSelectedStory(null)}
                    className="px-6 py-3 rounded-xl bg-zen-surface-container dark:bg-zen-dark-surface text-zen-text-muted dark:text-zen-dark-text-muted hover:text-zen-text font-bold text-sm transition-colors"
                >
                    {lang === 'it' ? 'Torna alle storie' : 'Back to stories'}
                </button>
            </div>
        </div>
    );
}
