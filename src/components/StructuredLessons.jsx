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
  Lock,
  Zap,
  HelpCircle
} from 'lucide-react';
import { 
  LESSONS, 
  getLessonKana, 
  getLessonVocabulary, 
  kanaHighlightType,
  DAKUTEN_LESSONS,
  getDakutenLessonKana,
  getDakutenLessonVocabulary,
  YOON_LESSONS,
  getYoonLessonKana,
  getYoonLessonVocabulary,
  PHONETICS_LESSONS,
  getPhoneticsLessonKana,
  getPhoneticsLessonVocabulary
} from '../data/lessonData';
import { getVocabularyIcon } from '../data/vocabulary';
import { playKanaSound } from '../utils/audio';
import KanaDrawingPad from './KanaDrawingPad';
import VocabIllustration from './common/VocabIllustration';
import { useLanguage } from '../context/LanguageContext';

function HighlightedKana({ text = '', targetChars = new Set() }) {
  const elements = [];
  let i = 0;
  while (i < text.length) {
    const pair = text.slice(i, i + 2);
    if (targetChars.has(pair)) {
      elements.push({ str: pair, isTarget: true, key: `${pair}-${i}` });
      i += 2;
      continue;
    }

    const single = text[i];
    const isTarget = targetChars.has(single);
    elements.push({ str: single, isTarget, key: `${single}-${i}` });
    i += 1;
  }

  return (
    <div className="font-kana text-2xl sm:text-3xl font-extrabold flex items-center flex-wrap gap-1 leading-none py-0.5">
      {elements.map((item) =>
        item.isTarget ? (
          <span
            key={item.key}
            className="text-zen-primary dark:text-zen-dark-primary font-black bg-zen-primary/15 dark:bg-zen-dark-primary/25 px-1.5 py-0.5 rounded-xl border-2 border-zen-primary/60 dark:border-zen-dark-primary/70 shadow-xs inline-flex items-center justify-center scale-105"
            title="Carattere studiato in questa lezione"
          >
            {item.str}
          </span>
        ) : (
          <span
            key={item.key}
            className="text-zen-primary/80 dark:text-zen-dark-primary/80 font-bold inline-flex items-center justify-center"
          >
            {item.str}
          </span>
        )
      )}
    </div>
  );
}

export default function StructuredLessons({ scriptMode, updateStats }) {
  const { lang, t } = useLanguage();

  // Navigation mode: 'hub' | 'course-5kana' | 'course-dakuten' | 'course-yoon' | 'course-phonetics'
  const [viewMode, setViewMode] = useState('hub');

  // 5-Kana Course State
  const [lessonId5Kana, setLessonId5Kana] = useState(1);
  // Dakuten Course State
  const [lessonIdDakuten, setLessonIdDakuten] = useState(1);
  // Yōon Course State
  const [lessonIdYoon, setLessonIdYoon] = useState(1);
  // Special Phonetics Course State
  const [lessonIdPhonetics, setLessonIdPhonetics] = useState(1);

  // Common active step for whichever course is open
  const [step, setStep] = useState(0);
  const [cardIndex, setCardIndex] = useState(0);
  const [vocabIndex, setVocabIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);

  const stepsLabels = lang === 'it' 
    ? ['Introduzione & Teoria', 'Carte Kana', 'Scrittura', 'Vocabolario', 'Verifica']
    : ['Introduction & Theory', 'Kana Cards', 'Writing', 'Vocabulary', 'Verification'];

  // ================= 5-KANA COURSE DERIVATIONS =================
  const lesson5Kana = LESSONS[lessonId5Kana - 1];
  const kana5Kana = useMemo(() => getLessonKana(lesson5Kana, scriptMode), [lesson5Kana, scriptMode]);
  const vocabulary5Kana = useMemo(() => getLessonVocabulary(lesson5Kana, scriptMode), [lesson5Kana, scriptMode]);

  // ================= DAKUTEN COURSE DERIVATIONS =================
  const lessonDakuten = DAKUTEN_LESSONS[lessonIdDakuten - 1];
  const kanaDakuten = useMemo(() => getDakutenLessonKana(lessonDakuten, scriptMode), [lessonDakuten, scriptMode]);
  const vocabularyDakuten = useMemo(() => getDakutenLessonVocabulary(lessonDakuten, scriptMode), [lessonDakuten, scriptMode]);

  // ================= YŌON COURSE DERIVATIONS =================
  const lessonYoon = YOON_LESSONS[lessonIdYoon - 1];
  const kanaYoon = useMemo(() => getYoonLessonKana(lessonYoon, scriptMode), [lessonYoon, scriptMode]);
  const vocabularyYoon = useMemo(() => getYoonLessonVocabulary(lessonYoon, scriptMode), [lessonYoon, scriptMode]);

  // ================= PHONETICS COURSE DERIVATIONS =================
  const lessonPhonetics = PHONETICS_LESSONS[lessonIdPhonetics - 1];
  const kanaPhonetics = useMemo(() => getPhoneticsLessonKana(lessonPhonetics, scriptMode), [lessonPhonetics, scriptMode]);
  const vocabularyPhonetics = useMemo(() => getPhoneticsLessonVocabulary(lessonPhonetics, scriptMode), [lessonPhonetics, scriptMode]);
  
  const activeLesson = isPhoneticsMode 
    ? lessonPhonetics 
    : isYoonMode 
    ? lessonYoon 
    : isDakutenMode 
    ? lessonDakuten 
    : lesson5Kana;
  
  const activeLessonContent = activeLesson?.[scriptMode] || activeLesson;

  // Active dataset depending on mode
  const isDakutenMode = viewMode === 'course-dakuten';
  const isYoonMode = viewMode === 'course-yoon';
  const isPhoneticsMode = viewMode === 'course-phonetics';
  
  const activeKana = isPhoneticsMode 
    ? kanaPhonetics 
    : isYoonMode 
    ? kanaYoon 
    : isDakutenMode 
    ? kanaDakuten 
    : kana5Kana;

  const activeVocabulary = isPhoneticsMode 
    ? vocabularyPhonetics 
    : isYoonMode 
    ? vocabularyYoon 
    : isDakutenMode 
    ? vocabularyDakuten 
    : vocabulary5Kana;

  const targetKanaChars = useMemo(() => new Set(activeKana.map((k) => k.char).filter(Boolean)), [activeKana]);

  const currentKana = activeKana[cardIndex % Math.max(activeKana.length, 1)] || {};
  const currentWord = activeVocabulary[vocabIndex % Math.max(activeVocabulary.length, 1)];
  const vocabularyQuizCount = Math.min(3, activeVocabulary.length);
  const quizTotal = activeKana.length + vocabularyQuizCount;
  const isKanaQuiz = quizIndex < activeKana.length;
  const quizWord = activeVocabulary[(quizIndex - activeKana.length) % Math.max(activeVocabulary.length, 1)];

  const quizChoices = useMemo(() => {
    if (isKanaQuiz) {
      const target = activeKana[quizIndex];
      if (!target) return [];
      
      if (isDakutenMode) {
        // In Dakuten mode: include the base sound as a clever distractor!
        const baseChoice = { romaji: target.baseRomaji, char: target.baseChar };
        const others = activeKana.filter(item => item.romaji !== target.romaji);
        const pool = [target, baseChoice, ...others].slice(0, 4);
        return pool.sort(() => Math.random() - 0.5);
      }

      if (isYoonMode || isPhoneticsMode) {
        const others = activeKana.filter(item => item.romaji !== target.romaji);
        const pool = [target, ...others].slice(0, 4);
        return pool.sort(() => Math.random() - 0.5);
      }

      return [target, ...activeKana.filter((item) => item.romaji !== target.romaji).slice(0, 3)].sort(() => Math.random() - 0.5);
    }
    return quizWord ? [quizWord, ...activeVocabulary.filter((item) => item.id !== quizWord.id).slice(0, 3)].sort(() => Math.random() - 0.5) : [];
  }, [isKanaQuiz, activeKana, quizIndex, quizWord, activeVocabulary, isDakutenMode, isYoonMode, isPhoneticsMode]);

  const changeLesson = (id) => {
    if (isPhoneticsMode) {
      setLessonIdPhonetics(id);
    } else if (isYoonMode) {
      setLessonIdYoon(id);
    } else if (isDakutenMode) {
      setLessonIdDakuten(id);
    } else {
      setLessonId5Kana(id);
    }
    setStep(0);
    setCardIndex(0);
    setVocabIndex(0);
    setFlipped(false);
    setQuizIndex(0);
    setQuizScore(0);
  };

  const openCourse = (mode) => {
    setViewMode(mode);
    setStep(0);
    setCardIndex(0);
    setVocabIndex(0);
    setFlipped(false);
    setQuizIndex(0);
    setQuizScore(0);
  };

  const answerQuiz = (choice) => {
    const correct = isKanaQuiz ? choice.romaji === activeKana[quizIndex]?.romaji : choice.id === quizWord?.id;
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

        {/* Active Courses Section */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-zen-text-muted dark:text-zen-dark-text-muted uppercase tracking-wider px-1">
            {lang === 'it' ? 'Percorsi Disponibili' : 'Available Courses'}
          </h3>

          <div className="grid gap-4">
            {/* Track 1: 5 Kana al Giorno */}
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
                      <PenTool className="w-3 h-3 text-zen-accent" /> Scrittura
                    </span>
                    <span className="flex items-center gap-1 bg-zen-surface-container/60 dark:bg-zen-dark-surface-high/60 px-2.5 py-1 rounded-lg">
                      <Award className="w-3 h-3 text-emerald-500" /> Quiz
                    </span>
                  </div>
                </div>

                <div className="shrink-0 flex md:flex-col items-center justify-between gap-3 border-t md:border-t-0 md:border-l border-zen-border/40 dark:border-zen-dark-border pt-4 md:pt-0 md:pl-6">
                  <div className="text-left md:text-center">
                    <span className="text-3xs font-bold uppercase tracking-wider text-zen-text-muted">Progresso</span>
                    <div className="text-base font-bold font-mono text-zen-text dark:text-zen-dark-text">
                      Giorno {lessonId5Kana}/10
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => openCourse('course-5kana')}
                    className="py-3 px-5 rounded-2xl bg-zen-primary dark:bg-zen-dark-primary hover:bg-zen-primary-dark dark:hover:bg-zen-dark-primary-hover text-white dark:text-zen-dark-on-primary font-bold text-xs shadow-zen-md hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer shrink-0"
                  >
                    <span>{lessonId5Kana > 1 ? `${t('lessons.continueCourse')} ${lessonId5Kana}` : t('lessons.startCourse')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Track 2: Dakuten & Handakuten */}
            <div className="zen-card p-6 sm:p-7 border-2 border-zen-primary/40 dark:border-zen-dark-primary/50 bg-zen-surface-lowest dark:bg-zen-dark-surface shadow-zen-md hover:shadow-zen-lg transition-all rounded-3xl group">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-zen-primary/10 dark:bg-zen-dark-primary/20 text-zen-primary dark:text-zen-dark-primary text-xs font-bold font-mono">
                      {t('lessons.trackDakutenBadge') || '5 Giorni • 25 Suoni Sonori'}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-2xs font-bold">
                      {lang === 'it' ? 'Attivo' : 'Active'}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-zen-surface-container dark:bg-zen-dark-surface-high text-zen-text-muted text-2xs font-bold font-kana">
                      が・ざ・だ・ば・ぱ
                    </span>
                  </div>

                  <div>
                    <h4 className="font-headline text-2xl font-bold text-zen-text dark:text-zen-dark-text group-hover:text-zen-primary dark:group-hover:text-zen-dark-primary transition-colors">
                      {t('lessons.trackDakutenTitle') || 'Dakuten & Handakuten'}
                    </h4>
                    <p className="text-sm font-semibold text-zen-primary dark:text-zen-dark-primary mt-0.5">
                      {t('lessons.trackDakutenSubtitle') || 'Suoni sonori e semi-sonori (゛ e ゜)'}
                    </p>
                    <p className="text-xs text-zen-text-muted dark:text-zen-dark-text-muted mt-2 leading-relaxed">
                      {t('lessons.trackDakutenDesc') || 'Padroneggia i 25 caratteri modificati (G, Z, D, B, P) suddivisi in 5 giornate tematiche, con confronto visivo tra suono sordo e sonoro.'}
                    </p>
                  </div>

                  {/* Features Mini-badges */}
                  <div className="flex flex-wrap gap-2 pt-1 text-2xs font-bold text-zen-text-muted dark:text-zen-dark-text-muted">
                    <span className="flex items-center gap-1 bg-zen-surface-container/60 dark:bg-zen-dark-surface-high/60 px-2.5 py-1 rounded-lg">
                      <Zap className="w-3 h-3 text-zen-primary" /> Confronto Fonetico
                    </span>
                    <span className="flex items-center gap-1 bg-zen-surface-container/60 dark:bg-zen-dark-surface-high/60 px-2.5 py-1 rounded-lg">
                      <Layers className="w-3 h-3 text-zen-secondary" /> Flashcards
                    </span>
                    <span className="flex items-center gap-1 bg-zen-surface-container/60 dark:bg-zen-dark-surface-high/60 px-2.5 py-1 rounded-lg">
                      <PenTool className="w-3 h-3 text-zen-accent" /> Tratti ゛ e ゜
                    </span>
                    <span className="flex items-center gap-1 bg-zen-surface-container/60 dark:bg-zen-dark-surface-high/60 px-2.5 py-1 rounded-lg">
                      <Award className="w-3 h-3 text-emerald-500" /> Quiz Discriminativo
                    </span>
                  </div>
                </div>

                <div className="shrink-0 flex md:flex-col items-center justify-between gap-3 border-t md:border-t-0 md:border-l border-zen-border/40 dark:border-zen-dark-border pt-4 md:pt-0 md:pl-6">
                  <div className="text-left md:text-center">
                    <span className="text-3xs font-bold uppercase tracking-wider text-zen-text-muted">Progresso</span>
                    <div className="text-base font-bold font-mono text-zen-text dark:text-zen-dark-text">
                      Giorno {lessonIdDakuten}/5
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => openCourse('course-dakuten')}
                    className="py-3 px-5 rounded-2xl bg-zen-primary dark:bg-zen-dark-primary hover:bg-zen-primary-dark dark:hover:bg-zen-dark-primary-hover text-white dark:text-zen-dark-on-primary font-bold text-xs shadow-zen-md hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer shrink-0"
                  >
                    <span>{lessonIdDakuten > 1 ? `${t('lessons.continueCourse')} ${lessonIdDakuten}` : t('lessons.startCourse')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Track 3: Combinazioni Yōon */}
            <div className="zen-card p-6 sm:p-7 border-2 border-zen-primary/40 dark:border-zen-dark-primary/50 bg-zen-surface-lowest dark:bg-zen-dark-surface shadow-zen-md hover:shadow-zen-lg transition-all rounded-3xl group">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-zen-primary/10 dark:bg-zen-dark-primary/20 text-zen-primary dark:text-zen-dark-primary text-xs font-bold font-mono">
                      {t('lessons.trackYoonBadge') || '6 Giorni • 33 Suoni Contratti'}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-2xs font-bold">
                      {lang === 'it' ? 'Attivo' : 'Active'}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-zen-surface-container dark:bg-zen-dark-surface-high text-zen-text-muted text-2xs font-bold font-kana">
                      きゃ・しゃ・ちゃ・にゃ・ぎゃ
                    </span>
                  </div>

                  <div>
                    <h4 className="font-headline text-2xl font-bold text-zen-text dark:text-zen-dark-text group-hover:text-zen-primary dark:group-hover:text-zen-dark-primary transition-colors">
                      {t('lessons.trackYoonTitle') || 'Combinazioni Yōon'}
                    </h4>
                    <p className="text-sm font-semibold text-zen-primary dark:text-zen-dark-primary mt-0.5">
                      {t('lessons.trackYoonSubtitle') || 'Suoni contratti con piccolo ya, yu, yo (ゃ, ゅ, ょ)'}
                    </p>
                    <p className="text-xs text-zen-text-muted dark:text-zen-dark-text-muted mt-2 leading-relaxed">
                      {t('lessons.trackYoonDesc') || 'Padroneggia tutte le 33 combinazioni contratte (K, S, T, N, H, M, R, G, J, B, P) in 6 lezioni con regole di proporzione grafica e pronuncia a tempo unico.'}
                    </p>
                  </div>

                  {/* Features Mini-badges */}
                  <div className="flex flex-wrap gap-2 pt-1 text-2xs font-bold text-zen-text-muted dark:text-zen-dark-text-muted">
                    <span className="flex items-center gap-1 bg-zen-surface-container/60 dark:bg-zen-dark-surface-high/60 px-2.5 py-1 rounded-lg">
                      <Zap className="w-3 h-3 text-zen-primary" /> Regola di Fusione
                    </span>
                    <span className="flex items-center gap-1 bg-zen-surface-container/60 dark:bg-zen-dark-surface-high/60 px-2.5 py-1 rounded-lg">
                      <Layers className="w-3 h-3 text-zen-secondary" /> Flashcards
                    </span>
                    <span className="flex items-center gap-1 bg-zen-surface-container/60 dark:bg-zen-dark-surface-high/60 px-2.5 py-1 rounded-lg">
                      <PenTool className="w-3 h-3 text-zen-accent" /> Piccolo ゃ/ゅ/ょ
                    </span>
                    <span className="flex items-center gap-1 bg-zen-surface-container/60 dark:bg-zen-dark-surface-high/60 px-2.5 py-1 rounded-lg">
                      <Award className="w-3 h-3 text-emerald-500" /> Quiz Discriminativo
                    </span>
                  </div>
                </div>

                <div className="shrink-0 flex md:flex-col items-center justify-between gap-3 border-t md:border-t-0 md:border-l border-zen-border/40 dark:border-zen-dark-border pt-4 md:pt-0 md:pl-6">
                  <div className="text-left md:text-center">
                    <span className="text-3xs font-bold uppercase tracking-wider text-zen-text-muted">Progresso</span>
                    <div className="text-base font-bold font-mono text-zen-text dark:text-zen-dark-text">
                      Giorno {lessonIdYoon}/6
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => openCourse('course-yoon')}
                    className="py-3 px-5 rounded-2xl bg-zen-primary dark:bg-zen-dark-primary hover:bg-zen-primary-dark dark:hover:bg-zen-dark-primary-hover text-white dark:text-zen-dark-on-primary font-bold text-xs shadow-zen-md hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer shrink-0"
                  >
                    <span>{lessonIdYoon > 1 ? `${t('lessons.continueCourse')} ${lessonIdYoon}` : t('lessons.startCourse')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Track 4: Regole di Fonetica Speciale */}
            <div className="zen-card p-6 sm:p-7 border-2 border-zen-primary/40 dark:border-zen-dark-primary/50 bg-zen-surface-lowest dark:bg-zen-dark-surface shadow-zen-md hover:shadow-zen-lg transition-all rounded-3xl group">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-zen-primary/10 dark:bg-zen-dark-primary/20 text-zen-primary dark:text-zen-dark-primary text-xs font-bold font-mono">
                      {t('lessons.trackPhoneticsBadge') || '3 Giorni • Fonetica & Ritmo'}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-2xs font-bold">
                      {lang === 'it' ? 'Attivo' : 'Active'}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-zen-surface-container dark:bg-zen-dark-surface-high text-zen-text-muted text-2xs font-bold font-kana">
                      っ・ッ・ー・ん・ン
                    </span>
                  </div>

                  <div>
                    <h4 className="font-headline text-2xl font-bold text-zen-text dark:text-zen-dark-text group-hover:text-zen-primary dark:group-hover:text-zen-dark-primary transition-colors">
                      {t('lessons.trackPhoneticsTitle') || 'Regole di Fonetica Speciale'}
                    </h4>
                    <p className="text-sm font-semibold text-zen-primary dark:text-zen-dark-primary mt-0.5">
                      {t('lessons.trackPhoneticsSubtitle') || 'Sokuon (っ/ッ), Allungamenti (ー) & Particelle'}
                    </p>
                    <p className="text-xs text-zen-text-muted dark:text-zen-dark-text-muted mt-2 leading-relaxed">
                      {t('lessons.trackPhoneticsDesc') || 'Padroneggia le 3 regole fondamentali per pronunciare e comprendere il giapponese autentico: consonanti doppie, vocali allungate e particelle storiche.'}
                    </p>
                  </div>

                  {/* Features Mini-badges */}
                  <div className="flex flex-wrap gap-2 pt-1 text-2xs font-bold text-zen-text-muted dark:text-zen-dark-text-muted">
                    <span className="flex items-center gap-1 bg-zen-surface-container/60 dark:bg-zen-dark-surface-high/60 px-2.5 py-1 rounded-lg">
                      <Zap className="w-3 h-3 text-zen-primary" /> Glottal Stop (っ)
                    </span>
                    <span className="flex items-center gap-1 bg-zen-surface-container/60 dark:bg-zen-dark-surface-high/60 px-2.5 py-1 rounded-lg">
                      <Layers className="w-3 h-3 text-zen-secondary" /> Chōonpu (ー)
                    </span>
                    <span className="flex items-center gap-1 bg-zen-surface-container/60 dark:bg-zen-dark-surface-high/60 px-2.5 py-1 rounded-lg">
                      <PenTool className="w-3 h-3 text-zen-accent" /> Particelle (は/へ/を)
                    </span>
                    <span className="flex items-center gap-1 bg-zen-surface-container/60 dark:bg-zen-dark-surface-high/60 px-2.5 py-1 rounded-lg">
                      <Award className="w-3 h-3 text-emerald-500" /> Quiz Discriminativo
                    </span>
                  </div>
                </div>

                <div className="shrink-0 flex md:flex-col items-center justify-between gap-3 border-t md:border-t-0 md:border-l border-zen-border/40 dark:border-zen-dark-border pt-4 md:pt-0 md:pl-6">
                  <div className="text-left md:text-center">
                    <span className="text-3xs font-bold uppercase tracking-wider text-zen-text-muted">Progresso</span>
                    <div className="text-base font-bold font-mono text-zen-text dark:text-zen-dark-text">
                      Giorno {lessonIdPhonetics}/3
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => openCourse('course-phonetics')}
                    className="py-3 px-5 rounded-2xl bg-zen-primary dark:bg-zen-dark-primary hover:bg-zen-primary-dark dark:hover:bg-zen-dark-primary-hover text-white dark:text-zen-dark-on-primary font-bold text-xs shadow-zen-md hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer shrink-0"
                  >
                    <span>{lessonIdPhonetics > 1 ? `${t('lessons.continueCourse')} ${lessonIdPhonetics}` : t('lessons.startCourse')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Course Overview Banner */}
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-500/20 shrink-0">
            <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-xs">
            <strong className="font-bold">{lang === 'it' ? 'Curriculum Completo dei Sillabari Giapponesi' : 'Complete Japanese Kana Curriculum'}</strong>
            <p className="opacity-90 mt-0.5">
              {lang === 'it' 
                ? 'Tutti i 4 percorsi formativi (Gojūon, Dakuten, Yōon e Fonetica) sono ora attivi per guidarti da principiante a maestro di Hiragana e Katakana.'
                : 'All 4 learning tracks (Gojūon, Dakuten, Yōon, and Phonetics) are fully available to guide you from zero to master.'}
            </p>
          </div>
        </div>
      </section>
    );
  }

  // ======================= 2. ACTIVE COURSE VIEW =======================
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
              <span className="text-xs font-bold uppercase tracking-wider">
                {isPhoneticsMode
                  ? t('lessons.trackPhoneticsTitle')
                  : isYoonMode 
                  ? t('lessons.trackYoonTitle') 
                  : isDakutenMode 
                  ? t('lessons.trackDakutenTitle') 
                  : t('lessons.track5KanaTitle')}
              </span>
            </div>
            <h2 className="mt-1 font-headline text-2xl font-bold text-zen-text dark:text-zen-dark-text">
              {t('lessons.day')} {activeLesson.id} · {(isPhoneticsMode || isYoonMode || isDakutenMode) ? (lang === 'it' ? (activeLessonContent.titleIt || activeLesson.titleIt) : (activeLessonContent.titleEn || activeLesson.titleEn)) : t('lessons.track5KanaSubtitle')}
            </h2>
            {(isPhoneticsMode || isYoonMode || isDakutenMode) && (
              <p className="text-xs text-zen-text-muted dark:text-zen-dark-text-muted mt-0.5">
                {lang === 'it' ? (activeLessonContent.descIt || activeLesson.descIt) : (activeLessonContent.descEn || activeLesson.descEn)}
              </p>
            )}
          </div>

          {/* Day Selector */}
          <select
            value={isPhoneticsMode ? lessonIdPhonetics : isYoonMode ? lessonIdYoon : (isDakutenMode ? lessonIdDakuten : lessonId5Kana)}
            onChange={(event) => changeLesson(Number(event.target.value))}
            className="rounded-xl border border-zen-border bg-white px-3 py-2 text-sm font-bold dark:border-zen-dark-border dark:bg-zen-dark-surface dark:text-zen-dark-text shadow-zen-sm cursor-pointer"
          >
            {(isPhoneticsMode ? PHONETICS_LESSONS : isYoonMode ? YOON_LESSONS : (isDakutenMode ? DAKUTEN_LESSONS : LESSONS)).map((item) => {
              const itemContent = item[scriptMode] || item;
              return (
                <option key={item.id} value={item.id}>
                  {t('lessons.day')} {item.id} {isPhoneticsMode ? `(${lang === 'it' ? itemContent.titleIt.split(':')[0] : itemContent.titleEn.split(':')[0]})` : isYoonMode ? `(${item.romaji.slice(0, 3).join(', ')}...)` : isDakutenMode ? `(${item.romaji.slice(0, 3).join(', ')}...)` : '(5 Kana)'}
                </option>
              );
            })}
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

      {/* Step 0: Teoria & Confronto Visivo */}
      {step === 0 && (
        <div className="space-y-5 animate-fade-in">
          {/* Theory & Explanation Card */}
          {(isDakutenMode || isYoonMode || isPhoneticsMode) && (activeLessonContent.theory || activeLesson.theory) && (() => {
            const currentTheory = activeLessonContent.theory || activeLesson.theory;
            const theoryData = currentTheory[lang] || currentTheory.it;
            return (
              <div className="zen-card p-5 sm:p-6 rounded-3xl border border-zen-border/60 dark:border-zen-dark-border bg-zen-surface-lowest dark:bg-zen-dark-surface shadow-zen-md space-y-4">
                <div className="flex items-center gap-3 text-zen-primary dark:text-zen-dark-primary">
                  <div className="p-2.5 rounded-2xl bg-zen-primary/10 dark:bg-zen-dark-primary/20 border border-zen-primary/20 shadow-sm">
                    <Zap className="w-5 h-5 fill-current" />
                  </div>
                  <div>
                    <span className="text-3xs font-bold uppercase tracking-wider text-zen-primary/80 dark:text-zen-dark-primary/80">
                      {lang === 'it' ? 'Guida Teorica & Fonetica' : 'Theory & Phonetics Guide'}
                    </span>
                    <h3 className="font-headline text-lg sm:text-xl font-bold text-zen-text dark:text-zen-dark-text">
                      {theoryData.title}
                    </h3>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-zen-text/90 dark:text-zen-dark-text/90 leading-relaxed font-medium">
                  {theoryData.intro}
                </p>

                {theoryData.points && theoryData.points.length > 0 && (
                  <div className="grid sm:grid-cols-2 gap-2 pt-1">
                    {theoryData.points.map((pt, idx) => (
                      <div 
                        key={idx}
                        className="px-3.5 py-2 rounded-xl bg-zen-surface-container/40 dark:bg-zen-dark-surface-high/60 border border-zen-border/40 text-xs text-zen-text dark:text-zen-dark-text font-semibold flex items-center gap-2.5 shadow-2xs"
                      >
                        <span className="w-2 h-2 rounded-full bg-zen-primary dark:bg-zen-dark-primary shrink-0" />
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>
                )}

                {theoryData.tip && (
                  <div className="p-3.5 rounded-2xl bg-zen-primary/10 dark:bg-zen-dark-primary/20 border border-zen-primary/20 text-2xs sm:text-xs text-zen-text dark:text-zen-dark-text leading-relaxed font-medium">
                    {theoryData.tip}
                  </div>
                )}
              </div>
            );
          })()}

          {/* Kana Comparison Cards: Phonetics Mode */}
          {isPhoneticsMode ? (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-zen-text-muted dark:text-zen-dark-text-muted uppercase tracking-wider px-1">
                {lang === 'it' ? 'Regole & Struttura del Suono' : 'Sound Structure & Rules'}
              </h4>
              <div className="grid gap-3 sm:grid-cols-3 md:grid-cols-5">
                {activeKana.map((item) => (
                  <div
                    key={item.char}
                    className="zen-card flex flex-col items-center justify-between border border-zen-border/40 p-4 dark:border-zen-dark-border bg-zen-surface-lowest dark:bg-zen-dark-surface shadow-zen-sm rounded-3xl"
                  >
                    <div className="w-full flex items-center justify-center gap-1.5 bg-zen-surface-container/40 dark:bg-zen-dark-surface-high/40 px-2 py-1 rounded-xl text-3xs font-bold text-zen-text-muted mb-2 text-center truncate">
                      <span>{lang === 'it' ? (item.descIt || item.desc || item.modifier) : (item.descEn || item.desc || item.modifier)}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => playKanaSound(item.char)}
                      className="flex flex-col items-center group my-1 cursor-pointer"
                      title="Ascolta suono"
                    >
                      <span className="font-kana text-5xl font-extrabold text-zen-primary dark:text-zen-dark-primary group-hover:scale-105 transition-transform">
                        {item.char}
                      </span>
                      <span className="mt-2 font-bold font-headline text-sm text-zen-text dark:text-zen-dark-text uppercase tracking-wider text-center">
                        {item.cleanRomaji || item.romaji}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => playKanaSound(item.char)}
                      className="w-full mt-2 py-1.5 rounded-xl bg-zen-primary/10 dark:bg-zen-dark-primary/20 text-zen-primary dark:text-zen-dark-primary text-3xs font-bold flex items-center justify-center gap-1 hover:bg-zen-primary/20 cursor-pointer transition-colors"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{lang === 'it' ? 'Ascolta' : 'Play'}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : isYoonMode ? (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-zen-text-muted dark:text-zen-dark-text-muted uppercase tracking-wider px-1">
                {lang === 'it' ? 'Fusione Sillabica: Suono -I + Piccolo ya/yu/yo (ゃ, ゅ, ょ)' : 'Syllable Fusion: -I Sound + Small ya/yu/yo (ゃ, ゅ, ょ)'}
              </h4>
              <div className="grid gap-3 sm:grid-cols-3 md:grid-cols-6">
                {activeKana.map((item) => (
                  <div
                    key={item.romaji}
                    className="zen-card flex flex-col items-center justify-between border border-zen-border/40 p-4 dark:border-zen-dark-border bg-zen-surface-lowest dark:bg-zen-dark-surface shadow-zen-sm rounded-3xl"
                  >
                    {/* Top Base Comparison Pill */}
                    <div className="w-full flex items-center justify-center gap-1.5 bg-zen-surface-container/40 dark:bg-zen-dark-surface-high/40 px-2 py-1 rounded-xl text-3xs font-bold text-zen-text-muted mb-2 font-kana">
                      <span>{item.baseChar}</span>
                      <span className="text-zen-primary dark:text-zen-dark-primary">+</span>
                      <span className="text-zen-primary dark:text-zen-dark-primary">{item.yoonModifier}</span>
                    </div>

                    {/* Transformed Yoon Kana */}
                    <button
                      type="button"
                      onClick={() => playKanaSound(item.char)}
                      className="flex flex-col items-center group my-1 cursor-pointer"
                      title="Ascolta suono Yōon"
                    >
                      <span className="font-kana text-5xl font-extrabold text-zen-primary dark:text-zen-dark-primary group-hover:scale-105 transition-transform">
                        {item.char}
                      </span>
                      <span className="mt-2 font-bold font-headline text-base text-zen-text dark:text-zen-dark-text uppercase tracking-wider">
                        {item.cleanRomaji || item.romaji}
                      </span>
                    </button>

                    {/* Audio Button */}
                    <button
                      type="button"
                      onClick={() => playKanaSound(item.char)}
                      className="w-full mt-2 py-1.5 rounded-xl bg-zen-primary/10 dark:bg-zen-dark-primary/20 text-zen-primary dark:text-zen-dark-primary text-3xs font-bold flex items-center justify-center gap-1 hover:bg-zen-primary/20 cursor-pointer transition-colors"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{lang === 'it' ? 'Ascolta' : 'Play'}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : isDakutenMode ? (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-zen-text-muted dark:text-zen-dark-text-muted uppercase tracking-wider px-1">
                {lang === 'it' ? 'Confronto Suono Base ➔ Suono Sonoro' : 'Base Sound ➔ Voiced Sound Comparison'}
              </h4>
              <div className="grid gap-3 sm:grid-cols-5">
                {activeKana.map((item) => (
                  <div
                    key={item.romaji}
                    className="zen-card flex flex-col items-center justify-between border border-zen-border/40 p-4 dark:border-zen-dark-border bg-zen-surface-lowest dark:bg-zen-dark-surface shadow-zen-sm rounded-3xl"
                  >
                    {/* Top Base Comparison Pill */}
                    <div className="w-full flex items-center justify-between bg-zen-surface-container/40 dark:bg-zen-dark-surface-high/40 px-2.5 py-1 rounded-xl text-3xs font-bold text-zen-text-muted mb-2">
                      <span>Base</span>
                      <button
                        type="button"
                        onClick={() => playKanaSound(item.baseChar)}
                        className="hover:text-zen-primary flex items-center gap-1 cursor-pointer"
                        title="Ascolta suono base"
                      >
                        <span className="font-kana">{item.baseChar}</span> ({item.baseRomaji})
                        <Volume2 className="w-2.5 h-2.5 opacity-70" />
                      </button>
                    </div>

                    {/* Transformed Dakuten Kana */}
                    <button
                      type="button"
                      onClick={() => playKanaSound(item.char)}
                      className="flex flex-col items-center group my-1 cursor-pointer"
                      title="Ascolta suono modificato"
                    >
                      <span className="font-kana text-6xl font-extrabold text-zen-primary dark:text-zen-dark-primary group-hover:scale-105 transition-transform">
                        {item.char}
                      </span>
                      <span className="mt-2 font-bold font-headline text-base text-zen-text dark:text-zen-dark-text uppercase tracking-wider">
                        {item.cleanRomaji || item.romaji}
                      </span>
                    </button>

                    {/* Audio Button */}
                    <button
                      type="button"
                      onClick={() => playKanaSound(item.char)}
                      className="w-full mt-2 py-1.5 rounded-xl bg-zen-primary/10 dark:bg-zen-dark-primary/20 text-zen-primary dark:text-zen-dark-primary text-3xs font-bold flex items-center justify-center gap-1 hover:bg-zen-primary/20 cursor-pointer transition-colors"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{lang === 'it' ? 'Ascolta' : 'Play'}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-5 animate-fade-in">
              {activeKana.map((item) => (
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
            <span className="font-kana text-9xl font-bold group-hover:scale-105 transition-transform text-zen-primary dark:text-zen-dark-primary">
              {flipped ? (currentKana.cleanRomaji || currentKana.romaji)?.toUpperCase() : currentKana.char}
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
              className="py-2 px-4 rounded-xl bg-zen-surface-container dark:bg-zen-dark-surface-high text-xs font-bold text-zen-text hover:scale-105 transition-all cursor-pointer"
            >
              {lang === 'it' ? '← Precedente' : '← Previous'}
            </button>
            <span className="text-xs font-bold font-mono text-zen-text-muted">{cardIndex + 1} / {activeKana.length}</span>
            <button
              onClick={() => {
                setCardIndex((value) => Math.min(activeKana.length - 1, value + 1));
                setFlipped(false);
              }}
              className="py-2 px-4 rounded-xl bg-zen-surface-container dark:bg-zen-dark-surface-high text-xs font-bold text-zen-text hover:scale-105 transition-all cursor-pointer"
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
            {activeKana.map((item, index) => (
              <button
                key={item.romaji}
                onClick={() => setCardIndex(index)}
                className={`rounded-2xl px-4 py-2.5 font-kana text-2xl transition-all cursor-pointer ${
                  currentKana.romaji === item.romaji
                    ? 'bg-zen-primary text-white dark:bg-zen-dark-primary dark:text-zen-dark-on-primary shadow-zen-sm scale-105'
                    : 'bg-zen-surface-container text-zen-text dark:bg-zen-dark-surface-high hover:scale-102'
                }`}
              >
                {item.char}
              </button>
            ))}
          </div>
          <KanaDrawingPad 
            kana={currentKana.char} 
            romaji={currentKana.cleanRomaji || currentKana.romaji} 
            onScore={() => {}} 
          />
        </div>
      )}

      {/* Step 3: Vocabolario */}
      {step === 3 && (
        <div className="zen-card space-y-4 border border-zen-border/40 p-6 dark:border-zen-dark-border bg-zen-surface-lowest dark:bg-zen-dark-surface rounded-3xl shadow-zen-md animate-fade-in">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-zen-text-muted uppercase tracking-wider">
              {t('lessons.vocabularyFound')} ({activeVocabulary.length})
            </p>
            <span className="text-3xs text-zen-text-muted font-medium hidden sm:inline">
              {lang === 'it' ? 'Tocca per ascoltare la pronuncia' : 'Tap to hear pronunciation'}
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {activeVocabulary.map((word) => (
              <button
                key={word.id}
                onClick={() => playKanaSound(word.kana)}
                className="flex items-center justify-between rounded-2xl border border-zen-border/40 p-3.5 sm:p-4 text-left dark:border-zen-dark-border bg-zen-surface-container/20 dark:bg-zen-dark-surface-high/30 hover:border-zen-primary dark:hover:border-zen-dark-primary hover:shadow-zen-sm transition-all group cursor-pointer"
              >
                <div className="space-y-1 min-w-0 flex-1 pr-3">
                  <HighlightedKana text={word.kana} targetChars={targetKanaChars} />
                  <div className="text-sm font-bold font-headline text-zen-text dark:text-zen-dark-text">{word.romaji}</div>
                  <div className="text-xs text-zen-text-muted dark:text-zen-dark-text-muted capitalize">
                    {lang === 'it' ? word.italian : word.english}
                  </div>
                </div>
                <div className="shrink-0">
                  <VocabIllustration
                    id={word.id}
                    keyword={word.imageKeyword}
                    alt={word.english}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-zen-surface-lowest dark:bg-zen-dark-surface p-1 shadow-sm group-hover:scale-105 transition-transform"
                    iconClassName="w-8 h-8 sm:w-9 sm:h-9"
                  />
                </div>
              </button>
            ))}
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
                  {isKanaQuiz ? activeKana[quizIndex]?.char : quizWord?.kana}
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
                    {isKanaQuiz ? (choice.cleanRomaji || choice.romaji)?.toUpperCase() : (lang === 'it' ? choice.italian : choice.english)}
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
                  onClick={() => changeLesson(activeLesson.id)}
                  className="rounded-xl bg-zen-surface-container px-4 py-2.5 text-xs font-bold text-zen-text hover:text-zen-primary transition-colors cursor-pointer"
                >
                  {t('lessons.reviewLesson')}
                </button>
                {activeLesson.id < (isPhoneticsMode ? PHONETICS_LESSONS.length : isYoonMode ? YOON_LESSONS.length : isDakutenMode ? DAKUTEN_LESSONS.length : LESSONS.length) && (
                  <button
                    type="button"
                    onClick={() => changeLesson(activeLesson.id + 1)}
                    className="rounded-xl px-5 py-2.5 text-xs font-bold text-white shadow-zen-sm hover:scale-105 transition-all cursor-pointer bg-zen-primary dark:bg-zen-dark-primary dark:text-zen-dark-on-primary"
                  >
                    {lang === 'it' ? `Passa a Giorno ${activeLesson.id + 1} →` : `Next: Day ${activeLesson.id + 1} →`}
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
