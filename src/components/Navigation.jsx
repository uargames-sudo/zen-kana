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
      <header className="sticky top-0 z-40 bg-zen-surface/95 dark:bg-zen-dark-bg/95 backdrop-blur-md border-b border-zen-surface-high dark:border-zen-dark-border shadow-zen-sm transition-colors duration-300">
        <div className="mx-auto max-w-[1600px] px-3 sm:px-5">

          {/* ===================== DESKTOP NAVIGATION HEADER ===================== */}

          <div className="hidden h-16 items-center justify-between gap-3 lg:flex">
            {/* Logo */}
            <div
              onClick={() => setActiveTab('dashboard')}
              className="group flex shrink-0 cursor-pointer items-center gap-2"
            >
              <div className="w-8 h-8 rounded-xl bg-zen-primary dark:bg-zen-dark-primary text-white dark:text-zen-dark-on-primary flex items-center justify-center font-kana font-bold text-base shadow-zen-sm group-hover:scale-105 transition-transform">
                あ
              </div>

              <div className="hidden xl:block">
                <h1 className="font-headline font-bold text-sm text-zen-text dark:text-zen-dark-primary leading-tight tracking-tight flex items-center gap-1">
                  {t('nav.appName')}
                  <Sparkles className="w-3 h-3 text-zen-secondary dark:text-zen-dark-primary" />
                </h1>
                <p className="text-[10px] text-zen-text-muted dark:text-zen-dark-text-muted">
                  {t('nav.appSubtitle')}
                </p>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="min-w-0 flex-1 flex items-center justify-center px-1">
              <div className="flex items-center gap-0.5 xl:gap-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`flex items-center gap-1.5 whitespace-nowrap rounded-xl px-2 py-1.5 xl:px-2.5 text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-zen-primary/10 dark:bg-zen-dark-surface-high text-zen-primary dark:text-zen-dark-primary font-bold border border-zen-primary/20 dark:border-zen-dark-border shadow-sm'
                          : 'text-zen-text-muted dark:text-zen-dark-text-muted hover:bg-zen-surface-high dark:hover:bg-zen-dark-surface hover:text-zen-text dark:hover:text-zen-dark-text'
                      }`}
                    >
                      <Icon
                        className={`w-3.5 h-3.5 shrink-0 ${
                          isActive
                            ? 'text-zen-primary dark:text-zen-dark-primary'
                            : ''
                        }`}
                      />
                      <span className="hidden xl:inline">{item.label}</span>
                      <span className="inline xl:hidden">{item.shortLabel}</span>
                    </button>
                  );
                })}
              </div>
            </nav>

            {/* Top Bar Actions (Script switch, Language, Install PWA & Theme) */}
            <div className="flex shrink-0 items-center gap-2">
              {/* Script Switcher */}
              <div className="flex items-center bg-zen-surface-container dark:bg-zen-dark-surface p-0.5 rounded-full border border-zen-border/40 dark:border-zen-dark-border">
                <button
                  onClick={() => setScriptMode('hiragana')}
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                    scriptMode === 'hiragana'
                      ? 'bg-zen-primary dark:bg-zen-dark-primary text-white dark:text-zen-dark-on-primary shadow-zen-sm'
                      : 'text-zen-text-muted dark:text-zen-dark-text-muted hover:text-zen-text dark:hover:text-zen-dark-text'
                  }`}
                  title={t('nav.scriptHiragana')}
                >
                  <span className="xl:hidden">{t('nav.scriptHiraganaShort')}</span>
                  <span className="hidden xl:inline">{t('nav.scriptHiragana')}</span>
                </button>

                <button
                  onClick={() => setScriptMode('katakana')}
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                    scriptMode === 'katakana'
                      ? 'bg-zen-secondary dark:bg-zen-dark-secondary text-white dark:text-zen-dark-on-primary shadow-zen-sm'
                      : 'text-zen-text-muted dark:text-zen-dark-text-muted hover:text-zen-text dark:hover:text-zen-dark-text'
                  }`}
                  title={t('nav.scriptKatakana')}
                >
                  <span className="xl:hidden">{t('nav.scriptKatakanaShort')}</span>
                  <span className="hidden xl:inline">{t('nav.scriptKatakana')}</span>
                </button>
              </div>

              {/* Language Switcher */}
              <button
                onClick={toggleLang}
                className="shrink-0 px-2.5 py-1.5 rounded-xl bg-zen-surface-container dark:bg-zen-dark-surface border border-zen-border/40 dark:border-zen-dark-border text-zen-primary dark:text-zen-dark-primary hover:scale-105 active:scale-95 transition-all shadow-zen-sm font-bold text-xs flex items-center gap-1.5"
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
                  className="relative shrink-0 p-2 rounded-xl bg-zen-surface-container dark:bg-zen-dark-surface border border-zen-border/40 dark:border-zen-dark-border text-zen-primary dark:text-zen-dark-primary hover:scale-105 active:scale-95 transition-all shadow-zen-sm"
                  title={t('nav.installApp')}
                  aria-label={t('nav.installApp')}
                >
                  <Download className="w-4 h-4 text-zen-primary dark:text-zen-dark-primary" />
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
                  <Sun className="w-4 h-4 fill-zen-dark-primary text-zen-dark-primary" />
                ) : (
                  <Moon className="w-4 h-4 fill-zen-primary text-zen-primary" />
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
              className="flex items-center gap-2 px-1 text-center"
            >
              <div className="w-7 h-7 rounded-lg bg-zen-primary dark:bg-zen-dark-primary text-white dark:text-zen-dark-on-primary flex items-center justify-center font-kana font-bold text-sm shadow-zen-sm">
                あ
              </div>
              <span className="font-headline text-lg font-bold text-zen-primary dark:text-zen-dark-primary tracking-tight">
                {t('nav.appName')}
              </span>
            </button>

            {/* Actions: Script mode badge, Language, Install icon & Theme toggle */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() =>
                  setScriptMode((prev) => (prev === 'hiragana' ? 'katakana' : 'hiragana'))
                }
                className="px-2 py-1 rounded-full text-[11px] font-bold bg-zen-primary/10 dark:bg-zen-dark-primary/20 text-zen-primary dark:text-zen-dark-primary border border-zen-primary/20 dark:border-zen-dark-primary/30 transition-all active:scale-95"
                title={t('nav.writingSystem')}
              >
                {scriptMode === 'hiragana' ? t('nav.scriptHiraganaShort') : t('nav.scriptKatakanaShort')}
              </button>

              <button
                onClick={toggleLang}
                className="flex h-8 px-2 items-center justify-center rounded-xl bg-zen-surface-container dark:bg-zen-dark-surface border border-zen-border/40 dark:border-zen-dark-border text-zen-primary dark:text-zen-dark-primary active:scale-95 transition-transform font-bold text-[11px] uppercase gap-1"
                title={t('nav.language')}
              >
                <Globe className="h-3 w-3" />
                <span>{lang}</span>
              </button>

              {!isStandalone && (
                <button
                  onClick={handleInstallClick}
                  className="flex h-8 w-8 items-center justify-center rounded-xl bg-zen-surface-container dark:bg-zen-dark-surface border border-zen-border/40 dark:border-zen-dark-border text-zen-primary dark:text-zen-dark-primary active:scale-95 transition-transform"
                  title={t('nav.installApp')}
                  aria-label={t('nav.installApp')}
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
              {t('nav.installModalTitle')}
            </h3>

            {isIos ? (
              <div className="space-y-3 text-xs text-zen-text-muted dark:text-zen-dark-text-muted text-left bg-zen-surface-container/50 dark:bg-zen-dark-surface-high/50 p-4 rounded-xl border border-zen-border/30">
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
              <div className="text-xs text-zen-text-muted dark:text-zen-dark-text-muted space-y-2 text-left bg-zen-surface-container/50 dark:bg-zen-dark-surface-high/50 p-4 rounded-xl border border-zen-border/30">
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
              className="w-full py-2.5 bg-zen-primary dark:bg-zen-dark-primary text-white dark:text-zen-dark-on-primary rounded-xl font-bold text-xs uppercase tracking-wider shadow-sm hover:opacity-90 transition-opacity"
            >
              {t('nav.gotIt')}
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
                    {t('nav.appName')}
                  </h2>
                  <p className="text-[11px] text-zen-text-muted dark:text-zen-dark-text-muted">
                    {t('nav.studySections')}
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

            {/* Language Selector Inside Drawer */}
            <div className="p-4 border-b border-zen-surface-high dark:border-zen-dark-border bg-zen-surface-container/50 dark:bg-zen-dark-surface/40">
              <p className="text-[11px] font-bold uppercase tracking-wider text-zen-text-muted dark:text-zen-dark-text-muted mb-2">
                {t('nav.language')}
              </p>
              <div className="grid grid-cols-2 gap-2 bg-zen-surface-container dark:bg-zen-dark-surface p-1 rounded-xl border border-zen-border/40 dark:border-zen-dark-border">
                <button
                  onClick={() => setLang('it')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    lang === 'it'
                      ? 'bg-zen-primary text-white dark:bg-zen-dark-primary dark:text-zen-dark-on-primary shadow-zen-sm'
                      : 'text-zen-text-muted dark:text-zen-dark-text-muted hover:text-zen-text dark:hover:text-zen-dark-text'
                  }`}
                >
                  <span>🇮🇹</span> Italiano
                </button>

                <button
                  onClick={() => setLang('en')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    lang === 'en'
                      ? 'bg-zen-primary text-white dark:bg-zen-dark-primary dark:text-zen-dark-on-primary shadow-zen-sm'
                      : 'text-zen-text-muted dark:text-zen-dark-text-muted hover:text-zen-text dark:hover:text-zen-dark-text'
                  }`}
                >
                  <span>🇬🇧</span> English
                </button>
              </div>
            </div>

            {/* Writing System Selector Inside Drawer */}
            <div className="p-4 border-b border-zen-surface-high dark:border-zen-dark-border bg-zen-surface-container/50 dark:bg-zen-dark-surface/40">
              <p className="text-[11px] font-bold uppercase tracking-wider text-zen-text-muted dark:text-zen-dark-text-muted mb-2">
                {t('nav.writingSystem')}
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
                {t('nav.studySections')}
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
                    <span>{t('nav.installApp')}</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider">PWA</span>
                </button>
              )}

              <button
                onClick={toggleTheme}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-zen-surface-container dark:bg-zen-dark-surface border border-zen-border/40 dark:border-zen-dark-border text-zen-text dark:text-zen-dark-text text-xs font-semibold"
              >
                <div className="flex items-center gap-2">
                  {isDark ? <Sun className="w-4 h-4 text-zen-dark-primary" /> : <Moon className="w-4 h-4 text-zen-primary" />}
                  <span>{t('nav.themeMode')}</span>
                </div>
                <span className="text-[11px] text-zen-text-muted dark:text-zen-dark-text-muted">
                  {isDark ? t('nav.themeDark') : t('nav.themeLight')}
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
                className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
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
            className="flex flex-col items-center justify-center py-1 px-2 rounded-xl text-zen-text-muted dark:text-zen-dark-text-muted hover:text-zen-text dark:hover:text-zen-dark-text font-medium transition-all"
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