import React, { useState, useEffect } from 'react';
import { Download, X, Share } from 'lucide-react';

export default function PwaInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    // Check if iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIpadOs = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent) || isIpadOs;
    const isStandalone = window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches;

    if (isIosDevice && !isStandalone) {
      setIsIos(true);
      setShowBanner(true);
    }

    // Listen for beforeinstallprompt event on Windows / Android / Chrome / Edge
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log('[PWA Installer] User outcome:', outcome);

    setDeferredPrompt(null);
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-20 lg:bottom-6 left-4 right-4 max-w-md mx-auto z-50 animate-slide-up">
      <div className="zen-card p-4 border border-zen-primary-light bg-zen-primary-dark text-white shadow-2xl flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-zen-primary-light/20 flex items-center justify-center text-zen-primary-light">
            <Download className="w-5 h-5" />
          </div>

          <div className="text-xs">
            <h4 className="font-bold text-white text-sm">Install Zen Kana PWA</h4>
            <p className="text-white/80">
              {isIos ? 'Tap Share → "Add to Home Screen"' : 'Install for offline Japanese study'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isIos && deferredPrompt && (
            <button
              onClick={handleInstallClick}
              className="px-3.5 py-2 rounded-xl bg-zen-primary-light text-zen-primary-dark font-bold text-xs hover:bg-white transition-colors"
            >
              Install
            </button>
          )}

          {isIos && <Share className="w-5 h-5 text-zen-primary-light" aria-label="Use the browser Share menu" />}

          <button
            onClick={() => setShowBanner(false)}
            className="p-1 rounded-lg text-white/60 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
