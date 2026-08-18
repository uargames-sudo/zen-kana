/**
 * Japanese Kana & Romaji Syllable Tokenizer & Puzzle Helper
 * Decomposes Japanese vocabulary into atomic kana syllables and matching romaji units.
 */
import { 
  HIRAGANA_BASIC, 
  KANA_DAKUTEN, 
  KANA_COMBINATION 
} from '../data/kanaData';

// Map of all known Kana combinations (Yoon: kya, shu, cho...)
const YOON_MAP = {
  // Hiragana Yoon
  'きゃ': 'kya', 'きゅ': 'kyu', 'きょ': 'kyo',
  'しゃ': 'sha', 'しゅ': 'shu', 'しょ': 'sho',
  'ちゃ': 'cha', 'ちゅ': 'chu', 'ちょ': 'cho',
  'にゃ': 'nya', 'にゅ': 'nyu', 'にょ': 'nyo',
  'ひゃ': 'hya', 'ひゅ': 'hyu', 'ひょ': 'hyo',
  'みゃ': 'mya', 'みゅ': 'myu', 'みょ': 'myo',
  'りゃ': 'rya', 'りゅ': 'ryu', 'りょ': 'ryo',
  'ぎゃ': 'gya', 'ぎゅ': 'gyu', 'ぎょ': 'gyo',
  'じゃ': 'ja',  'じゅ': 'ju',  'じょ': 'jo',
  'びゃ': 'bya', 'びゅ': 'byu', 'びょ': 'byo',
  'ぴゃ': 'pya', 'ぴゅ': 'pyu', 'ぴょ': 'pyo',

  // Katakana Yoon & Foreign combinations
  'キャ': 'kya', 'キュ': 'kyu', 'キョ': 'kyo',
  'シャ': 'sha', 'シュ': 'shu', 'ショ': 'sho',
  'チャ': 'cha', 'チュ': 'chu', 'チョ': 'cho',
  'ニャ': 'nya', 'ニュ': 'nyu', 'ニョ': 'nyo',
  'ヒャ': 'hya', 'ヒュ': 'hyu', 'ヒョ': 'hyo',
  'ミャ': 'mya', 'ミュ': 'myu', 'ミョ': 'myo',
  'リャ': 'rya', 'リュ': 'ryu', 'リョ': 'ryo',
  'ギャ': 'gya', 'ギュ': 'gyu', 'ギョ': 'gyo',
  'ジャ': 'ja',  'ジュ': 'ju',  'ジョ': 'jo',
  'ビャ': 'bya', 'ビュ': 'byu', 'ビョ': 'byo',
  'ピャ': 'pya', 'ピュ': 'pyu', 'ピョ': 'pyo',
  'ファ': 'fa',  'フィ': 'fi',  'フェ': 'fe',  'フォ': 'fo',
  'ティ': 'ti',  'ディ': 'di',  'ウィ': 'wi',  'ウェ': 'we', 'ウォ': 'wo',
  'ヴァ': 'va',  'ヴィ': 'vi',  'ヴェ': 've',  'ヴォ': 'vo',
  'シェ': 'she', 'チェ': 'che', 'ジェ': 'je'
};

// Build comprehensive single-kana to romaji map
const SINGLE_KANA_MAP = {};
[...HIRAGANA_BASIC, ...KANA_DAKUTEN, ...KANA_COMBINATION].forEach(item => {
  if (!item) return;
  if (item.hiragana && item.romaji) {
    SINGLE_KANA_MAP[item.hiragana] = item.romaji;
  }
  if (item.katakana && item.romaji) {
    SINGLE_KANA_MAP[item.katakana] = item.romaji;
  }
});

// Special symbols
SINGLE_KANA_MAP['っ'] = 'tsu';
SINGLE_KANA_MAP['ッ'] = 'tsu';
SINGLE_KANA_MAP['ー'] = '—';

/**
 * Tokenize a Japanese Kana word into syllable tokens
 * @param {string} kanaStr Japanese kana string (e.g. "さかな", "でんしゃ", "コーヒー")
 * @returns {Array<{ kana: string, romaji: string }>} Array of syllable tokens
 */
export function tokenizeKana(kanaStr = '') {
  if (!kanaStr) return [];
  const tokens = [];
  let i = 0;

  while (i < kanaStr.length) {
    // 1. Check 2-character Yoon combination (e.g. しゃ, キャ)
    if (i + 1 < kanaStr.length) {
      const pair = kanaStr.slice(i, i + 2);
      if (YOON_MAP[pair]) {
        tokens.push({
          kana: pair,
          romaji: YOON_MAP[pair]
        });
        i += 2;
        continue;
      }
    }

    // 2. Check single character
    const char = kanaStr[i];
    let romaji = SINGLE_KANA_MAP[char] || char;

    // Special gemination mark (sokuon) context
    if (char === 'っ' || char === 'ッ') {
      romaji = 'tsu';
    } else if (char === 'ー') {
      romaji = '—';
    }

    tokens.push({
      kana: char,
      romaji: romaji.toLowerCase()
    });
    i += 1;
  }

  return tokens;
}

/**
 * Pool of random syllables for distractors
 */
const HIRAGANA_DISTRACTOR_POOL = [
  { kana: 'あ', romaji: 'a' }, { kana: 'い', romaji: 'i' }, { kana: 'う', romaji: 'u' }, { kana: 'え', romaji: 'e' }, { kana: 'お', romaji: 'o' },
  { kana: 'か', romaji: 'ka' }, { kana: 'き', romaji: 'ki' }, { kana: 'く', romaji: 'ku' }, { kana: 'け', romaji: 'ke' }, { kana: 'こ', romaji: 'ko' },
  { kana: 'さ', romaji: 'sa' }, { kana: 'し', romaji: 'shi' }, { kana: 'す', romaji: 'su' }, { kana: 'せ', romaji: 'se' }, { kana: 'そ', romaji: 'so' },
  { kana: 'た', romaji: 'ta' }, { kana: 'ち', romaji: 'chi' }, { kana: 'つ', romaji: 'tsu' }, { kana: 'て', romaji: 'te' }, { kana: 'と', romaji: 'to' },
  { kana: 'な', romaji: 'na' }, { kana: 'に', romaji: 'ni' }, { kana: 'ぬ', romaji: 'nu' }, { kana: 'ね', romaji: 'ne' }, { kana: 'の', romaji: 'no' },
  { kana: 'は', romaji: 'ha' }, { kana: 'ひ', romaji: 'hi' }, { kana: 'ふ', romaji: 'fu' }, { kana: 'へ', romaji: 'he' }, { kana: 'ほ', romaji: 'ho' },
  { kana: 'ま', romaji: 'ma' }, { kana: 'み', romaji: 'mi' }, { kana: 'む', romaji: 'mu' }, { kana: 'め', romaji: 'me' }, { kana: 'も', romaji: 'mo' },
  { kana: 'や', romaji: 'ya' }, { kana: 'ゆ', romaji: 'yu' }, { kana: 'よ', romaji: 'yo' },
  { kana: 'ら', romaji: 'ra' }, { kana: 'り', romaji: 'ri' }, { kana: 'る', romaji: 'ru' }, { kana: 'れ', romaji: 're' }, { kana: 'ろ', romaji: 'ro' },
  { kana: 'わ', romaji: 'wa' }, { kana: 'ん', romaji: 'n' }
];

const KATAKANA_DISTRACTOR_POOL = [
  { kana: 'ア', romaji: 'a' }, { kana: 'イ', romaji: 'i' }, { kana: 'ウ', romaji: 'u' }, { kana: 'エ', romaji: 'e' }, { kana: 'オ', romaji: 'o' },
  { kana: 'カ', romaji: 'ka' }, { kana: 'キ', romaji: 'ki' }, { kana: 'ク', romaji: 'ku' }, { kana: 'ケ', romaji: 'ke' }, { kana: 'コ', romaji: 'ko' },
  { kana: 'サ', romaji: 'sa' }, { kana: 'シ', romaji: 'shi' }, { kana: 'ス', romaji: 'su' }, { kana: 'セ', romaji: 'se' }, { kana: 'ソ', romaji: 'so' },
  { kana: 'タ', romaji: 'ta' }, { kana: 'チ', romaji: 'chi' }, { kana: 'ツ', romaji: 'tsu' }, { kana: 'テ', romaji: 'te' }, { kana: 'ト', romaji: 'to' },
  { kana: 'ナ', romaji: 'na' }, { kana: 'ニ', romaji: 'ni' }, { kana: 'ヌ', romaji: 'nu' }, { kana: 'ネ', romaji: 'ne' }, { kana: 'ノ', romaji: 'no' },
  { kana: 'ハ', romaji: 'ha' }, { kana: 'ヒ', romaji: 'hi' }, { kana: 'フ', romaji: 'fu' }, { kana: 'ヘ', romaji: 'he' }, { kana: 'ホ', romaji: 'ho' },
  { kana: 'マ', romaji: 'ma' }, { kana: 'ミ', romaji: 'mi' }, { kana: 'ム', romaji: 'mu' }, { kana: 'メ', romaji: 'me' }, { kana: 'モ', romaji: 'mo' },
  { kana: 'ヤ', romaji: 'ya' }, { kana: 'ユ', romaji: 'yu' }, { kana: 'ヨ', romaji: 'yo' },
  { kana: 'ラ', romaji: 'ra' }, { kana: 'リ', romaji: 'ri' }, { kana: 'ル', romaji: 'ru' }, { kana: 'レ', romaji: 're' }, { kana: 'ロ', romaji: 'ro' },
  { kana: 'ワ', romaji: 'wa' }, { kana: 'ン', romaji: 'n' }, { kana: 'ー', romaji: '—' }
];

/**
 * Generate distractor tiles that are not already present in the target tokens
 * @param {Array<{ kana: string, romaji: string }>} existingTokens Target tokens
 * @param {string} scriptMode 'hiragana' | 'katakana'
 * @param {number} count Number of distractors (2 for Medium, 5 for Hard)
 * @returns {Array<{ kana: string, romaji: string, isDistractor: boolean }>}
 */
export function generateDistractors(existingTokens = [], scriptMode = 'hiragana', count = 0) {
  if (count <= 0) return [];

  const pool = scriptMode === 'katakana' ? KATAKANA_DISTRACTOR_POOL : HIRAGANA_DISTRACTOR_POOL;
  const existingKanaSet = new Set(existingTokens.map(t => t.kana));
  const existingRomajiSet = new Set(existingTokens.map(t => t.romaji));

  // Filter pool to avoid duplicate answers
  const availableDistractors = pool.filter(p => !existingKanaSet.has(p.kana) && !existingRomajiSet.has(p.romaji));
  const shuffled = [...availableDistractors].sort(() => Math.random() - 0.5);

  return shuffled.slice(0, count).map((item, idx) => ({
    ...item,
    isDistractor: true,
    uid: `distractor-${idx}-${item.kana}`
  }));
}
