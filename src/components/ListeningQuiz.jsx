import React, { useState, useEffect } from 'react';
import { Volume2, Sparkles, CheckCircle2, XCircle, Play } from 'lucide-react';
import { HIRAGANA_BASIC, KANA_DAKUTEN } from '../data/kanaData';
import { playKanaSound } from '../utils/audio';

export default function ListeningQuiz({ scriptMode, updateStats }) {
  const isHiragana = scriptMode === 'hiragana';
  const pool = [...HIRAGANA_BASIC.filter(k => k.hiragana), ...KANA_DAKUTEN];

  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [totalAsked, setTotalAsked] = useState(0);
  const [audioPlayed, setAudioPlayed] = useState(false);

  // Generate a new listening question with 4 options
  const generateQuestion = () => {
    const target = pool[Math.floor(Math.random() * pool.length)];
    
    // Pick 3 random wrong options
    const wrongOptions = [];
    while (wrongOptions.length < 3) {
      const rand = pool[Math.floor(Math.random() * pool.length)];
      if (rand.romaji !== target.romaji && !wrongOptions.some(o => o.romaji === rand.romaji)) {
        wrongOptions.push(rand);
      }
    }

    // Shuffle options
    const allOptions = [...wrongOptions, target].sort(() => Math.random() - 0.5);

    setCurrentQuestion(target);
    setOptions(allOptions);
    setSelectedOption(null);
    setIsAnswered(false);
    setAudioPlayed(false);
  };

  useEffect(() => {
    generateQuestion();
  }, [scriptMode]);

  const handlePlayAudio = () => {
    if (!currentQuestion) return;
    const char = isHiragana ? currentQuestion.hiragana : currentQuestion.katakana;
    playKanaSound(char);
    setAudioPlayed(true);
  };

  const handleSelectOption = (option) => {
    if (isAnswered) return;

    setSelectedOption(option);
    setIsAnswered(true);
    setTotalAsked(prev => prev + 1);

    const isCorrect = option.romaji === currentQuestion.romaji;
    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    if (updateStats) {
      updateStats(isCorrect);
    }
  };

  const handleNextQuestion = () => {
    generateQuestion();
  };

  if (!currentQuestion) return null;

  const targetChar = isHiragana ? currentQuestion.hiragana : currentQuestion.katakana;

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20 lg:pb-8">
      {/* Header & Score */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-headline font-bold text-zen-text dark:text-zen-dark-text">
            Quiz di Ascolto
          </h2>
          <p className="text-xs text-zen-text-muted dark:text-zen-dark-text-muted">
            Listen to the sound and select the matching Kana.
          </p>
        </div>

        <div className="px-4 py-2 rounded-2xl bg-white dark:bg-zen-dark-surface border border-zen-surface-high dark:border-zen-dark-border shadow-zen-sm flex items-center gap-3">
          <span className="text-xs text-zen-text-muted dark:text-zen-dark-text-muted font-semibold">Score:</span>
          <span className="text-lg font-bold text-zen-primary dark:text-zen-dark-primary">{score} / {totalAsked}</span>
        </div>
      </div>

      {/* Audio Trigger Card */}
      <div className="zen-card p-8 border-2 border-zen-surface-high dark:border-zen-dark-border flex flex-col items-center justify-center space-y-6 bg-white dark:bg-zen-dark-surface-high shadow-zen-lg dark:shadow-zen-dark-lg">
        <div className="text-center space-y-2">
          <span className="px-3.5 py-1 rounded-full bg-zen-secondary/15 dark:bg-zen-dark-primary/20 text-zen-secondary dark:text-zen-dark-primary text-xs font-semibold">
            Listening Practice
          </span>
          <h3 className="text-xl font-headline font-bold text-zen-text dark:text-zen-dark-text">
            Listen to the sound and select the matching Kana
          </h3>
        </div>

        <button
          onClick={handlePlayAudio}
          className={`w-28 h-28 rounded-full flex flex-col items-center justify-center gap-1 transition-all duration-300 shadow-zen-lg ${
            audioPlayed
              ? 'bg-zen-primary dark:bg-zen-dark-primary text-white dark:text-zen-dark-on-primary scale-105 shadow-zen-lg ring-4 ring-zen-primary-light dark:ring-zen-dark-primary/40'
              : 'bg-gradient-to-br from-zen-primary to-zen-primary-dark dark:from-zen-dark-primary dark:to-zen-dark-primary-hover text-white dark:text-zen-dark-on-primary hover:scale-105'
          }`}
        >
          <Play className="w-12 h-12 fill-current ml-1" />
        </button>

        <p className="text-xs text-zen-text-muted dark:text-zen-dark-text-muted font-medium">
          {audioPlayed ? 'Ascolto eseguito' : 'Premi per ascoltare'}
        </p>
      </div>

      {/* 4 Options Grid (Kana Characters) */}
      <div className="grid grid-cols-4 gap-4">
        {options.map((option, idx) => {
          const optionChar = isHiragana ? option.hiragana : option.katakana;
          const isSelected = selectedOption?.romaji === option.romaji;
          const isCorrect = option.romaji === currentQuestion.romaji;

          let btnStyle = 'bg-white dark:bg-zen-dark-surface-high border-zen-surface-high dark:border-zen-dark-border text-zen-primary dark:text-white hover:border-zen-primary-light dark:hover:border-zen-dark-primary';
          if (isAnswered) {
            if (isCorrect) {
              btnStyle = 'bg-zen-primary dark:bg-zen-dark-primary text-white dark:text-zen-dark-on-primary border-zen-primary ring-2 ring-zen-primary-light dark:ring-zen-dark-primary/40 shadow-zen-md';
            } else if (isSelected && !isCorrect) {
              btnStyle = 'bg-zen-secondary dark:bg-zen-dark-secondary text-white dark:text-zen-dark-on-primary border-zen-secondary';
            } else {
              btnStyle = 'bg-zen-surface-container/50 dark:bg-zen-dark-surface/50 text-zen-text-muted dark:text-zen-dark-text-muted border-transparent opacity-60';
            }
          }

          return (
            <button
              key={`${option.romaji}-${idx}`}
              onClick={() => handleSelectOption(option)}
              disabled={isAnswered}
              className={`p-6 rounded-2xl border-2 flex flex-col items-center justify-center transition-all duration-200 ${btnStyle}`}
            >
              <span className="font-kana font-bold text-5xl sm:text-6xl">
                {optionChar}
              </span>
            </button>
          );
        })}
      </div>

      {/* Result & Next Button */}
      {isAnswered && (
        <div className="zen-card p-5 border border-zen-primary-light dark:border-zen-dark-border bg-zen-surface-lowest dark:bg-zen-dark-surface flex items-center justify-between gap-4 animate-fade-in">
          <div className="flex items-center gap-3">
            {selectedOption?.romaji === currentQuestion.romaji ? (
              <>
                <CheckCircle2 className="w-8 h-8 text-zen-primary dark:text-zen-dark-primary" />
                <div>
                  <h4 className="font-bold text-zen-primary dark:text-zen-dark-primary">Subarashii! Correct Answer!</h4>
                  <p className="text-xs text-zen-text-muted dark:text-zen-dark-text-muted">
                    '{targetChar}' is pronounced '{currentQuestion.romaji}'.
                  </p>
                </div>
              </>
            ) : (
              <>
                <XCircle className="w-8 h-8 text-zen-secondary dark:text-zen-dark-secondary" />
                <div>
                  <h4 className="font-bold text-zen-secondary dark:text-zen-dark-secondary">Not quite right</h4>
                  <p className="text-xs text-zen-text-muted dark:text-zen-dark-text-muted">
                    The correct Kana was '{targetChar}' ({currentQuestion.romaji}).
                  </p>
                </div>
              </>
            )}
          </div>

          <button
            onClick={handleNextQuestion}
            className="px-5 py-3 rounded-xl bg-zen-primary dark:bg-zen-dark-primary hover:bg-zen-primary-dark dark:hover:bg-zen-dark-primary-hover text-white dark:text-zen-dark-on-primary font-bold text-xs shadow-zen-sm flex items-center gap-1.5"
          >
            Next Sound <Sparkles className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
