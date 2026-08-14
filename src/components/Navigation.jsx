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
  Download,
  Share,
  CheckCircle2,
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
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isIos, setIsIos] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);

  // Detect iOS and Standalone PWA mode
  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIpadOs = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent) || isIpadOs;
    const standalone = window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches;

    setIsIos(isIosDevice);
    setIsStandalone(standalone);

    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  // Prevent background scrolling when mobile menu drawer is open
  useEffect(() => {
    if (isMobileMenuOpen || showInstallModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen, showInstallModal]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log('[PWA Installer] User outcome:', outcome);
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else {
      setShowInstallModal(true);
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', shortLabel: 'Dashboard', icon: LayoutDashboard, desc: 'Overview & Study Stats' },
    { id: 'table', label: 'Kana Table', shortLabel: 'Kana', icon: Grid, desc: 'Interactive Syllabary' },
    { id: 'flashcards', label: 'Flashcards', shortLabel: 'Cards', icon: Layers, desc: 'Space Repetition Memory' },
    { id: 'activeStudy', label: 'Active Study', shortLabel: 'Active Study', icon: Sparkles, desc: 'Transliteration Training' },
    { id: 'vocabulary', label: 'Vocabulary', shortLabel: 'Vocab', icon: BookOpen, desc: 'Words & Pronunciation' },
    { id: 'lessons', label: 'Lessons', shortLabel: 'Lessons', icon: ListChecks, desc: 'Guided Study Path' },
    { id: 'writing', label: 'Writing', shortLabel: 'Writing', icon: PenTool, desc: 'Stroke Order & Canvas' },
    { id: 'listening', label: 'Listening', shortLabel: 'Listening', icon: Volume2, desc: 'Audio Recognition' },
    { id: 'quiz', label: 'Quiz', shortLabel: 'Quiz', icon: Award, desc: 'Knowledge Assessment' },
  ];

  // 4 Primary items for the mobile bottom nav + Menu toggle
  const primaryBottomNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'table', label: 'Kana', icon: Grid },
    { id: 'flashcards', label: 'Cards', icon: Layers },
    { id: 'activeStudy', label: 'Active', icon: Sparkles },
    { id: 'lessons', label: 'Lessons', icon: ListChecks },
  ];

  const isDark = theme === 'dark';

  const handleNavClick = (itemId) => {
    setActiveTab(itemId);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-zen-surface/95 dark:bg-zen-dark-bg/95 backdrop-blur-md border-b border-zen-surface-high dark:border-zen-dark-border shadow-zen-sm transition-colors duration-300">
        <div className="mx-auto max-w-[1600px] px-3 sm:px-5">

          {/* ===================== DESKTOP NAVIGATION HEADER ===================== */}

          <div className="hidden h-16 items-center justify-between gap-2 xl:gap-4 lg:flex">
            {/* Logo */}
            <div
              onClick={() => setActiveTab('dashboard')}
              className="group flex shrink-0 cursor-pointer items-center gap-2.5"
            >
              <div className="w-9 h-9 2xl:w-10 2xl:h-10 rounded-xl bg-zen-primary dark:bg-zen-dark-primary text-white dark:text-zen-dark-on-primary flex items-center justify-center font-kana font-bold text-lg 2xl:text-xl shadow-zen-sm group-hover:scale-105 transition-transform">
                あ
              </div>

              <div className="hidden 2xl:block">
                <h1 className="font-headline font-semibold text-base 2xl:text-lg text-zen-text dark:text-zen-dark-primary leading-tight tracking-tight flex items-center gap-1.5">
                  Zen Kana
                  <Sparkles className="w-3.5 h-3.5 text-zen-secondary dark:text-zen-dark-primary animate-pulse" />
                </h1>
                <p className="text-[11px] text-zen-text-muted dark:text-zen-dark-text-muted">
                  Kana Study Studio
                </p>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="min-w-0 flex-1 overflow-x-auto no-scrollbar py-1">
              <div className="flex items-center justify-center gap-1 px-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`flex items-center gap-1.5 whitespace-nowrap rounded-xl px-2 py-1.5 2xl:px-3 2xl:py-2 text-xs 2xl:text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-zen-primary/10 dark:bg-zen-dark-surface-high text-zen-primary dark:text-zen-dark-primary font-bold border border-zen-primary/20 dark:border-zen-dark-border shadow-sm'
                          : 'text-zen-text-muted dark:text-zen-dark-text-muted hover:bg-zen-surface-high dark:hover:bg-zen-dark-surface hover:text-zen-text dark:hover:text-zen-dark-text'
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 shrink-0 ${
                          isActive
                            ? 'text-zen-primary dark:text-zen-dark-primary'
                            : ''
                        }`}
                      />
                      <span className="hidden 2xl:inline">{item.label}</span>
                      <span className="inline 2xl:hidden">{item.shortLabel}</span>
                    </button>
                  );
                })}
              </div>
            </nav>

            {/* Top Bar Actions (Script switch, Install PWA & Theme) */}
            <div className="flex shrink-0 items-center gap-2">
              {/* Script Switcher */}
              <div className="flex items-center bg-zen-surface-container dark:bg-zen-dark-surface p-1 rounded-full border border-zen-border/40 dark:border-zen-dark-border">
                <button
                  onClick={() => setScriptMode('hiragana')}
                  className={`px-2.5 py-1 2xl:px-3 2xl:py-1.5 rounded-full text-xs font-semibold transition-all ${
                    scriptMode === 'hiragana'
                      ? 'bg-zen-primary dark:bg-zen-dark-primary text-white dark:text-zen-dark-on-primary shadow-zen-sm'
                      : 'text-zen-text-muted dark:text-zen-dark-text-muted hover:text-zen-text dark:hover:text-zen-dark-text'
                  }`}
                  title="Switch to Hiragana"
                >
                  <span className="2xl:hidden">あ Hira</span>
                  <span className="hidden 2xl:inline">Hiragana (あ)</span>
                </button>

                <button
                  onClick={() => setScriptMode('katakana')}
                  className={`px-2.5 py-1 2xl:px-3 2xl:py-1.5 rounded-full text-xs font-semibold transition-all ${
                    scriptMode === 'katakana'
                      ? 'bg-zen-secondary dark:bg-zen-dark-secondary text-white dark:text-zen-dark-on-primary shadow-zen-sm'
                      : 'text-zen-text-muted dark:text-zen-dark-text-muted hover:text-zen-text dark:hover:text-zen-dark-text'
                  }`}
                  title="Switch to Katakana"
                >
                  <span className="2xl:hidden">ア Kata</span>
                  <span className="hidden 2xl:inline">Katakana (ア)</span>
                </button>
              </div>

              {/* Install PWA Icon Button */}
              {!isStandalone && (
                <button
                  onClick={handleInstallClick}
                  className="relative shrink-0 p-2 rounded-xl bg-zen-surface-container dark:bg-zen-dark-surface border border-zen-border/40 dark:border-zen-dark-border text-zen-primary dark:text-zen-dark-primary hover:scale-105 active:scale-95 transition-all shadow-zen-sm"
                  title="Install Zen Kana PWA"
                  aria-label="Install Zen Kana PWA"
                >
                  <Download className="w-4 h-4 2xl:w-5 2xl:h-5 text-zen-primary dark:text-zen-dark-primary" />
                  {deferredPrompt && (
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-zen-dark-bg animate-pulse" />
                  )}
                </button>
              )}

              {/* Dark / Light Mode Toggle */}
              <button
                onClick={toggleTheme}
                className="shrink-0 p-2 rounded-xl bg-zen-surface-container dark:bg-zen-dark-surface border border-zen-border/40 dark:border-zen-dark-border text-zen-primary dark:text-zen-dark-primary hover:scale-105 active:scale-95 transition-all shadow-zen-sm"
                title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDark ? (
                  <Sun className="w-4 h-4 2xl:w-5 2xl:h-5 fill-zen-dark-primary text-zen-dark-primary" />
                ) : (
                  <Moon className="w-4 h-4 2xl:w-5 2xl:h-5 fill-zen-primary text-zen-primary" />
                )}
              </button>
            </div>
          </div>

          {/* ===================== MOBILE HEADER TOP BAR ===================== */}

          <div
            className="flex h-14 items-center justify-between lg:hidden"
            style={{
              paddingLeft: 'max(0.25rem, env(safe-area-inset-left))',
              paddingRight: 'max(0.25rem, env(safe-area-inset-right))',
              paddingTop: 'env(safe-area-inset-top)',
            }}
          >
            {/* Hamburger button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-zen-surface-container dark:bg-zen-dark-surface border border-zen-border/40 dark:border-zen-dark-border text-zen-text dark:text-zen-dark-text active:scale-95 transition-transform"
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

            {/* Actions: Script mode badge, Install icon & Theme toggle */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() =>
                  setScriptMode((prev) => (prev === 'hiragana' ? 'katakana' : 'hiragana'))
                }
                className="px-2 py-1 rounded-full text-[11px] font-bold bg-zen-primary/10 dark:bg-zen-dark-primary/20 text-zen-primary dark:text-zen-dark-primary border border-zen-primary/20 dark:border-zen-dark-primary/30 transition-all active:scale-95"
                title="Cambia sistema di scrittura"
              >
                {scriptMode === 'hiragana' ? 'あ Hira' : 'ア Kata'}
              </button>

              {!isStandalone && (
                <button
                  onClick={handleInstallClick}
                  className="flex h-8 w-8 items-center justify-center rounded-xl bg-zen-surface-container dark:bg-zen-dark-surface border border-zen-border/40 dark:border-zen-dark-border text-zen-primary dark:text-zen-dark-primary active:scale-95 transition-transform"
                  title="Installa Zen Kana PWA"
                  aria-label="Installa Zen Kana PWA"
                >
                  <Download className="h-4 w-4 text-zen-primary dark:text-zen-dark-primary" />
                </button>
              )}

              <button
                onClick={toggleTheme}
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-zen-surface-container dark:bg-zen-dark-surface border border-zen-border/40 dark:border-zen-dark-border text-zen-primary dark:text-zen-dark-primary active:scale-95 transition-transform"
                title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDark ? <Sun className="h-4 w-4 text-zen-dark-primary" /> : <Moon className="h-4 w-4 text-zen-primary" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ===================== INSTALLATION HELP MODAL ===================== */}
      {showInstallModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-sm rounded-2xl bg-white dark:bg-zen-dark-surface p-6 shadow-2xl border border-zen-surface-high dark:border-zen-dark-border text-center space-y-4">
            <button
              onClick={() => setShowInstallModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-zen-text-muted hover:bg-zen-surface-container dark:hover:bg-zen-dark-surface-high transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 mx-auto rounded-2xl bg-zen-primary/10 dark:bg-zen-dark-primary/20 text-zen-primary dark:text-zen-dark-primary flex items-center justify-center">
              <Download className="w-6 h-6" />
            </div>

            <h3 className="font-headline text-lg font-bold text-zen-text dark:text-zen-dark-text">
              Installa Zen Kana PWA
            </h3>

            {isIos ? (
              <div className="space-y-3 text-xs text-zen-text-muted dark:text-zen-dark-text-muted text-left bg-zen-surface-container/50 dark:bg-zen-dark-surface-high/50 p-4 rounded-xl border border-zen-border/30">
                <div className="flex items-center gap-2 text-zen-text dark:text-zen-dark-text font-semibold">
                  <Share className="w-4 h-4 text-zen-primary dark:text-zen-dark-primary" />
                  <span>Istruzioni per iOS Safari:</span>
                </div>
                <ol className="list-decimal list-inside space-y-1.5">
                  <li>Tocca l'icona <strong>Condividi</strong> (Share) nella barra del browser.</li>
                  <li>Scorri e tocca <strong>"Aggiungi a schermata Home"</strong>.</li>
                  <li>Conferma toccando <strong>Aggiungi</strong> in alto a destra.</li>
                </ol>
              </div>
            ) : (
              <div className="text-xs text-zen-text-muted dark:text-zen-dark-text-muted space-y-2 text-left bg-zen-surface-container/50 dark:bg-zen-dark-surface-high/50 p-4 rounded-xl border border-zen-border/30">
                <div className="flex items-center gap-2 text-zen-text dark:text-zen-dark-text font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-zen-primary dark:text-zen-dark-primary" />
                  <span>Browser Desktop / Android:</span>
                </div>
                <p>
                  Clicca sull'icona di installazione nella barra degli indirizzi del browser oppure dal menu del browser seleziona <strong>"Installa app"</strong>.
                </p>
              </div>
            )}

            <button
              onClick={() => setShowInstallModal(false)}
              className="w-full py-2.5 bg-zen-primary dark:bg-zen-dark-primary text-white dark:text-zen-dark-on-primary rounded-xl font-bold text-xs uppercase tracking-wider shadow-sm hover:opacity-90 transition-opacity"
            >
              Ho capito
            </button>
          </div>
        </div>
      )}

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
            <div className="p-4 border-t border-zen-surface-high dark:border-zen-dark-border bg-zen-surface dark:bg-zen-dark-surface space-y-2.5">
              {!isStandalone && (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleInstallClick();
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-zen-primary/10 dark:bg-zen-dark-primary/20 text-zen-primary dark:text-zen-dark-primary text-xs font-semibold border border-zen-primary/20 dark:border-zen-dark-primary/30"
                >
                  <div className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    <span>Installa Applicazione PWA</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider">Installa</span>
                </button>
              )}

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
            </div>
          </aside>
        </div>
      )}

      {/* ===================== MOBILE BOTTOM NAVIGATION BAR ===================== */}

      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-zen-dark-surface/95 backdrop-blur-lg border-t border-zen-surface-high dark:border-zen-dark-border px-2 py-1.5 shadow-lg"
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
                className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
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
            className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-zen-text-muted dark:text-zen-dark-text-muted hover:text-zen-text dark:hover:text-zen-dark-text font-medium transition-all"
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