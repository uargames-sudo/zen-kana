import React, { useState, useEffect, lazy, Suspense } from 'react';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import { useLanguage } from './context/LanguageContext';

// Dynamic Code-Splitting for lightweight initial bundle
const KanaTable = lazy(() => import('./components/KanaTable'));
const Flashcards = lazy(() => import('./components/Flashcards'));
const WritingCanvas = lazy(() => import('./components/WritingCanvas'));
const ListeningQuiz = lazy(() => import('./components/ListeningQuiz'));
const VerificationQuiz = lazy(() => import('./components/VerificationQuiz'));
const Vocabulary = lazy(() => import('./components/Vocabulary'));
const StructuredLessons = lazy(() => import('./components/StructuredLessons'));
const ActiveStudy = lazy(() => import('./components/ActiveStudy/ActiveStudy'));
const GamesHub = lazy(() => import('./components/GamesHub'));

function ModuleLoadingFallback() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[45vh] space-y-4 animate-fadeIn">
      <div className="w-9 h-9 border-3 border-zen-border/40 border-t-zen-primary dark:border-zen-dark-border dark:border-t-zen-dark-primary rounded-full animate-spin" />
      <span className="text-xs font-bold uppercase tracking-widest text-zen-text-muted dark:text-zen-dark-text-muted">
        Caricamento...
      </span>
    </div>
  );
}

export default function App() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [scriptMode, setScriptMode] = useState('hiragana'); // 'hiragana' | 'katakana'

  // Dark / Light Theme State
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('zen_kana_theme') || 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('zen_kana_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // User study statistics stored in localStorage
  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem('zen_kana_stats');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (err) {
        console.warn('Error reading stats from localStorage', err);
      }
    }
    return { reviewedCount: 28, correctCount: 54, totalAttempts: 60 };
  });

  // Save stats to localStorage on update
  useEffect(() => {
    localStorage.setItem('zen_kana_stats', JSON.stringify(stats));
  }, [stats]);

  // Service workers are available only on HTTPS (or localhost); register in dev too
  // so PWA installation can be verified from a trusted local HTTPS device URL.
  useEffect(() => {
    if ('serviceWorker' in navigator && window.isSecureContext) {
      window.addEventListener('load', () => {
        const baseUrl = import.meta.env.BASE_URL;
        navigator.serviceWorker.register(`${baseUrl}service-worker.js`, { scope: baseUrl }).then(
          (reg) => console.log('[PWA] ServiceWorker registered with scope:', reg.scope),
          (err) => console.warn('[PWA] ServiceWorker registration failed:', err)
        );
      });
    } else if (!window.isSecureContext) {
      console.warn('[PWA] ServiceWorker requires HTTPS or localhost.');
    }
  }, []);

  const updateStats = (isCorrect) => {
    setStats((prev) => {
      const newTotal = prev.totalAttempts + 1;
      const newCorrect = prev.correctCount + (isCorrect ? 1 : 0);
      const newReviewed = Math.min(46, prev.reviewedCount + (isCorrect ? 1 : 0));
      return {
        reviewedCount: newReviewed,
        correctCount: newCorrect,
        totalAttempts: newTotal,
        accuracy: Math.round((newCorrect / newTotal) * 100)
      };
    });
  };

  const resetStats = () => {
    setStats({ reviewedCount: 0, correctCount: 0, totalAttempts: 0, accuracy: 0 });
  };

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'table':
        return <KanaTable scriptMode={scriptMode} />;
      case 'flashcards':
        return <Flashcards scriptMode={scriptMode} updateStats={updateStats} />;
      case 'activeStudy':
        return <ActiveStudy />;
      case 'vocabulary':
        return <Vocabulary />;
      case 'lessons':
        return <StructuredLessons scriptMode={scriptMode} updateStats={updateStats} />;
      case 'writing':
        return <WritingCanvas scriptMode={scriptMode} />;
      case 'listening':
        return <ListeningQuiz scriptMode={scriptMode} updateStats={updateStats} />;
      case 'quiz':
        return <VerificationQuiz scriptMode={scriptMode} updateStats={updateStats} />;
      case 'games':
      case 'memory':
        return <GamesHub scriptMode={scriptMode} />;
      default:
        return <Dashboard setActiveTab={setActiveTab} scriptMode={scriptMode} stats={stats} resetStats={resetStats} />;
    }
  };

  return (
    <div className="app-root flex min-h-[100dvh] flex-col bg-zen-surface font-sans text-zen-text antialiased transition-colors duration-300 dark:bg-zen-dark-bg dark:text-zen-dark-text">
      {/* Top Header & Navigation */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        scriptMode={scriptMode}
        setScriptMode={setScriptMode}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      {/* Main Content View Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-2.5 xs:px-4 sm:px-6 pt-4 sm:pt-6 pb-24 xl:pb-8">
        <Suspense fallback={<ModuleLoadingFallback />}>
          {renderActiveComponent()}
        </Suspense>
      </main>

      {/* Footer */}
      <footer className="border-t border-zen-border/40 dark:border-zen-dark-border bg-zen-surface dark:bg-zen-dark-bg py-6 text-center text-xs text-zen-text-muted dark:text-zen-dark-text-muted hidden lg:block transition-colors duration-300">
        <p>{t('nav.footerText')}</p>
      </footer>
    </div>
  );
}
