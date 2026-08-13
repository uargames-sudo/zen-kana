// src/utils/romajiVariants.js

const ROMAJI_VARIANTS_MAP = {
    'shi': ['shi', 'si'],
    'chi': ['chi', 'ti'],
    'tsu': ['tsu', 'tu'],
    'fu': ['fu', 'hu'],
    'ji': ['ji', 'zi'],
    'sha': ['sha', 'sya'],
    'shu': ['shu', 'syu'],
    'sho': ['sho', 'syo'],
    'cha': ['cha', 'tya'],
    'chu': ['chu', 'tyu'],
    'cho': ['cho', 'tyo'],
    'ja': ['ja', 'zya'],
    'ju': ['ju', 'zyu'],
    'jo': ['jo', 'zyo'],
};

// Flatten to reverse lookup (si -> shi)
const REVERSE_VARIANTS_MAP = {};
for (const [key, variants] of Object.entries(ROMAJI_VARIANTS_MAP)) {
    for (const v of variants) {
        if (v !== key) {
            REVERSE_VARIANTS_MAP[v] = key;
        }
    }
}

/**
 * Checks if the given user input matches the expected romaji or any of its accepted variants.
 */
export function checkRomajiMatch(userInput, acceptedRomajiList) {
    const input = userInput.trim().toLowerCase();
    
    // Exact match in accepted list
    if (acceptedRomajiList.map(r => r.toLowerCase()).includes(input)) {
        return true;
    }
    
    // Simple replace all (not perfect for overlapping syllables, but works for MVP)
    let normalizedInput = input;
    for (const [variant, main] of Object.entries(REVERSE_VARIANTS_MAP)) {
        normalizedInput = normalizedInput.split(variant).join(main);
    }
    
    let normalizedExpectedList = acceptedRomajiList.map(r => {
        let n = r.toLowerCase();
        for (const [variant, main] of Object.entries(REVERSE_VARIANTS_MAP)) {
            n = n.split(variant).join(main);
        }
        return n;
    });

    return normalizedExpectedList.includes(normalizedInput);
}

/**
 * Compares userInput with the expected main romaji and returns an array of diff tokens.
 * E.g., saku[l]a -> [{ char: 's', err: false }, ..., { char: 'l', err: true }, ...]
 * A simple char-by-char diff for the MVP.
 */
export function getRomajiDiff(userInput, expectedRomaji) {
    const input = userInput.trim().toLowerCase();
    const expected = expectedRomaji.trim().toLowerCase();
    
    const diff = [];
    for (let i = 0; i < input.length; i++) {
        if (input[i] === expected[i]) {
            diff.push({ char: input[i], err: false });
        } else {
            diff.push({ char: input[i], err: true });
        }
    }
    return diff;
}
