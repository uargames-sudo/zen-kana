import React, { useMemo, useState } from 'react';
import { 
  BookOpen, 
  ChevronLeft, 
  ChevronRight, 
  PenTool, 
  Volume2, 
  CheckCircle, 
  ListChecks, 
  Sparkles, 
  ArrowRight, 
  Layers, 
  Award,
  Clock,
  Flame,
  Lock
} from 'lucide-react';
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

  // Navigation mode: 'hub' (Course selector) | 'course-5kana' (Active 5-kana course)
  const [viewMode, setViewMode] = useState('hub');

  // 5-Kana Course State
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

  // ======================= 1. LESSONS HUB / OVERVIEW =======================
  if (viewMode === 'hub') {
    return (
      <section className="mx-auto max-w-4xl space-y-6 pb-20 xl:pb-8 animate-fade-in">
        {/* Header Banner */}
        <div className="zen-card p-6 sm:p-8 bg-zen-surface-lowest dark:bg-zen-dark-surface border border-zen-border/40 dark:border-zen-dark-border">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zen-primary dark:text-zen-dark-primary mb-2">
            <ListChecks className="w-4 h-4" />
            <span>{t('lessons.title')}</span>
          </div>
          <h2 className="font-headline text-3xl font-bold text-zen-text dark:text-zen-dark-text">
            {t('lessons.hubTitle') || 'Lezioni & Corsi'}
          </h2>
          <p className="text-sm text-zen-text-muted dark:text-zen-dark-text-muted mt-1 max-w-2xl">
            {t('lessons.hubSubtitle') || 'Percorsi di studio strutturati per padroneggiare il giapponese passo dopo passo.'}
          </p>
        </div>

        {/* Primary Available Track: 5 Kana al giorno */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-zen-text-muted dark:text-zen-dark-text-muted uppercase tracking-wider px-1">
            {lang === 'it' ? 'Percorsi Disponibili' : 'Available Courses'}
          </h3>

          <div className="zen-card p-6 sm:p-7 border-2 border-zen-primary/40 dark:border-zen-dark-primary/50 bg-zen-surface-lowest dark:bg-zen-dark-surface shadow-zen-md hover:shadow-zen-lg transition-all rounded-3xl group">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-3 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-zen-primary/10 dark:bg-zen-dark-primary/20 text-zen-primary dark:text-zen-dark-primary text-xs font-bold font-mono">
                    {t('lessons.track5KanaBadge') || '10 Giorni • 46 Kana Base'}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-2xs font-bold">
                    {lang === 'it' ? 'Attivo' : 'Active'}
                  </span>
                </div>

                <div>
                  <h4 className="font-headline text-2xl font-bold text-zen-text dark:text-zen-dark-text group-hover:text-zen-primary dark:group-hover:text-zen-dark-primary transition-colors">
                    {t('lessons.track5KanaTitle') || '5 Kana al Giorno'}
                  </h4>
                  <p className="text-sm font-semibold text-zen-primary dark:text-zen-dark-primary mt-0.5">
                    {t('lessons.track5KanaSubtitle') || 'Kana base un passo alla volta'}
                  </p>
                  <p className="text-xs text-zen-text-muted dark:text-zen-dark-text-muted mt-2 leading-relaxed">
                    {t('lessons.track5KanaDesc') || 'Impara i 46 caratteri base Gojūon suddivisi in 10 lezioni quotidiane mirate con teoria, schede interattive, scrittura e quiz di verifica.'}
                  </p>
                </div>

                {/* Features Mini-badges */}
                <div className="flex flex-wrap gap-2 pt-1 text-2xs font-bold text-zen-text-muted dark:text-zen-dark-text-muted">
                  <span className="flex items-center gap-1 bg-zen-surface-container/60 dark:bg-zen-dark-surface-high/60 px-2.5 py-1 rounded-lg">
                    <BookOpen className="w-3 h-3 text-zen-primary" /> Teoria
                  </span>
                  <span className="flex items-center gap-1 bg-zen-surface-container/60 dark:bg-zen-dark-surface-high/60 px-2.5 py-1 rounded-lg">
                    <Layers className="w-3 h-3 text-zen-secondary" /> Flashcards
                  </span>
                  <span className="flex items-center gap-1 bg-zen-surface-container/60 dark:bg-zen-dark-surface-high/60 px-2.5 py-1 rounded-lg">
                    <PenTool className="w-3 h-3 text-zen-accent" /> Scrittura Canvas
                  </span>
                  <span className="flex items-center gap-1 bg-zen-surface-container/60 dark:bg-zen-dark-surface-high/60 px-2.5 py-1 rounded-lg">
                    <Award className="w-3 h-3 text-emerald-500" /> Quiz Finale
                  </span>
                </div>
              </div>

              <div className="shrink-0 flex md:flex-col items-center justify-between gap-3 border-t md:border-t-0 md:border-l border-zen-border/40 dark:border-zen-dark-border pt-4 md:pt-0 md:pl-6">
                <div className="text-left md:text-center">
                  <span className="text-3xs font-bold uppercase tracking-wider text-zen-text-muted">Progresso</span>
                  <div className="text-base font-bold font-mono text-zen-text dark:text-zen-dark-text">
                    Giorno {lessonId}/10
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setViewMode('course-5kana')}
                  className="py-3 px-5 rounded-2xl bg-zen-primary dark:bg-zen-dark-primary hover:bg-zen-primary-dark dark:hover:bg-zen-dark-primary-hover text-white dark:text-zen-dark-on-primary font-bold text-xs shadow-zen-md hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer shrink-0"
                >
                  <span>{lessonId > 1 ? `${t('lessons.continueCourse')} ${lessonId}` : t('lessons.startCourse')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Future Tracks Modular Placeholders */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-bold text-zen-text-muted dark:text-zen-dark-text-muted uppercase tracking-wider px-1">
            {lang === 'it' ? 'Prossimi Corsi in Arrivo' : 'Upcoming Courses'}
          </h3>

          <div className="grid sm:grid-cols-3 gap-3">
            {[
              {
                title: 'Dakuten & Handakuten',
                subtitle: 'Suoni sonori e semi-sonori (゛ e ゜)',
                kana: 'が・ぱ',
              },
              {
                title: 'Combinazioni Yōon',
                subtitle: 'Dittonghi e suoni contratti (きゃ, しゃ...)',
                kana: 'きゃ',
              },
              {
                title: 'Regole di Fonetica Zen',
                subtitle: 'Sokuon (っ) e Chōonpu (ー)',
                kana: 'っ・ー',
              },
            ].map((course, idx) => (
              <div
                key={idx}
                className="zen-card p-4 rounded-2xl border border-dashed border-zen-border/60 dark:border-zen-dark-border bg-zen-surface-container/20 dark:bg-zen-dark-surface/40 opacity-75 space-y-2 relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <span className="font-kana text-xl font-bold text-zen-primary/60 dark:text-zen-dark-primary/60">
                    {course.kana}
                  </span>
                  <span className="flex items-center gap-1 text-3xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-zen-surface-container dark:bg-zen-dark-surface-high text-zen-text-muted">
                    <Lock className="w-2.5 h-2.5" />
                    {t('lessons.comingSoon')}
                  </span>
                </div>

                <div>
                  <h5 className="font-headline font-bold text-sm text-zen-text dark:text-zen-dark-text">
                    {course.title}
                  </h5>
                  <p className="text-2xs text-zen-text-muted dark:text-zen-dark-text-muted mt-0.5">
                    {course.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // ======================= 2. ACTIVE "5 KANA AL GIORNO" COURSE =======================
  return (
    <section className="mx-auto max-w-4xl space-y-6 pb-20 xl:pb-8 animate-fade-in">
      {/* Course Navigation Bar */}
      <div className="zen-card border border-zen-border/40 p-5 dark:border-zen-dark-border bg-zen-surface-lowest dark:bg-zen-dark-surface">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-zen-primary dark:text-zen-dark-primary">
              <button
                type="button"
                onClick={() => setViewMode('hub')}
                className="px-2.5 py-1 rounded-xl bg-zen-surface-container dark:bg-zen-dark-surface-high text-zen-text-muted hover:text-zen-text dark:text-zen-dark-text-muted text-2xs font-bold uppercase tracking-wider flex items-center gap-1 transition-colors cursor-pointer mr-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>{t('lessons.backToHub') || 'Tutti i Corsi'}</span>
              </button>
              <span className="text-xs font-bold uppercase tracking-wider">{t('lessons.track5KanaTitle')}</span>
            </div>
            <h2 className="mt-1 font-headline text-2xl font-bold text-zen-text dark:text-zen-dark-text">
              {t('lessons.day')} {lesson.id} · {t('lessons.track5KanaSubtitle')}
            </h2>
          </div>

          {/* Day Selector */}
          <select
            value={lessonId}
            onChange={(event) => changeLesson(Number(event.target.value))}
            className="rounded-xl border border-zen-border bg-white px-3 py-2 text-sm font-bold dark:border-zen-dark-border dark:bg-zen-dark-surface dark:text-zen-dark-text shadow-zen-sm cursor-pointer"
          >
            {LESSONS.map((item) => (
              <option key={item.id} value={item.id}>
                {t('lessons.day')} {item.id} (5 Kana)
              </option>
            ))}
          </select>
        </div>

        {/* 5 Lesson Step Tabs */}
        <div className="mt-5 grid grid-cols-5 gap-1.5 bg-zen-surface-container/40 dark:bg-zen-dark-surface-high/40 p-1 rounded-2xl border border-zen-border/40 dark:border-zen-dark-border">
          {stepsLabels.map((label, index) => (
            <button
              key={label}
              onClick={() => setStep(index)}
              className={`rounded-xl px-2 py-2 text-2xs font-bold sm:text-xs transition-all cursor-pointer ${
                step === index
                  ? 'bg-zen-primary text-white dark:bg-zen-dark-primary dark:text-zen-dark-on-primary shadow-zen-sm scale-102'
                  : 'text-zen-text-muted hover:text-zen-text dark:text-zen-dark-text-muted'
              }`}
            >
              {index + 1}. <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Step 0: Teoria & Introduzione */}
      {step === 0 && (
        <div className="grid gap-4 sm:grid-cols-5 animate-fade-in">
          {kana.map((item) => (
            <button
              key={item.romaji}
              onClick={() => playKanaSound(item.char)}
              className="zen-card flex min-h-48 flex-col items-center justify-center border border-zen-border/40 p-4 dark:border-zen-dark-border hover:border-zen-primary dark:hover:border-zen-dark-primary hover:scale-103 active:scale-95 transition-all bg-zen-surface-lowest dark:bg-zen-dark-surface shadow-zen-sm group cursor-pointer"
            >
              <span className="font-kana text-6xl font-bold text-zen-primary dark:text-zen-dark-primary group-hover:scale-105 transition-transform">{item.char}</span>
              <span className="mt-2 font-bold font-headline text-base text-zen-text dark:text-zen-dark-text uppercase tracking-wider">{item.romaji}</span>
              <span className="mt-1 text-3xs text-zen-text-muted dark:text-zen-dark-text-muted font-medium">
                {lang === 'it' ? 'Tocca per audio' : 'Tap for audio'}
              </span>
              <Volume2 className="mt-3 h-4 w-4 text-zen-primary dark:text-zen-dark-primary opacity-80 group-hover:opacity-100" />
            </button>
          ))}
        </div>
      )}

      {/* Step 1: Flashcards */}
      {step === 1 && (
        <div className="zen-card min-h-[360px] border border-zen-border/40 p-8 text-center dark:border-zen-dark-border bg-zen-surface-lowest dark:bg-zen-dark-surface shadow-zen-md rounded-3xl animate-fade-in">
          <button
            onClick={() => {
              setFlipped((value) => !value);
              playKanaSound(currentKana.char);
            }}
            className="flex w-full flex-col items-center cursor-pointer group"
          >
            <span className="font-kana text-9xl font-bold text-zen-primary dark:text-zen-dark-primary group-hover:scale-105 transition-transform">
              {flipped ? currentKana.romaji.toUpperCase() : currentKana.char}
            </span>
            <span className="mt-8 text-xs font-bold text-zen-text-muted dark:text-zen-dark-text-muted uppercase tracking-wider">
              {t('flashcards.flipHint')}
            </span>
          </button>
          <div className="mt-8 flex justify-between items-center max-w-sm mx-auto">
            <button
              onClick={() => {
                setCardIndex((value) => Math.max(0, value - 1));
                setFlipped(false);
              }}
              className="py-2 px-4 rounded-xl bg-zen-surface-container dark:bg-zen-dark-surface-high text-xs font-bold text-zen-primary dark:text-zen-dark-primary hover:scale-105 transition-all cursor-pointer"
            >
              {lang === 'it' ? '← Precedente' : '← Previous'}
            </button>
            <span className="text-xs font-bold font-mono text-zen-text-muted">{cardIndex + 1} / {kana.length}</span>
            <button
              onClick={() => {
                setCardIndex((value) => Math.min(kana.length - 1, value + 1));
                setFlipped(false);
              }}
              className="py-2 px-4 rounded-xl bg-zen-surface-container dark:bg-zen-dark-surface-high text-xs font-bold text-zen-primary dark:text-zen-dark-primary hover:scale-105 transition-all cursor-pointer"
            >
              {lang === 'it' ? 'Successivo →' : 'Next →'}
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Scrittura Canvas */}
      {step === 2 && (
        <div className="zen-card space-y-4 border border-zen-border/40 p-5 dark:border-zen-dark-border bg-zen-surface-lowest dark:bg-zen-dark-surface rounded-3xl shadow-zen-md animate-fade-in">
          <div className="flex flex-wrap gap-2 justify-center">
            {kana.map((item, index) => (
              <button
                key={item.romaji}
                onClick={() => setCardIndex(index)}
                className={`rounded-2xl px-4 py-2.5 font-kana text-2xl transition-all cursor-pointer ${
                  currentKana.romaji === item.romaji
                    ? 'bg-zen-primary text-white dark:bg-zen-dark-primary dark:text-zen-dark-on-primary shadow-zen-sm scale-105'
                    : 'bg-zen-surface-container text-zen-primary dark:bg-zen-dark-surface-high dark:text-zen-dark-primary hover:scale-102'
                }`}
              >
                {item.char}
              </button>
            ))}
          </div>
          <KanaDrawingPad kana={currentKana.char} romaji={currentKana.romaji} onScore={() => {}} />
        </div>
      )}

      {/* Step 3: Vocabolario */}
      {step === 3 && (
        <div className="zen-card space-y-4 border border-zen-border/40 p-6 dark:border-zen-dark-border bg-zen-surface-lowest dark:bg-zen-dark-surface rounded-3xl shadow-zen-md animate-fade-in">
          <p className="text-xs font-bold text-zen-text-muted uppercase tracking-wider">
            {t('lessons.vocabularyFound')} ({vocabulary.length})
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            {vocabulary.map((word) => {
              const Icon = getVocabularyIcon(word.imageKeyword);
              return (
                <button
                  key={word.id}
                  onClick={() => playKanaSound(word.kana)}
                  className="flex items-center justify-between rounded-2xl border border-zen-border/40 p-4 text-left dark:border-zen-dark-border bg-zen-surface-container/20 dark:bg-zen-dark-surface-high/30 hover:border-zen-primary dark:hover:border-zen-dark-primary transition-all group cursor-pointer"
                >
                  <div className="space-y-1">
                    <HighlightedKana text={word.kana} lesson={lesson} scriptMode={scriptMode} />
                    <div className="text-sm font-bold font-headline text-zen-text dark:text-zen-dark-text">{word.romaji}</div>
                    <div className="text-xs text-zen-text-muted dark:text-zen-dark-text-muted">
                      {lang === 'it' ? word.italian : word.english}
                    </div>
                  </div>
                  <div className="p-3 rounded-2xl bg-zen-surface-lowest dark:bg-zen-dark-surface shadow-zen-sm text-zen-primary dark:text-zen-dark-primary group-hover:scale-110 transition-transform">
                    <Icon className="h-6 w-6" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Step 4: Verifica Finale */}
      {step === 4 && (
        <div className="zen-card space-y-6 border border-zen-border/40 p-6 text-center dark:border-zen-dark-border bg-zen-surface-lowest dark:bg-zen-dark-surface rounded-3xl shadow-zen-md animate-fade-in">
          {quizIndex < quizTotal ? (
            <div className="space-y-6">
              <div className="flex justify-between text-xs font-bold text-zen-text-muted uppercase tracking-wider">
                <span>{t('quiz.question')} {quizIndex + 1} / {quizTotal}</span>
                <span>{t('quiz.score')}: {quizScore}</span>
              </div>

              <div className="py-4">
                <span className="font-kana text-8xl font-bold text-zen-primary dark:text-zen-dark-primary">
                  {isKanaQuiz ? kana[quizIndex]?.char : quizWord?.kana}
                </span>
                <p className="text-xs text-zen-text-muted mt-2 font-medium">
                  {isKanaQuiz 
                    ? (lang === 'it' ? 'Qual è la pronuncia corretta?' : 'What is the correct Romaji?')
                    : (lang === 'it' ? 'Qual è il significato?' : 'What is the translation?')}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
                {quizChoices.map((choice, index) => (
                  <button
                    key={index}
                    onClick={() => answerQuiz(choice)}
                    className="rounded-2xl border border-zen-border/60 bg-zen-surface-container/30 dark:bg-zen-dark-surface-high/40 p-4 text-sm font-bold text-zen-text hover:border-zen-primary hover:bg-zen-primary/10 dark:border-zen-dark-border dark:text-zen-dark-text dark:hover:border-zen-dark-primary transition-all cursor-pointer"
                  >
                    {isKanaQuiz ? choice.romaji?.toUpperCase() : (lang === 'it' ? choice.italian : choice.english)}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4 py-4">
              <div className="w-16 h-16 rounded-3xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/30 shadow-zen-sm">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="font-headline text-2xl font-bold text-zen-text dark:text-zen-dark-text">
                {t('quiz.resultsTitle')}
              </h3>
              <p className="text-sm text-zen-text-muted">
                {lang === 'it' ? 'Punteggio ottenuto:' : 'Final score:'} <strong className="text-zen-primary dark:text-zen-dark-primary text-base font-mono">{quizScore} / {quizTotal}</strong>
              </p>
              <div className="pt-2 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => changeLesson(lessonId)}
                  className="rounded-xl bg-zen-surface-container px-4 py-2.5 text-xs font-bold text-zen-text hover:text-zen-primary transition-colors cursor-pointer"
                >
                  {t('lessons.reviewLesson')}
                </button>
                {lessonId < LESSONS.length && (
                  <button
                    type="button"
                    onClick={() => changeLesson(lessonId + 1)}
                    className="rounded-xl bg-zen-primary px-5 py-2.5 text-xs font-bold text-white shadow-zen-sm hover:scale-105 transition-all cursor-pointer dark:bg-zen-dark-primary dark:text-zen-dark-on-primary"
                  >
                    {lang === 'it' ? `Passa a Giorno ${lessonId + 1} →` : `Next: Day ${lessonId + 1} →`}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
