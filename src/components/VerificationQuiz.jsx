import React, { useState } from 'react';
import { Award, RotateCcw, Volume2, CheckCircle2, Check, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { HIRAGANA_BASIC, KANA_DAKUTEN } from '../data/kanaData';
import { VOCABULARY } from '../data/vocabulary';
import { playKanaSound } from '../utils/audio';
import { useLanguage } from '../context/LanguageContext';

const QUESTIONS_PER_TEST = 10;
const shuffle = (items) => [...items].sort(() => Math.random() - 0.5);

export default function VerificationQuiz({ scriptMode, updateStats }) {
  const { lang, t } = useLanguage();
  const kanaPool = [...HIRAGANA_BASIC.filter((item) => item.hiragana), ...KANA_DAKUTEN];
  const [testQuestions, setTestQuestions] = useState(() => generateTestQuestions());
  const [currentStep, setCurrentStep] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(0);

  function generateTestQuestions() {
    const kanaQuestions = shuffle(kanaPool).slice(0, 5).map((target) => ({
      kind: 'kana',
      target,
      choices: shuffle([target, ...shuffle(kanaPool.filter((item) => item.romaji !== target.romaji)).slice(0, 3)]),
    }));
    const vocabularyQuestions = shuffle(VOCABULARY).slice(0, 5).map((target) => ({
      kind: 'translation',
      target,
      choices: shuffle([target, ...shuffle(VOCABULARY.filter((item) => item.id !== target.id)).slice(0, 3)]),
    }));
    return shuffle([...kanaQuestions, ...vocabularyQuestions]);
  }

  const isCorrectChoice = (question, choice) => question.kind === 'kana'
    ? choice.romaji === question.target.romaji
    : choice.id === question.target.id;

  const handleAnswerSelect = (choice) => {
    if (isFinished || userAnswers[currentStep]) return;
    const question = testQuestions[currentStep];
    const isCorrect = isCorrectChoice(question, choice);
    const finalAnswers = { ...userAnswers, [currentStep]: choice };
    setUserAnswers(finalAnswers);
    updateStats?.(isCorrect);
    if (currentStep < QUESTIONS_PER_TEST - 1) {
      setTimeout(() => setCurrentStep((step) => step + 1), 400);
      return;
    }
    const finalScore = testQuestions.reduce((total, item, index) => total + (isCorrectChoice(item, finalAnswers[index]) ? 1 : 0), 0);
    setScore(finalScore);
    setIsFinished(true);
    if (finalScore >= 7) confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
  };

  const handleRestart = () => {
    setTestQuestions(generateTestQuestions());
    setCurrentStep(0);
    setUserAnswers({});
    setIsFinished(false);
    setScore(0);
  };

  if (isFinished) {
    const percentage = Math.round((score / QUESTIONS_PER_TEST) * 100);
    const wrongQuestions = testQuestions
      .map((q, idx) => ({ q, ans: userAnswers[idx], isCorrect: isCorrectChoice(q, userAnswers[idx]) }))
      .filter(item => !item.isCorrect);

    return (
      <div className="mx-auto max-w-2xl space-y-6 pb-20 xl:pb-8">
        <div className="zen-card space-y-6 border-2 border-zen-surface-high dark:border-zen-dark-border bg-white dark:bg-zen-dark-surface p-8 text-center shadow-zen-lg dark:shadow-zen-dark-lg rounded-3xl">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-zen-primary/10 text-zen-primary dark:bg-zen-dark-primary/20 dark:text-zen-dark-primary">
            <Award className="h-10 w-10" />
          </div>
          <div>
            <h2 className="font-headline text-3xl font-bold text-zen-text dark:text-zen-dark-text">
              {lang === 'it' ? 'Test Completato!' : 'Test Completed!'}
            </h2>
            <p className="mt-2 text-sm text-zen-text-muted dark:text-zen-dark-text-muted">
              {lang === 'it' ? 'Verifica Kana e Vocabolario' : 'Kana and vocabulary verification'}
            </p>
          </div>
          <div className="inline-block rounded-2xl bg-zen-surface-container/60 px-6 py-4 dark:bg-zen-dark-surface-high">
            <div className="text-4xl font-bold text-zen-primary dark:text-zen-dark-primary">{score} / {QUESTIONS_PER_TEST}</div>
            <div className="mt-1 text-xs font-semibold text-zen-text-muted dark:text-zen-dark-text-muted">
              {t('quiz.accuracy')}: {percentage}%
            </div>
          </div>
          <p className="text-sm font-medium text-zen-text dark:text-zen-dark-text">
            {percentage >= 90 ? (lang === 'it' ? 'Padronanza straordinaria!' : 'Outstanding mastery!') : percentage >= 70 ? (lang === 'it' ? 'Ottimo lavoro! Continua a esercitarti.' : 'Great job! Keep practicing.') : (lang === 'it' ? 'Continua così, la pratica fa la perfezione!' : 'Keep at it!')}
          </p>
          <button onClick={handleRestart} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-zen-primary py-4 text-sm font-bold text-white shadow-zen-md dark:bg-zen-dark-primary dark:text-zen-dark-on-primary">
            <RotateCcw className="h-5 w-5" /> {t('quiz.restart')}
          </button>
        </div>

        {/* Mistakes Review Section */}
        <div className="zen-card p-6 sm:p-8 bg-white dark:bg-zen-dark-surface border-2 border-zen-surface-high dark:border-zen-dark-border rounded-3xl shadow-zen-lg dark:shadow-zen-dark-lg space-y-4">
          <div className="flex items-center justify-between border-b border-zen-border/40 dark:border-zen-dark-border pb-3">
            <h3 className="text-base font-bold text-zen-text dark:text-zen-dark-text flex items-center gap-2">
              <span>{lang === 'it' ? 'Riepilogo Risposte Errate' : 'Mistakes Review'}</span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold ${wrongQuestions.length === 0 ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'}`}>
                {wrongQuestions.length} {lang === 'it' ? 'errori' : 'mistakes'}
              </span>
            </h3>
          </div>

          {wrongQuestions.length === 0 ? (
            <div className="py-8 text-center text-emerald-600 dark:text-emerald-400 font-semibold text-sm flex flex-col items-center gap-2">
              <CheckCircle2 className="w-10 h-10" />
              <p>{lang === 'it' ? 'Nessun errore! Tutte le risposte erano corrette.' : 'Perfect score! No mistakes made.'}</p>
            </div>
          ) : (
            <div className="space-y-3 pt-2">
              {wrongQuestions.map(({ q, ans }, idx) => {
                const isKana = q.kind === 'kana';
                const targetText = isKana ? (scriptMode === 'hiragana' ? q.target.hiragana : q.target.katakana) : (q.target.japanese || q.target.kana);
                const correctLabel = isKana ? q.target.romaji : (lang === 'it' ? q.target.italian : q.target.english);
                const userLabel = ans ? (isKana ? ans.romaji : (lang === 'it' ? ans.italian : ans.english)) : '-';

                return (
                  <div
                    key={`wrong-q-${idx}`}
                    className="p-4 rounded-2xl bg-zen-surface-container/40 dark:bg-zen-dark-surface-high border border-zen-border/40 dark:border-zen-dark-border flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => playKanaSound(targetText)}
                        className="p-3 rounded-xl bg-zen-primary/10 dark:bg-zen-dark-primary/20 text-zen-primary dark:text-zen-dark-primary hover:bg-zen-primary/20 transition-colors shadow-sm shrink-0"
                        title="Audio"
                      >
                        <Volume2 className="w-5 h-5" />
                      </button>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-kana font-bold text-2xl text-zen-text dark:text-white">
                            {targetText}
                          </span>
                          {!isKana && (
                            <span className="text-xs font-mono text-zen-text-muted dark:text-zen-dark-text-muted">
                              ({q.target.romaji})
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 text-xs font-semibold">
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30">
                        <X className="w-3.5 h-3.5 shrink-0" />
                        <span>{lang === 'it' ? 'Tua risposta' : 'Your answer'}: <strong>{userLabel}</strong></span>
                      </div>

                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                        <Check className="w-3.5 h-3.5 shrink-0" />
                        <span>{lang === 'it' ? 'Corretta' : 'Correct'}: <strong>{correctLabel}</strong></span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  const currentQ = testQuestions[currentStep];
  const isKanaQuestion = currentQ.kind === 'kana';
  const targetKana = isKanaQuestion ? (scriptMode === 'hiragana' ? currentQ.target.hiragana : currentQ.target.katakana) : currentQ.target.kana;
  
  const prompt = isKanaQuestion
    ? (lang === 'it' ? 'Quale lettura romaji corrisponde?' : 'Which romaji matches?') 
    : (lang === 'it' ? 'Scegli la traduzione corretta' : 'Choose the correct translation');

  const progressPercent = Math.round(((currentStep + 1) / QUESTIONS_PER_TEST) * 100);

  return (
    <div className="mx-auto max-w-2xl space-y-6 pb-20 xl:pb-8">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-zen-text-muted dark:text-zen-dark-text-muted">
          <span>{t('quiz.title')} · Kana & Vocabolario</span>
          <span>{t('quiz.question')} {currentStep + 1} / {QUESTIONS_PER_TEST}</span>
        </div>
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-zen-surface-container dark:bg-zen-dark-surface-high">
          <div className="h-full rounded-full bg-zen-primary transition-all duration-300 dark:bg-zen-dark-primary" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>
      <div className="zen-card flex flex-col items-center space-y-4 border-2 border-zen-surface-high bg-white p-10 text-center shadow-zen-lg dark:border-zen-dark-border dark:bg-zen-dark-surface-high dark:shadow-zen-dark-lg">
        <div className="flex w-full items-center justify-between">
          <span className="rounded-full bg-zen-surface-container px-3 py-1 text-xs font-semibold text-zen-text-muted dark:bg-zen-dark-surface dark:text-zen-dark-text-muted">{prompt}</span>
          <button onClick={() => playKanaSound(targetKana)} className="rounded-full bg-zen-primary/10 p-2.5 text-zen-primary dark:bg-zen-dark-primary/20 dark:text-zen-dark-primary" title="Play Japanese audio">
            <Volume2 className="h-5 w-5" />
          </button>
        </div>
        <div className="font-kana py-4 text-8xl font-bold text-zen-primary dark:text-white sm:text-9xl">{targetKana}</div>
        {!isKanaQuestion && <div className="text-lg font-bold text-zen-text dark:text-zen-dark-text">{currentQ.target.romaji}</div>}
      </div>
      <div className="grid grid-cols-2 gap-4">
        {currentQ.choices.map((choice, index) => {
          const isSelected = userAnswers[currentStep]?.id === choice.id || (isKanaQuestion && userAnswers[currentStep]?.romaji === choice.romaji);
          return (
            <button
              key={`${choice.id || choice.romaji}-${index}`}
              onClick={() => handleAnswerSelect(choice)}
              className={`rounded-2xl border-2 p-5 font-headline font-bold transition-all duration-200 ${
                isSelected
                  ? 'border-zen-primary bg-zen-primary text-white shadow-zen-md dark:bg-zen-dark-primary dark:text-zen-dark-on-primary'
                  : 'border-zen-surface-high bg-white text-zen-text hover:border-zen-primary-light dark:border-zen-dark-border dark:bg-zen-dark-surface dark:text-zen-dark-text dark:hover:border-zen-dark-primary'
              } text-xl capitalize`}
            >
              {isKanaQuestion ? choice.romaji : (lang === 'it' ? choice.italian : choice.english)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
