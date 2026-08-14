import React, { useState } from 'react';
import QuestionPrompt from './QuestionPrompt';
import AnswerInput from './AnswerInput';
import VirtualKeyboard from './VirtualKeyboard';
import SolutionCard from './SolutionCard';
import { checkRomajiMatch, getRomajiDiff } from '../../utils/romajiVariants';
import { Layers, Activity, Keyboard } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function ActiveStudy({ vocabularyData }) {
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
        return <div className="text-white text-center p-8">No vocabulary data available.</div>;
    }

    if (phase === 'setup') {
        return (
            <div className="w-full max-w-2xl mx-auto p-4 flex flex-col pt-12 pb-20">
                <div className="bg-slate-800 rounded-2xl shadow-xl border border-slate-700 p-8">
                    <div className="flex items-center justify-center mb-8 gap-3">
                        <Activity className="w-8 h-8 text-indigo-400" />
                        <h2 className="text-3xl font-bold text-slate-100">{t('activeStudy.setupTitle')}</h2>
                    </div>
                    
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-lg font-bold text-slate-300 mb-4 uppercase tracking-wider">{t('activeStudy.questionCount')}</h3>
                            <div className="flex flex-wrap gap-3">
                                {[5, 10, 20, 50].map(num => (
                                    <button 
                                        key={num}
                                        onClick={() => setTargetCount(num)}
                                        className={`px-6 py-3 rounded-xl font-bold transition-all ${targetCount === num ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/30' : 'bg-slate-900 text-slate-400 hover:bg-slate-700'}`}
                                    >
                                        {num}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-slate-300 mb-4 uppercase tracking-wider">{t('activeStudy.studyMode')}</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <button 
                                    onClick={() => setStudyMode('ja-to-ro')}
                                    className={`p-4 rounded-xl font-bold transition-all flex flex-col items-center gap-2 ${studyMode === 'ja-to-ro' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-900 text-slate-400 hover:bg-slate-700'}`}
                                >
                                    <span className="text-xl">あ ➔ a</span>
                                    <span className="text-sm">{t('activeStudy.modeReadKana')}</span>
                                </button>
                                <button 
                                    onClick={() => setStudyMode('ro-to-ja')}
                                    className={`p-4 rounded-xl font-bold transition-all flex flex-col items-center gap-2 ${studyMode === 'ro-to-ja' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-900 text-slate-400 hover:bg-slate-700'}`}
                                >
                                    <span className="text-xl">a ➔ あ</span>
                                    <span className="text-sm">{t('activeStudy.modeWriteKana')}</span>
                                </button>
                                <button 
                                    onClick={() => setStudyMode('mixed')}
                                    className={`p-4 rounded-xl font-bold transition-all flex flex-col items-center gap-2 ${studyMode === 'mixed' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-900 text-slate-400 hover:bg-slate-700'}`}
                                >
                                    <Layers className="w-6 h-6" />
                                    <span className="text-sm">{t('activeStudy.modeMixed')}</span>
                                </button>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-slate-300 mb-4 uppercase tracking-wider">{t('activeStudy.difficulty')}</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <button 
                                    type="button"
                                    onClick={() => setDifficulty('easy')}
                                    className={`p-4 rounded-xl font-bold transition-all flex flex-col items-start gap-1 border text-left ${
                                        difficulty === 'easy'
                                            ? 'bg-indigo-600/30 border-indigo-500 text-white shadow-lg shadow-indigo-900/20'
                                            : 'bg-slate-900/80 border-slate-700 text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'
                                    }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm uppercase tracking-wider font-extrabold text-emerald-400">{t('activeStudy.difficultyEasy')}</span>
                                    </div>
                                    <p className="text-xs text-slate-400 font-normal mt-1 leading-relaxed">
                                        {t('activeStudy.difficultyEasyDesc')}
                                    </p>
                                </button>

                                <button 
                                    type="button"
                                    onClick={() => setDifficulty('medium')}
                                    className={`p-4 rounded-xl font-bold transition-all flex flex-col items-start gap-1 border text-left ${
                                        difficulty === 'medium'
                                            ? 'bg-indigo-600/30 border-indigo-500 text-white shadow-lg shadow-indigo-900/20'
                                            : 'bg-slate-900/80 border-slate-700 text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'
                                    }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm uppercase tracking-wider font-extrabold text-amber-400">{t('activeStudy.difficultyMedium')}</span>
                                    </div>
                                    <p className="text-xs text-slate-400 font-normal mt-1 leading-relaxed">
                                        {t('activeStudy.difficultyMediumDesc')}
                                    </p>
                                </button>

                                <button 
                                    type="button"
                                    onClick={() => setDifficulty('hard')}
                                    className={`p-4 rounded-xl font-bold transition-all flex flex-col items-start gap-1 border text-left ${
                                        difficulty === 'hard'
                                            ? 'bg-indigo-600/30 border-indigo-500 text-white shadow-lg shadow-indigo-900/20'
                                            : 'bg-slate-900/80 border-slate-700 text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'
                                    }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm uppercase tracking-wider font-extrabold text-rose-400">{t('activeStudy.difficultyHard')}</span>
                                    </div>
                                    <p className="text-xs text-slate-400 font-normal mt-1 leading-relaxed">
                                        {t('activeStudy.difficultyHardDesc')}
                                    </p>
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={startSession}
                            className="w-full mt-8 py-5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl font-bold text-lg uppercase tracking-widest transition-all shadow-xl shadow-indigo-900/40 active:scale-95"
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
            <div className="w-full max-w-md mx-auto p-4 flex flex-col pt-24 pb-20 text-center">
                <div className="bg-slate-800 rounded-2xl shadow-xl border border-slate-700 p-8">
                    <h2 className="text-3xl font-bold text-slate-100 mb-2">{t('activeStudy.sessionComplete')}</h2>
                    <p className="text-slate-400 mb-8">{t('activeStudy.sessionSummaryText')}</p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-slate-900 p-4 rounded-xl border border-emerald-500/20">
                            <div className="text-4xl font-bold text-emerald-400 mb-1">{stats.correct}</div>
                            <div className="text-xs uppercase tracking-widest text-slate-500 font-bold">{t('activeStudy.correctCount')}</div>
                        </div>
                        <div className="bg-slate-900 p-4 rounded-xl border border-rose-500/20">
                            <div className="text-4xl font-bold text-rose-400 mb-1">{stats.failed}</div>
                            <div className="text-xs uppercase tracking-widest text-slate-500 font-bold">{t('activeStudy.failedCount')}</div>
                        </div>
                    </div>
                    
                    <button
                        onClick={() => setPhase('setup')}
                        className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold uppercase tracking-widest transition-all shadow-lg active:scale-95"
                    >
                        {t('activeStudy.backToSetup')}
                    </button>
                </div>
            </div>
        );
    }

    // Playing phase
    return (
        <div className="w-full max-w-4xl mx-auto p-4 flex flex-col h-full overflow-y-auto pt-6 pb-20">
            
            {/* Header controls & Progress */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => setPhase('setup')}
                        className="p-2 bg-slate-800 text-slate-400 hover:text-slate-100 rounded-lg transition-colors border border-slate-700 text-xs font-bold uppercase tracking-wider"
                        title="Quit Session"
                    >
                        {t('activeStudy.exitSession')}
                    </button>
                    <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                        {t('activeStudy.questionProgress')} {questionsDone + 1} / {targetCount}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider border ${
                        difficulty === 'easy' 
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                            : difficulty === 'medium'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                            : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                    }`}>
                        {difficulty === 'easy' ? t('activeStudy.difficultyEasy') : difficulty === 'medium' ? t('activeStudy.difficultyMedium') : t('activeStudy.difficultyHard')}
                    </span>
                </div>
            </div>
            
            {/* Main Area */}
            {status === 'playing' ? (
                <>
                    <QuestionPrompt 
                        currentWord={currentQuestion} 
                        mode={mode} 
                        difficulty={difficulty}
                    />
                    
                    <div className="text-center mt-6 text-sm text-slate-500 font-bold uppercase tracking-widest">
                        {t('activeStudy.attemptsRemaining')} {maxAttempts - attempts}
                    </div>
                    
                    <AnswerInput 
                        value={userInput}
                        onChange={(val) => { setUserInput(val); setDiff(null); }}
                        onSubmit={handleSubmit}
                        diff={diff}
                        disabled={status !== 'playing'}
                        mode={mode}
                    />

                    {/* Mode Write Kana (ro-to-ja): Virtual Keyboard for input */}
                    {mode === 'ro-to-ja' && (
                        <>
                            <VirtualKeyboard 
                                onKeyPress={handleKeyboardPress}
                                onBackspace={handleBackspace}
                                disabled={status !== 'playing'}
                                readOnly={false}
                                showRomaji={difficulty === 'easy'}
                                allowToggleRomaji={difficulty === 'medium'}
                            />
                            
                            <div className="flex justify-center mt-6">
                                <button
                                    onClick={handleSubmit}
                                    disabled={!userInput.trim() || status !== 'playing'}
                                    className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold uppercase tracking-widest transition-all disabled:opacity-50 shadow-lg"
                                >
                                    {t('activeStudy.submitAnswer')}
                                </button>
                            </div>
                        </>
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
                                <div className="mt-4">
                                    <div className="flex justify-center">
                                        <button
                                            type="button"
                                            onClick={() => setShowConsultationKeyboard(!showConsultationKeyboard)}
                                            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold uppercase tracking-wider border border-slate-700 transition-colors shadow-sm"
                                        >
                                            <Keyboard className="w-4 h-4 text-indigo-400" />
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
                </>
            ) : (
                <div className="flex flex-col items-center">
                    <div className={`text-2xl font-bold mb-4 uppercase tracking-widest ${status === 'success' ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {status === 'success' ? t('activeStudy.correct') : t('activeStudy.wrong')}
                    </div>
                    <SolutionCard item={currentQuestion} onNext={handleNextClick} />
                </div>
            )}
            
        </div>
    );
}
