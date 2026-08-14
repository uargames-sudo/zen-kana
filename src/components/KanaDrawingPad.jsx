import React, { useEffect, useRef, useState } from 'react';
import { Eraser, CheckCircle } from 'lucide-react';

const SHAPES = {
  one: [[{ x: 0.3, y: 0.2 }, { x: 0.65, y: 0.8 }]],
  two: [[{ x: 0.25, y: 0.28 }, { x: 0.75, y: 0.28 }], [{ x: 0.5, y: 0.2 }, { x: 0.5, y: 0.8 }]],
  three: [[{ x: 0.25, y: 0.25 }, { x: 0.72, y: 0.3 }], [{ x: 0.32, y: 0.56 }, { x: 0.7, y: 0.5 }], [{ x: 0.5, y: 0.18 }, { x: 0.5, y: 0.82 }]],
};

const TEMPLATE_BY_ROMAJI = {
  a: 'three', i: 'two', u: 'two', e: 'two', o: 'three', ka: 'three', ki: 'three', ku: 'two', ke: 'three', ko: 'two',
  sa: 'three', shi: 'three', su: 'two', se: 'three', so: 'two', ta: 'three', chi: 'three', tsu: 'two', te: 'two', to: 'two',
  na: 'three', ni: 'three', nu: 'two', ne: 'three', no: 'one', ha: 'three', hi: 'two', fu: 'three', he: 'two', ho: 'three',
  ma: 'three', mi: 'two', mu: 'two', me: 'two', mo: 'three', ya: 'two', yu: 'two', yo: 'two', ra: 'two', ri: 'two',
  ru: 'two', re: 'two', ro: 'one', wa: 'two', wo: 'three', n: 'one',
};

const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

export default function KanaDrawingPad({ kana, romaji, onScore }) {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const activeStroke = useRef(null);
  const [strokes, setStrokes] = useState([]);
  const [score, setScore] = useState(null);
  const template = SHAPES[TEMPLATE_BY_ROMAJI[romaji] || 'two'];

  const prepareCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const ratio = window.devicePixelRatio || 1;
    canvas.width = rect.width * ratio;
    canvas.height = rect.height * ratio;
    const context = canvas.getContext('2d');
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.lineWidth = 22;
    context.strokeStyle = document.documentElement.classList.contains('dark') ? '#36d399' : '#38656f';
    contextRef.current = context;
  };

  useEffect(() => { prepareCanvas(); }, [kana]);

  const clear = () => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    if (canvas && context) context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    setStrokes([]);
    setScore(null);
  };

  const pointFromEvent = (event) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return { x: (event.clientX - rect.left) / rect.width, y: (event.clientY - rect.top) / rect.height, rawX: event.clientX - rect.left, rawY: event.clientY - rect.top };
  };

  const start = (event) => {
    event.preventDefault();
    canvasRef.current.setPointerCapture?.(event.pointerId);
    const point = pointFromEvent(event);
    activeStroke.current = [point];
    contextRef.current.beginPath();
    contextRef.current.moveTo(point.rawX, point.rawY);
  };
  const move = (event) => {
    if (!activeStroke.current) return;
    event.preventDefault();
    const point = pointFromEvent(event);
    activeStroke.current.push(point);
    contextRef.current.lineTo(point.rawX, point.rawY);
    contextRef.current.stroke();
  };
  const finish = (event) => {
    if (!activeStroke.current) return;
    event.preventDefault();
    const completed = [...strokes, activeStroke.current];
    activeStroke.current = null;
    setStrokes(completed);
    const strokeScore = Math.max(0, 1 - Math.abs(completed.length - template.length) / Math.max(template.length, 1));
    const waypointScores = template.map((expected, index) => {
      const userStroke = completed[index] || [];
      if (!userStroke.length) return 0;
      const startDistance = Math.min(...userStroke.map((point) => distance(point, expected[0])));
      const endDistance = Math.min(...userStroke.map((point) => distance(point, expected[expected.length - 1])));
      return Math.max(0, 1 - ((startDistance + endDistance) / 0.7));
    });
    const waypointScore = waypointScores.reduce((sum, value) => sum + value, 0) / template.length;
    const allPoints = completed.flat();
    const coverage = allPoints.length ? Math.min(1, (Math.max(...allPoints.map((point) => point.x)) - Math.min(...allPoints.map((point) => point.x)) + Math.max(...allPoints.map((point) => point.y)) - Math.min(...allPoints.map((point) => point.y))) / 0.7) : 0;
    const nextScore = Math.round((strokeScore * 0.35 + waypointScore * 0.5 + coverage * 0.15) * 100);
    setScore(nextScore);
    onScore?.(nextScore);
  };

  return <div className="space-y-3">
    <div className="relative h-72 overflow-hidden rounded-3xl border-2 border-dashed border-zen-primary-light/60 bg-zen-surface-container/30 touch-none dark:border-zen-dark-border dark:bg-zen-dark-surface-high">
      <div className="pointer-events-none absolute inset-0 grid place-items-center"><span className="font-kana text-[190px] font-bold text-zen-primary/10 dark:text-zen-dark-primary/15">{kana}</span></div>
      <canvas ref={canvasRef} onPointerDown={start} onPointerMove={move} onPointerUp={finish} onPointerCancel={finish} className="relative z-10 h-full w-full touch-none" />
    </div>
    <div className="flex items-center justify-between text-sm"><span className="font-semibold text-zen-text-muted dark:text-zen-dark-text-muted">{score === null ? `Draw ${template.length} stroke${template.length > 1 ? 's' : ''}` : <span className="flex items-center gap-1 text-zen-primary dark:text-zen-dark-primary"><CheckCircle className="h-4 w-4" /> Score: {score}%</span>}</span><button onClick={clear} className="flex items-center gap-1 rounded-xl border border-zen-border/60 px-3 py-2 text-xs font-bold text-zen-text dark:border-zen-dark-border dark:text-zen-dark-text"><Eraser className="h-4 w-4" /> Clear</button></div>
  </div>;
}
