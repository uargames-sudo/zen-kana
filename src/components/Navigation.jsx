import React, { useState } from 'react';
import {
  LayoutDashboard,
  Grid,
  Layers,
  PenTool,
  Volume2,
  Award,
  Sparkles,
  Sun,
  Moon,
  BookOpen,
  Menu,
  X,
  ListChecks,
} from 'lucide-react';

export default function Navigation({
  activeTab,
  setActiveTab,
  scriptMode,
  setScriptMode,
  theme,
  toggleTheme,
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'table', label: 'Kana Table', icon: Grid },
    { id: 'flashcards', label: 'Flashcards', icon: Layers },
    { id: 'vocabulary', label: 'Vocabulary', icon: BookOpen },
    { id: 'lessons', label: 'Lessons', icon: ListChecks },
    { id: 'writing', label: 'Writing', icon: PenTool },
    { id: 'listening', label: 'Listening Quiz', icon: Volume2 },
    { id: 'quiz', label: 'Verification', icon: Award },
  ];

  const isDark = theme === 'dark';

  return (
    <header className="sticky top-0 z-40 bg-zen-surface/90 dark:bg-zen-dark-bg/95 backdrop-blur-md border-b border-zen-surface-high dark:border-zen-dark-border shadow-zen-sm transition-colors duration-300">

      <div className="mx-auto max-w-[1440px] px-4 sm:px-6">

        {/* ===================== DESKTOP ===================== */}

        <div className="hidden h-16 items-center gap-3 lg:flex">

          <div
            onClick={() => setActiveTab('dashboard')}
            className="group flex shrink-0 cursor-pointer items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-zen-primary dark:bg-zen-dark-primary text-white dark:text-zen-dark-on-primary flex items-center justify-center font-kana font-bold text-xl shadow-zen-sm group-hover:scale-105 transition-transform">
              あ
            </div>

            <div className="hidden xl:block">
              <h1 className="font-headline font-semibold text-lg text-zen-text dark:text-zen-dark-primary leading-tight tracking-tight flex items-center gap-1.5">
                Zen Kana
                <Sparkles className="w-4 h-4 text-zen-secondary dark:text-zen-dark-primary animate-pulse" />
              </h1>

              <p className="text-xs text-zen-text-muted dark:text-zen-dark-text-muted hidden sm:block">
                Japanese Kana Study Studio
              </p>
            </div>
          </div>

          <div className="order-3 flex shrink-0 items-center gap-1 sm:gap-3">

            <div className="flex items-center bg-zen-surface-container dark:bg-zen-dark-surface p-1 rounded-full border border-zen-border/40 dark:border-zen-dark-border">
              <button
                onClick={() => setScriptMode('hiragana')}
                className={`px-2 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-xs font-semibold transition-all ${
                  scriptMode === 'hiragana'
                    ? 'bg-zen-primary dark:bg-zen-dark-primary text-white dark:text-zen-dark-on-primary shadow-zen-sm'
                    : 'text-zen-text-muted dark:text-zen-dark-text-muted hover:text-zen-text dark:hover:text-zen-dark-text'
                }`}
              >
                Hiragana (あ)
              </button>

              <button
                onClick={() => setScriptMode('katakana')}
                className={`px-2 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-xs font-semibold transition-all ${
                  scriptMode === 'katakana'
                    ? 'bg-zen-secondary dark:bg-zen-dark-secondary text-white dark:text-zen-dark-on-primary shadow-zen-sm'
                    : 'text-zen-text-muted dark:text-zen-dark-text-muted hover:text-zen-text dark:hover:text-zen-dark-text'
                }`}
              >
                Katakana (ア)
              </button>
            </div>

            <button
              onClick={toggleTheme}
              className="shrink-0 p-2 sm:p-2.5 rounded-xl bg-zen-surface-container dark:bg-zen-dark-surface border border-zen-border/40 dark:border-zen-dark-border text-zen-primary dark:text-zen-dark-primary hover:scale-105 active:scale-95 transition-all shadow-zen-sm"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? (
                <Sun className="w-4 h-4 sm:w-5 sm:h-5 fill-zen-dark-primary text-zen-dark-primary" />
              ) : (
                <Moon className="w-4 h-4 sm:w-5 sm:h-5 fill-zen-primary text-zen-primary" />
              )}
            </button>
          </div>

          <nav className="order-2 hidden min-w-0 flex-1 overflow-x-auto lg:block">
            <div className="flex min-w-max items-center justify-center gap-0.5 px-1">

              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center gap-1.5 whitespace-nowrap rounded-xl px-2.5 py-2 text-sm font-medium transition-all xl:px-3 ${
                      isActive
                        ? 'bg-zen-primary/10 dark:bg-zen-dark-surface-high text-zen-primary dark:text-zen-dark-primary font-semibold border border-transparent dark:border-zen-dark-border'
                        : 'text-zen-text-muted dark:text-zen-dark-text-muted hover:bg-zen-surface-high dark:hover:bg-zen-dark-surface hover:text-zen-text dark:hover:text-zen-dark-text'
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 ${
                        isActive
                          ? 'text-zen-primary dark:text-zen-dark-primary'
                          : ''
                      }`}
                    />

                    {item.label}
                  </button>
                );
              })}

            </div>
          </nav>

        </div>

        {/* ===================== MOBILE HEADER ===================== */}

        <div
          className="flex h-14 items-center justify-between lg:hidden"
          style={{
            paddingLeft: 'max(1rem, env(safe-area-inset-left))',
            paddingRight: 'max(1rem, env(safe-area-inset-right))',
            paddingTop: 'env(safe-area-inset-top)',
          }}
        >

          <button
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-zen-text dark:text-zen-dark-text shrink-0"
            aria-label={
              isMobileMenuOpen
                ? 'Close study controls'
                : 'Open study controls'
            }
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            className="flex-1 min-w-0 px-3 text-center"
          >
            <span className="block truncate font-headline text-xl font-bold text-zen-primary dark:text-zen-dark-primary">
              Zen Kana
            </span>
          </button>

          <button
            onClick={toggleTheme}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-zen-primary dark:text-zen-dark-primary shrink-0"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>

        </div>

      </div>

      {/* ===================== MOBILE MENU ===================== */}

      {isMobileMenuOpen && (
        <div className="border-t border-zen-surface-high bg-white px-4 py-3 shadow-zen-sm dark:border-zen-dark-border dark:bg-zen-dark-surface lg:hidden">

          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-zen-text-muted dark:text-zen-dark-text-muted">
            Writing system
          </p>

          <div className="grid grid-cols-2 gap-2">

            <button
              onClick={() => {
                setScriptMode('hiragana');
                setIsMobileMenuOpen(false);
              }}
              className={`rounded-xl px-3 py-2.5 text-sm font-bold ${
                scriptMode === 'hiragana'
                  ? 'bg-zen-primary text-white dark:bg-zen-dark-primary dark:text-zen-dark-on-primary'
                  : 'bg-zen-surface-container text-zen-text dark:bg-zen-dark-surface-high dark:text-zen-dark-text'
              }`}
            >
              Hiragana
            </button>

            <button
              onClick={() => {
                setScriptMode('katakana');
                setIsMobileMenuOpen(false);
              }}
              className={`rounded-xl px-3 py-2.5 text-sm font-bold ${
                scriptMode === 'katakana'
                  ? 'bg-zen-secondary text-white dark:bg-zen-dark-secondary dark:text-zen-dark-on-primary'
                  : 'bg-zen-surface-container text-zen-text dark:bg-zen-dark-surface-high dark:text-zen-dark-text'
              }`}
            >
              Katakana
            </button>

          </div>

        </div>
      )}

      {/* ===================== MOBILE BOTTOM NAV ===================== */}

      <div
        className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-zen-dark-surface/95 backdrop-blur-lg border-t border-zen-surface-high dark:border-zen-dark-border px-2 py-2 shadow-lg"
        style={{
          paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))',
        }}
      >
        <div className="flex items-center justify-around overflow-x-auto">

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg transition-all min-w-[52px] ${
                  isActive
                    ? 'text-zen-primary dark:text-zen-dark-primary font-semibold scale-105'
                    : 'text-zen-text-muted dark:text-zen-dark-text-muted hover:text-zen-text dark:hover:text-zen-dark-text'
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${
                    isActive ? 'stroke-[2.5]' : 'stroke-2'
                  }`}
                />

                <span className="text-[9px] mt-0.5 tracking-tight text-center leading-tight">
                  {item.label}
                </span>
              </button>
            );
          })}

        </div>
      </div>

    </header>
  );
}