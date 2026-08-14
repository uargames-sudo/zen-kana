import React, { useRef, useState, useEffect } from 'react';
import { Volume2, Eraser, Eye, EyeOff, ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { HIRAGANA_BASIC, KANA_DAKUTEN, getKanaExample } from '../data/kanaData';
import { playKanaSound } from '../utils/audio';
import { useLanguage } from '../context/LanguageContext';

export default function WritingCanvas({ scriptMode }) {
  const { lang, t } = useLanguage();
  const isHiragana = scriptMode === 'hiragana';
  const kanaList = [...HIRAGANA_BASIC.filter(k => k.hiragana), ...KANA_DAKUTEN];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showGuide, setShowGuide] = useState(true);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  const canvasRef = useRef(null);
  const contextRef = useRef(null);

  const currentItem = kanaList[currentIndex];
  const char = isHiragana ? currentItem.hiragana : currentItem.katakana;

  // Initialize Canvas context
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set high DPI canvas resolution
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;

    const isDarkMode = document.documentElement.classList.contains('dark');

    const ctx = canvas.getContext('2d');
    ctx.scale(2, 2);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = isDarkMode ? '#36d399' : '#38656f';
    ctx.lineWidth = 10;
    contextRef.current = ctx;

    clearCanvas();
  }, [currentIndex]);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    if (!canvas || !ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);
    setHasDrawn(false);
  };

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    if (e.touches && e.touches[0]) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const startDrawing = (e) => {
    e.preventDefault();
    const { x, y } = getCoordinates(e);
    const ctx = contextRef.current;
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setHasDrawn(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const { x, y } = getCoordinates(e);
    const ctx = contextRef.current;
    if (!ctx) return;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = (e) => {
    if (!isDrawing) return;
    if (e) e.preventDefault();
    const ctx = contextRef.current;
    if (ctx) ctx.closePath();
    setIsDrawing(false);
  };

  const handleNext = () => {
    if (currentIndex < kanaList.length - 1) {
      setCurrentIndex(prev => prev + 1);
      clearCanvas();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      clearCanvas();
    }
  };

  const handlePlaySound = () => {
    playKanaSound(char);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 lg:pb-8">
      {/* Header Info */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-headline font-bold text-zen-text dark:text-zen-dark-text">
            {t('writing.title')}
          </h2>
          <p className="text-xs text-zen-text-muted dark:text-zen-dark-text-muted">
            {t('writing.subtitle')}
          </p>
        </div>

        <button
          onClick={handlePlaySound}
          className="p-3 rounded-2xl bg-zen-primary dark:bg-zen-dark-primary text-white dark:text-zen-dark-on-primary hover:bg-zen-primary-dark dark:hover:bg-zen-dark-primary-hover transition-colors shadow-zen-sm flex items-center gap-2 text-xs font-bold"
        >
          <Volume2 className="w-4 h-4" /> Audio ({currentItem.romaji})
        </button>
      </div>

      {/* Main Drawing Canvas & Reference Grid Container */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Reference Card */}
        <div className="md:col-span-5 zen-card p-6 border-2 border-zen-surface-high dark:border-zen-dark-border bg-white dark:bg-zen-dark-surface-high flex flex-col justify-between items-center text-center shadow-zen-lg dark:shadow-zen-dark-lg">
          <div className="w-full flex justify-between items-center text-xs text-zen-text-muted dark:text-zen-dark-text-muted">
            <span className="px-3 py-1 rounded-full bg-zen-surface-container dark:bg-zen-dark-surface font-semibold">
              {t('writing.currentChar')}
            </span>
            <button
              onClick={handlePlaySound}
              className="p-2.5 rounded-full bg-zen-primary/10 dark:bg-zen-dark-primary/20 text-zen-primary dark:text-zen-dark-primary hover:bg-zen-primary/20 transition-colors"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>

          <div className="my-auto py-8">
            <span className="font-kana font-bold text-8xl sm:text-9xl text-zen-primary dark:text-white">
              {char}
            </span>
            <div className="text-2xl font-headline font-bold text-zen-text dark:text-zen-dark-text uppercase mt-4">
              {currentItem.romaji}
            </div>
          </div>

          <div className="w-full text-xs text-zen-text-muted dark:text-zen-dark-text-muted pt-4 border-t border-zen-surface-high dark:border-zen-dark-border">
            {t('table.exampleWord')}: {getKanaExample(currentItem, lang)}
          </div>
        </div>

        {/* Right Practice Pad Canvas Container */}
        <div className="md:col-span-7 zen-card p-6 border-2 border-zen-surface-high dark:border-zen-dark-border flex flex-col items-center justify-between relative bg-white dark:bg-zen-dark-surface overflow-hidden shadow-zen-lg dark:shadow-zen-dark-lg">
          {/* Top toolbar over canvas */}
          <div className="w-full flex items-center justify-between mb-4 text-xs font-semibold text-zen-text-muted dark:text-zen-dark-text-muted">
            <span className="px-3 py-1 rounded-full bg-zen-surface-container dark:bg-zen-dark-surface-high">
              Canvas ({currentIndex + 1}/{kanaList.length})
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowGuide(!showGuide)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zen-border/40 dark:border-zen-dark-border hover:bg-zen-surface-container dark:hover:bg-zen-dark-surface-high transition-colors text-xs font-bold"
              >
                {showGuide ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                {showGuide ? (lang === 'it' ? 'Nascondi Traccia' : 'Hide Outline') : (lang === 'it' ? 'Mostra Traccia' : 'Show Outline')}
              </button>

              <button
                onClick={clearCanvas}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zen-border/40 dark:border-zen-dark-border hover:bg-zen-secondary/10 dark:hover:bg-zen-dark-secondary/20 hover:text-zen-secondary dark:hover:text-zen-dark-primary transition-colors text-xs font-bold"
              >
                <Eraser className="w-3.5 h-3.5" /> {t('writing.clear')}
              </button>
            </div>
          </div>

          {/* HTML5 Canvas Practice Area */}
          <div className="relative w-full h-[280px] sm:h-[320px] rounded-3xl bg-zen-surface-container/30 dark:bg-zen-dark-surface-high border-2 border-dashed border-zen-primary-light/60 dark:border-zen-dark-border flex items-center justify-center select-none touch-none">
            {/* Background Grid Lines */}
            <div className="absolute inset-0 pointer-events-none flex flex-col justify-center items-center">
              <div className="w-full h-px bg-zen-primary-light/30 dark:bg-zen-dark-border/60" />
              <div className="h-full w-px bg-zen-primary-light/30 dark:bg-zen-dark-border/60 absolute" />
            </div>

            {/* Faint Stroke Guide Overlay */}
            {showGuide && (
              <span className="absolute font-kana font-bold text-[180px] sm:text-[200px] text-zen-primary/15 dark:text-zen-dark-primary/20 pointer-events-none leading-none select-none">
                {char}
              </span>
            )}

            {/* HTML5 Canvas */}
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="w-full h-full cursor-crosshair relative z-10"
            />
          </div>

          {/* Canvas Feedback message & Navigation */}
          <div className="mt-4 w-full flex items-center justify-between text-xs font-semibold text-zen-text-muted dark:text-zen-dark-text-muted">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="px-3.5 py-2 rounded-xl border border-zen-border/40 text-zen-text dark:text-zen-dark-text disabled:opacity-40 flex items-center gap-1 font-bold"
            >
              <ArrowLeft className="w-4 h-4" /> {t('writing.prev')}
            </button>

            {hasDrawn ? (
              <span className="text-zen-primary dark:text-zen-dark-primary flex items-center gap-1">
                <Check className="w-4 h-4" /> {lang === 'it' ? 'Tratto registrato!' : 'Stroke recorded!'}
              </span>
            ) : (
              <span>{t('writing.strokeTips')}</span>
            )}

            <button
              onClick={handleNext}
              disabled={currentIndex === kanaList.length - 1}
              className="px-4 py-2 rounded-xl bg-zen-primary dark:bg-zen-dark-primary text-white dark:text-zen-dark-on-primary font-bold shadow-zen-sm flex items-center gap-1 disabled:opacity-40"
            >
              {t('writing.next')} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
