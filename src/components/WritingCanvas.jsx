import React, { useRef, useState, useEffect } from 'react';
import { Volume2, Eraser, Eye, EyeOff, ArrowRight, ArrowLeft, Check, ListOrdered, Sparkles } from 'lucide-react';
import { HIRAGANA_BASIC, KANA_DAKUTEN, getKanaExample } from '../data/kanaData';
import { getStrokeOrderData } from '../data/strokeOrderData';
import { playKanaSound } from '../utils/audio';
import { useLanguage } from '../context/LanguageContext';

export default function WritingCanvas({ scriptMode }) {
  const { lang, t } = useLanguage();
  const isHiragana = scriptMode === 'hiragana';
  const kanaList = [...HIRAGANA_BASIC.filter(k => k.hiragana), ...KANA_DAKUTEN];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showGuide, setShowGuide] = useState(true);
  const [showStrokeNumbers, setShowStrokeNumbers] = useState(true);
  const [activeStepTab, setActiveStepTab] = useState('guide'); // 'guide', 'steps'
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  const canvasRef = useRef(null);
  const contextRef = useRef(null);

  const currentItem = kanaList[currentIndex];
  const char = isHiragana ? currentItem.hiragana : currentItem.katakana;
  const strokeInfo = getStrokeOrderData(char);

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
    ctx.strokeStyle = isDarkMode ? '#f0b000' : '#981701';
    ctx.lineWidth = 22;
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

  const stepsList = lang === 'it' ? strokeInfo.stepsIt : strokeInfo.stepsEn;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 xl:pb-8">
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
        {/* Left Reference Card with Stroke Order Details */}
        <div className="md:col-span-5 zen-card p-5 sm:p-6 border-2 border-zen-border/40 dark:border-zen-dark-border bg-zen-surface-lowest dark:bg-zen-dark-surface flex flex-col justify-between items-center text-center shadow-zen-lg dark:shadow-zen-dark-lg rounded-3xl">
          <div className="w-full flex justify-between items-center text-xs">
            <span className="px-3 py-1 rounded-full bg-zen-surface-container dark:bg-zen-dark-surface-high font-semibold text-zen-text-muted dark:text-zen-dark-text-muted">
              {t('writing.currentChar')}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-zen-primary/10 dark:bg-zen-dark-primary/20 text-zen-primary dark:text-zen-dark-primary font-bold text-xs">
              {strokeInfo.strokes} {lang === 'it' ? (strokeInfo.strokes === 1 ? 'tratto' : 'tratti') : (strokeInfo.strokes === 1 ? 'stroke' : 'strokes')}
            </span>
          </div>

          {/* Sub-tabs: Visual Guide vs Stroke Steps */}
          <div className="w-full mt-3 flex items-center bg-zen-surface-container/60 dark:bg-zen-dark-surface-high p-1 rounded-xl border border-zen-border/40 dark:border-zen-dark-border text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveStepTab('guide')}
              className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1 ${
                activeStepTab === 'guide'
                  ? 'bg-zen-surface-lowest dark:bg-zen-dark-surface text-zen-primary dark:text-zen-dark-primary shadow-sm'
                  : 'text-zen-text-muted dark:text-zen-dark-text-muted hover:text-zen-text'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{lang === 'it' ? 'Carattere & Tratti' : 'Character & Strokes'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveStepTab('steps')}
              className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1 ${
                activeStepTab === 'steps'
                  ? 'bg-zen-surface-lowest dark:bg-zen-dark-surface text-zen-primary dark:text-zen-dark-primary shadow-sm'
                  : 'text-zen-text-muted dark:text-zen-dark-text-muted hover:text-zen-text'
              }`}
            >
              <ListOrdered className="w-3.5 h-3.5" />
              <span>{lang === 'it' ? 'Dettaglio Tratti' : 'Stroke Steps'}</span>
            </button>
          </div>

          {/* Tab 1: Interactive Character with Stroke Numbers */}
          {activeStepTab === 'guide' ? (
            <div className="my-auto py-4 w-full flex flex-col items-center">
              <div className="relative w-48 h-48 sm:w-52 sm:h-52 rounded-2xl bg-zen-surface-container/30 dark:bg-zen-dark-surface-high border border-dashed border-zen-border/60 dark:border-zen-dark-border flex items-center justify-center">
                {/* Cross Grid Lines */}
                <div className="absolute inset-0 pointer-events-none flex flex-col justify-center items-center">
                  <div className="w-full h-px bg-zen-primary/20 dark:bg-zen-dark-border/60" />
                  <div className="h-full w-px bg-zen-primary/20 dark:bg-zen-dark-border/60 absolute" />
                </div>

                {/* Main Kana Glyph */}
                <span className="font-kana font-bold text-8xl sm:text-9xl text-zen-primary dark:text-zen-dark-text select-none leading-none">
                  {char}
                </span>

                {/* Numbered Stroke Markers Overlay */}
                {showStrokeNumbers && strokeInfo.markers?.map((marker, mIdx) => (
                  <div
                    key={`marker-${mIdx}`}
                    style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-6 h-6 rounded-full bg-rose-500 text-white font-extrabold text-xs shadow-md border-2 border-white dark:border-zen-dark-surface animate-pulse"
                    title={`Tratto ${marker.num}: ${marker.dir}`}
                  >
                    <span>{marker.num}</span>
                  </div>
                ))}
              </div>

              <div className="text-xl font-headline font-bold text-zen-text dark:text-zen-dark-text uppercase mt-3">
                {currentItem.romaji}
              </div>

              {/* Toggle Stroke Numbers Button */}
              <button
                type="button"
                onClick={() => setShowStrokeNumbers(!showStrokeNumbers)}
                className="mt-2 text-xs-plus font-semibold text-zen-text-muted dark:text-zen-dark-text-muted hover:text-zen-primary dark:hover:text-zen-dark-primary transition-colors flex items-center gap-1"
              >
                {showStrokeNumbers ? (lang === 'it' ? 'Nascondi numeri tratti' : 'Hide stroke numbers') : (lang === 'it' ? 'Mostra numeri tratti' : 'Show stroke numbers')}
              </button>
            </div>
          ) : (
            /* Tab 2: Sequential Step-by-Step Stroke Order List */
            <div className="my-auto py-3 w-full space-y-2 text-left">
              <div className="text-xs font-bold uppercase tracking-wider text-zen-text-muted dark:text-zen-dark-text-muted mb-2 text-center">
                {lang === 'it' ? `Sequenza Tratti (${strokeInfo.strokes} tratti totali)` : `Stroke Sequence (${strokeInfo.strokes} total)`}
              </div>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {stepsList.map((step, sIdx) => (
                  <div
                    key={`step-desc-${sIdx}`}
                    className="p-2.5 rounded-xl bg-zen-surface-container/40 dark:bg-zen-dark-surface border border-zen-border/40 dark:border-zen-dark-border flex items-start gap-2.5 text-xs text-zen-text dark:text-zen-dark-text"
                  >
                    <span className="w-5 h-5 rounded-full bg-zen-primary dark:bg-zen-dark-primary text-white dark:text-zen-dark-on-primary font-bold text-xs-plus flex items-center justify-center shrink-0 mt-0.5">
                      {sIdx + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="w-full text-xs text-zen-text-muted dark:text-zen-dark-text-muted pt-3 border-t border-zen-surface-high dark:border-zen-dark-border">
            {t('table.exampleWord')}: <strong>{getKanaExample(currentItem, lang)}</strong>
          </div>
        </div>

        {/* Right Practice Pad Canvas Container */}
        <div className="md:col-span-7 zen-card p-5 sm:p-6 border-2 border-zen-border/40 dark:border-zen-dark-border flex flex-col items-center justify-between relative bg-zen-surface-lowest dark:bg-zen-dark-surface overflow-hidden shadow-zen-lg dark:shadow-zen-dark-lg rounded-3xl">
          {/* Top toolbar over canvas */}
          <div className="w-full flex items-center justify-between mb-4 text-xs font-semibold text-zen-text-muted dark:text-zen-dark-text-muted">
            <span className="px-3 py-1 rounded-full bg-zen-surface-container dark:bg-zen-dark-surface-high font-bold">
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
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zen-border/40 dark:border-zen-dark-border hover:bg-rose-500/10 hover:text-rose-500 dark:hover:text-rose-400 transition-colors text-xs font-bold"
              >
                <Eraser className="w-3.5 h-3.5" /> {t('writing.clear')}
              </button>
            </div>
          </div>

          {/* HTML5 Canvas Practice Area */}
          <div className="relative w-full h-[280px] sm:h-[320px] rounded-3xl bg-zen-surface-container/30 dark:bg-zen-dark-surface-high border-2 border-dashed border-zen-border/40 dark:border-zen-dark-border flex items-center justify-center select-none touch-none">
            {/* Background Grid Lines */}
            <div className="absolute inset-0 pointer-events-none flex flex-col justify-center items-center">
              <div className="w-full h-px bg-zen-primary/20 dark:bg-zen-dark-border/60" />
              <div className="h-full w-px bg-zen-primary/20 dark:bg-zen-dark-border/60 absolute" />
            </div>

            {/* Faint Stroke Guide Overlay */}
            {showGuide && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center select-none">
                <span className="font-kana font-bold text-[180px] sm:text-[200px] text-zen-primary/15 dark:text-zen-dark-primary/20 leading-none select-none">
                  {char}
                </span>

                {/* Optional numbered markers on canvas overlay for clear guidance */}
                {showStrokeNumbers && strokeInfo.markers?.map((marker, mIdx) => (
                  <div
                    key={`canvas-marker-${mIdx}`}
                    style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-5 h-5 rounded-full bg-rose-500/80 text-white font-bold text-2xs shadow-sm pointer-events-none select-none"
                  >
                    <span>{marker.num}</span>
                  </div>
                ))}
              </div>
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
              className="px-3.5 py-2 rounded-xl border border-zen-border/40 text-zen-text dark:text-zen-dark-text disabled:opacity-40 flex items-center gap-1 font-bold shadow-zen-sm"
            >
              <ArrowLeft className="w-4 h-4" /> {t('writing.prev')}
            </button>

            {hasDrawn ? (
              <span className="text-zen-primary dark:text-zen-dark-primary flex items-center gap-1 font-bold">
                <Check className="w-4 h-4" /> {lang === 'it' ? 'Tratto registrato!' : 'Stroke recorded!'}
              </span>
            ) : (
              <span className="text-center">{t('writing.strokeTips')}</span>
            )}

            <button
              onClick={handleNext}
              disabled={currentIndex === kanaList.length - 1}
              className="px-4 py-2 rounded-xl bg-zen-primary dark:bg-zen-dark-primary hover:bg-zen-primary-dark dark:hover:bg-zen-dark-primary-hover text-white dark:text-zen-dark-on-primary font-bold shadow-zen-sm flex items-center gap-1 disabled:opacity-40"
            >
              {t('writing.next')} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
