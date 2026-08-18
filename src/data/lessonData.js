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

export function getLessonVocabulary(lesson, scriptMode, minimum = 6) {
  const allowedKana = getAllowedKana(lesson, scriptMode);
  const candidates = VOCABULARY.filter((word) => word.script === scriptMode);
  const strict = candidates.filter((word) => Array.from(word.kana).filter(isKanaCharacter).every((character) => allowedKana.has(character)));

  if (strict.length >= minimum) return strict;

  const fallback = candidates
    .filter((word) => !strict.some((strictWord) => strictWord.id === word.id))
    .filter((word) => Array.from(word.kana).some((character) => allowedKana.has(character)))
    .sort((a, b) => {
      const countKnown = (word) => Array.from(word.kana).filter((character) => allowedKana.has(character)).length;
      return countKnown(b) - countKnown(a);
    });

  return [...strict, ...fallback].slice(0, Math.max(minimum, 12));
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
    descEn: 'The two dakuten strokes transform the voiceless K sound into voiced G.'
  },
  {
    id: 2,
    group: 'z',
    romaji: ['za', 'ji', 'zu', 'ze', 'zo'],
    baseRomaji: ['sa', 'shi', 'su', 'se', 'so'],
    titleIt: 'Riga Z / J (S ➔ Z/J con ゛)',
    titleEn: 'Row Z / J (S ➔ Z/J with ゛)',
    descIt: 'La riga S diventa Z, con la particolarità "shi" che si trasforma in "ji" (じ/ジ).',
    descEn: 'Row S becomes Z, with "shi" transforming into "ji" (じ/ジ).'
  },
  {
    id: 3,
    group: 'd',
    romaji: ['da', 'ji (dji)', 'zu (dzu)', 'de', 'do'],
    baseRomaji: ['ta', 'chi', 'tsu', 'te', 'to'],
    titleIt: 'Riga D (T ➔ D con ゛)',
    titleEn: 'Row D (T ➔ D with ゛)',
    descIt: 'La riga T diventa D. "Chi" diventa "ji" (ぢ/ヂ) e "tsu" diventa "zu" (づ/ヅ).',
    descEn: 'Row T becomes D. "Chi" becomes "ji" (ぢ/ヂ) and "tsu" becomes "zu" (づ/ヅ).'
  },
  {
    id: 4,
    group: 'b',
    romaji: ['ba', 'bi', 'bu', 'be', 'bo'],
    baseRomaji: ['ha', 'hi', 'fu', 'he', 'ho'],
    titleIt: 'Riga B (H ➔ B con ゛)',
    titleEn: 'Row B (H ➔ B with ゛)',
    descIt: 'I suoni aspirati H/F si trasformano nel suono occlusivo sonoro B.',
    descEn: 'Aspirated H/F sounds transform into voiced plosive B sounds.'
  },
  {
    id: 5,
    group: 'p',
    romaji: ['pa', 'pi', 'pu', 'pe', 'po'],
    baseRomaji: ['ha', 'hi', 'fu', 'he', 'ho'],
    titleIt: 'Riga P (H ➔ P con ゜ Handakuten)',
    titleEn: 'Row P (H ➔ P with ゜ Handakuten)',
    descIt: 'Il cerchietto maru trasforma la riga H nel suono plosivo sordo P.',
    descEn: 'The small maru circle transforms row H into voiceless plosive P sounds.'
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

export function getDakutenAllowedKana(lesson, scriptMode) {
  const property = scriptMode === 'katakana' ? 'katakana' : 'hiragana';
  const basicKana = new Set(HIRAGANA_BASIC.map(item => item[property]).filter(Boolean));
  const cumulativeDakuten = new Set(lesson.cumulativeRomaji.map(romaji => dakutenByRomaji.get(romaji)?.[property]).filter(Boolean));
  return new Set([...basicKana, ...cumulativeDakuten]);
}

export function getDakutenLessonVocabulary(lesson, scriptMode, minimum = 6) {
  const allowedKana = getDakutenAllowedKana(lesson, scriptMode);
  const property = scriptMode === 'katakana' ? 'katakana' : 'hiragana';
  const targetDakutenChars = new Set(lesson.romaji.map(romaji => dakutenByRomaji.get(romaji)?.[property]).filter(Boolean));

  const candidates = VOCABULARY.filter((word) => word.script === scriptMode);
  
  // Prefer words that contain the day's specific dakuten characters
  const containingTarget = candidates.filter(word => 
    Array.from(word.kana).some(char => targetDakutenChars.has(char))
  );

  if (containingTarget.length >= minimum) {
    return containingTarget.slice(0, 12);
  }

  // Fallback to words containing any allowed characters
  const generalAllowed = candidates.filter(word => 
    Array.from(word.kana).filter(isKanaCharacter).every(char => allowedKana.has(char))
  );

  return [...new Set([...containingTarget, ...generalAllowed])].slice(0, Math.max(minimum, 10));
}
