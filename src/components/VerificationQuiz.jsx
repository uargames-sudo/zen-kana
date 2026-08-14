import React, { useState } from 'react';
import { Award, RotateCcw, Volume2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { HIRAGANA_BASIC, KANA_DAKUTEN } from '../data/kanaData';
import { VOCABULARY, getVocabularyIcon } from '../data/vocabulary';
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
    const kanaQuestions = shuffle(kanaPool).slice(0, 4).map((target) => ({
      kind: 'kana', target,
      choices: shuffle([target, ...shuffle(kanaPool.filter((item) => item.romaji !== target.romaji)).slice(0, 3)]),
    }));
    const vocabularyQuestions = shuffle(VOCABULARY).slice(0, 6).map((target, index) => ({
      kind: index % 2 === 0 ? 'translation' : 'icon', target,
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
    return (
      <div className="mx-auto max-w-xl space-y-6 pb-20 lg:pb-8">
        <div className="zen-card space-y-6 border-2 border-zen-primary-light bg-white p-8 text-center shadow-zen-lg dark:border-zen-dark-border dark:bg-zen-dark-surface dark:shadow-zen-dark-lg">
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
      </div>
    );
  }

  const currentQ = testQuestions[currentStep];
  const isKanaQuestion = currentQ.kind === 'kana';
  const targetKana = isKanaQuestion ? (scriptMode === 'hiragana' ? currentQ.target.hiragana : currentQ.target.katakana) : currentQ.target.kana;
  
  const prompt = currentQ.kind === 'kana' 
    ? (lang === 'it' ? 'Quale lettura romaji corrisponde?' : 'Which romaji matches?') 
    : currentQ.kind === 'translation' 
    ? (lang === 'it' ? 'Scegli la traduzione corretta' : 'Choose the correct translation') 
    : (lang === 'it' ? 'Scegli l\'icona corrispondente' : 'Choose the matching icon');

  const progressPercent = Math.round(((currentStep + 1) / QUESTIONS_PER_TEST) * 100);

  return (
    <div className="mx-auto max-w-2xl space-y-6 pb-20 lg:pb-8">
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
      <div className={`grid gap-4 ${currentQ.kind === 'icon' ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-2'}`}>
        {currentQ.choices.map((choice, index) => {
          const isSelected = userAnswers[currentStep]?.id === choice.id || (isKanaQuestion && userAnswers[currentStep]?.romaji === choice.romaji);
          const Icon = currentQ.kind === 'icon' ? getVocabularyIcon(choice.imageKeyword) : null;
          return (
            <button
              key={`${choice.id || choice.romaji}-${index}`}
              onClick={() => handleAnswerSelect(choice)}
              className={`rounded-2xl border-2 p-5 font-headline font-bold transition-all duration-200 ${
                isSelected
                  ? 'border-zen-primary bg-zen-primary text-white shadow-zen-md dark:bg-zen-dark-primary dark:text-zen-dark-on-primary'
                  : 'border-zen-surface-high bg-white text-zen-text hover:border-zen-primary-light dark:border-zen-dark-border dark:bg-zen-dark-surface dark:text-zen-dark-text dark:hover:border-zen-dark-primary'
              } ${currentQ.kind === 'icon' ? 'flex min-h-28 items-center justify-center' : 'text-xl capitalize'}`}
            >
              {Icon ? <Icon className="h-10 w-10" /> : isKanaQuestion ? choice.romaji : (lang === 'it' ? choice.italian : choice.english)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
