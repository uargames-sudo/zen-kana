import * as LucideIcons from 'lucide-react';
import vocabulary from '../../vocabulary.json';
import { 
  HIRAGANA_BASIC, 
  KANA_DAKUTEN, 
  KANA_COMBINATION 
} from './kanaData';

export const VOCABULARY = vocabulary;

export function keywordToPascalCase(keyword = '') {
  return keyword
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

export function getVocabularyIcon(keyword) {
  const iconName = keywordToPascalCase(keyword);
  return LucideIcons[iconName] || LucideIcons.HelpCircle;
}

export function getVocabularyByScript(scriptMode = 'all') {
  if (scriptMode === 'hiragana') {
    return VOCABULARY.filter((word) => word.script === 'hiragana');
  }
  if (scriptMode === 'katakana') {
    return VOCABULARY.filter((word) => word.script === 'katakana');
  }
  return VOCABULARY;
}

/**
 * Generate full syllable items from the complete Kana Syllabary (Gojūon, Dakuten, Yoon)
 * for direct syllable training in Kana Puzzle and Active Study.
 */
export function getSyllablesDataset(scriptMode = 'all', category = 'all') {
  const items = [];

  const addEntries = (dataset, catName) => {
    dataset.forEach((entry, idx) => {
      if (!entry || !entry.romaji) return;

      if (scriptMode === 'all' || scriptMode === 'hiragana') {
        if (entry.hiragana) {
          items.push({
            id: `syl-h-${catName}-${idx}-${entry.hiragana}`,
            kana: entry.hiragana,
            romaji: entry.romaji.split(' ')[0], // clean e.g. "ji (dji)" -> "ji"
            italian: entry.exampleIt || entry.romaji,
            english: entry.exampleEn || entry.romaji,
            script: 'hiragana',
            category: catName,
            type: 'syllable',
            imageKeyword: 'sparkles',
            japanese: entry.hiragana,
            acceptedRomaji: [entry.romaji.split(' ')[0]]
          });
        }
      }

      if (scriptMode === 'all' || scriptMode === 'katakana') {
        if (entry.katakana) {
          items.push({
            id: `syl-k-${catName}-${idx}-${entry.katakana}`,
            kana: entry.katakana,
            romaji: entry.romaji.split(' ')[0],
            italian: entry.exampleIt || entry.romaji,
            english: entry.exampleEn || entry.romaji,
            script: 'katakana',
            category: catName,
            type: 'syllable',
            imageKeyword: 'sparkles',
            japanese: entry.katakana,
            acceptedRomaji: [entry.romaji.split(' ')[0]]
          });
        }
      }
    });
  };

  if (category === 'all' || category === 'basic') {
    addEntries(HIRAGANA_BASIC.filter(e => e.hiragana), 'basic');
  }
  if (category === 'all' || category === 'dakuten') {
    addEntries(KANA_DAKUTEN, 'dakuten');
  }
  if (category === 'all' || category === 'yoon') {
    addEntries(KANA_COMBINATION, 'yoon');
  }

  return items;
}
