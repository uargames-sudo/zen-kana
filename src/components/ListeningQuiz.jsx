import React, { useState, useEffect } from 'react';
import { Volume2, Sparkles, CheckCircle2, XCircle, Play, RotateCcw, Settings, Award, Check, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { HIRAGANA_BASIC, KANA_DAKUTEN } from '../data/kanaData';
import { VOCABULARY } from '../data/vocabulary';
import { playKanaSound } from '../utils/audio';
import { useLanguage } from '../context/LanguageContext';

const shuffle = (items) => [...items].sort(() => Math.random() - 0.5);

export default function ListeningQuiz({ scriptMode, updateStats }) {
  const { lang, t } = useLanguage();

  // Setup state
  const [phase, setPhase] = useState('setup'); // 'setup', 'playing', 'summary'
  const [scriptFilter, setScriptFilter] = useState(scriptMode || 'hiragana'); // 'hiragana', 'katakana', 'both'
  const [includeVocab, setIncludeVocab] = useState(true);
  const [targetCount, setTargetCount] = useState(10);

  // Playing state
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [history, setHistory] = useState([]); // [{ target, options, selected, isCorrect }]
  const [audioPlayed, setAudioPlayed] = useState(false);

  // Sync scriptFilter if top-level scriptMode changes during setup
  useEffect(() => {
    if (phase === 'setup' && scriptMode) {
      setScriptFilter(scriptMode);
    }
  }, [scriptMode, phase]);

  // Build items pool based on filter settings
  const buildPool = () => {
    const hiraganaChars = [...HIRAGANA_BASIC.filter(k => k.hiragana), ...KANA_DAKUTEN].map(k => ({
      id: `h_char_${k.romaji}`,
      type: 'kana',
      script: 'hiragana',
      label: k.hiragana,
      audioText: k.hiragana,
      romaji: k.romaji,
      translation: k.romaji
    }));

    const katakanaChars = [...HIRAGANA_BASIC.filter(k => k.katakana), ...KANA_DAKUTEN].map(k => ({
      id: `k_char_${k.romaji}`,
      type: 'kana',
      script: 'katakana',
      label: k.katakana,
      audioText: k.katakana,
      romaji: k.romaji,
      translation: k.romaji
    }));

    const hiraganaWords = VOCABULARY.filter(v => v.script === 'hiragana').map(v => ({
      id: `h_word_${v.id}`,
      type: 'word',
      script: 'hiragana',
      label: v.japanese || v.kana,
      audioText: v.japanese || v.kana,
      romaji: v.romaji,
      translation: lang === 'it' ? v.italian : v.english,
      italian: v.italian,
      english: v.english
    }));

    const katakanaWords = VOCABULARY.filter(v => v.script === 'katakana').map(v => ({
      id: `k_word_${v.id}`,
      type: 'word',
      script: 'katakana',
      label: v.japanese || v.kana,
      audioText: v.japanese || v.kana,
      romaji: v.romaji,
      translation: lang === 'it' ? v.italian : v.english,
      italian: v.italian,
      english: v.english
    }));

    let kanaPool = [];
    let wordPool = [];

    if (scriptFilter === 'hiragana') {
      kanaPool = hiraganaChars;
      wordPool = hiraganaWords;
    } else if (scriptFilter === 'katakana') {
      kanaPool = katakanaChars;
      wordPool = katakanaWords;
    } else {
      kanaPool = [...hiraganaChars, ...katakanaChars];
      wordPool = [...hiraganaWords, ...katakanaWords];
    }

    return { kanaPool, wordPool };
  };

  // Generate complete question list for a session
  const generateQuestionsList = () => {
    const { kanaPool, wordPool } = buildPool();
    const fullPool = includeVocab && wordPool.length > 0 ? [...kanaPool, ...wordPool] : kanaPool;
    const shuffledTargets = shuffle(fullPool).slice(0, targetCount);

    const generated = shuffledTargets.map(target => {
      const isWord = target.type === 'word';
      const candidatePool = isWord ? wordPool : kanaPool;
      const otherChoices = shuffle(candidatePool.filter(item => item.id !== target.id && item.label !== target.label)).slice(0, 3);
      const allChoices = shuffle([target, ...otherChoices]);
      return {
        target,
        options: allChoices
      };
    });

    return generated;
  };

  const startSession = () => {
    const sessionQuestions = generateQuestionsList();
    if (sessionQuestions.length === 0) return;
    setQuestions(sessionQuestions);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setHistory([]);
    setPhase('playing');
    setAudioPlayed(false);
  };

  // Auto-play audio when question changes
  useEffect(() => {
    if (phase === 'playing' && questions[currentIndex]) {
      const timer = setTimeout(() => {
        playKanaSound(questions[currentIndex].target.audioText);
        setAudioPlayed(true);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [phase, currentIndex, questions]);

  // Keyboard navigation for Desktop / Power Users (1-4, Space, Enter)
  useEffect(() => {
    if (phase !== 'playing') return;

    const handleKeyDown = (e) => {
      if (['1', '2', '3', '4'].includes(e.key)) {
        const optionIndex = parseInt(e.key, 10) - 1;
        if (questions[currentIndex]?.options[optionIndex] && !isAnswered) {
          handleSelectOption(questions[currentIndex].options[optionIndex]);
        }
      } else if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (isAnswered) {
          handleNext();
        } else {
          handlePlayAudio();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, currentIndex, questions, isAnswered, selectedOption]);

  const handlePlayAudio = () => {
    if (!questions[currentIndex]) return;
    playKanaSound(questions[currentIndex].target.audioText);
    setAudioPlayed(true);
  };

  const handleSelectOption = (option) => {
    if (isAnswered) return;
    const currentQ = questions[currentIndex];
    const isCorrect = option.id === currentQ.target.id || option.label === currentQ.target.label;

    setSelectedOption(option);
    setIsAnswered(true);

    const stepResult = {
      target: currentQ.target,
      options: currentQ.options,
      selected: option,
      isCorrect
    };

    setHistory(prev => [...prev, stepResult]);
    updateStats?.(isCorrect);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setAudioPlayed(false);
    } else {
      setPhase('summary');
      const correctCount = history.filter(h => h.isCorrect).length + (selectedOption?.id === questions[currentIndex]?.target.id ? 1 : 0);
      if (correctCount >= targetCount * 0.7) {
        confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
      }
    }
  };

  // ==================== SETUP SCREEN ====================
  if (phase === 'setup') {
    return (
      <div className="max-w-2xl mx-auto space-y-6 pb-20 xl:pb-8">
        <div className="zen-card p-6 sm:p-8 bg-white dark:bg-zen-dark-surface border-2 border-zen-surface-high dark:border-zen-dark-border rounded-3xl shadow-zen-lg dark:shadow-zen-dark-lg space-y-8">
          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-zen-primary/10 dark:bg-zen-dark-primary/20 text-zen-primary dark:text-zen-dark-primary flex items-center justify-center">
              <Volume2 className="w-6 h-6" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-headline font-bold text-zen-text dark:text-zen-dark-text">
              {t('listening.setupTitle')}
            </h2>
          </div>

          {/* Script Selection: Hiragana, Katakana, Both */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-zen-text-muted dark:text-zen-dark-text-muted uppercase tracking-wider">
              {t('listening.filterScript')}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setScriptFilter('hiragana')}
                className={`p-4 rounded-2xl font-bold transition-all flex flex-col items-center gap-1 border ${
                  scriptFilter === 'hiragana'
                    ? 'bg-zen-primary dark:bg-zen-dark-primary text-white dark:text-zen-dark-on-primary border-zen-primary shadow-zen-sm'
                    : 'bg-zen-surface-container/60 dark:bg-zen-dark-surface-high text-zen-text dark:text-zen-dark-text border-zen-border/40 dark:border-zen-dark-border hover:border-zen-primary/40'
                }`}
              >
                <span className="text-2xl font-kana">あ</span>
                <span className="text-xs">{t('listening.scriptHiragana')}</span>
              </button>

              <button
                type="button"
                onClick={() => setScriptFilter('katakana')}
                className={`p-4 rounded-2xl font-bold transition-all flex flex-col items-center gap-1 border ${
                  scriptFilter === 'katakana'
                    ? 'bg-zen-primary dark:bg-zen-dark-primary text-white dark:text-zen-dark-on-primary border-zen-primary shadow-zen-sm'
                    : 'bg-zen-surface-container/60 dark:bg-zen-dark-surface-high text-zen-text dark:text-zen-dark-text border-zen-border/40 dark:border-zen-dark-border hover:border-zen-primary/40'
                }`}
              >
                <span className="text-2xl font-kana">ア</span>
                <span className="text-xs">{t('listening.scriptKatakana')}</span>
              </button>

              <button
                type="button"
                onClick={() => setScriptFilter('both')}
                className={`p-4 rounded-2xl font-bold transition-all flex flex-col items-center gap-1 border ${
                  scriptFilter === 'both'
                    ? 'bg-indigo-600 dark:bg-indigo-500 text-white border-indigo-600 shadow-zen-sm'
                    : 'bg-zen-surface-container/60 dark:bg-zen-dark-surface-high text-zen-text dark:text-zen-dark-text border-zen-border/40 dark:border-zen-dark-border hover:border-indigo-400'
                }`}
              >
                <span className="text-2xl font-kana">あ / ア</span>
                <span className="text-xs">{t('listening.scriptBoth')}</span>
              </button>
            </div>
          </div>

          {/* Vocabulary Words Toggle */}
          <div className="p-4 sm:p-5 rounded-2xl bg-zen-surface-container/40 dark:bg-zen-dark-surface-high border border-zen-border/40 dark:border-zen-dark-border flex items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-sm font-bold text-zen-text dark:text-zen-dark-text">
                {t('listening.includeVocab')}
              </div>
              <p className="text-xs text-zen-text-muted dark:text-zen-dark-text-muted">
                {t('listening.includeVocabDesc')} (
                {scriptFilter === 'hiragana' ? 'solo vocaboli Hiragana' : scriptFilter === 'katakana' ? 'solo vocaboli Katakana' : 'tutti i vocaboli'}
                )
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIncludeVocab(!includeVocab)}
              className={`w-14 h-8 rounded-full transition-colors relative p-1 shrink-0 ${
                includeVocab ? 'bg-zen-primary dark:bg-zen-dark-primary' : 'bg-zen-border/60 dark:bg-zen-dark-border'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full bg-white transition-transform ${
                  includeVocab ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Question Count Selection */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-zen-text-muted dark:text-zen-dark-text-muted uppercase tracking-wider">
              {t('listening.questionCount')}
            </label>
            <div className="flex flex-wrap gap-3">
              {[5, 10, 15, 20].map(count => (
                <button
                  key={count}
                  type="button"
                  onClick={() => setTargetCount(count)}
                  className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                    targetCount === count
                      ? 'bg-zen-primary dark:bg-zen-dark-primary text-white dark:text-zen-dark-on-primary shadow-zen-sm'
                      : 'bg-zen-surface-container dark:bg-zen-dark-surface-high text-zen-text-muted dark:text-zen-dark-text-muted hover:text-zen-text dark:hover:text-zen-dark-text border border-zen-border/40 dark:border-zen-dark-border'
                  }`}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>

          {/* Start Quiz Button */}
          <button
            type="button"
            onClick={startSession}
            className="w-full py-4 rounded-2xl bg-zen-primary hover:bg-zen-primary-dark dark:bg-zen-dark-primary dark:hover:bg-zen-dark-primary-hover text-white dark:text-zen-dark-on-primary font-bold text-sm uppercase tracking-widest transition-all shadow-zen-md active:scale-95 flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-current" />
            {t('listening.startQuiz')}
          </button>
        </div>
      </div>
    );
  }

  // ==================== SUMMARY / MISTAKES REVIEW SCREEN ====================
  if (phase === 'summary') {
    const correctCount = history.filter(h => h.isCorrect).length;
    const wrongList = history.filter(h => !h.isCorrect);
    const percentage = Math.round((correctCount / questions.length) * 100);

    return (
      <div className="max-w-2xl mx-auto space-y-6 pb-20 xl:pb-8">
        {/* Score Card */}
        <div className="zen-card p-6 sm:p-8 bg-white dark:bg-zen-dark-surface border-2 border-zen-surface-high dark:border-zen-dark-border rounded-3xl shadow-zen-lg dark:shadow-zen-dark-lg text-center space-y-6">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-zen-primary/10 text-zen-primary dark:bg-zen-dark-primary/20 dark:text-zen-dark-primary">
            <Award className="h-10 w-10" />
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-headline font-bold text-zen-text dark:text-zen-dark-text">
              {t('listening.resultsTitle')}
            </h2>
            <p className="mt-1 text-xs text-zen-text-muted dark:text-zen-dark-text-muted">
              {scriptFilter === 'hiragana' ? 'Hiragana' : scriptFilter === 'katakana' ? 'Katakana' : 'Hiragana & Katakana'}
              {includeVocab ? ' · Con Vocabolario' : ' · Solo Caratteri'}
            </p>
          </div>

          <div className="inline-block rounded-2xl bg-zen-surface-container/60 dark:bg-zen-dark-surface-high px-6 py-4">
            <div className="text-4xl font-bold text-zen-primary dark:text-zen-dark-primary">
              {correctCount} / {questions.length}
            </div>
            <div className="mt-1 text-xs font-semibold text-zen-text-muted dark:text-zen-dark-text-muted">
              {t('listening.accuracy')}: {percentage}%
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={startSession}
              className="flex-1 py-3.5 rounded-2xl bg-zen-primary hover:bg-zen-primary-dark dark:bg-zen-dark-primary dark:hover:bg-zen-dark-primary-hover text-white dark:text-zen-dark-on-primary font-bold text-xs uppercase tracking-wider transition-all shadow-zen-sm flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              {t('listening.tryAgain')}
            </button>
            <button
              onClick={() => setPhase('setup')}
              className="flex-1 py-3.5 rounded-2xl bg-zen-surface-container hover:bg-zen-surface-high dark:bg-zen-dark-surface-high dark:hover:bg-zen-dark-surface text-zen-text dark:text-zen-dark-text border border-zen-border/60 dark:border-zen-dark-border font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
            >
              <Settings className="w-4 h-4" />
              {t('listening.backToSetup')}
            </button>
          </div>
        </div>

        {/* Mistakes Review Section */}
        <div className="zen-card p-6 sm:p-8 bg-white dark:bg-zen-dark-surface border-2 border-zen-surface-high dark:border-zen-dark-border rounded-3xl shadow-zen-lg dark:shadow-zen-dark-lg space-y-4">
          <div className="flex items-center justify-between border-b border-zen-border/40 dark:border-zen-dark-border pb-3">
            <h3 className="text-base font-bold text-zen-text dark:text-zen-dark-text flex items-center gap-2">
              <span>{t('listening.reviewTitle')}</span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold ${wrongList.length === 0 ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'}`}>
                {wrongList.length} {t('listening.failedCount').toLowerCase()}
              </span>
            </h3>
          </div>

          {wrongList.length === 0 ? (
            <div className="py-8 text-center text-emerald-600 dark:text-emerald-400 font-semibold text-sm flex flex-col items-center gap-2">
              <CheckCircle2 className="w-10 h-10" />
              <p>{t('listening.noMistakes')}</p>
            </div>
          ) : (
            <div className="space-y-3 pt-2">
              {wrongList.map((item, idx) => (
                <div
                  key={`mistake-${idx}`}
                  className="p-3.5 sm:p-4 rounded-2xl bg-zen-surface-container/40 dark:bg-zen-dark-surface-high border border-zen-border/40 dark:border-zen-dark-border flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      type="button"
                      onClick={() => playKanaSound(item.target.audioText)}
                      className="p-2.5 sm:p-3 rounded-xl bg-zen-primary/10 dark:bg-zen-dark-primary/20 text-zen-primary dark:text-zen-dark-primary hover:bg-zen-primary/20 transition-colors shadow-sm shrink-0"
                      title={t('listening.replayAudio')}
                    >
                      <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                    <div className="flex items-baseline gap-2 flex-wrap min-w-0">
                      <span className="font-kana font-bold text-xl sm:text-2xl text-zen-text dark:text-white whitespace-nowrap">
                        {item.target.label}
                      </span>
                      <span className="text-xs font-mono text-zen-text-muted dark:text-zen-dark-text-muted whitespace-nowrap">
                        ({item.target.romaji})
                      </span>
                      {item.target.translation && item.target.translation !== item.target.romaji && (
                        <span className="text-xs font-semibold text-zen-primary dark:text-zen-dark-primary whitespace-nowrap">
                          · {item.target.translation}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs font-semibold shrink-0">
                    {/* User's Wrong Answer */}
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30 whitespace-nowrap">
                      <X className="w-3.5 h-3.5 shrink-0" />
                      <span>{t('listening.yourAnswer')}: <strong className="font-kana">{item.selected.label}</strong> ({item.selected.romaji})</span>
                    </div>

                    {/* Correct Answer */}
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 whitespace-nowrap">
                      <Check className="w-3.5 h-3.5 shrink-0" />
                      <span>{t('listening.correctAnswer')}: <strong className="font-kana">{item.target.label}</strong></span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ==================== PLAYING SCREEN ====================
  const currentQ = questions[currentIndex];
  if (!currentQ) return null;

  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);
  const isWordQuestion = currentQ.target.type === 'word';

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20 xl:pb-8">
      {/* Header & Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-zen-text-muted dark:text-zen-dark-text-muted">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setPhase('setup')}
              className="px-3 py-1 rounded-lg bg-zen-surface-lowest dark:bg-zen-dark-surface border border-zen-border/60 dark:border-zen-dark-border text-zen-text-muted hover:text-zen-text dark:text-zen-dark-text-muted transition-colors uppercase tracking-wider font-bold shadow-zen-sm text-xs-plus"
            >
              {t('listening.exit')}
            </button>
            <span>{t('listening.question')} {currentIndex + 1} / {questions.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-zen-surface-container dark:bg-zen-dark-surface text-zen-primary dark:text-zen-dark-primary font-bold">
              {currentQ.target.script === 'hiragana' ? 'Hiragana' : 'Katakana'}
              {isWordQuestion ? ' · Vocab' : ' · Kana'}
            </span>
          </div>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-zen-surface-container dark:bg-zen-dark-surface-high">
          <div
            className="h-full rounded-full bg-zen-primary dark:bg-zen-dark-primary transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Audio Trigger Card */}
      <div className="zen-card p-6 sm:p-8 border-2 border-zen-border/40 dark:border-zen-dark-border flex flex-col items-center justify-center space-y-5 bg-zen-surface-lowest dark:bg-zen-dark-surface shadow-zen-lg dark:shadow-zen-dark-lg rounded-3xl">
        <div className="text-center space-y-1">
          <span className="px-3.5 py-1 rounded-full bg-zen-primary/10 dark:bg-zen-dark-primary/20 text-zen-primary dark:text-zen-dark-primary text-xs font-bold uppercase tracking-wider">
            {lang === 'it' ? 'Esercizio di Ascolto' : 'Listening Exercise'}
          </span>
          <h3 className="text-xl font-headline font-bold text-zen-text dark:text-zen-dark-text">
            {t('listening.whichKana')}
          </h3>
        </div>

        <button
          onClick={handlePlayAudio}
          className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full flex flex-col items-center justify-center gap-1 transition-all duration-300 shadow-zen-lg ${
            audioPlayed
              ? 'bg-zen-primary dark:bg-zen-dark-primary text-white dark:text-zen-dark-on-primary scale-105 ring-4 ring-zen-primary/20 dark:ring-zen-dark-primary/40'
              : 'bg-zen-primary hover:bg-zen-primary-dark dark:bg-zen-dark-primary dark:hover:bg-zen-dark-primary-hover text-white dark:text-zen-dark-on-primary hover:scale-105'
          }`}
          title={t('listening.playAudio')}
        >
          <Play className="w-10 h-10 sm:w-12 sm:h-12 fill-current ml-1" />
        </button>

        <p className="text-xs text-zen-text-muted dark:text-zen-dark-text-muted font-medium">
          {audioPlayed ? t('listening.audioPlayed') : t('listening.clickToPlay')}
        </p>
      </div>

      {/* 4 Options Grid */}
      <div className={`grid gap-4 ${isWordQuestion ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-4'}`}>
        {currentQ.options.map((option, idx) => {
          const isSelected = !!selectedOption && (
            option.id !== undefined
              ? selectedOption.id === option.id
              : selectedOption.label === option.label
          );
          const isCorrect = option.id === currentQ.target.id || option.label === currentQ.target.label;

          let btnStyle = 'bg-zen-surface-lowest dark:bg-zen-dark-surface border-zen-border/40 dark:border-zen-dark-border text-zen-text dark:text-zen-dark-text hover:border-zen-primary dark:hover:border-zen-dark-primary';
          if (isAnswered) {
            if (isCorrect) {
              btnStyle = 'bg-emerald-500 text-white border-emerald-600 ring-2 ring-emerald-300 dark:ring-emerald-500/40 shadow-zen-md';
            } else if (isSelected && !isCorrect) {
              btnStyle = 'bg-rose-500 text-white border-rose-600';
            } else {
              btnStyle = 'bg-zen-surface-container/40 dark:bg-zen-dark-surface-high/40 text-zen-text-muted dark:text-zen-dark-text-muted border-transparent opacity-50';
            }
          }

          return (
            <button
              key={`${option.id || option.label}-${idx}`}
              onClick={() => handleSelectOption(option)}
              disabled={isAnswered}
              className={`relative p-4 sm:p-5 rounded-2xl border-2 flex flex-col items-center justify-center transition-all duration-200 min-h-[90px] ${btnStyle}`}
            >
              <span className="absolute top-2.5 left-2.5 w-5 h-5 rounded-md bg-zen-surface-container/80 dark:bg-zen-dark-surface-high/80 border border-zen-border/40 dark:border-zen-dark-border/60 text-2xs font-mono font-bold flex items-center justify-center text-zen-text-muted dark:text-zen-dark-text-muted">
                {idx + 1}
              </span>
              <span className={`font-kana font-bold ${isWordQuestion ? 'text-2xl sm:text-3xl' : 'text-4xl sm:text-5xl'}`}>
                {option.label}
              </span>
              {isAnswered && (
                <span className="text-xs-plus font-mono mt-1 opacity-90">
                  {option.romaji} {option.translation && option.translation !== option.romaji ? `· ${option.translation}` : ''}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Feedback Bar & Next Button */}
      {isAnswered && (
        <div className="zen-card p-4 sm:p-5 border border-zen-primary-light dark:border-zen-dark-border bg-white dark:bg-zen-dark-surface flex items-center justify-between gap-4 animate-fade-in rounded-2xl shadow-zen-sm">
          <div className="flex items-center gap-3">
            {selectedOption?.id === currentQ.target.id || selectedOption?.label === currentQ.target.label ? (
              <>
                <CheckCircle2 className="w-7 h-7 text-emerald-500 shrink-0" />
                <div>
                  <h4 className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                    {lang === 'it' ? 'Risposta Corretta!' : 'Correct Answer!'}
                  </h4>
                  <p className="text-xs text-zen-text-muted dark:text-zen-dark-text-muted">
                    '{currentQ.target.label}' ({currentQ.target.romaji})
                    {currentQ.target.translation && currentQ.target.translation !== currentQ.target.romaji ? ` · ${currentQ.target.translation}` : ''}
                  </p>
                </div>
              </>
            ) : (
              <>
                <XCircle className="w-7 h-7 text-rose-500 shrink-0" />
                <div>
                  <h4 className="font-bold text-rose-600 dark:text-rose-400 text-sm">
                    {lang === 'it' ? 'Risposta Errata' : 'Incorrect'}
                  </h4>
                  <p className="text-xs text-zen-text-muted dark:text-zen-dark-text-muted">
                    {lang === 'it' ? 'La risposta corretta era' : 'The correct answer was'} '{currentQ.target.label}' ({currentQ.target.romaji}).
                  </p>
                </div>
              </>
            )}
          </div>

          <button
            onClick={handleNext}
            className="px-5 py-2.5 rounded-xl bg-zen-primary dark:bg-zen-dark-primary hover:bg-zen-primary-dark dark:hover:bg-zen-dark-primary-hover text-white dark:text-zen-dark-on-primary font-bold text-xs shadow-zen-sm flex items-center gap-1.5 shrink-0"
          >
            {currentIndex < questions.length - 1 ? t('listening.next') : (lang === 'it' ? 'Vedi Risultati' : 'See Results')}
            <Sparkles className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
