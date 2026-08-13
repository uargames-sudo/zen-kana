import { HIRAGANA_BASIC } from './kanaData';
import { VOCABULARY } from './vocabulary';

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
  const candidates = VOCABULARY.filter((word) => word.type === scriptMode);
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
