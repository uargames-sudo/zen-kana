/**
 * Enhanced Audio Utility for Japanese Kana & Vocabulary Speech Synthesis
 * - Fixes Chromium Web Speech API first-click latency & voice loading delay
 * - Fixes Chromium garbage collection bug that cuts off short audio utterances
 * - Optimizes volume (1.0 max) and cadence (0.75 for Kana, 0.80 for Vocab) for optimal learner comprehension
 * - Automatic pre-warming on initial user gesture (click/touch/hover)
 * - Multi-engine fallback for devices without native Japanese TTS voices
 */

let cachedJapaneseVoice = null;
let activeUtterance = null;
let activeAudio = null;
let isAudioPrewarmed = false;

/**
 * Prime and load speech synthesis voices as early as possible
 */
export function initAudioEngine() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return;
  }

  // Force loading voices immediately
  const voices = window.speechSynthesis.getVoices();
  if (voices && voices.length > 0) {
    cachedJapaneseVoice = findBestJapaneseVoice(voices);
  }

  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = () => {
      const updatedVoices = window.speechSynthesis.getVoices();
      cachedJapaneseVoice = findBestJapaneseVoice(updatedVoices);
    };
  }

  // Pre-warm audio on very first user interaction
  const prewarmOnce = () => {
    if (isAudioPrewarmed) return;
    isAudioPrewarmed = true;

    try {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
      // Trigger voice lookup
      getJapaneseVoice();
    } catch {
      // safe fallback
    }

    window.removeEventListener('pointerdown', prewarmOnce);
    window.removeEventListener('touchstart', prewarmOnce);
    window.removeEventListener('keydown', prewarmOnce);
  };

  window.addEventListener('pointerdown', prewarmOnce, { passive: true, once: true });
  window.addEventListener('touchstart', prewarmOnce, { passive: true, once: true });
  window.addEventListener('keydown', prewarmOnce, { passive: true, once: true });
}

/**
 * Find the highest-quality Japanese voice available on the system
 */
function findBestJapaneseVoice(voices = []) {
  if (!voices || voices.length === 0) return null;

  // 1. Prioritize premium natural voices (Google, Microsoft Neural, Apple Siri/Kyoko)
  const premiumJapanese = voices.find(v => 
    (v.lang === 'ja-JP' || v.lang === 'ja_JP' || v.lang.startsWith('ja')) &&
    (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Neural') || v.name.includes('Kyoko') || v.name.includes('Nanami') || v.name.includes('Ayumi'))
  );
  if (premiumJapanese) return premiumJapanese;

  // 2. Standard Japanese voice
  const standardJapanese = voices.find(v => 
    v.lang === 'ja-JP' || 
    v.lang === 'ja_JP' || 
    v.lang.startsWith('ja') ||
    (v.name && v.name.toLowerCase().includes('japan'))
  );
  if (standardJapanese) return standardJapanese;

  return null;
}

/**
 * Get cached or active Japanese voice
 */
export function getJapaneseVoice() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return null;
  }

  if (cachedJapaneseVoice) {
    return cachedJapaneseVoice;
  }

  const voices = window.speechSynthesis.getVoices() || [];
  cachedJapaneseVoice = findBestJapaneseVoice(voices);
  return cachedJapaneseVoice;
}

/**
 * Play fallback audio using online TTS endpoint with caching
 */
function playFallbackAudio(text, rate = 0.78) {
  try {
    if (activeAudio) {
      activeAudio.pause();
      activeAudio.currentTime = 0;
      activeAudio = null;
    }

    const encodedText = encodeURIComponent(text);
    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=ja&q=${encodedText}`;
    
    const audio = new Audio(ttsUrl);
    audio.volume = 1.0;
    audio.playbackRate = Math.max(0.7, Math.min(1.2, rate));
    activeAudio = audio;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(err => {
        console.warn('[Audio] Online TTS playback failed:', err);
      });
    }
    return true;
  } catch (err) {
    console.warn('[Audio] Fallback audio exception:', err);
    return false;
  }
}

/**
 * Play text using Web Speech API in Japanese with optimized volume and clear pronunciation.
 * @param {string} text Kana character or word to pronounce
 * @param {number|null} customRate Custom speed rate (defaults to 0.76 for single kana, 0.82 for words)
 */
export function playKanaSound(text, customRate = null) {
  if (!text || typeof window === 'undefined') {
    return false;
  }

  // Determine optimal speed rate if not explicitly passed
  // Single syllable Kana: 0.75 for clear vowel articulation
  // Multi-character vocabulary: 0.80 for natural word flow
  const isSingleKana = text.length <= 2;
  const rate = customRate !== null ? customRate : (isSingleKana ? 0.75 : 0.80);

  if ('speechSynthesis' in window) {
    try {
      // 1. Unstick paused speech synthesis queue (Chromium bug)
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }

      // 2. Fetch Japanese voice
      let jaVoice = getJapaneseVoice();
      if (!jaVoice) {
        const voices = window.speechSynthesis.getVoices() || [];
        jaVoice = findBestJapaneseVoice(voices);
        if (jaVoice) cachedJapaneseVoice = jaVoice;
      }

      // If no Japanese voice is installed on user's OS, use online fallback
      if (!jaVoice) {
        return playFallbackAudio(text, rate);
      }

      // 3. Clear any hanging utterances
      window.speechSynthesis.cancel();

      // 4. Create new utterance with full volume and clear pitch
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = jaVoice;
      utterance.lang = jaVoice.lang || 'ja-JP';
      utterance.volume = 1.0; // Max volume
      utterance.rate = rate;  // Optimal learner cadence
      utterance.pitch = 1.0;

      // 5. CRITICAL CHROMIUM BUG FIX: Keep global reference to prevent Garbage Collection from cutting off speech
      activeUtterance = utterance;
      if (typeof window !== 'undefined') {
        window.__activeKanaUtterance = utterance;
      }

      utterance.onend = () => {
        activeUtterance = null;
        if (typeof window !== 'undefined') {
          window.__activeKanaUtterance = null;
        }
      };

      let fallbackTriggered = false;
      utterance.onerror = (e) => {
        if (e.error === 'interrupted' || e.error === 'canceled') {
          return;
        }
        console.warn('[Audio] SpeechSynthesis error, falling back:', e);
        if (!fallbackTriggered) {
          fallbackTriggered = true;
          playFallbackAudio(text, rate);
        }
      };

      // 6. Speak with resume guarantee
      window.speechSynthesis.speak(utterance);

      // Extra safeguard for Chromium engines that pause spontaneously
      setTimeout(() => {
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
      }, 50);

      return true;
    } catch (err) {
      console.warn('[Audio] SpeechSynthesis exception, falling back:', err);
      return playFallbackAudio(text, rate);
    }
  }

  return playFallbackAudio(text, rate);
}

// Auto-initialize audio engine
if (typeof window !== 'undefined') {
  initAudioEngine();
}
