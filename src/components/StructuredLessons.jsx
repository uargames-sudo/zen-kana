import React, { useMemo, useState } from 'react';
import { BookOpen, ChevronLeft, ChevronRight, PenTool, Volume2, CheckCircle } from 'lucide-react';
import { LESSONS, getLessonKana, getLessonVocabulary, kanaHighlightType } from '../data/lessonData';
import { getVocabularyIcon } from '../data/vocabulary';
import { playKanaSound } from '../utils/audio';
import KanaDrawingPad from './KanaDrawingPad';
import { useLanguage } from '../context/LanguageContext';

function HighlightedKana({ text, lesson, scriptMode }) {
  return (
    <span className="font-kana text-3xl font-bold">
      {Array.from(text).map((character, index) => {
        const type = kanaHighlightType(character, lesson, scriptMode);
        return (
          <span
            key={`${character}-${index}`}
            className={
              type === 'new'
                ? 'text-zen-secondary dark:text-zen-dark-secondary'
                : type === 'known'
                ? 'text-zen-primary dark:text-zen-dark-primary'
                : 'text-zen-text-muted dark:text-zen-dark-text-muted'
            }
          >
            {character}
          </span>
        );
      })}
    </span>
  );
}

export default function StructuredLessons({ scriptMode, updateStats }) {
  const { lang, t } = useLanguage();
  const [lessonId, setLessonId] = useState(1);
  const [step, setStep] = useState(0);
  const [cardIndex, setCardIndex] = useState(0);
  const [vocabIndex, setVocabIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);

  const stepsLabels = lang === 'it' 
    ? ['Introduzione', 'Carte Kana', 'Scrittura', 'Vocabolario', 'Verifica']
    : ['Introduction', 'Kana cards', 'Writing', 'Vocabulary', 'Verification'];

  const lesson = LESSONS[lessonId - 1];
  const kana = useMemo(() => getLessonKana(lesson, scriptMode), [lesson, scriptMode]);
  const vocabulary = useMemo(() => getLessonVocabulary(lesson, scriptMode), [lesson, scriptMode]);
  const currentKana = kana[cardIndex % kana.length];
  const currentWord = vocabulary[vocabIndex % vocabulary.length];
  const vocabularyQuizCount = Math.min(3, vocabulary.length);
  const quizTotal = kana.length + vocabularyQuizCount;
  const isKanaQuiz = quizIndex < kana.length;
  const quizWord = vocabulary[(quizIndex - kana.length) % Math.max(vocabulary.length, 1)];

  const quizChoices = useMemo(() => {
    if (isKanaQuiz) {
      const target = kana[quizIndex];
      return target ? [target, ...kana.filter((item) => item.romaji !== target.romaji).slice(0, 3)].sort(() => Math.random() - 0.5) : [];
    }
    return quizWord ? [quizWord, ...vocabulary.filter((item) => item.id !== quizWord.id).slice(0, 3)].sort(() => Math.random() - 0.5) : [];
  }, [isKanaQuiz, kana, quizIndex, quizWord, vocabulary]);

  const changeLesson = (id) => {
    setLessonId(id);
    setStep(0);
    setCardIndex(0);
    setVocabIndex(0);
    setFlipped(false);
    setQuizIndex(0);
    setQuizScore(0);
  };

  const answerQuiz = (choice) => {
    const correct = isKanaQuiz ? choice.romaji === kana[quizIndex].romaji : choice.id === quizWord.id;
    updateStats?.(correct);
    if (correct) setQuizScore((value) => value + 1);
    setQuizIndex((value) => value + 1);
  };

  return (
    <section className="mx-auto max-w-4xl space-y-6 pb-20 xl:pb-8">
      <div className="zen-card border border-zen-surface-high p-5 dark:border-zen-dark-border">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-zen-primary dark:text-zen-dark-primary">
              <BookOpen className="h-5 w-5" />
              <span className="text-xs font-bold uppercase tracking-wider">{t('lessons.title')}</span>
            </div>
            <h2 className="mt-1 font-headline text-2xl font-bold text-zen-text dark:text-zen-dark-text">
              {t('lessons.day')} {lesson.id} · 5 kana {lang === 'it' ? 'al giorno' : 'per day'}
            </h2>
          </div>
          <select
            value={lessonId}
            onChange={(event) => changeLesson(Number(event.target.value))}
            className="rounded-xl border border-zen-border bg-white px-3 py-2 text-sm font-bold dark:border-zen-dark-border dark:bg-zen-dark-surface dark:text-zen-dark-text"
          >
            {LESSONS.map((item) => (
              <option key={item.id} value={item.id}>
                {t('lessons.day')} {item.id}
              </option>
            ))}
          </select>
        </div>
        <div className="mt-5 grid grid-cols-5 gap-1">
          {stepsLabels.map((label, index) => (
            <button
              key={label}
              onClick={() => setStep(index)}
              className={`rounded-lg px-2 py-2 text-[10px] font-bold sm:text-xs transition-all ${
                step === index
                  ? 'bg-zen-primary text-white dark:bg-zen-dark-primary dark:text-zen-dark-on-primary'
                  : 'bg-zen-surface-container text-zen-text-muted dark:bg-zen-dark-surface-high dark:text-zen-dark-text-muted'
              }`}
            >
              {index + 1}. <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {step === 0 && (
        <div className="grid gap-4 sm:grid-cols-5">
          {kana.map((item) => (
            <button
              key={item.romaji}
              onClick={() => playKanaSound(item.char)}
              className="zen-card flex min-h-48 flex-col items-center justify-center border border-zen-surface-high p-4 dark:border-zen-dark-border hover:border-zen-primary transition-colors"
            >
              <span className="font-kana text-6xl font-bold text-zen-primary dark:text-zen-dark-primary">{item.char}</span>
              <span className="mt-2 font-bold text-zen-text dark:text-zen-dark-text">{item.romaji}</span>
              <span className="mt-1 text-xs text-zen-text-muted dark:text-zen-dark-text-muted">
                {lang === 'it' ? 'Tocca per audio' : 'Tap for audio'}
              </span>
              <Volume2 className="mt-3 h-4 w-4 text-zen-primary dark:text-zen-dark-primary" />
            </button>
          ))}
        </div>
      )}

      {step === 1 && (
        <div className="zen-card min-h-[360px] border border-zen-surface-high p-8 text-center dark:border-zen-dark-border">
          <button
            onClick={() => {
              setFlipped((value) => !value);
              playKanaSound(currentKana.char);
            }}
            className="flex w-full flex-col items-center"
          >
            <span className="font-kana text-9xl font-bold text-zen-primary dark:text-zen-dark-primary">
              {flipped ? currentKana.romaji : currentKana.char}
            </span>
            <span className="mt-8 text-sm font-bold text-zen-text-muted dark:text-zen-dark-text-muted">
              {t('flashcards.flipHint')}
            </span>
          </button>
          <div className="mt-8 flex justify-between">
            <button
              onClick={() => {
                setCardIndex((value) => Math.max(0, value - 1));
                setFlipped(false);
              }}
              className="text-sm font-bold text-zen-primary dark:text-zen-dark-primary"
            >
              {lang === 'it' ? 'Precedente' : 'Previous'}
            </button>
            <span className="text-sm text-zen-text-muted">{cardIndex + 1} / {kana.length}</span>
            <button
              onClick={() => {
                setCardIndex((value) => Math.min(kana.length - 1, value + 1));
                setFlipped(false);
              }}
              className="text-sm font-bold text-zen-primary dark:text-zen-dark-primary"
            >
              {lang === 'it' ? 'Successivo' : 'Next'}
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="zen-card space-y-4 border border-zen-surface-high p-5 dark:border-zen-dark-border">
          <div className="flex flex-wrap gap-2">
            {kana.map((item, index) => (
              <button
                key={item.romaji}
                onClick={() => setCardIndex(index)}
                className={`rounded-xl px-3 py-2 font-kana text-2xl ${
                  currentKana.romaji === item.romaji
                    ? 'bg-zen-primary text-white dark:bg-zen-dark-primary dark:text-zen-dark-on-primary'
                    : 'bg-zen-surface-container text-zen-primary dark:bg-zen-dark-surface-high dark:text-zen-dark-primary'
                }`}
              >
                {item.char}
              </button>
            ))}
          </div>
          <KanaDrawingPad kana={currentKana.char} romaji={currentKana.romaji} onScore={() => {}} />
        </div>
      )}

      {step === 3 && (
        <div className="zen-card min-h-[360px] border border-zen-surface-high p-8 text-center dark:border-zen-dark-border">
          {currentWord && (
            <button
              onClick={() => {
                setFlipped((value) => !value);
                playKanaSound(currentWord.kana);
              }}
              className="flex w-full flex-col items-center"
            >
              <div className="mb-6 rounded-2xl bg-zen-primary/10 p-4 text-zen-primary dark:bg-zen-dark-primary/20 dark:text-zen-dark-primary">
                {React.createElement(getVocabularyIcon(currentWord.imageKeyword), { className: 'h-12 w-12' })}
              </div>
              {flipped ? (
                <>
                  <HighlightedKana text={currentWord.kana} lesson={lesson} scriptMode={scriptMode} />
                  <span className="mt-3 text-xl font-bold text-zen-text dark:text-zen-dark-text">
                    {lang === 'it' ? `${currentWord.italian} • ${currentWord.english}` : `${currentWord.english} • ${currentWord.italian}`}
                  </span>
                  <span className="text-sm text-zen-text-muted dark:text-zen-dark-text-muted">{currentWord.romaji}</span>
                </>
              ) : (
                <HighlightedKana text={currentWord.kana} lesson={lesson} scriptMode={scriptMode} />
              )}
              <span className="mt-8 text-sm font-bold text-zen-text-muted dark:text-zen-dark-text-muted">
                {t('flashcards.flipHint')}
              </span>
            </button>
          )}
          <div className="mt-8 flex justify-between">
            <button
              onClick={() => {
                setVocabIndex((value) => Math.max(0, value - 1));
                setFlipped(false);
              }}
              className="text-sm font-bold text-zen-primary dark:text-zen-dark-primary"
            >
              {lang === 'it' ? 'Precedente' : 'Previous'}
            </button>
            <span className="text-sm text-zen-text-muted">{vocabIndex + 1} / {vocabulary.length}</span>
            <button
              onClick={() => {
                setVocabIndex((value) => Math.min(vocabulary.length - 1, value + 1));
                setFlipped(false);
              }}
              className="text-sm font-bold text-zen-primary dark:text-zen-dark-primary"
            >
              {lang === 'it' ? 'Successivo' : 'Next'}
            </button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="zen-card space-y-6 border border-zen-surface-high p-8 text-center dark:border-zen-dark-border">
          {quizIndex < quizTotal ? (
            <>
              {isKanaQuiz ? (
                <>
                  <p className="text-sm font-bold text-zen-text-muted dark:text-zen-dark-text-muted">
                    {lang === 'it' ? 'Quale lettura corrisponde?' : 'Which reading matches?'}
                  </p>
                  <button onClick={() => playKanaSound(kana[quizIndex].char)} className="font-kana text-8xl font-bold text-zen-primary dark:text-zen-dark-primary">
                    {kana[quizIndex].char}
                  </button>
                </>
              ) : (
                <>
                  <p className="text-sm font-bold text-zen-text-muted dark:text-zen-dark-text-muted">
                    {lang === 'it' ? 'Scegli la traduzione corretta' : 'Choose the correct translation'}
                  </p>
                  <button onClick={() => playKanaSound(quizWord.kana)} className="font-kana text-7xl font-bold text-zen-primary dark:text-zen-dark-primary">
                    {quizWord.kana}
                  </button>
                </>
              )}
              <div className="grid grid-cols-2 gap-3">
                {quizChoices.map((choice) => (
                  <button
                    key={choice.id || choice.romaji}
                    onClick={() => answerQuiz(choice)}
                    className="rounded-xl border border-zen-surface-high p-4 text-xl font-bold dark:border-zen-dark-border hover:bg-zen-primary/10 transition-colors"
                  >
                    {isKanaQuiz ? choice.romaji : (lang === 'it' ? choice.italian : choice.english)}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div>
              <CheckCircle className="mx-auto h-12 w-12 text-zen-primary dark:text-zen-dark-primary" />
              <h3 className="mt-3 font-headline text-2xl font-bold">{lang === 'it' ? 'Lezione Completata!' : 'Lesson Complete!'}</h3>
              <p className="mt-2 text-zen-text-muted dark:text-zen-dark-text-muted">{lang === 'it' ? 'Punteggio' : 'Score'}: {quizScore} / {quizTotal}</p>
            </div>
          )}
        </div>
      )}

      <div className="flex justify-between">
        <button
          disabled={lessonId === 1}
          onClick={() => changeLesson(lessonId - 1)}
          className="flex items-center gap-1 text-sm font-bold disabled:opacity-40 text-zen-primary dark:text-zen-dark-primary"
        >
          <ChevronLeft className="h-4 w-4" /> {lang === 'it' ? 'Giorno precedente' : 'Previous day'}
        </button>
        <button
          disabled={lessonId === LESSONS.length}
          onClick={() => changeLesson(lessonId + 1)}
          className="flex items-center gap-1 text-sm font-bold disabled:opacity-40 text-zen-primary dark:text-zen-dark-primary"
        >
          {lang === 'it' ? 'Giorno successivo' : 'Next day'} <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}
