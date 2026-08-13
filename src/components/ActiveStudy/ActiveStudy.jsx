import React, { useState, useEffect } from 'react';
import QuestionPrompt from './QuestionPrompt';
import AnswerInput from './AnswerInput';
import VirtualKeyboard from './VirtualKeyboard';
import SolutionCard from './SolutionCard';
import KanaSidePanel from './KanaSidePanel';
import { checkRomajiMatch, getRomajiDiff } from '../../utils/romajiVariants';
import { Layers, ListChecks, Activity } from 'lucide-react';

export default function ActiveStudy({ vocabularyData }) {
    const [phase, setPhase] = useState('setup'); // 'setup', 'playing', 'summary'
    
    // Setup state
    const [targetCount, setTargetCount] = useState(10); // 5, 10, 20, or Infinity
    const [studyMode, setStudyMode] = useState('mixed'); // 'ja-to-ro', 'ro-to-ja', 'mixed'
    const [easyMode, setEasyMode] = useState(false);
    
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
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    
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
        setQuestionsDone(prev => prev + 1);
        // nextQuestion is called via effect or we just call it directly. 
        // Actually it's better to call it immediately.
        // But wait, the state `questionsDone` needs to be updated before `nextQuestion` checks it.
        // Let's just do:
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
                        <h2 className="text-3xl font-bold text-slate-100">Active Study Setup</h2>
                    </div>
                    
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-lg font-bold text-slate-300 mb-4 uppercase tracking-wider">Number of Questions</h3>
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
                            <h3 className="text-lg font-bold text-slate-300 mb-4 uppercase tracking-wider">Study Mode</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <button 
                                    onClick={() => setStudyMode('ja-to-ro')}
                                    className={`p-4 rounded-xl font-bold transition-all flex flex-col items-center gap-2 ${studyMode === 'ja-to-ro' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-900 text-slate-400 hover:bg-slate-700'}`}
                                >
                                    <span className="text-xl">あ ➔ a</span>
                                    <span className="text-sm">Read Kana</span>
                                </button>
                                <button 
                                    onClick={() => setStudyMode('ro-to-ja')}
                                    className={`p-4 rounded-xl font-bold transition-all flex flex-col items-center gap-2 ${studyMode === 'ro-to-ja' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-900 text-slate-400 hover:bg-slate-700'}`}
                                >
                                    <span className="text-xl">a ➔ あ</span>
                                    <span className="text-sm">Write Kana</span>
                                </button>
                                <button 
                                    onClick={() => setStudyMode('mixed')}
                                    className={`p-4 rounded-xl font-bold transition-all flex flex-col items-center gap-2 ${studyMode === 'mixed' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-900 text-slate-400 hover:bg-slate-700'}`}
                                >
                                    <Layers className="w-6 h-6" />
                                    <span className="text-sm">Mixed</span>
                                </button>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-slate-300 mb-4 uppercase tracking-wider">Difficulty</h3>
                            <label className="flex items-center cursor-pointer space-x-3">
                                <div className="relative">
                                    <input 
                                        type="checkbox" 
                                        className="sr-only" 
                                        checked={easyMode}
                                        onChange={() => setEasyMode(!easyMode)}
                                    />
                                    <div className={`block w-12 h-7 rounded-full transition-colors ${easyMode ? 'bg-indigo-500' : 'bg-slate-700'}`}></div>
                                    <div className={`dot absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition-transform ${easyMode ? 'transform translate-x-5' : ''}`}></div>
                                </div>
                                <div>
                                    <span className="text-slate-200 font-bold">Easy Mode</span>
                                    <p className="text-slate-400 text-xs">Shows if a word uses Hiragana or Katakana in Write mode</p>
                                </div>
                            </label>
                        </div>

                        <button
                            onClick={startSession}
                            className="w-full mt-8 py-5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl font-bold text-lg uppercase tracking-widest transition-all shadow-xl shadow-indigo-900/40 active:scale-95"
                        >
                            Start Session
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
                    <h2 className="text-3xl font-bold text-slate-100 mb-2">Session Complete!</h2>
                    <p className="text-slate-400 mb-8">Here's how you did:</p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-slate-900 p-4 rounded-xl border border-emerald-500/20">
                            <div className="text-4xl font-bold text-emerald-400 mb-1">{stats.correct}</div>
                            <div className="text-xs uppercase tracking-widest text-slate-500 font-bold">Correct</div>
                        </div>
                        <div className="bg-slate-900 p-4 rounded-xl border border-rose-500/20">
                            <div className="text-4xl font-bold text-rose-400 mb-1">{stats.failed}</div>
                            <div className="text-xs uppercase tracking-widest text-slate-500 font-bold">Failed</div>
                        </div>
                    </div>
                    
                    <button
                        onClick={() => setPhase('setup')}
                        className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold uppercase tracking-widest transition-all shadow-lg active:scale-95"
                    >
                        Back to Setup
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
                        className="p-2 bg-slate-800 text-slate-400 hover:text-slate-100 rounded-lg transition-colors border border-slate-700"
                        title="Quit Session"
                    >
                        Exit
                    </button>
                    <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                        Q {questionsDone + 1} / {targetCount}
                    </div>
                </div>
                
                <button 
                    onClick={() => setIsPanelOpen(true)}
                    className="px-4 py-2 bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/40 rounded-lg text-sm font-bold tracking-widest uppercase border border-indigo-500/30 transition-colors"
                >
                    Kana Table
                </button>
            </div>
            
            {/* Main Area */}
            {status === 'playing' ? (
                <>
                    <QuestionPrompt 
                        currentWord={currentQuestion} 
                        mode={mode} 
                        easyMode={easyMode} 
                    />
                    
                    <div className="text-center mt-6 text-sm text-slate-500 font-bold uppercase tracking-widest">
                        Attempts remaining: {maxAttempts - attempts}
                    </div>
                    
                    <AnswerInput 
                        value={userInput}
                        onChange={(val) => { setUserInput(val); setDiff(null); }}
                        onSubmit={handleSubmit}
                        diff={diff}
                        disabled={status !== 'playing'}
                        mode={mode}
                    />

                    {mode === 'ro-to-ja' && (
                        <VirtualKeyboard 
                            onKeyPress={handleKeyboardPress}
                            onBackspace={handleBackspace}
                            disabled={status !== 'playing'}
                        />
                    )}
                    
                    {mode === 'ro-to-ja' && (
                        <div className="flex justify-center mt-6">
                            <button
                                onClick={handleSubmit}
                                disabled={!userInput.trim() || status !== 'playing'}
                                className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold uppercase tracking-widest transition-all disabled:opacity-50 shadow-lg"
                            >
                                Submit Answer
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div className="flex flex-col items-center">
                    <div className={`text-2xl font-bold mb-4 uppercase tracking-widest ${status === 'success' ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {status === 'success' ? 'Correct!' : 'Wrong!'}
                    </div>
                    <SolutionCard item={currentQuestion} onNext={handleNextClick} />
                </div>
            )}
            
            <KanaSidePanel isOpen={isPanelOpen} onClose={() => setIsPanelOpen(false)} />
            
        </div>
    );
}
