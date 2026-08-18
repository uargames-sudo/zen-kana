import { HIRAGANA_BASIC, KANA_DAKUTEN, KANA_COMBINATION } from './kanaData';
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


// ====================================================
// 3. YŌON COMBINATIONS COURSE (6 Days, 33 Kana)
// ====================================================
const YOON_SYLLABLES = [
  {
    id: 1,
    romaji: ['kya', 'kyu', 'kyo', 'sha', 'shu', 'sho'],
    baseKanaH: ['き', 'き', 'き', 'し', 'し', 'し'],
    baseKanaK: ['キ', 'キ', 'キ', 'シ', 'シ', 'シ'],
    yoonModifierH: ['ゃ', 'ゅ', 'ょ', 'ゃ', 'ゅ', 'ょ'],
    yoonModifierK: ['ャ', 'ュ', 'ョ', 'ャ', 'ュ', 'ョ'],
    titleIt: 'Righe K & S (きゃ・きゅ・きょ / しゃ・しゅ・しょ)',
    titleEn: 'Rows K & S (kya, kyu, kyo / sha, shu, sho)',
    descIt: 'La fusione fondamentale: la consonante con vocale -I si fonde con piccolo ya, yu, yo in 1 sola sillaba.',
    descEn: 'The fundamental contraction: the -I consonant merges with small ya, yu, yo into a single beat.',
    theory: {
      it: {
        title: 'Cosa sono le Combinazioni Yōon (拗音)?',
        intro: 'I suoni Yōon (suoni contratti) si formano unendo una sillaba base che finisce per -I (come き o し) con un piccolo ya (ゃ), yu (ゅ) o yo (ょ). Non si pronunciano come due lettere separate, ma si fondono in un unico tempo/mora!',
        points: [
          'き (ki) + ゃ (piccolo ya) = きゃ (kya)',
          'き (ki) + ゅ (piccolo yu) = きゅ (kyu)',
          'き (ki) + ょ (piccolo yo) = きょ (kyo)',
          'し (shi) + ゃ = しゃ (sha) ★ non "shya"',
          'し (shi) + ゅ = しゅ (shu) ★ non "shyu"',
          'し (shi) + ょ = しょ (sho) ★ non "shyo"'
        ],
        tip: '💡 Nota Fonetica: Nota che しゃ, しゅ, しょ si pronunciano direttamente "sha, shu, sho" come in "sciarpa" o "sciupare".'
      },
      en: {
        title: 'What are Yōon Combinations (拗音)?',
        intro: 'Yōon (contracted sounds) are created by joining an -I syllable (like き or し) with a small ya (ゃ), yu (ゅ), or yo (ょ). They are not pronounced as two separate sounds, but blended together into a single beat!',
        points: [
          'ki + small ya = kya',
          'ki + small yu = kyu',
          'ki + small yo = kyo',
          'shi + small ya = sha ★ (not "shya")',
          'shi + small yu = shu ★ (not "shyu")',
          'shi + small yo = sho ★ (not "shyo")'
        ],
        tip: '💡 Phonetic Note: Notice that しゃ, しゅ, しょ are spelled and pronounced directly as "sha, shu, sho"!'
      }
    }
  },
  {
    id: 2,
    romaji: ['cha', 'chu', 'cho', 'nya', 'nyu', 'nyo'],
    baseKanaH: ['ち', 'ち', 'ち', 'に', 'に', 'に'],
    baseKanaK: ['チ', 'チ', 'チ', 'ニ', 'ニ', 'ニ'],
    yoonModifierH: ['ゃ', 'ゅ', 'ょ', 'ゃ', 'ゅ', 'ょ'],
    yoonModifierK: ['ャ', 'ュ', 'ョ', 'ャ', 'ュ', 'ョ'],
    titleIt: 'Righe T & N (ちゃ・ちゅ・ちょ / にゃ・にゅ・にょ)',
    titleEn: 'Rows T & N (cha, chu, cho / nya, nyu, nyo)',
    descIt: 'I suoni dolci della riga T (cha, chu, cho) e i suoni nasali della riga N (nya, nyu, nyo).',
    descEn: 'The soft sounds of row T (cha, chu, cho) and nasal sounds of row N (nya, nyu, nyo).',
    theory: {
      it: {
        title: 'Righe T & N (CHA, CHU, CHO & NYA, NYU, NYO)',
        intro: 'ち (chi) combinato con il piccolo ya/yu/yo genera i suoni "cha, chu, cho" (come in "ciao", "ciuffo", "cioccolato"). に (ni) genera i suoni nasali "nya, nyu, nyo" (come in "gnocco").',
        points: [
          'ち (chi) + ゃ = ちゃ (cha)',
          'ち (chi) + ゅ = ちゅ (chu)',
          'ち (chi) + ょ = ちょ (cho)',
          'に (ni) + ゃ = にゃ (nya)',
          'に (ni) + ゅ = にゅ (nyu)',
          'に (ni) + ょ = にょ (nyo)'
        ],
        tip: '💡 Curiosità: "にゃん" (nyan) è l\'onomatopea giapponese per il miagolio del gatto!'
      },
      en: {
        title: 'Rows T & N (CHA, CHU, CHO & NYA, NYU, NYO)',
        intro: 'ち (chi) combined with small ya/yu/yo produces "cha, chu, cho" (as in "champion", "choose", "chocolate"). に (ni) produces nasal "nya, nyu, nyo" sounds.',
        points: [
          'chi + small ya = cha',
          'chi + small yu = chu',
          'chi + small yo = cho',
          'ni + small ya = nya',
          'ni + small yu = nyu',
          'ni + small yo = nyo'
        ],
        tip: '💡 Fun Fact: "にゃん" (nyan) is the Japanese onomatopoeia for a cat\'s meow!'
      }
    }
  },
  {
    id: 3,
    romaji: ['hya', 'hyu', 'hyo', 'mya', 'myu', 'myo'],
    baseKanaH: ['ひ', 'ひ', 'ひ', 'み', 'み', 'み'],
    baseKanaK: ['ヒ', 'ヒ', 'ヒ', 'ミ', 'ミ', 'ミ'],
    yoonModifierH: ['ゃ', 'ゅ', 'ょ', 'ゃ', 'ゅ', 'ょ'],
    yoonModifierK: ['ャ', 'ュ', 'ョ', 'ャ', 'ュ', 'ョ'],
    titleIt: 'Righe H & M (ひゃ・ひゅ・ひょ / みゃ・みゅ・みょ)',
    titleEn: 'Rows H & M (hya, hyu, hyo / mya, myu, myo)',
    descIt: 'Suoni aspirati con la H e labiali morbidi con la M.',
    descEn: 'Aspirated sounds with H and soft labial sounds with M.',
    theory: {
      it: {
        title: 'Righe H & M (HYA, HYU, HYO & MYA, MYU, MYO)',
        intro: 'ひ (hi) si fonde con ya/yu/yo per creare "hya, hyu, hyo" (frequente nei numeri, es. 百 = ひゃく / hyaku = 100). み (mi) si fonde per creare "mya, myu, myo" (es. 名字 = みょうじ / myouji = cognome).',
        points: [
          'ひ (hi) + ゃ/ゅ/ょ = ひゃ, ひゅ, ひょ',
          'み (mi) + ゃ/ゅ/ょ = みゃ, みゅ, みょ'
        ],
        tip: '💡 Esempio: "ひゃく" (hyaku) è una delle parole più usate in assoluto per indicare il numero 100.'
      },
      en: {
        title: 'Rows H & M (HYA, HYU, HYO & MYA, MYU, MYO)',
        intro: 'ひ (hi) merges into "hya, hyu, hyo" (frequent in numbers, e.g. 百 = ひゃく / hyaku = 100). み (mi) merges into "mya, myu, myo" (e.g. 名字 = myouji = surname).',
        points: [
          'hi + small ya/yu/yo = hya, hyu, hyo',
          'mi + small ya/yu/yo = mya, myu, myo'
        ],
        tip: '💡 Example: "ひゃく" (hyaku) is one of the most common words, meaning the number 100.'
      }
    }
  },
  {
    id: 4,
    romaji: ['rya', 'ryu', 'ryo'],
    baseKanaH: ['り', 'り', 'り'],
    baseKanaK: ['リ', 'リ', 'リ'],
    yoonModifierH: ['ゃ', 'ゅ', 'ょ'],
    yoonModifierK: ['ャ', 'ュ', 'ョ'],
    titleIt: 'Riga R & Proporzioni Grafiche (りゃ・りゅ・りょ)',
    titleEn: 'Row R & Graphic Proportions (rya, ryu, ryo)',
    descIt: 'I suoni con la R e la regola visiva fondamentale per distinguere i piccoli kana.',
    descEn: 'R sounds and the essential visual rule to distinguish small kana from normal kana.',
    theory: {
      it: {
        title: 'Riga R e la Dimensione Visiva del Piccolo ゃ',
        intro: 'La riga R forma "りゃ, りゅ, りょ" (es. りょこう = viaggio, りゅう = drago). In questa lezione impariamo la regola grafica cruciale: il piccolo ゃ è scritto a circa 1/4 della dimensione normale e posizionato in basso a destra!',
        points: [
          'きや (ki-ya, 2 sillabe separate)',
          'きゃ (kya, 1 singola sillaba contratta)',
          'りよ (ri-yo, 2 sillabe) vs りょ (ryo, 1 sillaba)'
        ],
        tip: '💡 Regola Grafica: Se il kana ha dimensione normale (や, ゆ, よ) si legge staccato in due battiti. Se è rimpicciolito (ゃ, ゅ, ょ) forma un suono Yōon in un unico battito!'
      },
      en: {
        title: 'Row R and Small ゃ Visual Proportions',
        intro: 'Row R forms "rya, ryu, ryo" (e.g. りょこう = travel, りゅう = dragon). Here we focus on the crucial visual rule: small ゃ is written at roughly 1/4 normal size in the lower-right corner!',
        points: [
          'きや (ki-ya, 2 separate beats)',
          'きゃ (kya, 1 single blended syllable)',
          'りよ (ri-yo, 2 beats) vs りょ (ryo, 1 beat)'
        ],
        tip: '💡 Visual Rule: Full-sized や, ゆ, よ are read as separate syllables. Small ゃ, ゅ, ょ form a contracted Yōon sound in one beat!'
      }
    }
  },
  {
    id: 5,
    romaji: ['gya', 'gyu', 'gyo', 'ja', 'ju', 'jo'],
    baseKanaH: ['ぎ', 'ぎ', 'ぎ', 'じ', 'じ', 'じ'],
    baseKanaK: ['ギ', 'ギ', 'ギ', 'ジ', 'ジ', 'ジ'],
    yoonModifierH: ['ゃ', 'ゅ', 'ょ', 'ゃ', 'ゅ', 'ょ'],
    yoonModifierK: ['ャ', 'ュ', 'ョ', 'ャ', 'ュ', 'ョ'],
    titleIt: 'Dakuten Yōon: Righe G & J (ぎゃ・ぎゅ・ぎょ / じゃ・じゅ・じょ)',
    titleEn: 'Dakuten Yōon: Rows G & J (gya, gyo, gyo / ja, ju, jo)',
    descIt: 'Le combinazioni Yōon con i due trattini dakuten: G sonora e J dolce.',
    descEn: 'Yōon combinations with dakuten ten-ten strokes: voiced G and soft J.',
    theory: {
      it: {
        title: 'I suoni Yōon Sonori: GYA, GYU, GYO & JA, JU, JO',
        intro: 'Anche le sillabe con il dakuten ゛ possono formare suoni Yōon! ぎ (gi) forma "gya, gyu, gyo", mentre じ (ji) forma "ja, ju, jo" (come in "giacca", "giubbotto", "giorno").',
        points: [
          'ぎ (gi) + ゃ/ゅ/ょ = ぎゃ (gya), ぎゅ (gyu), ぎょ (gyo)',
          'じ (ji) + ゃ/ゅ/ょ = じゃ (ja), じゅ (ju), じょ (jo)'
        ],
        tip: '💡 Nota: In Romaji si scrive "ja, ju, jo" (senza la "y") perché la "j" include già il suono palatale.'
      },
      en: {
        title: 'Voiced Yōon Sounds: GYA, GYU, GYO & JA, JU, JO',
        intro: 'Syllables with dakuten ゛ also form Yōon! ぎ (gi) forms "gya, gyu, gyo", while じ (ji) forms "ja, ju, jo" (as in "jacket", "juice", "joke").',
        points: [
          'gi + small ya/yu/yo = gya, gyu, gyo',
          'ji + small ya/yu/yo = ja, ju, jo'
        ],
        tip: '💡 Note: In Romaji it is written as "ja, ju, jo" (without "y") because "j" already contains the palatal sound.'
      }
    }
  },
  {
    id: 6,
    romaji: ['bya', 'byu', 'byo', 'pya', 'pyu', 'pyo'],
    baseKanaH: ['び', 'び', 'び', 'ぴ', 'ぴ', 'ぴ'],
    baseKanaK: ['ビ', 'ビ', 'ビ', 'ピ', 'ピ', 'ピ'],
    yoonModifierH: ['ゃ', 'ゅ', 'ょ', 'ゃ', 'ゅ', 'ょ'],
    yoonModifierK: ['ャ', 'ュ', 'ョ', 'ャ', 'ュ', 'ョ'],
    titleIt: 'Dakuten & Handakuten Yōon: Righe B & P (びゃ・びゅ・びょ / ぴゃ・ぴゅ・ぴょ)',
    titleEn: 'Dakuten & Handakuten Yōon: Rows B & P (bya, byu, byo / pya, pyu, pyo)',
    descIt: 'I suoni sonori B e semi-sonori P combinati con ya, yu, yo.',
    descEn: 'Voiced B and semi-voiced P sounds combined with ya, yu, yo.',
    theory: {
      it: {
        title: 'Righe B & P Yōon (BYA, BYU, BYO & PYA, PYU, PYO)',
        intro: 'び (bi con ゛) forma "bya, byu, byo" (frequente in 病院 = びょういん / byouin = ospedale). ぴ (pi con ゜) forma "pya, pyu, pyo" (frequente in parole onomatopeiche o numeri come 600 = ろっぴゃく).',
        points: [
          'び (bi) + ゃ/ゅ/ょ = びゃ (bya), びゅ (byu), びょ (byo)',
          'ぴ (pi) + ゃ/ゅ/ょ = ぴゃ (pya), ぴゅ (pyu), ぴょ (pyo)'
        ],
        tip: '💡 Complimenti: Con questa lezione hai completato tutte le 33 combinazioni Yōon del giapponese!'
      },
      en: {
        title: 'Rows B & P Yōon (BYA, BYU, BYO & PYA, PYU, PYO)',
        intro: 'び (bi with ゛) forms "bya, byu, byo" (frequent in 病院 = byouin = hospital). ぴ (pi with ゜) forms "pya, pyu, pyo" (frequent in onomatopoeia or numbers like 600 = roppyaku).',
        points: [
          'bi + small ya/yu/yo = bya, byu, byo',
          'pi + small ya/yu/yo = pya, pyu, pyo'
        ],
        tip: '💡 Congratulations: With this lesson you have mastered all 33 Yōon combinations of the Japanese language!'
      }
    }
  }
];

const yoonByRomaji = new Map(KANA_COMBINATION.map((item) => [item.romaji, item]));

export const YOON_LESSONS = YOON_SYLLABLES.map((item) => ({
  ...item
}));

export function getYoonLessonKana(lesson, scriptMode) {
  const property = scriptMode === 'katakana' ? 'katakana' : 'hiragana';
  const baseProp = scriptMode === 'katakana' ? 'baseKanaK' : 'baseKanaH';
  const modProp = scriptMode === 'katakana' ? 'yoonModifierK' : 'yoonModifierH';

  return lesson.romaji.map((romaji, idx) => {
    const item = yoonByRomaji.get(romaji);
    return {
      ...item,
      char: item?.[property],
      baseChar: lesson[baseProp]?.[idx],
      yoonModifier: lesson[modProp]?.[idx],
      cleanRomaji: romaji
    };
  }).filter((item) => item.char);
}

// Map of curated Yōon vocabulary examples for rich contextual learning
const YOON_EXTRA_VOCAB = [
  { id: 'y_kya', kanaH: 'きゃく', kanaK: 'キャク', romaji: 'kyaku', english: 'guest', italian: 'ospite', imageKeyword: 'friend', yoon: 'kya' },
  { id: 'y_kyu', kanaH: 'きゅうり', kanaK: 'キュウリ', romaji: 'kyuuri', english: 'cucumber', italian: 'cetriolo', imageKeyword: 'apple', yoon: 'kyu' },
  { id: 'y_kyo', kanaH: 'きょう', kanaK: 'キョウ', romaji: 'kyou', english: 'today', italian: 'oggi', imageKeyword: 'sun', yoon: 'kyo' },
  { id: 'y_sha', kanaH: 'しゃしん', kanaK: 'シャシン', romaji: 'shashin', english: 'photo', italian: 'foto', imageKeyword: 'picture', yoon: 'sha' },
  { id: 'y_shu', kanaH: 'しゅくだい', kanaK: 'シュクダイ', romaji: 'shukudai', english: 'homework', italian: 'compiti', imageKeyword: 'book', yoon: 'shu' },
  { id: 'y_sho', kanaH: 'しょくどう', kanaK: 'ショクドウ', romaji: 'shokudou', english: 'dining hall', italian: 'mensa', imageKeyword: 'house', yoon: 'sho' },
  { id: 'y_cha', kanaH: 'おちゃ', kanaK: 'オチャ', romaji: 'ocha', english: 'green tea', italian: 'tè verde', imageKeyword: 'water', yoon: 'cha' },
  { id: 'y_chu', kanaH: 'ちゅうしゃ', kanaK: 'チュウシャ', romaji: 'chuusha', english: 'injection', italian: 'iniezione', imageKeyword: 'hospital', yoon: 'chu' },
  { id: 'y_cho', kanaH: 'チョコ', kanaK: 'チョコ', romaji: 'choko', english: 'chocolate', italian: 'cioccolato', imageKeyword: 'cake', yoon: 'cho' },
  { id: 'y_nya', kanaH: 'にゃんこ', kanaK: 'ニャンコ', romaji: 'nyanko', english: 'kitty', italian: 'gattino', imageKeyword: 'cat', yoon: 'nya' },
  { id: 'y_nyu', kanaH: 'ニュース', kanaK: 'ニュース', romaji: 'nyuusu', english: 'news', italian: 'notizie', imageKeyword: 'tv', yoon: 'nyu' },
  { id: 'y_nyo', kanaH: 'にょうぼう', kanaK: 'ニョウボウ', romaji: 'nyoubou', english: 'wife', italian: 'moglie', imageKeyword: 'friend', yoon: 'nyo' },
  { id: 'y_hya', kanaH: 'ひゃく', kanaK: 'ヒャク', romaji: 'hyaku', english: 'hundred', italian: 'cento', imageKeyword: 'money', yoon: 'hya' },
  { id: 'y_hyu', kanaH: 'ひゅーず', kanaK: 'ヒューズ', romaji: 'hyuuzu', english: 'fuse', italian: 'fusibile', imageKeyword: 'light', yoon: 'hyu' },
  { id: 'y_hyo', kanaH: 'ひょうざん', kanaK: 'ヒョウザン', romaji: 'hyouzan', english: 'iceberg', italian: 'iceberg', imageKeyword: 'sea', yoon: 'hyo' },
  { id: 'y_mya', kanaH: 'みゃく', kanaK: 'ミャク', romaji: 'myaku', english: 'pulse', italian: 'battito', imageKeyword: 'heart', yoon: 'mya' },
  { id: 'y_myu', kanaH: 'みゅーじあむ', kanaK: 'ミュージアム', romaji: 'myuujiamu', english: 'museum', italian: 'museo', imageKeyword: 'house', yoon: 'myu' },
  { id: 'y_myo', kanaH: 'みょうじ', kanaK: 'ミョウジ', romaji: 'myouji', english: 'surname', italian: 'cognome', imageKeyword: 'friend', yoon: 'myo' },
  { id: 'y_rya', kanaH: 'りゃくご', kanaK: 'リャクゴ', romaji: 'ryakugo', english: 'abbreviation', italian: 'abbreviazione', imageKeyword: 'book', yoon: 'rya' },
  { id: 'y_ryu', kanaH: 'りゅう', kanaK: 'リュウ', romaji: 'ryuu', english: 'dragon', italian: 'drago', imageKeyword: 'bird', yoon: 'ryu' },
  { id: 'y_ryo', kanaH: 'りょこう', kanaK: 'リョコウ', romaji: 'ryokou', english: 'travel', italian: 'viaggio', imageKeyword: 'car', yoon: 'ryo' },
  { id: 'y_gya', kanaH: 'ぎゃく', kanaK: 'ギャク', romaji: 'gyaku', english: 'opposite', italian: 'opposto', imageKeyword: 'help', yoon: 'gya' },
  { id: 'y_gyu', kanaH: 'ぎゅうにく', kanaK: 'ギュウニク', romaji: 'gyuuniku', english: 'beef', italian: 'carne di manzo', imageKeyword: 'food', yoon: 'gyu' },
  { id: 'y_gyo', kanaH: 'ぎょうざ', kanaK: 'ギョウザ', romaji: 'gyouza', english: 'dumplings', italian: 'ravioli', imageKeyword: 'food', yoon: 'gyo' },
  { id: 'y_ja', kanaH: 'じゃがいも', kanaK: 'ジャガイモ', romaji: 'jagaimo', english: 'potato', italian: 'patata', imageKeyword: 'food', yoon: 'ja' },
  { id: 'y_ju', kanaH: 'ジュース', kanaK: 'ジュース', romaji: 'juusu', english: 'juice', italian: 'succo', imageKeyword: 'water', yoon: 'ju' },
  { id: 'y_jo', kanaH: 'じょせい', kanaK: 'ジョセイ', romaji: 'josei', english: 'woman', italian: 'donna', imageKeyword: 'friend', yoon: 'jo' },
  { id: 'y_bya', kanaH: 'びゃくや', kanaK: 'ビャクヤ', romaji: 'byakuya', english: 'white night', italian: 'notte bianca', imageKeyword: 'sun', yoon: 'bya' },
  { id: 'y_byu', kanaH: 'びゅー', kanaK: 'ビュー', romaji: 'byuu', english: 'view', italian: 'panorama', imageKeyword: 'mountain', yoon: 'byu' },
  { id: 'y_byo', kanaH: 'びょういん', kanaK: 'ビョウイン', romaji: 'byouin', english: 'hospital', italian: 'ospedale', imageKeyword: 'house', yoon: 'byo' },
  { id: 'y_pya', kanaH: 'ろっぴゃく', kanaK: 'ロッピャク', romaji: 'roppyaku', english: 'six hundred', italian: 'seicento', imageKeyword: 'money', yoon: 'pya' },
  { id: 'y_pyu', kanaH: 'ぴゅあ', kanaK: 'ピュア', romaji: 'pyua', english: 'pure', italian: 'puro', imageKeyword: 'water', yoon: 'pyu' },
  { id: 'y_pyo', kanaH: 'ぴょんぴょん', kanaK: 'ピョンピョン', romaji: 'pyonpyon', english: 'hopping', italian: 'saltellante', imageKeyword: 'dog', yoon: 'pyo' }
];

export function getYoonLessonVocabulary(lesson, scriptMode) {
  const property = scriptMode === 'katakana' ? 'katakana' : 'hiragana';
  const targetChars = new Set(lesson.romaji.map(romaji => yoonByRomaji.get(romaji)?.[property]).filter(Boolean));
  const candidates = VOCABULARY.filter((word) => word.script === scriptMode);

  // 1. From standard vocabulary.json
  const vocabMatching = candidates.filter(word => 
    Array.from(targetChars).some(yoonChar => word.kana.includes(yoonChar))
  );

  // 2. From curated Yoon examples
  const extraMatching = YOON_EXTRA_VOCAB
    .filter(item => lesson.romaji.includes(item.yoon))
    .map(item => ({
      id: item.id,
      kana: scriptMode === 'katakana' ? item.kanaK : item.kanaH,
      romaji: item.romaji,
      english: item.english,
      italian: item.italian,
      imageKeyword: item.imageKeyword,
      script: scriptMode
    }));

  const combined = [...vocabMatching];
  extraMatching.forEach(extra => {
    if (!combined.some(c => c.romaji === extra.romaji || c.kana === extra.kana)) {
      combined.push(extra);
    }
  });

  return combined.slice(0, 10);
}


// ====================================================
// 4. SPECIAL PHONETICS COURSE (3 Days)
// ====================================================
const PHONETICS_SYLLABLES = [
  {
    id: 1,
    topic: 'sokuon',
    hiraKana: [
      { char: 'っ', cleanRomaji: 'sokuon (っ)', baseChar: 'つ', modifier: 'piccolo', desc: 'Raddoppia consonante' },
      { char: 'っき', cleanRomaji: 'kki', baseChar: 'き', modifier: 'っ', desc: 'Doppia K' },
      { char: 'っし', cleanRomaji: 'sshi', baseChar: 'し', modifier: 'っ', desc: 'Doppia S' },
      { char: 'って', cleanRomaji: 'tte', baseChar: 'て', modifier: 'っ', desc: 'Doppia T' },
      { char: 'っぷ', cleanRomaji: 'ppu', baseChar: 'ぷ', modifier: 'っ', desc: 'Doppia P' }
    ],
    kataKana: [
      { char: 'ッ', cleanRomaji: 'sokuon (ッ)', baseChar: 'ツ', modifier: 'small', desc: 'Doubles consonant' },
      { char: 'ッカ', cleanRomaji: 'kka', baseChar: 'カ', modifier: 'ッ', desc: 'Double K' },
      { char: 'ッシ', cleanRomaji: 'sshi', baseChar: 'シ', modifier: 'ッ', desc: 'Double S' },
      { char: 'ット', cleanRomaji: 'tto', baseChar: 'ト', modifier: 'ッ', desc: 'Double T' },
      { char: 'ップ', cleanRomaji: 'ppu', baseChar: 'プ', modifier: 'ッ', desc: 'Double P' }
    ],
    titleIt: 'Sokuon (促音): Piccolo っ/ッ e Consonanti Doppie',
    titleEn: 'Sokuon: Small っ/ッ & Double Consonants',
    descIt: 'Il salto di 1 battito (glottal stop) che raddoppia la consonante successiva (K, S, T, P).',
    descEn: 'The 1-beat glottal pause that doubles the following consonant (K, S, T, P).',
    theory: {
      it: {
        title: 'Come funziona il Piccolo っ / ッ (Sokuon)',
        intro: 'Il piccolo っ (scritto a circa 1/4 della dimensione normale) NON si pronuncia "tsu". Rappresenta una brevissima pausa di silenzio (glottal stop) che raddoppia la consonante successiva!',
        points: [
          'き (ki) + っ (pausa) + ぷ (pu) = きっぷ (kippu, "biglietto")',
          'べ (be) + ッ (pausa) + ド (do) = ベッド (beddo, "letto")',
          'さ (sa) + ッ (pausa) + カー (kaa) = サッカー (sakkaa, "calcio")',
          'Si usa prima di consonanti sorde o sonore (K, S, T, P, G, D, B)'
        ],
        tip: '💡 Trucco di Ritmo: Trattieni il respiro per un istante prima di pronunciare la consonante successiva. Conta mentalmente 1 battito sulla pausa!'
      },
      en: {
        title: 'How Small っ / ッ (Sokuon) Works',
        intro: 'Small っ (written at 1/4 size) is NEVER pronounced as "tsu". It creates a tiny glottal stop (a beat of silence) that doubles the subsequent consonant!',
        points: [
          'ki + small tsu + pu = kippu ("ticket")',
          'be + small tsu + do = beddo ("bed")',
          'sa + small tsu + kaa = sakkaa ("soccer")',
          'Used strictly before consonants (K, S, T, P, G, D, B)'
        ],
        tip: '💡 Rhythm Tip: Hold your breath for half a second before releasing the next consonant. Count 1 distinct beat on the pause!'
      }
    }
  },
  {
    id: 2,
    topic: 'long-vowels',
    hiraKana: [
      { char: 'ああ', cleanRomaji: 'aa (ā)', baseChar: 'あ', modifier: 'あ', desc: 'Allungamento A' },
      { char: 'いい', cleanRomaji: 'ii (ī)', baseChar: 'い', modifier: 'い', desc: 'Allungamento I' },
      { char: 'うう', cleanRomaji: 'uu (ū)', baseChar: 'う', modifier: 'う', desc: 'Allungamento U' },
      { char: 'えい', cleanRomaji: 'ee / ei', baseChar: 'え', modifier: 'い', desc: 'Allungamento E con い' },
      { char: 'おう', cleanRomaji: 'oo / ou', baseChar: 'お', modifier: 'う', desc: 'Allungamento O con う' }
    ],
    kataKana: [
      { char: 'ー', cleanRomaji: 'chōonpu (ー)', baseChar: 'ー', modifier: 'lungo', desc: 'Allunga di 1 mora' },
      { char: 'アー', cleanRomaji: 'aa', baseChar: 'ア', modifier: 'ー', desc: 'A allungata' },
      { char: 'イー', cleanRomaji: 'ii', baseChar: 'イ', modifier: 'ー', desc: 'I allungata' },
      { char: 'ウー', cleanRomaji: 'uu', baseChar: 'ウ', modifier: 'ー', desc: 'U allungata' },
      { char: 'エー', cleanRomaji: 'ee', baseChar: 'エ', modifier: 'ー', desc: 'E allungata' },
      { char: 'オー', cleanRomaji: 'oo', baseChar: 'オ', modifier: 'ー', desc: 'O allungata' }
    ],
    titleIt: 'Vocali Lunghe (Chōonpu ー & Allungamenti Hiragana)',
    titleEn: 'Long Vowels (Chōonpu ー & Hiragana Elongations)',
    descIt: 'Allungamento vocalico a 2 battiti: il trattino ー in Katakana e le regole おう/えい in Hiragana.',
    descEn: 'Two-beat vowel lengthening: the ー mark in Katakana and おう/えい rules in Hiragana.',
    theory: {
      it: {
        title: 'Regole delle Vocali Lunghe (Chōon)',
        intro: 'In giapponese la lunghezza delle vocali cambia completamente il significato della parola! In Katakana si usa il trattino orizzontale "ー", mentre in Hiragana si aggiunge una vocale d\'estensione (in particolare U per allungare O, e I per allungare E).',
        points: [
          'In Katakana: コーヒー (koohii = caffè), ケーキ (keeki = torta)',
          'In Hiragana: O si allunga con う (es. たいよう = taiyoo, きょう = kyoo)',
          'In Hiragana: E si allunga con い (es. せんせい = sensee)',
          'Coppie minime: おばさん (zia, 4 morae) vs おばあさん (nonna, 5 morae)'
        ],
        tip: '💡 Regola d\'Oro: Mantieni la vocale per il doppio del tempo (2 battiti invece di 1). Non interrompere il flusso d\'aria!'
      },
      en: {
        title: 'Rules of Long Vowels (Chōon)',
        intro: 'In Japanese, vowel length completely changes the meaning of words! Katakana uses the horizontal line "ー", while Hiragana appends extension vowels (specifically U extends O, and I extends E).',
        points: [
          'In Katakana: コーヒー (koohii = coffee), ケーキ (keeki = cake)',
          'In Hiragana: O extends with う (e.g. たいよう = taiyou, きょう = kyou)',
          'In Hiragana: E extends with い (e.g. せんせい = sensei/sensee)',
          'Minimal pairs: おばさん (aunt) vs おばあさん (grandmother)'
        ],
        tip: '💡 Golden Rule: Hold the vowel sound for exactly twice as long (2 beats instead of 1). Keep air flowing smoothly!'
      }
    }
  },
  {
    id: 3,
    topic: 'particles-n',
    hiraKana: [
      { char: 'は', cleanRomaji: 'wa (particella)', baseChar: 'は', modifier: 'particella', desc: 'Letta "WA" come tema' },
      { char: 'へ', cleanRomaji: 'e (particella)', baseChar: 'へ', modifier: 'particella', desc: 'Letta "E" come direzione' },
      { char: 'を', cleanRomaji: 'o (particella)', baseChar: 'を', modifier: 'particella', desc: 'Letta "O" come oggetto' },
      { char: 'ん', cleanRomaji: 'n (mora)', baseChar: 'ん', modifier: 'nasale', desc: 'Consonante autonoma (1 battito)' }
    ],
    kataKana: [
      { char: 'ン', cleanRomaji: 'n (mora)', baseChar: 'ン', modifier: 'nasale', desc: 'Consonante autonoma (1 battito)' },
      { char: 'アン', cleanRomaji: 'an', baseChar: 'ア', modifier: 'ン', desc: 'A + N' },
      { char: 'イン', cleanRomaji: 'in', baseChar: 'イ', modifier: 'ン', desc: 'I + N' },
      { char: 'オン', cleanRomaji: 'on', baseChar: 'オ', modifier: 'ン', desc: 'O + N' }
    ],
    titleIt: 'Particelle Speciali & la Nasale Finale (は・へ・を & ん/ン)',
    titleEn: 'Special Particles & Final Nasal (は・へ・を & ん/ン)',
    descIt: 'Le eccezioni storiche di pronuncia per le particelle e il comportamento della nasale sillabica.',
    descEn: 'Historical pronunciation exceptions for particles and syllabic nasal behaviors.',
    theory: {
      it: {
        title: 'Particelle con Pronuncia Speciale e la N finale',
        intro: 'Tre particelle grammaticali mantengono la loro grafia storica ma cambiano pronuncia quando usate nella frase. Inoltre, "ん / ン" è l\'unica consonante autonoma che vale un intero battito!',
        points: [
          'は come particella di tema si legge "WA" (es. こんにちは = konnichiWA)',
          'へ come particella di moto a luogo si legge "E" (es. とうきょう へ = tokyou E)',
          'を come particella di complemento oggetto si legge "O" (es. ほん を よむ = hon O yomu)',
          'ん/ン vale 1 tempo intero e assimila il suono (m/n/ng) prima di B, M, P, K'
        ],
        tip: '💡 Attenzione: Si scrive "は" ma si pronuncia "WA" SOLO quando è la particella grammaticale (o in saluti fissi come konnichiwa / konbanwa)!'
      },
      en: {
        title: 'Particles with Special Pronunciation & Final N',
        intro: 'Three grammatical particles retain historical spelling but change their pronunciation in sentences. Also, "ん / ン" is the only independent consonant with a full beat!',
        points: [
          'は as topic particle is pronounced "WA" (e.g. こんにちは = konnichiWA)',
          'へ as directional particle is pronounced "E" (e.g. とうきょう へ = tokyo E)',
          'を as direct object particle is pronounced "O" (e.g. ほん を = hon O)',
          'ん/ン takes a full beat and assimilates (m/n/ng) before B, M, P, K'
        ],
        tip: '💡 Note: "は" is pronounced "WA" ONLY when acting as a grammatical particle or in set greetings (konnichiwa / konbanwa)!'
      }
    }
  }
];

export const PHONETICS_LESSONS = PHONETICS_SYLLABLES.map((item) => ({
  ...item
}));

export function getPhoneticsLessonKana(lesson, scriptMode) {
  const isKatakana = scriptMode === 'katakana';
  const list = isKatakana ? lesson.kataKana : lesson.hiraKana;
  return list.map((item) => ({
    ...item,
    romaji: item.cleanRomaji
  }));
}

const PHONETICS_EXTRA_VOCAB = [
  { id: 'p_gakkou', kanaH: 'がっこう', kanaK: 'ガッコウ', romaji: 'gakkou', english: 'school', italian: 'scuola', imageKeyword: 'house', topic: 'sokuon' },
  { id: 'p_zasshi', kanaH: 'ざっし', kanaK: 'ザッシ', romaji: 'zasshi', english: 'magazine', italian: 'rivista', imageKeyword: 'book', topic: 'sokuon' },
  { id: 'p_kitte', kanaH: 'きって', kanaK: 'キッテ', romaji: 'kitte', english: 'stamp', italian: 'francobollo', imageKeyword: 'letter', topic: 'sokuon' },
  { id: 'p_ippai', kanaH: 'いっぱい', kanaK: 'イッパイ', romaji: 'ippai', english: 'full', italian: 'pieno', imageKeyword: 'water', topic: 'sokuon' },
  { id: 'p_konnichiwa', kanaH: 'こんにちは', kanaK: 'コンニチハ', romaji: 'konnichiwa', english: 'hello', italian: 'ciao / buongiorno', imageKeyword: 'friend', topic: 'particles-n' },
  { id: 'p_arigatou', kanaH: 'ありがとう', kanaK: 'アリガトウ', romaji: 'arigatou', english: 'thank you', italian: 'grazie', imageKeyword: 'heart', topic: 'long-vowels' }
];

export function getPhoneticsLessonVocabulary(lesson, scriptMode) {
  const candidates = VOCABULARY.filter((word) => word.script === scriptMode);
  let vocabMatching = [];

  if (lesson.topic === 'sokuon') {
    const sokuonChar = scriptMode === 'katakana' ? 'ッ' : 'っ';
    vocabMatching = candidates.filter(w => w.kana.includes(sokuonChar));
  } else if (lesson.topic === 'long-vowels') {
    if (scriptMode === 'katakana') {
      vocabMatching = candidates.filter(w => w.kana.includes('ー'));
    } else {
      vocabMatching = candidates.filter(w => 
        w.kana.includes('う') || w.kana.includes('い') || w.romaji.includes('ou') || w.romaji.includes('ei')
      );
    }
  } else if (lesson.topic === 'particles-n') {
    const nChar = scriptMode === 'katakana' ? 'ン' : 'ん';
    vocabMatching = candidates.filter(w => w.kana.includes(nChar));
  }

  const extraMatching = PHONETICS_EXTRA_VOCAB
    .filter(item => item.topic === lesson.topic)
    .map(item => ({
      id: item.id,
      kana: scriptMode === 'katakana' ? item.kanaK : item.kanaH,
      romaji: item.romaji,
      english: item.english,
      italian: item.italian,
      imageKeyword: item.imageKeyword,
      script: scriptMode
    }));

  const combined = [...vocabMatching];
  extraMatching.forEach(extra => {
    if (!combined.some(c => c.romaji === extra.romaji || c.kana === extra.kana)) {
      combined.push(extra);
    }
  });

  return combined.slice(0, 10);
}


