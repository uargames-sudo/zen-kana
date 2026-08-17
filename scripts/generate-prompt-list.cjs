const fs = require('fs');
const path = require('path');
const vocabulary = require(path.join(__dirname, '../vocabulary.json'));

const stylePromptSuffix = "Clean bold outlines, warm minimalist color palette, Kyoto lacquer red accents, warm cream and ink black, solid clean neutral off-white background. No text, no words, no letters.";

const prompts = vocabulary.map(item => {
  return {
    id: item.id,
    kana: item.kana,
    romaji: item.romaji,
    italian: item.italian,
    english: item.english,
    script: item.script,
    filename: `${item.id}.jpg`,
    prompt: `Minimalist 2D vector flat Japanese style illustration of: ${item.english} (${item.italian}). ${stylePromptSuffix}`
  };
});

fs.writeFileSync('./vocab-prompts.json', JSON.stringify(prompts, null, 2), 'utf-8');
console.log(`Successfully generated vocab-prompts.json with ${prompts.length} prompt templates.`);
