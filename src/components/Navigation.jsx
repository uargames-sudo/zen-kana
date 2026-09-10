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
  Globe,
  HelpCircle,
  Brain,
  Gamepad2,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Navigation({
  activeTab,
  setActiveTab,
  scriptMode,
  setScriptMode,
  theme,
  toggleTheme,
}) {
  const { lang, setLang, toggleLang, t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isIos, setIsIos] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);

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
    { id: 'dashboard', label: t('nav.dashboard'), shortLabel: t('nav.dashboard'), icon: LayoutDashboard, desc: t('nav.dashboardDesc') },
    { id: 'table', label: t('nav.table'), shortLabel: t('nav.tableShort'), icon: Grid, desc: t('nav.tableDesc') },
    { id: 'flashcards', label: t('nav.flashcards'), shortLabel: t('nav.flashcardsShort'), icon: Layers, desc: t('nav.flashcardsDesc') },
    { id: 'activeStudy', label: t('nav.activeStudy'), shortLabel: t('nav.activeStudyShort'), icon: Sparkles, desc: t('nav.activeStudyDesc') },
    { id: 'vocabulary', label: t('nav.vocabulary'), shortLabel: t('nav.vocabularyShort'), icon: BookOpen, desc: t('nav.vocabularyDesc') },
    { id: 'lessons', label: t('nav.lessons'), shortLabel: t('nav.lessonsShort'), icon: ListChecks, desc: t('nav.lessonsDesc') },
    { id: 'writing', label: t('nav.writing'), shortLabel: t('nav.writingShort'), icon: PenTool, desc: t('nav.writingDesc') },
    { id: 'listening', label: t('nav.listening'), shortLabel: t('nav.listeningShort'), icon: Volume2, desc: t('nav.listeningDesc') },
    { id: 'quiz', label: t('nav.quiz'), shortLabel: t('nav.quizShort'), icon: Award, desc: t('nav.quizDesc') },
    { id: 'games', label: t('nav.games'), shortLabel: t('nav.gamesShort'), icon: Gamepad2, desc: t('nav.gamesDesc') },
  ];

  // 5 Primary items for the mobile bottom nav + Menu toggle
  const primaryBottomNavItems = [
    { id: 'dashboard', label: t('nav.dashboard'), icon: LayoutDashboard },
    { id: 'table', label: t('nav.tableShort'), icon: Grid },
    { id: 'flashcards', label: t('nav.flashcardsShort'), icon: Layers },
    { id: 'activeStudy', label: t('nav.activeStudyShort'), icon: Sparkles },
    { id: 'lessons', label: t('nav.lessonsShort'), icon: ListChecks },
  ];

  const isDark = theme === 'dark';

  const handleNavClick = (itemId) => {
    setActiveTab(itemId);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-zen-surface dark:bg-zen-dark-bg border-b border-zen-border/40 dark:border-zen-dark-border shadow-zen-sm transition-colors duration-300">
        <div className="mx-auto max-w-[1600px] px-3 sm:px-5">

          {/* ===================== DESKTOP NAVIGATION HEADER ===================== */}

          <div className="hidden h-16 items-center justify-between gap-3 xl:flex flex-nowrap">
            {/* Logo */}
            <div
              onClick={() => setActiveTab('dashboard')}
              className="group flex flex-1 min-w-0 cursor-pointer items-center gap-2.5"
            >
              <div className="w-8 h-8 bg-zen-primary dark:bg-zen-dark-primary text-white dark:text-zen-dark-on-primary flex items-center justify-center font-kana font-bold text-base shadow-zen-sm group-hover:scale-105 transition-transform shrink-0 border border-transparent">
                あ
              </div>

              <div className="hidden 2xl:block shrink-0">
                <h1 className="font-headline font-bold text-sm text-zen-text dark:text-zen-dark-primary leading-tight tracking-tight flex items-center gap-1">
                  {t('nav.appName')}
                  <Sparkles className="w-3 h-3 text-zen-secondary dark:text-zen-dark-primary" />
                </h1>
                <p className="text-2xs text-zen-text-muted dark:text-zen-dark-text-muted">
                  {t('nav.appSubtitle')}
                </p>
              </div>
            </div>

            {/* Desktop Navigation Links (Icon-only for inactive, full for active, hover reveal) */}
            <nav className="min-w-0 shrink-0 flex items-center justify-center px-1">
              <div className="flex items-center gap-1 bg-zen-surface-container/60 dark:bg-zen-dark-surface p-1 border border-zen-border/40 dark:border-zen-dark-border flex-nowrap">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      title={item.label}
                      aria-label={item.label}
                      className={`group relative flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium transition-all duration-150 shrink-0 cursor-pointer border ${
                        isActive
                          ? 'bg-zen-primary/10 dark:bg-zen-dark-primary/15 text-zen-primary dark:text-zen-dark-primary font-bold border-zen-primary/30 dark:border-zen-dark-primary/40 shadow-sm'
                          : 'text-zen-text-muted dark:text-zen-dark-text-muted border-transparent hover:bg-zen-surface-high dark:hover:bg-zen-dark-bg hover:text-zen-primary dark:hover:text-zen-dark-primary'
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-transform duration-150 group-hover:scale-105 ${
                          isActive
                            ? 'text-zen-primary dark:text-zen-dark-primary'
                            : ''
                        }`}
                      />
                      {/* Name visible if active, or smoothly revealed on mouse over */}
                      <span
                        className={`whitespace-nowrap transition-all duration-200 overflow-hidden select-none ${
                          isActive
                            ? 'max-w-[160px] opacity-100'
                            : 'max-w-0 opacity-0 group-hover:max-w-[160px] group-hover:opacity-100 group-hover:ml-0.5'
                        }`}
                      >
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </nav>

            {/* Top Bar Actions (Script switch, Language, Install PWA & Theme) */}
            <div className="flex flex-1 min-w-0 justify-end items-center gap-2">
              {/* Script Switcher */}
              <div className="flex items-center bg-zen-surface-container dark:bg-zen-dark-surface p-0.5 border border-zen-border/40 dark:border-zen-dark-border shrink-0">
                <button
                  onClick={() => setScriptMode('hiragana')}
                  className={`px-2.5 py-1 text-xs font-semibold transition-all flex items-center justify-center min-w-[32px] cursor-pointer border ${
                    scriptMode === 'hiragana'
                      ? 'bg-zen-primary dark:bg-zen-dark-primary text-white dark:text-zen-dark-on-primary border-zen-primary/30 dark:border-zen-dark-primary/40 shadow-zen-sm'
                      : 'text-zen-text-muted dark:text-zen-dark-text-muted border-transparent hover:text-zen-text dark:hover:text-zen-dark-text'
                  }`}
                  title={t('nav.scriptHiragana')}
                >
                  <span className="hidden 2xl:inline">{t('nav.scriptHiragana')}</span>
                  <span className="2xl:hidden">{t('nav.scriptHiraganaShort')}</span>
                </button>

                <button
                  onClick={() => setScriptMode('katakana')}
                  className={`px-2.5 py-1 text-xs font-semibold transition-all flex items-center justify-center min-w-[32px] cursor-pointer border ${
                    scriptMode === 'katakana'
                      ? 'bg-zen-primary dark:bg-zen-dark-primary text-white dark:text-zen-dark-on-primary border-zen-primary/30 dark:border-zen-dark-primary/40 shadow-zen-sm'
                      : 'text-zen-text-muted dark:text-zen-dark-text-muted border-transparent hover:text-zen-text dark:hover:text-zen-dark-text'
                  }`}
                  title={t('nav.scriptKatakana')}
                >
                  <span className="hidden 2xl:inline">{t('nav.scriptKatakana')}</span>
                  <span className="2xl:hidden">{t('nav.scriptKatakanaShort')}</span>
                </button>
              </div>

              {/* Syllabary Guide Info Button */}
              <button
                onClick={() => setShowGuideModal(true)}
                className="shrink-0 p-2 bg-zen-surface-container dark:bg-zen-dark-surface border border-zen-border/40 dark:border-zen-dark-border text-zen-primary dark:text-zen-dark-primary hover:-translate-y-0.5 active:translate-y-0 transition-all shadow-zen-sm cursor-pointer"
                title={t('nav.guideButton')}
                aria-label={t('nav.guideButton')}
              >
                <HelpCircle className="w-4 h-4" />
              </button>

              {/* Language Switcher */}
              <button
                onClick={toggleLang}
                className="shrink-0 px-2.5 py-1.5 bg-zen-surface-container dark:bg-zen-dark-surface border border-zen-border/40 dark:border-zen-dark-border text-zen-primary dark:text-zen-dark-primary hover:-translate-y-0.5 active:translate-y-0 transition-all shadow-zen-sm font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                title={lang === 'it' ? 'Switch to English' : 'Passa all\'Italiano'}
                aria-label="Toggle Language"
              >
                <Globe className="w-3.5 h-3.5" />
                <span className="uppercase font-mono">{lang}</span>
              </button>

              {/* Install PWA Icon Button */}
              {!isStandalone && (
                <button
                  onClick={handleInstallClick}
                  className="relative shrink-0 p-2 bg-zen-surface-container dark:bg-zen-dark-surface border border-zen-border/40 dark:border-zen-dark-border text-zen-primary dark:text-zen-dark-primary hover:-translate-y-0.5 active:translate-y-0 transition-all shadow-zen-sm cursor-pointer"
                  title={t('nav.installApp')}
                  aria-label={t('nav.installApp')}
                >
                  <Download className="w-4 h-4 text-zen-primary dark:text-zen-dark-primary" />
                  {deferredPrompt && (
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-500 animate-pulse" />
                  )}
                </button>
              )}

              {/* Dark / Light Mode Toggle */}
              <button
                onClick={toggleTheme}
                className="shrink-0 p-2 bg-zen-surface-container dark:bg-zen-dark-surface border border-zen-border/40 dark:border-zen-dark-border text-zen-primary dark:text-zen-dark-primary hover:-translate-y-0.5 active:translate-y-0 transition-all shadow-zen-sm cursor-pointer"
                title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDark ? (
                  <Sun className="w-4 h-4 fill-zen-dark-primary text-zen-dark-primary" />
                ) : (
                  <Moon className="w-4 h-4 fill-zen-primary text-zen-primary" />
                )}
              </button>
            </div>
          </div>

          {/* ===================== TABLET & MOBILE HEADER TOP BAR ===================== */}

          <div
            className="flex h-14 items-center justify-between xl:hidden"
            style={{
              paddingLeft: 'max(0.25rem, env(safe-area-inset-left))',
              paddingRight: 'max(0.25rem, env(safe-area-inset-right))',
              paddingTop: 'env(safe-area-inset-top)',
            }}
          >
            {/* Hamburger button */}
            <div className="flex flex-1 items-center justify-start">
              <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="flex h-9 w-9 items-center justify-center bg-zen-surface-container dark:bg-zen-dark-surface border border-zen-border/40 dark:border-zen-dark-border text-zen-text dark:text-zen-dark-text active:scale-95 transition-transform"
              aria-label="Apri menu navigazione"
              aria-expanded={isMobileMenuOpen}
            >
              <Menu className="h-5 w-5 text-zen-primary dark:text-zen-dark-primary" />
              </button>
            </div>

            {/* Brand Logo & Name */}
            <button
              onClick={() => setActiveTab('dashboard')}
              className="flex shrink-0 items-center justify-center gap-2 px-1 text-center"
            >
              <div className="w-7 h-7 bg-zen-primary dark:bg-zen-dark-primary text-white dark:text-zen-dark-on-primary flex items-center justify-center font-kana font-bold text-sm shadow-zen-sm">
                あ
              </div>
              <span className="font-headline text-lg font-bold text-zen-primary dark:text-zen-dark-primary tracking-tight">
                {t('nav.appName')}
              </span>
            </button>

            {/* Actions: Guide, Script mode badge, Language, Install icon & Theme toggle */}
            <div className="flex flex-1 items-center justify-end gap-1.5">
              <button
                onClick={() => setShowGuideModal(true)}
                className="flex h-8 w-8 items-center justify-center bg-zen-surface-container dark:bg-zen-dark-surface border border-zen-border/40 dark:border-zen-dark-border text-zen-primary dark:text-zen-dark-primary active:scale-95 transition-transform"
                title={t('nav.guideButton')}
                aria-label={t('nav.guideButton')}
              >
                <HelpCircle className="h-4 w-4" />
              </button>

              <button
                onClick={() =>
                  setScriptMode((prev) => (prev === 'hiragana' ? 'katakana' : 'hiragana'))
                }
                className="px-2 py-1 text-xs font-bold bg-zen-primary/10 dark:bg-zen-dark-primary/20 text-zen-primary dark:text-zen-dark-primary border border-zen-primary/20 dark:border-zen-dark-primary/30 transition-all active:scale-95"
                title={t('nav.writingSystem')}
              >
                {scriptMode === 'hiragana' ? t('nav.scriptHiraganaShort') : t('nav.scriptKatakanaShort')}
              </button>

              <button
                onClick={toggleLang}
                className="flex h-8 px-2 items-center justify-center bg-zen-surface-container dark:bg-zen-dark-surface border border-zen-border/40 dark:border-zen-dark-border text-zen-primary dark:text-zen-dark-primary active:scale-95 transition-transform font-bold text-xs uppercase gap-1"
                title={t('nav.language')}
              >
                <Globe className="h-3 w-3" />
                <span>{lang}</span>
              </button>

              {!isStandalone && (
                <button
                  onClick={handleInstallClick}
                  className="flex h-8 w-8 items-center justify-center bg-zen-surface-container dark:bg-zen-dark-surface border border-zen-border/40 dark:border-zen-dark-border text-zen-primary dark:text-zen-dark-primary active:scale-95 transition-transform"
                  title={t('nav.installApp')}
                  aria-label={t('nav.installApp')}
                >
                  <Download className="h-4 w-4 text-zen-primary dark:text-zen-dark-primary" />
                </button>
              )}

              <button
                onClick={toggleTheme}
                className="flex h-8 w-8 items-center justify-center bg-zen-surface-container dark:bg-zen-dark-surface border border-zen-border/40 dark:border-zen-dark-border text-zen-primary dark:text-zen-dark-primary active:scale-95 transition-transform"
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
          <div className="relative w-full max-w-sm bg-white dark:bg-zen-dark-surface p-6 shadow-2xl border border-zen-border/60 dark:border-zen-dark-border text-center space-y-4">
            <button
              onClick={() => setShowInstallModal(false)}
              className="absolute top-4 right-4 p-1.5 text-zen-text-muted hover:bg-zen-surface-container dark:hover:bg-zen-dark-surface-high transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 mx-auto bg-zen-primary/10 dark:bg-zen-dark-primary/20 text-zen-primary dark:text-zen-dark-primary flex items-center justify-center border border-zen-primary/20 dark:border-zen-dark-primary/30">
              <Download className="w-6 h-6" />
            </div>

            <h3 className="font-headline text-lg font-bold text-zen-text dark:text-zen-dark-text">
              {t('nav.installModalTitle')}
            </h3>

            {isIos ? (
              <div className="space-y-3 text-xs text-zen-text-muted dark:text-zen-dark-text-muted text-left bg-zen-surface-container/50 dark:bg-zen-dark-surface-high/50 p-4 border border-zen-border/40">
                <div className="flex items-center gap-2 text-zen-text dark:text-zen-dark-text font-semibold">
                  <Share className="w-4 h-4 text-zen-primary dark:text-zen-dark-primary" />
                  <span>{t('nav.installModalIosTitle')}</span>
                </div>
                <ol className="list-decimal list-inside space-y-1.5">
                  <li>{t('nav.installModalIos1')}</li>
                  <li>{t('nav.installModalIos2')}</li>
                  <li>{t('nav.installModalIos3')}</li>
                </ol>
              </div>
            ) : (
              <div className="text-xs text-zen-text-muted dark:text-zen-dark-text-muted space-y-2 text-left bg-zen-surface-container/50 dark:bg-zen-dark-surface-high/50 p-4 border border-zen-border/40">
                <div className="flex items-center gap-2 text-zen-text dark:text-zen-dark-text font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-zen-primary dark:text-zen-dark-primary" />
                  <span>{t('nav.installModalDesktopTitle')}</span>
                </div>
                <p>
                  {t('nav.installModalDesktopText')}
                </p>
              </div>
            )}

            <button
              onClick={() => setShowInstallModal(false)}
              className="w-full py-2.5 bg-zen-primary dark:bg-zen-dark-primary text-white dark:text-zen-dark-on-primary font-bold text-xs uppercase tracking-wider shadow-sm hover:opacity-90 transition-opacity cursor-pointer border border-transparent"
            >
              {t('nav.gotIt')}
            </button>
          </div>
        </div>
      )}

      {/* ===================== KANA SYLLABARY GUIDE MODAL ===================== */}

      {showGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-xl bg-zen-surface-lowest dark:bg-zen-dark-surface p-6 sm:p-7 shadow-2xl border-2 border-zen-border/80 dark:border-zen-dark-border max-h-[90vh] overflow-y-auto space-y-5">
            <button
              onClick={() => setShowGuideModal(false)}
              aria-label={t('nav.closeGuide')}
              className="absolute top-4 right-4 p-2 text-zen-text-muted hover:text-zen-text hover:bg-zen-surface-container dark:hover:bg-zen-dark-surface-high transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 pr-8">
              <div className="w-11 h-11 bg-zen-primary/10 dark:bg-zen-dark-primary/20 text-zen-primary dark:text-zen-dark-primary flex items-center justify-center border border-zen-primary/30 dark:border-zen-dark-primary/40 shrink-0 shadow-sm">
                <HelpCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-headline text-xl font-bold text-zen-text dark:text-zen-dark-text leading-tight">
                  {t('nav.guideTitle')}
                </h3>
                <p className="text-xs text-zen-text-muted dark:text-zen-dark-text-muted mt-0.5 font-medium">
                  {t('nav.guideSubtitle')}
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-1">
              {/* 1. Hiragana Card */}
              <div className="p-4 bg-zen-surface-container/40 dark:bg-zen-dark-surface-high/60 border border-zen-border/50 dark:border-zen-dark-border shadow-2xs space-y-1.5">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 bg-zen-primary text-white flex items-center justify-center font-kana font-bold text-base shadow-sm shrink-0">
                    あ
                  </span>
                  <h4 className="font-bold text-sm sm:text-base font-headline text-zen-text dark:text-zen-dark-text">
                    {t('nav.guideHiraganaTitle')}
                  </h4>
                </div>
                <p className="text-xs text-zen-text/90 dark:text-zen-dark-text/90 leading-relaxed font-medium pl-10.5">
                  {t('nav.guideHiraganaDesc')}
                </p>
              </div>

              {/* 2. Katakana Card */}
              <div className="p-4 bg-zen-surface-container/40 dark:bg-zen-dark-surface-high/60 border border-zen-border/50 dark:border-zen-dark-border shadow-2xs space-y-1.5">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 bg-zen-secondary text-white flex items-center justify-center font-kana font-bold text-base shadow-sm shrink-0">
                    ア
                  </span>
                  <h4 className="font-bold text-sm sm:text-base font-headline text-zen-text dark:text-zen-dark-text">
                    {t('nav.guideKatakanaTitle')}
                  </h4>
                </div>
                <p className="text-xs text-zen-text/90 dark:text-zen-dark-text/90 leading-relaxed font-medium pl-10.5">
                  {t('nav.guideKatakanaDesc')}
                </p>
              </div>

              {/* 3. Kanji Card */}
              <div className="p-4 bg-zen-surface-container/40 dark:bg-zen-dark-surface-high/60 border border-zen-border/50 dark:border-zen-dark-border shadow-2xs space-y-1.5">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 bg-purple-600 text-white flex items-center justify-center font-kana font-bold text-base shadow-sm shrink-0">
                    漢
                  </span>
                  <h4 className="font-bold text-sm sm:text-base font-headline text-zen-text dark:text-zen-dark-text">
                    {t('nav.guideKanjiTitle') || 'Kanji (漢字)'}
                  </h4>
                </div>
                <p className="text-xs text-zen-text/90 dark:text-zen-dark-text/90 leading-relaxed font-medium pl-10.5">
                  {t('nav.guideKanjiDesc') || 'Ideogrammi che rappresentano un intero concetto o significato.'}
                </p>
              </div>

              {/* 4. Dakuten & Handakuten Card */}
              <div className="p-4 bg-zen-surface-container/40 dark:bg-zen-dark-surface-high/60 border border-zen-border/50 dark:border-zen-dark-border shadow-2xs space-y-1.5">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 bg-zen-accent text-white flex items-center justify-center font-kana font-bold text-base shadow-sm shrink-0">
                    が
                  </span>
                  <h4 className="font-bold text-sm sm:text-base font-headline text-zen-text dark:text-zen-dark-text">
                    {t('nav.guideDakutenTitle')}
                  </h4>
                </div>
                <p className="text-xs text-zen-text/90 dark:text-zen-dark-text/90 leading-relaxed font-medium pl-10.5">
                  {t('nav.guideDakutenDesc')}
                </p>
              </div>

              {/* 4. Yoon Combinations Card */}
              <div className="p-4 bg-zen-surface-container/40 dark:bg-zen-dark-surface-high/60 border border-zen-border/50 dark:border-zen-dark-border shadow-2xs space-y-1.5">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 bg-emerald-600 text-white flex items-center justify-center font-kana font-bold text-xs shadow-sm shrink-0">
                    きゃ
                  </span>
                  <h4 className="font-bold text-sm sm:text-base font-headline text-zen-text dark:text-zen-dark-text">
                    {t('nav.guideYoonTitle')}
                  </h4>
                </div>
                <p className="text-xs text-zen-text/90 dark:text-zen-dark-text/90 leading-relaxed font-medium pl-10.5">
                  {t('nav.guideYoonDesc')}
                </p>
              </div>

              {/* 5. Special Phonetics & Rhythm Card */}
              <div className="p-4 bg-zen-surface-container/40 dark:bg-zen-dark-surface-high/60 border border-zen-border/50 dark:border-zen-dark-border shadow-2xs space-y-1.5">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 bg-amber-600 text-white flex items-center justify-center font-kana font-bold text-base shadow-sm shrink-0">
                    っ
                  </span>
                  <h4 className="font-bold text-sm sm:text-base font-headline text-zen-text dark:text-zen-dark-text">
                    {t('nav.guidePhoneticsTitle')}
                  </h4>
                </div>
                <p className="text-xs text-zen-text/90 dark:text-zen-dark-text/90 leading-relaxed font-medium pl-10.5">
                  {t('nav.guidePhoneticsDesc')}
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowGuideModal(false)}
              className="w-full py-3 bg-zen-primary dark:bg-zen-dark-primary text-white dark:text-zen-dark-on-primary font-bold text-xs uppercase tracking-wider shadow-zen-md hover:opacity-90 active:scale-[0.99] transition-all min-h-[44px] cursor-pointer border border-transparent"
            >
              {t('nav.closeGuide')}
            </button>
          </div>
        </div>
      )}

      {/* ===================== MOBILE HAMBURGER MENU DRAWER OVERLAY ===================== */}

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 xl:hidden flex">
          {/* Backdrop Blur Overlay */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 animate-fadeIn"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Sliding Drawer Container */}
          <aside className="relative z-50 w-full max-w-[310px] bg-zen-surface-lowest dark:bg-zen-dark-surface border-r border-zen-border/40 dark:border-zen-dark-border flex flex-col h-full shadow-2xl overflow-y-auto animate-slideRight">
            {/* Drawer Header */}
            <div className="p-4 border-b border-zen-border/40 dark:border-zen-dark-border flex items-center justify-between bg-zen-surface dark:bg-zen-dark-bg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-zen-primary dark:bg-zen-dark-primary text-white dark:text-zen-dark-on-primary flex items-center justify-center font-kana font-bold text-base shadow-zen-sm border border-transparent">
                  あ
                </div>
                <div>
                  <h2 className="font-headline font-bold text-base text-zen-primary dark:text-zen-dark-primary leading-tight">
                    {t('nav.appName')}
                  </h2>
                  <p className="text-2xs text-zen-text-muted dark:text-zen-dark-text-muted">
                    {t('nav.appSubtitle')}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 text-zen-text-muted hover:text-zen-text dark:text-zen-dark-text-muted dark:hover:text-zen-dark-text bg-zen-surface-container dark:bg-zen-dark-surface cursor-pointer"
                aria-label="Chiudi menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Script Selector in Drawer */}
            <div className="p-4 border-b border-zen-surface-high dark:border-zen-dark-border bg-zen-surface-container/30 dark:bg-zen-dark-surface-high/30">
              <span className="block text-xs-plus font-semibold text-zen-text-muted dark:text-zen-dark-text-muted mb-2 uppercase tracking-wider">
                {t('nav.writingSystem')}
              </span>
              <div className="grid grid-cols-2 gap-2 bg-zen-surface-container dark:bg-zen-dark-surface p-1 border border-zen-border/40 dark:border-zen-dark-border">
                <button
                  onClick={() => setScriptMode('hiragana')}
                  className={`py-2 text-xs font-bold transition-all cursor-pointer border ${
                    scriptMode === 'hiragana'
                      ? 'bg-zen-primary dark:bg-zen-dark-primary text-white dark:text-zen-dark-on-primary border-zen-primary/30 dark:border-zen-dark-primary/40 shadow-zen-sm'
                      : 'text-zen-text-muted dark:text-zen-dark-text-muted border-transparent'
                  }`}
                >
                  Hiragana (あ)
                </button>
                <button
                  onClick={() => setScriptMode('katakana')}
                  className={`py-2 text-xs font-bold transition-all cursor-pointer border ${
                    scriptMode === 'katakana'
                      ? 'bg-zen-primary dark:bg-zen-dark-primary text-white dark:text-zen-dark-on-primary border-zen-primary/30 dark:border-zen-dark-primary/40 shadow-zen-sm'
                      : 'text-zen-text-muted dark:text-zen-dark-text-muted hover:text-zen-text dark:hover:text-zen-dark-text border-transparent'
                  }`}
                >
                  Katakana (ア)
                </button>
              </div>
            </div>

            {/* Language Selector in Drawer */}
            <div className="p-4 border-b border-zen-surface-high dark:border-zen-dark-border bg-zen-surface-container/30 dark:bg-zen-dark-surface-high/30">
              <span className="block text-xs-plus font-semibold text-zen-text-muted dark:text-zen-dark-text-muted mb-2 uppercase tracking-wider">
                {t('nav.language')}
              </span>
              <div className="grid grid-cols-2 gap-2 bg-zen-surface-container dark:bg-zen-dark-surface p-1 border border-zen-border/40 dark:border-zen-dark-border">
                <button
                  onClick={() => setLang('it')}
                  className={`py-2 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border ${
                    lang === 'it'
                      ? 'bg-zen-primary dark:bg-zen-dark-primary text-white dark:text-zen-dark-on-primary border-zen-primary/30 dark:border-zen-dark-primary/40 shadow-zen-sm'
                      : 'text-zen-text-muted dark:text-zen-dark-text-muted hover:text-zen-text dark:hover:text-zen-dark-text border-transparent'
                  }`}
                >
                  🇮🇹 Italiano
                </button>
                <button
                  onClick={() => setLang('en')}
                  className={`py-2 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border ${
                    lang === 'en'
                      ? 'bg-zen-primary dark:bg-zen-dark-primary text-white dark:text-zen-dark-on-primary border-zen-primary/30 dark:border-zen-dark-primary/40 shadow-zen-sm'
                      : 'text-zen-text-muted dark:text-zen-dark-text-muted hover:text-zen-text dark:hover:text-zen-dark-text border-transparent'
                  }`}
                >
                  🇬🇧 English
                </button>
              </div>
            </div>

            {/* Navigation Modules Links */}
            <div className="flex-1 p-3 space-y-1 overflow-y-auto">
              <p className="px-3 py-1.5 text-xs-plus font-semibold text-zen-text-muted dark:text-zen-dark-text-muted uppercase tracking-wider">
                {t('nav.studySections')}
              </p>

              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center justify-between p-3 transition-all cursor-pointer ${
                      isActive
                        ? 'bg-zen-primary/10 dark:bg-zen-dark-surface-high text-zen-primary dark:text-zen-dark-primary font-bold border border-zen-primary/30 dark:border-zen-dark-primary/40 shadow-zen-sm'
                        : 'text-zen-text dark:text-zen-dark-text hover:bg-zen-surface-container dark:hover:bg-zen-dark-surface font-medium border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 ${
                          isActive
                            ? 'bg-zen-primary text-white dark:bg-zen-dark-primary dark:text-zen-dark-on-primary'
                            : 'bg-zen-surface-container dark:bg-zen-dark-surface text-zen-text-muted dark:text-zen-dark-text-muted'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <span className="block text-sm leading-tight">{item.label}</span>
                        <span className="block text-2xs text-zen-text-muted dark:text-zen-dark-text-muted font-normal mt-0.5">
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
            <div className="p-4 border-t border-zen-surface-high dark:border-zen-dark-border bg-zen-surface dark:bg-zen-dark-surface space-y-2">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setShowGuideModal(true);
                }}
                className="w-full flex items-center justify-between p-3 bg-zen-surface-container dark:bg-zen-dark-surface border border-zen-border/40 dark:border-zen-dark-border text-zen-text dark:text-zen-dark-text text-xs font-semibold cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-zen-primary dark:text-zen-dark-primary" />
                  <span>{t('nav.guideButton')}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-zen-text-muted/60" />
              </button>

              {!isStandalone && (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleInstallClick();
                  }}
                  className="w-full flex items-center justify-between p-3 bg-zen-primary/10 dark:bg-zen-dark-primary/20 text-zen-primary dark:text-zen-dark-primary text-xs font-semibold border border-zen-primary/20 dark:border-zen-dark-primary/30 cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    <span>{t('nav.installApp')}</span>
                  </div>
                  <span className="text-2xs font-bold uppercase tracking-wider">PWA</span>
                </button>
              )}

              <button
                onClick={toggleTheme}
                className="w-full flex items-center justify-between p-3 bg-zen-surface-container dark:bg-zen-dark-surface border border-zen-border/40 dark:border-zen-dark-border text-zen-text dark:text-zen-dark-text text-xs font-semibold cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  {isDark ? <Sun className="w-4 h-4 text-zen-dark-primary" /> : <Moon className="w-4 h-4 text-zen-primary" />}
                  <span>{t('nav.themeMode')}</span>
                </div>
                <span className="text-xs-plus text-zen-text-muted dark:text-zen-dark-text-muted">
                  {isDark ? t('nav.themeDark') : t('nav.themeLight')}
                </span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* ===================== MOBILE BOTTOM NAVIGATION BAR ===================== */}

      <nav
        className="xl:hidden fixed bottom-0 left-0 right-0 z-40 bg-zen-surface dark:bg-zen-dark-bg border-t border-zen-border/40 dark:border-zen-dark-border px-2 py-1.5 shadow-lg transition-colors duration-300"
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
                className={`flex flex-col items-center justify-center py-1 px-2.5 transition-all cursor-pointer ${
                  isActive
                    ? 'text-zen-primary dark:text-zen-dark-primary font-bold border-b-2 border-zen-primary dark:border-zen-dark-primary -mb-[2px]'
                    : 'text-zen-text-muted dark:text-zen-dark-text-muted hover:text-zen-text dark:hover:text-zen-dark-text font-medium border-b-2 border-transparent'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                <span className="text-2xs mt-0.5 tracking-tight text-center leading-tight">
                  {item.label}
                </span>
              </button>
            );
          })}

          {/* Menu Hamburger Trigger Button in Bottom Bar */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="flex flex-col items-center justify-center py-1 px-2.5 text-zen-text-muted dark:text-zen-dark-text-muted hover:text-zen-text dark:hover:text-zen-dark-text font-medium transition-all cursor-pointer border-b-2 border-transparent"
            aria-label="Apri menu completo"
          >
            <Menu className="w-5 h-5 stroke-2" />
            <span className="text-2xs mt-0.5 tracking-tight text-center leading-tight">
              Menu
            </span>
          </button>
        </div>
      </nav>
    </>
  );
}