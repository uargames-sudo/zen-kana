/**
 * Audio utility for Japanese Kana Speech Synthesis & Fallback Audio
 * Supports native Web Speech API (window.speechSynthesis) with fallback to online TTS audio
 * for WebView2 / Tauri / iOS compatibility.
 */

let cachedJapaneseVoice = null;
let activeAudio = null;

/**
 * Find and return Japanese voice from SpeechSynthesis
 */
export function getJapaneseVoice() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return null;
  }

  const voices = window.speechSynthesis.getVoices() || [];
  const jaVoice = voices.find(v => 
    v.lang === 'ja-JP' || 
    v.lang === 'ja_JP' || 
    v.lang.startsWith('ja') ||
    (v.name && v.name.toLowerCase().includes('japanese'))
  );

  if (jaVoice) {
    cachedJapaneseVoice = jaVoice;
  }
  return jaVoice || cachedJapaneseVoice || null;
}

// Pre-load and update voices on browser voice change event
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    cachedJapaneseVoice = null;
    getJapaneseVoice();
  };
}

/**
 * Diagnostic helper to inspect available system voices in console
 */
export function checkAudioCapabilities() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('[Audio Utility] SpeechSynthesis is NOT supported in this browser environment.');
    return { supported: false, voices: [], jaVoice: null };
  }

  const voices = window.speechSynthesis.getVoices() || [];
  const jaVoice = getJapaneseVoice();

  console.group('[Audio Utility] System Voice Diagnostic');
  console.log(`Total voices detected: ${voices.length}`);
  console.log('Japanese Voice found:', jaVoice ? `${jaVoice.name} (${jaVoice.lang})` : 'NONE');
  console.log('All installed voices:', voices.map(v => `${v.name} [${v.lang}]`));
  console.groupEnd();

  return {
    supported: true,
    totalVoices: voices.length,
    jaVoice: jaVoice ? { name: jaVoice.name, lang: jaVoice.lang } : null,
    allVoices: voices.map(v => ({ name: v.name, lang: v.lang }))
  };
}

// Attach helper to global window for easy debugging in console
if (typeof window !== 'undefined') {
  window.__checkKanaVoices = checkAudioCapabilities;
}

/**
 * Play fallback audio using online TTS API.
 * @param {string} text Kana character or word to pronounce
 * @param {number} rate Speed rate
 */
function playFallbackAudio(text, rate = 0.85) {
  try {
    if (activeAudio) {
      activeAudio.pause();
      activeAudio = null;
    }

    const encodedText = encodeURIComponent(text);
    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=ja&q=${encodedText}`;
    
    const audio = new Audio(ttsUrl);
    audio.playbackRate = rate;
    activeAudio = audio;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(err => {
        console.warn('[Audio Utility] Online TTS playback failed:', err);
      });
    }
    return true;
  } catch (err) {
    console.warn('[Audio Utility] Fallback audio exception:', err);
    return false;
  }
}

/**
 * Play text using Web Speech API in Japanese with fallback to online TTS.
 * MUST be called inside a click/touch user gesture event handler.
 * @param {string} text Kana character or word to pronounce
 * @param {number} rate Speed rate (default 0.85)
 */
export function playKanaSound(text, rate = 0.85) {
  if (!text || typeof window === 'undefined') {
    return false;
  }

  if ('speechSynthesis' in window) {
    try {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }

      const jaVoice = getJapaneseVoice();

      // If operating system lacks Japanese TTS voice or voices list is empty, use fallback audio immediately
      if (!jaVoice) {
        console.log('[Audio Utility] No native Japanese voice found, using online audio fallback.');
        return playFallbackAudio(text, rate);
      }

      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ja-JP';
      utterance.rate = rate;
      utterance.pitch = 1.0;
      utterance.voice = jaVoice;

      let hasFiredError = false;
      utterance.onerror = (e) => {
        console.warn('[Audio Utility] SpeechSynthesis error, switching to online audio fallback:', e);
        if (!hasFiredError) {
          hasFiredError = true;
          playFallbackAudio(text, rate);
        }
      };

      window.speechSynthesis.speak(utterance);

      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
      return true;
    } catch (err) {
      console.warn('[Audio Utility] SpeechSynthesis exception, switching to fallback:', err);
      return playFallbackAudio(text, rate);
    }
  }

  return playFallbackAudio(text, rate);
}


