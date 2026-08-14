import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../i18n/translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    const saved = localStorage.getItem('zen_kana_lang');
    if (saved && (saved === 'it' || saved === 'en')) {
      return saved;
    }
    // Detect from browser language if Italian
    if (typeof navigator !== 'undefined' && navigator.language && navigator.language.startsWith('it')) {
      return 'it';
    }
    return 'it'; // Default Italian
  });

  useEffect(() => {
    localStorage.setItem('zen_kana_lang', lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = (newLang) => {
    if (newLang === 'it' || newLang === 'en') {
      setLangState(newLang);
    }
  };

  const toggleLang = () => {
    setLangState(prev => (prev === 'it' ? 'en' : 'it'));
  };

  /**
   * Helper to get translated string by dot notation path (e.g. 'nav.dashboard')
   */
  const t = (path, fallback = '') => {
    const keys = path.split('.');
    let current = translations[lang];

    for (const key of keys) {
      if (current && current[key] !== undefined) {
        current = current[key];
      } else {
        // Fallback to English if key missing in current language
        let enFallback = translations['en'];
        for (const k of keys) {
          if (enFallback && enFallback[k] !== undefined) {
            enFallback = enFallback[k];
          } else {
            enFallback = undefined;
            break;
          }
        }
        return enFallback !== undefined ? enFallback : fallback || path;
      }
    }

    return current;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
