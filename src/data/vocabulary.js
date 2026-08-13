import * as LucideIcons from 'lucide-react';
import vocabulary from '../../vocabulary.json';

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

export function getVocabularyByScript(scriptMode) {
  return VOCABULARY.filter((word) => word.type === scriptMode);
}
