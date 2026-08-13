import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import KanaTable from './components/KanaTable';
import Flashcards from './components/Flashcards';
import WritingCanvas from './components/WritingCanvas';
import ListeningQuiz from './components/ListeningQuiz';
import VerificationQuiz from './components/VerificationQuiz';
import PwaInstaller from './components/PwaInstaller';
import Vocabulary from './components/Vocabulary';
import StructuredLessons from './components/StructuredLessons';

export default function App() {
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
        navigator.serviceWorker.register('/service-worker.js', { scope: '/' }).then(
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

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'table':
        return <KanaTable scriptMode={scriptMode} />;
      case 'flashcards':
        return <Flashcards scriptMode={scriptMode} updateStats={updateStats} />;
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
      default:
        return <Dashboard setActiveTab={setActiveTab} scriptMode={scriptMode} stats={stats} />;
    }
  };

  return (
    <div className="flex min-h-[100dvh] flex-col bg-zen-surface font-sans text-zen-text antialiased transition-colors duration-300 dark:bg-zen-dark-bg dark:text-zen-dark-text">
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
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 pt-6">
        {renderActiveComponent()}
      </main>

      {/* PWA Installer Prompt */}
      <PwaInstaller />

      {/* Footer */}
      <footer className="border-t border-zen-surface-high dark:border-zen-dark-border py-6 text-center text-xs text-zen-text-muted dark:text-zen-dark-text-muted hidden lg:block">
        <p>Zen Kana PWA Studio — Built with Vite, React & Tailwind CSS. Japanese Audio powered by Web Speech API.</p>
      </footer>
    </div>
  );
}
