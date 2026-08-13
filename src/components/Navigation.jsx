import React, { useState, useEffect } from 'react';
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
  ChevronRight,
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

  // Prevent background scrolling when mobile menu drawer is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, desc: 'Overview & Study Stats' },
    { id: 'table', label: 'Kana Table', icon: Grid, desc: 'Interactive Syllabary' },
    { id: 'flashcards', label: 'Flashcards', icon: Layers, desc: 'Space Repetition Memory' },
    { id: 'vocabulary', label: 'Vocabulary', icon: BookOpen, desc: 'Words & Pronunciation' },
    { id: 'lessons', label: 'Lessons', icon: ListChecks, desc: 'Guided Study Path' },
    { id: 'writing', label: 'Writing', icon: PenTool, desc: 'Stroke Order & Canvas' },
    { id: 'listening', label: 'Listening Quiz', icon: Volume2, desc: 'Audio Recognition' },
    { id: 'quiz', label: 'Verification', icon: Award, desc: 'Knowledge Assessment' },
  ];

  // 4 Primary items for the mobile bottom nav + Menu toggle
  const primaryBottomNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'table', label: 'Kana', icon: Grid },
    { id: 'flashcards', label: 'Cards', icon: Layers },
    { id: 'lessons', label: 'Lessons', icon: ListChecks },
  ];

  const isDark = theme === 'dark';

  const handleNavClick = (itemId) => {
    setActiveTab(itemId);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-zen-surface/90 dark:bg-zen-dark-bg/95 backdrop-blur-md border-b border-zen-surface-high dark:border-zen-dark-border shadow-zen-sm transition-colors duration-300">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6">

          {/* ===================== DESKTOP NAVIGATION HEADER ===================== */}

          <div className="hidden h-16 items-center gap-3 lg:flex">
            {/* Logo */}
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

            {/* Top Bar Actions (Script switch & Theme) */}
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

            {/* Desktop Navigation Links */}
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

          {/* ===================== MOBILE HEADER TOP BAR ===================== */}

          <div
            className="flex h-14 items-center justify-between lg:hidden"
            style={{
              paddingLeft: 'max(0.5rem, env(safe-area-inset-left))',
              paddingRight: 'max(0.5rem, env(safe-area-inset-right))',
              paddingTop: 'env(safe-area-inset-top)',
            }}
          >
            {/* Hamburger button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-zen-surface-container dark:bg-zen-dark-surface border border-zen-border/40 dark:border-zen-dark-border text-zen-text dark:text-zen-dark-text active:scale-95 transition-transform"
              aria-label="Apri menu navigazione"
              aria-expanded={isMobileMenuOpen}
            >
              <Menu className="h-5 w-5 text-zen-primary dark:text-zen-dark-primary" />
            </button>

            {/* Brand Logo & Name */}
            <button
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-2 px-2 text-center"
            >
              <div className="w-7 h-7 rounded-lg bg-zen-primary dark:bg-zen-dark-primary text-white dark:text-zen-dark-on-primary flex items-center justify-center font-kana font-bold text-sm shadow-zen-sm">
                あ
              </div>
              <span className="font-headline text-lg font-bold text-zen-primary dark:text-zen-dark-primary tracking-tight">
                Zen Kana
              </span>
            </button>

            {/* Script mode badge & Theme toggle */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() =>
                  setScriptMode((prev) => (prev === 'hiragana' ? 'katakana' : 'hiragana'))
                }
                className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-zen-primary/10 dark:bg-zen-dark-primary/20 text-zen-primary dark:text-zen-dark-primary border border-zen-primary/20 dark:border-zen-dark-primary/30 transition-all active:scale-95"
                title="Cambia sistema di scrittura"
              >
                {scriptMode === 'hiragana' ? 'あ Hiragana' : 'ア Katakana'}
              </button>

              <button
                onClick={toggleTheme}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-zen-surface-container dark:bg-zen-dark-surface border border-zen-border/40 dark:border-zen-dark-border text-zen-primary dark:text-zen-dark-primary active:scale-95 transition-transform"
                title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDark ? <Sun className="h-4 w-4 text-zen-dark-primary" /> : <Moon className="h-4 w-4 text-zen-primary" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ===================== MOBILE HAMBURGER MENU DRAWER OVERLAY ===================== */}

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop Blur Overlay */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 animate-fadeIn"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Sliding Drawer Container */}
          <aside className="relative z-50 w-full max-w-[310px] bg-white dark:bg-zen-dark-bg border-r border-zen-surface-high dark:border-zen-dark-border flex flex-col h-full shadow-2xl overflow-y-auto animate-slideRight">
            {/* Drawer Header */}
            <div className="p-4 border-b border-zen-surface-high dark:border-zen-dark-border flex items-center justify-between bg-zen-surface dark:bg-zen-dark-surface">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-zen-primary dark:bg-zen-dark-primary text-white dark:text-zen-dark-on-primary flex items-center justify-center font-kana font-bold text-lg shadow-zen-sm">
                  あ
                </div>
                <div>
                  <h2 className="font-headline font-bold text-base text-zen-text dark:text-zen-dark-text leading-tight">
                    Zen Kana Studio
                  </h2>
                  <p className="text-[11px] text-zen-text-muted dark:text-zen-dark-text-muted">
                    Menu di Navigazione
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-xl text-zen-text-muted dark:text-zen-dark-text-muted hover:bg-zen-surface-container dark:hover:bg-zen-dark-surface-high transition-colors"
                aria-label="Chiudi menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Writing System Selector Inside Drawer */}
            <div className="p-4 border-b border-zen-surface-high dark:border-zen-dark-border bg-zen-surface-container/50 dark:bg-zen-dark-surface/40">
              <p className="text-[11px] font-bold uppercase tracking-wider text-zen-text-muted dark:text-zen-dark-text-muted mb-2">
                Sistema di Scrittura
              </p>
              <div className="grid grid-cols-2 gap-2 bg-zen-surface-container dark:bg-zen-dark-surface p-1 rounded-xl border border-zen-border/40 dark:border-zen-dark-border">
                <button
                  onClick={() => setScriptMode('hiragana')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    scriptMode === 'hiragana'
                      ? 'bg-zen-primary text-white dark:bg-zen-dark-primary dark:text-zen-dark-on-primary shadow-zen-sm'
                      : 'text-zen-text-muted dark:text-zen-dark-text-muted hover:text-zen-text dark:hover:text-zen-dark-text'
                  }`}
                >
                  <span className="font-kana font-normal text-sm">あ</span> Hiragana
                </button>

                <button
                  onClick={() => setScriptMode('katakana')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    scriptMode === 'katakana'
                      ? 'bg-zen-secondary text-white dark:bg-zen-dark-secondary dark:text-zen-dark-on-primary shadow-zen-sm'
                      : 'text-zen-text-muted dark:text-zen-dark-text-muted hover:text-zen-text dark:hover:text-zen-dark-text'
                  }`}
                >
                  <span className="font-kana font-normal text-sm">ア</span> Katakana
                </button>
              </div>
            </div>

            {/* Navigation Section Links List */}
            <div className="p-3 flex-1 space-y-1">
              <p className="px-3 pt-2 pb-1 text-[11px] font-bold uppercase tracking-wider text-zen-text-muted dark:text-zen-dark-text-muted">
                Sezioni di Studio
              </p>

              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                      isActive
                        ? 'bg-zen-primary/10 dark:bg-zen-dark-surface-high text-zen-primary dark:text-zen-dark-primary font-bold border-l-4 border-zen-primary dark:border-zen-dark-primary'
                        : 'text-zen-text dark:text-zen-dark-text hover:bg-zen-surface-container dark:hover:bg-zen-dark-surface font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg ${
                          isActive
                            ? 'bg-zen-primary text-white dark:bg-zen-dark-primary dark:text-zen-dark-on-primary'
                            : 'bg-zen-surface-container dark:bg-zen-dark-surface text-zen-text-muted dark:text-zen-dark-text-muted'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <span className="block text-sm leading-tight">{item.label}</span>
                        <span className="block text-[10px] text-zen-text-muted dark:text-zen-dark-text-muted font-normal mt-0.5">
                          {item.desc}
                        </span>
                      </div>
                    </div>

                    <ChevronRight className={`w-4 h-4 ${isActive ? 'text-zen-primary dark:text-zen-dark-primary' : 'text-zen-text-muted/40'}`} />
                  </button>
                );
              })}
            </div>

            {/* Drawer Footer Controls */}
            <div className="p-4 border-t border-zen-surface-high dark:border-zen-dark-border bg-zen-surface dark:bg-zen-dark-surface space-y-3">
              <button
                onClick={toggleTheme}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-zen-surface-container dark:bg-zen-dark-surface border border-zen-border/40 dark:border-zen-dark-border text-zen-text dark:text-zen-dark-text text-xs font-semibold"
              >
                <div className="flex items-center gap-2">
                  {isDark ? <Sun className="w-4 h-4 text-zen-dark-primary" /> : <Moon className="w-4 h-4 text-zen-primary" />}
                  <span>Modalità Tema</span>
                </div>
                <span className="text-[11px] text-zen-text-muted dark:text-zen-dark-text-muted">
                  {isDark ? 'Scuro' : 'Chiaro'}
                </span>
              </button>

              <div className="text-center text-[10px] text-zen-text-muted dark:text-zen-dark-text-muted">
                Zen Kana PWA Studio — Responsive Mobile Viewport
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* ===================== MOBILE BOTTOM NAVIGATION BAR ===================== */}

      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-zen-dark-surface/95 backdrop-blur-lg border-t border-zen-surface-high dark:border-zen-dark-border px-3 py-1.5 shadow-lg"
        style={{
          paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))',
        }}
        aria-label="Navigazione rapida mobile"
      >
        <div className="flex items-center justify-around max-w-md mx-auto">
          {primaryBottomNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
                  isActive
                    ? 'text-zen-primary dark:text-zen-dark-primary font-bold scale-105'
                    : 'text-zen-text-muted dark:text-zen-dark-text-muted hover:text-zen-text dark:hover:text-zen-dark-text font-medium'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                <span className="text-[10px] mt-0.5 tracking-tight text-center leading-tight">
                  {item.label}
                </span>
              </button>
            );
          })}

          {/* Menu Hamburger Trigger Button in Bottom Bar */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="flex flex-col items-center justify-center py-1 px-3 rounded-xl text-zen-text-muted dark:text-zen-dark-text-muted hover:text-zen-text dark:hover:text-zen-dark-text font-medium transition-all"
            aria-label="Apri menu completo"
          >
            <Menu className="w-5 h-5 stroke-2" />
            <span className="text-[10px] mt-0.5 tracking-tight text-center leading-tight">
              Menu
            </span>
          </button>
        </div>
      </nav>
    </>
  );
}