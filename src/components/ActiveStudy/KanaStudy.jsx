import React, { useState } from 'react';
import QuestionPrompt from './QuestionPrompt';
import AnswerInput from './AnswerInput';
import VirtualKeyboard from './VirtualKeyboard';
import SolutionCard from './SolutionCard';
import { checkRomajiMatch, getRomajiDiff } from '../../utils/romajiVariants';
import { Layers, Sparkles, Keyboard, CheckCircle, XCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import defaultVocabularyData from '../../../vocabulary.json';

export default function KanaStudy({ vocabularyData = defaultVocabularyData }) {
    const { lang, t } = useLanguage();
    const [phase, setPhase] = useState('setup'); // 'setup', 'playing', 'summary'
    
    // Setup state
    const [targetCount, setTargetCount] = useState(10); // 5, 10, 20, or 50
    const [studyMode, setStudyMode] = useState('mixed'); // 'ja-to-ro', 'ro-to-ja', 'mixed'
    const [difficulty, setDifficulty] = useState('easy'); // 'easy', 'medium', 'hard'
    
    // Playing state
    const [mode, setMode] = useState('ja-to-ro');
    const [questionsDone, setQuestionsDone] = useState(0);
    const [stats, setStats] = useState({ correct: 0, failed: 0 });
    
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [userInput, setUserInput] = useState('');
    const [attempts, setAttempts] = useState(0);
    const [maxAttempts] = useState(3);
    const [status, setStatus] = useState('playing'); // 'playing', 'success', 'failed'
    const [diff, setDiff] = useState(null);
    const [showConsultationKeyboard, setShowConsultationKeyboard] = useState(false);
    
    const getRandomQuestion = () => {
        const validItems = vocabularyData.filter(item => item.japanese && item.romaji);
        if (validItems.length === 0) return null;
        const randomIndex = Math.floor(Math.random() * validItems.length);
        return validItems[randomIndex];
    };

    const startSession = () => {
        setQuestionsDone(0);
        setStats({ correct: 0, failed: 0 });
        setPhase('playing');
        nextQuestion();
    };

    const nextQuestion = () => {
        if (questionsDone >= targetCount) {
            setPhase('summary');
            return;
        }

        setCurrentQuestion(getRandomQuestion());
        setUserInput('');
        setAttempts(0);
        setStatus('playing');
        setDiff(null);
        
        if (studyMode === 'mixed') {
            setMode(Math.random() > 0.5 ? 'ja-to-ro' : 'ro-to-ja');
        } else {
            setMode(studyMode);
        }
    };

    const handleSubmit = () => {
        if (!userInput.trim() || status !== 'playing') return;

        const currentAttempts = attempts + 1;
        setAttempts(currentAttempts);
        
        let isCorrect = false;
        
        if (mode === 'ja-to-ro') {
            const accepted = currentQuestion.acceptedRomaji || [currentQuestion.romaji];
            isCorrect = checkRomajiMatch(userInput, accepted);
            if (!isCorrect) setDiff(getRomajiDiff(userInput, currentQuestion.romaji));
        } else {
            const expectedKana = currentQuestion.kana || currentQuestion.japanese;
            isCorrect = userInput.trim() === expectedKana.trim();
            if (!isCorrect) setDiff(getRomajiDiff(userInput, expectedKana));
        }

        if (isCorrect) {
            setStatus('success');
            setDiff(null);
            setStats(s => ({ ...s, correct: s.correct + 1 }));
        } else if (currentAttempts >= maxAttempts) {
            setStatus('failed');
            setStats(s => ({ ...s, failed: s.failed + 1 }));
        }
    };

    const handleNextClick = () => {
        const nextDoneCount = questionsDone + 1;
        if (nextDoneCount >= targetCount) {
            setPhase('summary');
        } else {
            setQuestionsDone(nextDoneCount);
            setCurrentQuestion(getRandomQuestion());
            setUserInput('');
            setAttempts(0);
            setStatus('playing');
            setDiff(null);
            
            if (studyMode === 'mixed') {
                setMode(Math.random() > 0.5 ? 'ja-to-ro' : 'ro-to-ja');
            } else {
                setMode(studyMode);
            }
        }
    };

    const handleKeyboardPress = (kana) => {
        setUserInput(prev => prev + kana);
        setDiff(null);
    };

    const handleBackspace = () => {
        setUserInput(prev => prev.slice(0, -1));
        setDiff(null);
    };
    
    if (vocabularyData.length === 0) {
        return <div className="text-zen-text dark:text-zen-dark-text text-center p-8">No vocabulary data available.</div>;
    }

    if (phase === 'setup') {
        return (
            <div className="w-full max-w-2xl mx-auto p-4 flex flex-col pt-6 pb-20">
                <div className="zen-card bg-zen-surface-lowest dark:bg-zen-dark-surface border-2 border-zen-border/40 dark:border-zen-dark-border rounded-3xl shadow-zen-lg dark:shadow-zen-dark-lg p-6 sm:p-8">
                    <div className="flex items-center justify-center mb-8 gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-zen-primary/10 dark:bg-zen-dark-primary/20 text-zen-primary dark:text-zen-dark-primary flex items-center justify-center">
                            <Sparkles className="w-6 h-6" />
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-headline font-bold text-zen-text dark:text-zen-dark-text">
                            {t('activeStudy.setupTitle')}
                        </h2>
                    </div>
                    
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-xs font-bold text-zen-text-muted dark:text-zen-dark-text-muted mb-3 uppercase tracking-wider">
                                {t('activeStudy.questionCount')}
                            </h3>
                            <div className="flex flex-wrap gap-2.5 sm:gap-3">
                                {[5, 10, 20, 50].map(num => (
                                    <button 
                                        key={num}
                                        onClick={() => setTargetCount(num)}
                                        className={`px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl font-bold text-sm transition-all ${
                                            targetCount === num 
                                                ? 'bg-zen-primary dark:bg-zen-dark-primary text-white dark:text-zen-dark-on-primary shadow-zen-sm' 
                                                : 'bg-zen-surface-container dark:bg-zen-dark-surface-high text-zen-text-muted dark:text-zen-dark-text-muted hover:text-zen-text dark:hover:text-zen-dark-text border border-zen-border/40 dark:border-zen-dark-border'
                                        }`}
                                    >
                                        {num}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xs font-bold text-zen-text-muted dark:text-zen-dark-text-muted mb-3 uppercase tracking-wider">
                                {t('activeStudy.studyMode')}
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {[
                                    { id: 'ja-to-ro', kana: 'あ ➔ A', label: t('activeStudy.modeReadKana') },
                                    { id: 'ro-to-ja', kana: 'A ➔ あ', label: t('activeStudy.modeWriteKana') },
                                    { id: 'mixed', icon: Layers, label: t('activeStudy.modeMixed') }
                                ].map((item) => {
                                    const Icon = item.icon;
                                    const isSelected = studyMode === item.id;
                                    return (
                                        <button 
                                            key={item.id}
                                            onClick={() => setStudyMode(item.id)}
                                            className={`p-4 rounded-2xl font-bold transition-all flex flex-col items-center gap-1.5 border ${
                                                isSelected 
                                                    ? 'bg-zen-primary dark:bg-zen-dark-primary text-white dark:text-zen-dark-on-primary border-zen-primary shadow-zen-sm' 
                                                    : 'bg-zen-surface-container/60 dark:bg-zen-dark-surface-high text-zen-text dark:text-zen-dark-text border-zen-border/40 dark:border-zen-dark-border hover:border-zen-primary/40'
                                            }`}
                                        >
                                            {item.kana ? <span className="text-xl font-kana">{item.kana}</span> : <Icon className="w-5 h-5" />}
                                            <span className="text-xs">{item.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xs font-bold text-zen-text-muted dark:text-zen-dark-text-muted mb-3 uppercase tracking-wider">
                                {t('activeStudy.difficulty')}
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {[
                                    { id: 'easy', label: t('activeStudy.difficultyEasy'), desc: t('activeStudy.difficultyEasyDesc') },
                                    { id: 'medium', label: t('activeStudy.difficultyMedium'), desc: t('activeStudy.difficultyMediumDesc') },
                                    { id: 'hard', label: t('activeStudy.difficultyHard'), desc: t('activeStudy.difficultyHardDesc') }
                                ].map((diffItem) => {
                                    const isSelected = difficulty === diffItem.id;
                                    return (
                                        <button 
                                            key={diffItem.id}
                                            type="button"
                                            onClick={() => setDifficulty(diffItem.id)}
                                            className={`p-4 rounded-2xl font-bold transition-all flex flex-col items-start gap-1 border text-left ${
                                                isSelected
                                                    ? 'bg-zen-primary/10 border-zen-primary text-zen-primary dark:bg-zen-dark-primary/15 dark:border-zen-dark-primary dark:text-zen-dark-primary ring-2 ring-zen-primary/20 dark:ring-zen-dark-primary/30'
                                                    : 'bg-zen-surface-container/60 dark:bg-zen-dark-surface-high border-zen-border/40 dark:border-zen-dark-border text-zen-text dark:text-zen-dark-text hover:border-zen-border'
                                            }`}
                                        >
                                            <span className="text-xs uppercase tracking-wider font-extrabold text-zen-primary dark:text-zen-dark-primary">
                                                {diffItem.label}
                                            </span>
                                            <p className="text-xs-plus text-zen-text-muted dark:text-zen-dark-text-muted font-normal mt-0.5 leading-relaxed">
                                                {diffItem.desc}
                                            </p>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <button 
                            onClick={startSession}
                            className="w-full py-4 rounded-2xl bg-zen-primary hover:bg-zen-primary-dark dark:bg-zen-dark-primary dark:hover:bg-zen-dark-primary-hover text-white dark:text-zen-dark-on-primary font-bold text-sm uppercase tracking-widest shadow-zen-md transition-all active:scale-95"
                        >
                            {t('activeStudy.startSession')}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (phase === 'summary') {
        return (
            <div className="w-full max-w-md mx-auto p-4 flex flex-col pt-12 pb-20 text-center">
                <div className="zen-card bg-zen-surface-lowest dark:bg-zen-dark-surface border-2 border-zen-border/40 dark:border-zen-dark-border rounded-3xl shadow-zen-lg dark:shadow-zen-dark-lg p-8">
                    <h2 className="text-2xl sm:text-3xl font-headline font-bold text-zen-text dark:text-zen-dark-text mb-2">
                        {t('activeStudy.sessionComplete')}
                    </h2>
                    <p className="text-sm text-zen-text-muted dark:text-zen-dark-text-muted mb-8">
                        {t('activeStudy.sessionSummaryText')}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-emerald-500/10 p-4 rounded-2xl border border-emerald-500/30">
                            <div className="text-4xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">{stats.correct}</div>
                            <div className="text-xs uppercase tracking-widest text-emerald-700 dark:text-emerald-300 font-bold">{t('activeStudy.correctCount')}</div>
                        </div>
                        <div className="bg-rose-500/10 p-4 rounded-2xl border border-rose-500/30">
                            <div className="text-4xl font-bold text-rose-600 dark:text-rose-400 mb-1">{stats.failed}</div>
                            <div className="text-xs uppercase tracking-widest text-rose-700 dark:text-rose-300 font-bold">{t('activeStudy.failedCount')}</div>
                        </div>
                    </div>
                    
                    <button
                        onClick={() => setPhase('setup')}
                        className="w-full py-3.5 rounded-2xl bg-zen-primary hover:bg-zen-primary-dark dark:bg-zen-dark-primary dark:hover:bg-zen-dark-primary-hover text-white dark:text-zen-dark-on-primary font-bold uppercase tracking-widest transition-all shadow-zen-sm active:scale-95 text-xs"
                    >
                        {t('activeStudy.backToSetup')}
                    </button>
                </div>
            </div>
        );
    }

    // Playing phase
    const progressPercent = Math.round(((questionsDone + 1) / targetCount) * 100);

    return (
        <div className="w-full max-w-2xl mx-auto space-y-6 pb-20 xl:pb-8">
            
            {/* Header controls & Progress Bar */}
            <div className="space-y-2.5">
                <div className="flex justify-between items-center text-xs font-bold text-zen-text-muted dark:text-zen-dark-text-muted">
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => setPhase('setup')}
                            className="px-3 py-1 rounded-lg bg-zen-surface-lowest dark:bg-zen-dark-surface border border-zen-border/60 dark:border-zen-dark-border text-zen-text-muted hover:text-zen-text dark:text-zen-dark-text-muted dark:hover:text-zen-dark-text text-xs-plus font-bold uppercase tracking-wider transition-colors shadow-zen-sm"
                            title="Quit Session"
                        >
                            {t('activeStudy.exitSession')}
                        </button>
                        <span>
                            {t('activeStudy.questionProgress')} {questionsDone + 1} / {targetCount}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold uppercase tracking-wider bg-zen-primary/10 dark:bg-zen-dark-primary/20 text-zen-primary dark:text-zen-dark-primary border border-zen-primary/20 dark:border-zen-dark-primary/30">
                            {difficulty === 'easy' ? t('activeStudy.difficultyEasy') : difficulty === 'medium' ? t('activeStudy.difficultyMedium') : t('activeStudy.difficultyHard')}
                        </span>
                    </div>
                </div>

                {/* Smooth Progress Bar */}
                <div className="h-2 w-full overflow-hidden rounded-full bg-zen-surface-container dark:bg-zen-dark-surface-high">
                    <div 
                        className="h-full rounded-full bg-zen-primary dark:bg-zen-dark-primary transition-all duration-300"
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>
            </div>
            
            {/* Main Interactive Stage */}
            {status === 'playing' ? (
                <div className="space-y-5">
                    <QuestionPrompt 
                        currentWord={currentQuestion} 
                        mode={mode} 
                        difficulty={difficulty}
                    />
                    
                    <AnswerInput 
                        value={userInput}
                        onChange={(val) => { setUserInput(val); setDiff(null); }}
                        onSubmit={handleSubmit}
                        diff={diff}
                        disabled={status !== 'playing'}
                        mode={mode}
                        attempts={attempts}
                        maxAttempts={maxAttempts}
                    />

                    {/* Mode Write Kana (ro-to-ja): Virtual Keyboard for input */}
                    {mode === 'ro-to-ja' && (
                        <VirtualKeyboard 
                            onKeyPress={handleKeyboardPress}
                            onBackspace={handleBackspace}
                            disabled={status !== 'playing'}
                            readOnly={false}
                            showRomaji={difficulty === 'easy'}
                            allowToggleRomaji={difficulty === 'medium'}
                        />
                    )}

                    {/* Mode Read Kana (ja-to-ro): Consultation Virtual Keyboard */}
                    {mode === 'ja-to-ro' && (
                        <>
                            {/* Easy mode: auto-shown consultation keyboard with romaji */}
                            {difficulty === 'easy' && (
                                <VirtualKeyboard 
                                    readOnly={true}
                                    showRomaji={true}
                                    allowToggleRomaji={false}
                                    disabled={status !== 'playing'}
                                />
                            )}

                            {/* Medium mode: toggleable consultation keyboard */}
                            {difficulty === 'medium' && (
                                <div className="mt-4 space-y-3">
                                    <div className="flex justify-center">
                                        <button
                                            type="button"
                                            onClick={() => setShowConsultationKeyboard(!showConsultationKeyboard)}
                                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zen-surface-lowest dark:bg-zen-dark-surface border border-zen-border/60 dark:border-zen-dark-border text-zen-text dark:text-zen-dark-text text-xs font-bold uppercase tracking-wider hover:bg-zen-surface-container dark:hover:bg-zen-dark-surface-high transition-colors shadow-zen-sm"
                                        >
                                            <Keyboard className="w-4 h-4 text-zen-primary dark:text-zen-dark-primary" />
                                            <span>{showConsultationKeyboard ? t('activeStudy.hideRefKeyboard') : t('activeStudy.showRefKeyboard')}</span>
                                        </button>
                                    </div>

                                    {showConsultationKeyboard && (
                                        <VirtualKeyboard 
                                            readOnly={true}
                                            showRomaji={false}
                                            allowToggleRomaji={true}
                                            disabled={status !== 'playing'}
                                        />
                                    )}
                                </div>
                            )}

                            {/* Hard mode: no consultation keyboard available */}
                        </>
                    )}
                </div>
            ) : (
                <SolutionCard 
                    item={currentQuestion} 
                    onNext={handleNextClick} 
                    status={status}
                />
            )}
            
        </div>
    );
}
