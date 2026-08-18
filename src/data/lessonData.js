import { HIRAGANA_BASIC, KANA_DAKUTEN } from './kanaData';
import { VOCABULARY } from './vocabulary';

// ==========================================
// 1. BASIC GOJŪON COURSE (10 Days, 46 Kana)
// ==========================================
const LESSON_SYLLABLES = [
  ['a', 'i', 'u', 'e', 'o'],
  ['ka', 'ki', 'ku', 'ke', 'ko'],
  ['sa', 'shi', 'su', 'se', 'so'],
  ['ta', 'chi', 'tsu', 'te', 'to'],
  ['na', 'ni', 'nu', 'ne', 'no'],
  ['ha', 'hi', 'fu', 'he', 'ho'],
  ['ma', 'mi', 'mu', 'me', 'mo'],
  ['ya', 'yu', 'yo', 'ra', 'ri'],
  ['ru', 're', 'ro', 'wa', 'wo'],
  ['n', 'a', 'ka', 'sa', 'ta'],
];

const kanaByRomaji = new Map(HIRAGANA_BASIC.filter((item) => item.hiragana).map((item) => [item.romaji, item]));

export const LESSONS = LESSON_SYLLABLES.map((romaji, index) => ({
  id: index + 1,
  title: index === 9 ? 'Final review and ん' : `Day ${index + 1}`,
  romaji,
  cumulativeRomaji: [...new Set(LESSON_SYLLABLES.slice(0, index + 1).flat())],
}));

export function getLessonKana(lesson, scriptMode) {
  const property = scriptMode === 'katakana' ? 'katakana' : 'hiragana';
  return lesson.romaji.map((romaji) => ({ ...kanaByRomaji.get(romaji), char: kanaByRomaji.get(romaji)?.[property] })).filter((item) => item.char);
}

export function getAllowedKana(lesson, scriptMode) {
  const property = scriptMode === 'katakana' ? 'katakana' : 'hiragana';
  return new Set(lesson.cumulativeRomaji.map((romaji) => kanaByRomaji.get(romaji)?.[property]).filter(Boolean));
}

const isKanaCharacter = (character) => /[\u3040-\u309f\u30a0-\u30ff]/.test(character) && character !== 'ー';

export function getLessonVocabulary(lesson, scriptMode) {
  const property = scriptMode === 'katakana' ? 'katakana' : 'hiragana';
  const targetChars = new Set(lesson.romaji.map((romaji) => kanaByRomaji.get(romaji)?.[property]).filter(Boolean));
  const candidates = VOCABULARY.filter((word) => word.script === scriptMode);

  // Only words containing at least one character taught in this lesson (max 10)
  const matching = candidates.filter((word) => 
    Array.from(word.kana).some((char) => targetChars.has(char))
  );

  return matching.slice(0, 10);
}

export function kanaHighlightType(character, lesson, scriptMode) {
  const property = scriptMode === 'katakana' ? 'katakana' : 'hiragana';
  const newKana = new Set(lesson.romaji.map((romaji) => kanaByRomaji.get(romaji)?.[property]));
  if (newKana.has(character)) return 'new';
  if (getAllowedKana(lesson, scriptMode).has(character)) return 'known';
  return 'future';
}


// ====================================================
// 2. DAKUTEN & HANDAKUTEN COURSE (5 Days, 25 Kana)
// ====================================================
const DAKUTEN_SYLLABLES = [
  {
    id: 1,
    group: 'g',
    romaji: ['ga', 'gi', 'gu', 'ge', 'go'],
    baseRomaji: ['ka', 'ki', 'ku', 'ke', 'ko'],
    titleIt: 'Riga G (K ➔ G con ゛)',
    titleEn: 'Row G (K ➔ G with ゛)',
    descIt: 'I due trattini dakuten trasformano il suono sordo K in sonoro G.',
    descEn: 'The two dakuten strokes transform the voiceless K sound into voiced G.',
    theory: {
      it: {
        title: 'Cosa sono i Dakuten (濁音)?',
        intro: 'I Dakuten (chiamati comunemente ten-ten ゛) sono due piccoli trattini obliqui posti in alto a destra del carattere. Hanno il compito fondamentale di trasformare una consonante sorda in una consonante sonora, attivando la vibrazione delle corde vocali.',
        points: [
          'Riga K ➔ Riga G (か ➔ が, き ➔ ぎ, く ➔ ぐ, け ➔ げ, こ ➔ ご)',
          'Riga S ➔ Riga Z (さ ➔ ざ, し ➔ じ, す ➔ ず, せ ➔ ぜ, そ ➔ ぞ)',
          'Riga T ➔ Riga D (た ➔ だ, ち ➔ ぢ, つ ➔ づ, て ➔ で, と ➔ ど)',
          'Riga H ➔ Riga B (は ➔ ば, ひ ➔ び, ふ ➔ ぶ, へ ➔ べ, ほ ➔ ぼ)'
        ],
        tip: '💡 Trucco Zen: Appoggia due dita sulla gola. Pronunciando "KA" non c\'è vibrazione iniziale, mentre pronunciando "GA" sentirai chiaramente vibrare le corde vocali!'
      },
      en: {
        title: 'What are Dakuten (濁音)?',
        intro: 'Dakuten (commonly called ten-ten ゛) are two small diagonal strokes placed in the upper-right corner of a kana character. They turn voiceless consonants into voiced consonants by activating vocal cord vibration.',
        points: [
          'Row K ➔ Row G (ka ➔ ga, ki ➔ gi, ku ➔ gu, ke ➔ ge, ko ➔ go)',
          'Row S ➔ Row Z (sa ➔ za, shi ➔ ji, su ➔ zu, se ➔ ze, so ➔ zo)',
          'Row T ➔ Row D (ta ➔ da, chi ➔ ji, tsu ➔ zu, te ➔ de, to ➔ do)',
          'Row H ➔ Row B (ha ➔ ba, hi ➔ bi, fu ➔ bu, he ➔ be, ho ➔ bo)'
        ],
        tip: '💡 Zen Tip: Place your fingers on your throat. You will feel no vibration for "KA", but you will clearly feel vocal cords vibrating for "GA"!'
      }
    }
  },
  {
    id: 2,
    group: 'z',
    romaji: ['za', 'ji', 'zu', 'ze', 'zo'],
    baseRomaji: ['sa', 'shi', 'su', 'se', 'so'],
    titleIt: 'Riga Z / J (S ➔ Z/J con ゛)',
    titleEn: 'Row Z / J (S ➔ Z/J with ゛)',
    descIt: 'La riga S diventa Z, con la particolarità "shi" che si trasforma in "ji" (じ/ジ).',
    descEn: 'Row S becomes Z, with "shi" transforming into "ji" (じ/ジ).',
    theory: {
      it: {
        title: 'La Riga Z e l\'eccezione じ (JI)',
        intro: 'Aggiungendo i dakuten ゛ alla riga S, tutti i suoni diventano sonori (Z). Fai attenzione all\'eccezione fonetica: し (shi) non diventa "zi", ma si trasforma in じ (ji), con suono dolce come in "gioco".',
        points: [
          'さ (sa) ➔ ざ (za)',
          'し (shi) ➔ じ (ji) ★ Eccezione fonetica dolce',
          'す (su) ➔ ず (zu)',
          'せ (se) ➔ ぜ (ze)',
          'そ (so) ➔ ぞ (zo)'
        ],
        tip: '💡 Regola: Nel giapponese standard la sillaba "zi" non esiste; viene sempre pronunciata e scritta "ji"!'
      },
      en: {
        title: 'Row Z and the じ (JI) exception',
        intro: 'Adding dakuten ゛ to row S makes all sounds voiced (Z). Pay special attention to the phonetic exception: し (shi) does not become "zi", but transforms into じ (ji), pronounced like the "j" in "juice".',
        points: [
          'sa ➔ za',
          'shi ➔ ji ★ Soft phonetic exception',
          'su ➔ zu',
          'se ➔ ze',
          'so ➔ zo'
        ],
        tip: '💡 Rule: Standard Japanese has no "zi" syllable; it is always pronounced and written as "ji"!'
      }
    }
  },
  {
    id: 3,
    group: 'd',
    romaji: ['da', 'ji (dji)', 'zu (dzu)', 'de', 'do'],
    baseRomaji: ['ta', 'chi', 'tsu', 'te', 'to'],
    titleIt: 'Riga D (T ➔ D con ゛)',
    titleEn: 'Row D (T ➔ D with ゛)',
    descIt: 'La riga T diventa D. "Chi" diventa "ji" (ぢ/ヂ) e "tsu" diventa "zu" (づ/ヅ).',
    descEn: 'Row T becomes D. "Chi" becomes "ji" (ぢ/ヂ) and "tsu" becomes "zu" (づ/ヅ).',
    theory: {
      it: {
        title: 'La Riga D e i suoni gemelli (ぢ e づ)',
        intro: 'La riga T diventa D con i dakuten. Nota che ち (chi) diventa ぢ (ji/dji) e つ (tsu) diventa づ (zu/dzu). Nel giapponese moderno, ぢ ha la stessa pronuncia identica di じ, e づ ha la stessa identica pronuncia di ず (fenomeno chiamato Yotsugana).',
        points: [
          'た (ta) ➔ だ (da)',
          'ち (chi) ➔ ぢ (ji) ★ Suona come じ',
          'つ (tsu) ➔ づ (zu) ★ Suona come ず',
          'て (te) ➔ で (de)',
          'と (to) ➔ ど (do)'
        ],
        tip: '💡 Curiosità: Nella scrittura quotidiana si usano quasi sempre じ e ず. I caratteri ぢ e づ compaiono soprattutto quando la sillaba deriva da parole composte, come はなぢ (hanaji = sangue dal naso) o つづく (tsuzuku = continuare).'
      },
      en: {
        title: 'Row D and the twin sounds (ぢ & づ)',
        intro: 'Row T becomes row D with dakuten. Note that ち (chi) becomes ぢ (ji) and つ (tsu) becomes づ (zu). In modern Japanese, ぢ sounds identical to じ, and づ sounds identical to ず (known as Yotsugana).',
        points: [
          'ta ➔ da',
          'chi ➔ ぢ (ji) ★ Sounds identical to じ',
          'tsu ➔ づ (zu) ★ Sounds identical to ず',
          'te ➔ de',
          'to ➔ do'
        ],
        tip: '💡 Note: Modern Japanese almost exclusively uses じ and ず. Characters ぢ and づ appear mainly in compound words like はなぢ (hanaji) or つづく (tsuzuku).'
      }
    }
  },
  {
    id: 4,
    group: 'b',
    romaji: ['ba', 'bi', 'bu', 'be', 'bo'],
    baseRomaji: ['ha', 'hi', 'fu', 'he', 'ho'],
    titleIt: 'Riga B (H ➔ B con ゛)',
    titleEn: 'Row B (H ➔ B with ゛)',
    descIt: 'I suoni aspirati H/F si trasformano nel suono occlusivo sonoro B.',
    descEn: 'Aspirated H/F sounds transform into voiced plosive B sounds.',
    theory: {
      it: {
        title: 'La Riga B (H ➔ B)',
        intro: 'I suoni aspirati della riga H (ha, hi, fu, he, ho) aggiungendo i due trattini ゛ si trasformano nei corrispondenti suoni occlusivi sonori: ba, bi, bu, be, bo.',
        points: [
          'は (ha) ➔ ば (ba)',
          'ひ (hi) ➔ び (bi)',
          'ふ (fu) ➔ ぶ (bu) ★ "fu" diventa "bu"',
          'へ (he) ➔ べ (be)',
          'ほ (ho) ➔ ぼ (bo)'
        ],
        tip: '💡 Nota: Anche ふ (fu), pur avendo un suono aspirato bilabiale, con i dakuten diventa regolarmente ぶ (bu).'
      },
      en: {
        title: 'Row B (H ➔ B)',
        intro: 'The aspirated sounds of row H (ha, hi, fu, he, ho) with two dakuten strokes ゛ transform into voiced plosive sounds: ba, bi, bu, be, bo.',
        points: [
          'ha ➔ ba',
          'hi ➔ bi',
          'fu ➔ bu ★ "fu" becomes "bu"',
          'he ➔ be',
          'ho ➔ bo'
        ],
        tip: '💡 Note: Even ふ (fu), despite its distinct bilabial sound, regularly becomes ぶ (bu) with dakuten.'
      }
    }
  },
  {
    id: 5,
    group: 'p',
    romaji: ['pa', 'pi', 'pu', 'pe', 'po'],
    baseRomaji: ['ha', 'hi', 'fu', 'he', 'ho'],
    titleIt: 'Riga P (H ➔ P con ゜ Handakuten)',
    titleEn: 'Row P (H ➔ P with ゜ Handakuten)',
    descIt: 'Il cerchietto maru trasforma la riga H nel suono plosivo sordo P.',
    descEn: 'The small maru circle transforms row H into voiceless plosive P sounds.',
    theory: {
      it: {
        title: 'Cosa sono gli Handakuten (半濁音)?',
        intro: 'Gli Handakuten (suoni semi-sonori) utilizzano un piccolo cerchietto ゜ (chiamato maru) in alto a destra, invece dei due trattini. Esiste un\'unica riga handakuten in tutto il giapponese: la riga H che diventa la riga P (pa, pi, pu, pe, po).',
        points: [
          'は (ha) ➔ ぱ (pa)',
          'ひ (hi) ➔ ぴ (pi)',
          'ふ (fu) ➔ ぷ (pu)',
          'へ (he) ➔ ぺ (pe)',
          'ほ (ho) ➔ ぽ (po)'
        ],
        tip: '💡 Regola: I segni ゛ (dakuten) e ゜ (handakuten) si posizionano sempre nello stesso identico punto: in alto a destra della sillaba base!'
      },
      en: {
        title: 'What are Handakuten (半濁音)?',
        intro: 'Handakuten (semi-voiced sounds) use a small circle ゜ (called maru) in the top-right corner instead of two strokes. There is only one handakuten row in the entire Japanese language: row H becoming row P (pa, pi, pu, pe, po).',
        points: [
          'ha ➔ pa',
          'hi ➔ pi',
          'fu ➔ pu',
          'he ➔ pe',
          'ho ➔ po'
        ],
        tip: '💡 Rule: Both ゛ (dakuten) and ゜ (handakuten) are always positioned in the exact same spot: upper right corner of the base kana!'
      }
    }
  }
];

const dakutenByRomaji = new Map(KANA_DAKUTEN.map((item) => [item.romaji, item]));

export const DAKUTEN_LESSONS = DAKUTEN_SYLLABLES.map((item, index) => ({
  ...item,
  cumulativeRomaji: [...new Set(DAKUTEN_SYLLABLES.slice(0, index + 1).flatMap(l => l.romaji))],
}));

export function getDakutenLessonKana(lesson, scriptMode) {
  const property = scriptMode === 'katakana' ? 'katakana' : 'hiragana';
  return lesson.romaji.map((romaji, idx) => {
    const dakutenItem = dakutenByRomaji.get(romaji);
    const baseRomaji = lesson.baseRomaji[idx];
    const baseItem = kanaByRomaji.get(baseRomaji);

    return {
      ...dakutenItem,
      char: dakutenItem?.[property],
      baseChar: baseItem?.[property],
      baseRomaji: baseRomaji,
      cleanRomaji: romaji.split(' ')[0] // e.g. 'ji (dji)' -> 'ji'
    };
  }).filter((item) => item.char);
}

export function getDakutenLessonVocabulary(lesson, scriptMode) {
  const property = scriptMode === 'katakana' ? 'katakana' : 'hiragana';
  const targetDakutenChars = new Set(lesson.romaji.map(romaji => dakutenByRomaji.get(romaji)?.[property]).filter(Boolean));
  const candidates = VOCABULARY.filter((word) => word.script === scriptMode);

  // Strictly words containing AT LEAST ONE dakuten/handakuten character of the current lesson (max 10)
  const matching = candidates.filter(word => 
    Array.from(word.kana).some(char => targetDakutenChars.has(char))
  );

  return matching.slice(0, 10);
}
