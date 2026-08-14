// src/data/strokeOrderData.js
// Stroke order dataset for Hiragana and Katakana characters

export const STROKE_ORDER_DATA = {
  // ==================== HIRAGANA ====================
  'あ': {
    strokes: 3,
    stepsIt: [
      '1. Tratto orizzontale corto da sinistra a destra.',
      '2. Tratto verticale leggermente curvo dall\'alto verso il basso.',
      '3. Tratto ad anello ampio che parte dal centro, scende e risale a spirale verso destra.'
    ],
    stepsEn: [
      '1. Short horizontal stroke from left to right.',
      '2. Vertical downward curved stroke crossing through the first.',
      '3. Wide looping stroke starting at center, swirling downward and around to the right.'
    ],
    markers: [
      { num: 1, x: 28, y: 32, dir: '→' },
      { num: 2, x: 50, y: 18, dir: '↓' },
      { num: 3, x: 42, y: 44, dir: '↺' }
    ]
  },
  'い': {
    strokes: 2,
    stepsIt: [
      '1. Tratto curvo a sinistra dall\'alto in basso con un piccolo uncino finale verso l\'alto.',
      '2. Tratto curvo più corto a destra dall\'alto verso il basso.'
    ],
    stepsEn: [
      '1. Left curved stroke top-to-bottom with a slight upward hook at the end.',
      '2. Shorter right downward curved stroke.'
    ],
    markers: [
      { num: 1, x: 30, y: 25, dir: '↓' },
      { num: 2, x: 70, y: 35, dir: '↓' }
    ]
  },
  'う': {
    strokes: 2,
    stepsIt: [
      '1. Piccolo tratto diagonale corto in alto.',
      '2. Grande curva aperta a forma di mezzaluna verso il basso.'
    ],
    stepsEn: [
      '1. Small short diagonal stroke at the top.',
      '2. Large open crescent curve sweeping downward.'
    ],
    markers: [
      { num: 1, x: 45, y: 20, dir: '↘' },
      { num: 2, x: 32, y: 42, dir: '↷' }
    ]
  },
  'え': {
    strokes: 2,
    stepsIt: [
      '1. Piccolo tratto diagonale corto in alto.',
      '2. Tratto continuo a zig-zag: scende a sinistra, sale a destra e curva in basso con onda finale.'
    ],
    stepsEn: [
      '1. Small diagonal stroke at the top.',
      '2. Continuous multi-bend stroke: diagonal down, up-right, then sweeping down into a wave.'
    ],
    markers: [
      { num: 1, x: 45, y: 20, dir: '↘' },
      { num: 2, x: 26, y: 44, dir: '↝' }
    ]
  },
  'お': {
    strokes: 3,
    stepsIt: [
      '1. Tratto orizzontale corto da sinistra a destra.',
      '2. Tratto verticale che scende, risale formando un anello e curva verso destra.',
      '3. Piccolo punto/trattino diagonale in alto a destra.'
    ],
    stepsEn: [
      '1. Short horizontal stroke from left to right.',
      '2. Vertical stroke down, looping back up and around to the right.',
      '3. Small diagonal accent dot on the upper right.'
    ],
    markers: [
      { num: 1, x: 28, y: 34, dir: '→' },
      { num: 2, x: 48, y: 22, dir: '↓' },
      { num: 3, x: 74, y: 26, dir: '↘' }
    ]
  },
  'か': {
    strokes: 3,
    stepsIt: [
      '1. Tratto curvo a sinistra con uncino finale verso l\'interno.',
      '2. Tratto verticale leggermente inclinato che scende a destra.',
      '3. Trattino diagonale in alto a destra.'
    ],
    stepsEn: [
      '1. Left curved stroke with an inward hook at the bottom.',
      '2. Slanted vertical stroke down the right side.',
      '3. Diagonal accent stroke on the top right.'
    ],
    markers: [
      { num: 1, x: 30, y: 30, dir: '↓' },
      { num: 2, x: 62, y: 20, dir: '↓' },
      { num: 3, x: 72, y: 34, dir: '↘' }
    ]
  },
  'き': {
    strokes: 4,
    stepsIt: [
      '1. Primo tratto orizzontale superiore.',
      '2. Secondo tratto orizzontale parallelo.',
      '3. Tratto diagonale inclinato che taglia le due linee con uncino finale a sinistra.',
      '4. Arco curvo inferiore separato alla base.'
    ],
    stepsEn: [
      '1. Upper horizontal stroke.',
      '2. Second parallel horizontal stroke.',
      '3. Slanted diagonal stroke cutting through with a left hook.',
      '4. Bottom curved smile stroke.'
    ],
    markers: [
      { num: 1, x: 30, y: 28, dir: '→' },
      { num: 2, x: 26, y: 44, dir: '→' },
      { num: 3, x: 58, y: 16, dir: '↙' },
      { num: 4, x: 34, y: 76, dir: '↷' }
    ]
  },
  'く': {
    strokes: 1,
    stepsIt: [
      '1. Singolo tratto continuo a cuneo: diagonale verso il basso-sinistra, poi cambia direzione verso il basso-destra.'
    ],
    stepsEn: [
      '1. Single continuous angle stroke: diagonal down-left, then folding down-right.'
    ],
    markers: [
      { num: 1, x: 65, y: 22, dir: '↙' }
    ]
  },
  'け': {
    strokes: 3,
    stepsIt: [
      '1. Tratto verticale a sinistra con piccolo uncino.',
      '2. Tratto orizzontale corto a destra.',
      '3. Tratto verticale a destra che taglia la linea orizzontale e curva dolcemente.'
    ],
    stepsEn: [
      '1. Left vertical stroke with slight hook.',
      '2. Right short horizontal stroke.',
      '3. Right vertical stroke cutting down and curving gently.'
    ],
    markers: [
      { num: 1, x: 26, y: 24, dir: '↓' },
      { num: 2, x: 50, y: 36, dir: '→' },
      { num: 3, x: 68, y: 20, dir: '↓' }
    ]
  },
  'こ': {
    strokes: 2,
    stepsIt: [
      '1. Tratto orizzontale superiore da sinistra a destra con piccolo uncino.',
      '2. Tratto orizzontale inferiore leggermente curvo.'
    ],
    stepsEn: [
      '1. Top horizontal stroke with a tiny downward hook.',
      '2. Bottom parallel curved horizontal stroke.'
    ],
    markers: [
      { num: 1, x: 30, y: 32, dir: '→' },
      { num: 2, x: 30, y: 68, dir: '→' }
    ]
  },
  'さ': {
    strokes: 3,
    stepsIt: [
      '1. Tratto orizzontale leggermente inclinato verso l\'alto.',
      '2. Tratto diagonale che taglia la linea verso il basso a sinistra con uncino.',
      '3. Arco curvo inferiore aperto.'
    ],
    stepsEn: [
      '1. Slanted upward horizontal stroke.',
      '2. Diagonal downward stroke with a left hook.',
      '3. Open bottom smile curve.'
    ],
    markers: [
      { num: 1, x: 28, y: 35, dir: '→' },
      { num: 2, x: 60, y: 20, dir: '↙' },
      { num: 3, x: 35, y: 72, dir: '↷' }
    ]
  },
  'し': {
    strokes: 1,
    stepsIt: [
      '1. Singolo tratto che scende dritto e curva verso l\'alto a forma di amo da pesca.'
    ],
    stepsEn: [
      '1. Single continuous downward stroke curving upward like a fish hook.'
    ],
    markers: [
      { num: 1, x: 42, y: 20, dir: '↓' }
    ]
  },
  'す': {
    strokes: 2,
    stepsIt: [
      '1. Tratto orizzontale lungo da sinistra a destra.',
      '2. Tratto verticale che scende, forma un piccolo anello al centro e scende dritto.'
    ],
    stepsEn: [
      '1. Long horizontal stroke left to right.',
      '2. Vertical stroke down, looping in the middle, then tapering downward.'
    ],
    markers: [
      { num: 1, x: 22, y: 34, dir: '→' },
      { num: 2, x: 58, y: 18, dir: '↓' }
    ]
  },
  'せ': {
    strokes: 3,
    stepsIt: [
      '1. Tratto orizzontale lungo.',
      '2. Tratto verticale a destra con piega orizzontale alla base.',
      '3. Tratto verticale a sinistra che scende e curva verso destra.'
    ],
    stepsEn: [
      '1. Long horizontal stroke.',
      '2. Right vertical stroke turning horizontally at the base.',
      '3. Left vertical stroke ending with a slight curve.'
    ],
    markers: [
      { num: 1, x: 22, y: 40, dir: '→' },
      { num: 2, x: 72, y: 22, dir: '↓' },
      { num: 3, x: 38, y: 24, dir: '↓' }
    ]
  },
  'そ': {
    strokes: 1,
    stepsIt: [
      '1. Singolo tratto continuo: orizzontale corto, diagonale giù, orizzontale a destra e grande arco aperto sotto.'
    ],
    stepsEn: [
      '1. Single continuous zig-zag stroke into a wide bottom crescent curve.'
    ],
    markers: [
      { num: 1, x: 34, y: 24, dir: '→' }
    ]
  },
  'た': {
    strokes: 4,
    stepsIt: [
      '1. Tratto orizzontale corto a sinistra.',
      '2. Tratto diagonale che taglia il primo verso il basso.',
      '3. Tratto orizzontale superiore a destra.',
      '4. Tratto curvo inferiore a destra (simile a こ).'
    ],
    stepsEn: [
      '1. Short horizontal stroke on the left.',
      '2. Slanted vertical stroke cutting through.',
      '3. Upper right horizontal stroke.',
      '4. Lower right curved stroke.'
    ],
    markers: [
      { num: 1, x: 22, y: 36, dir: '→' },
      { num: 2, x: 36, y: 22, dir: '↙' },
      { num: 3, x: 55, y: 44, dir: '→' },
      { num: 4, x: 55, y: 66, dir: '→' }
    ]
  },
  'ち': {
    strokes: 2,
    stepsIt: [
      '1. Tratto orizzontale leggermente inclinato in alto.',
      '2. Tratto verticale che scende e forma una grande curva a forma di 5.'
    ],
    stepsEn: [
      '1. Slightly slanted horizontal stroke at top.',
      '2. Vertical stroke curving into a big loop like the number 5.'
    ],
    markers: [
      { num: 1, x: 28, y: 32, dir: '→' },
      { num: 2, x: 50, y: 20, dir: '↓' }
    ]
  },
  'つ': {
    strokes: 1,
    stepsIt: [
      '1. Singolo tratto curvo: inizia orizzontale e curva dolcemente formando una grande onda verso il basso.'
    ],
    stepsEn: [
      '1. Single stroke curving upward and sweeping down like a cresting wave.'
    ],
    markers: [
      { num: 1, x: 26, y: 36, dir: '↷' }
    ]
  },
  'て': {
    strokes: 1,
    stepsIt: [
      '1. Singolo tratto: linea orizzontale che poi curva indietro verso sinistra a forma di mezzaluna.'
    ],
    stepsEn: [
      '1. Single stroke: horizontal right, then curving back down to the left.'
    ],
    markers: [
      { num: 1, x: 26, y: 34, dir: '→' }
    ]
  },
  'と': {
    strokes: 2,
    stepsIt: [
      '1. Tratto corto diagonale in alto.',
      '2. Grande curva aperta a forma di C a destra.'
    ],
    stepsEn: [
      '1. Short diagonal stroke on the upper left.',
      '2. Large open C-curve on the right side.'
    ],
    markers: [
      { num: 1, x: 36, y: 24, dir: '↘' },
      { num: 2, x: 54, y: 32, dir: '↷' }
    ]
  },
  'な': {
    strokes: 4,
    stepsIt: [
      '1. Tratto orizzontale corto a sinistra.',
      '2. Tratto diagonale inclinato.',
      '3. Piccolo punto/trattino diagonale in alto a destra.',
      '4. Tratto verticale che forma un occhiello alla base.'
    ],
    stepsEn: [
      '1. Left horizontal stroke.',
      '2. Diagonal downward crossing stroke.',
      '3. Small accent stroke top right.',
      '4. Vertical stroke looping at bottom right.'
    ],
    markers: [
      { num: 1, x: 22, y: 34, dir: '→' },
      { num: 2, x: 36, y: 20, dir: '↙' },
      { num: 3, x: 68, y: 28, dir: '↘' },
      { num: 4, x: 62, y: 48, dir: '↓' }
    ]
  },
  'に': {
    strokes: 3,
    stepsIt: [
      '1. Tratto verticale a sinistra con piccolo uncino.',
      '2. Tratto orizzontale superiore a destra.',
      '3. Tratto orizzontale inferiore a destra.'
    ],
    stepsEn: [
      '1. Left vertical stroke with small hook.',
      '2. Upper right horizontal stroke.',
      '3. Lower right horizontal stroke.'
    ],
    markers: [
      { num: 1, x: 26, y: 24, dir: '↓' },
      { num: 2, x: 54, y: 38, dir: '→' },
      { num: 3, x: 54, y: 64, dir: '→' }
    ]
  },
  'ぬ': {
    strokes: 2,
    stepsIt: [
      '1. Tratto diagonale corto da sinistra verso il centro.',
      '2. Tratto ad anello continuo che scende, curva formando una pancia e termina con un occhiello a destra.'
    ],
    stepsEn: [
      '1. Slanted diagonal stroke from upper left.',
      '2. Sweeping stroke curving around and finishing with a small loop at bottom right.'
    ],
    markers: [
      { num: 1, x: 34, y: 24, dir: '↘' },
      { num: 2, x: 44, y: 20, dir: '↓' }
    ]
  },
  'ね': {
    strokes: 2,
    stepsIt: [
      '1. Tratto verticale dritto a sinistra.',
      '2. Tratto continuo a zig-zag che attraversa la prima linea e termina con un occhiello a destra.'
    ],
    stepsEn: [
      '1. Straight vertical stroke on the left.',
      '2. Zig-zag stroke looping across and finishing with a small loop on the right.'
    ],
    markers: [
      { num: 1, x: 28, y: 22, dir: '↓' },
      { num: 2, x: 22, y: 36, dir: '→' }
    ]
  },
  'の': {
    strokes: 1,
    stepsIt: [
      '1. Singolo tratto continuo: parte dal centro, scende a sinistra e curva descrivendo una spirale armoniosa verso destra.'
    ],
    stepsEn: [
      '1. Single continuous spiral stroke starting at center, dipping down-left and curving around.'
    ],
    markers: [
      { num: 1, x: 48, y: 32, dir: '↙' }
    ]
  },
  'は': {
    strokes: 3,
    stepsIt: [
      '1. Tratto verticale a sinistra con uncino.',
      '2. Tratto orizzontale corto a destra.',
      '3. Tratto verticale che taglia il secondo e termina con un occhiello circolare.'
    ],
    stepsEn: [
      '1. Left vertical stroke with a hook.',
      '2. Right horizontal stroke.',
      '3. Right vertical stroke looping at the bottom.'
    ],
    markers: [
      { num: 1, x: 25, y: 22, dir: '↓' },
      { num: 2, x: 48, y: 36, dir: '→' },
      { num: 3, x: 64, y: 24, dir: '↓' }
    ]
  },
  'ひ': {
    strokes: 1,
    stepsIt: [
      '1. Singolo tratto continuo: orizzontale corto, scende a forma di U e curva verso destra.'
    ],
    stepsEn: [
      '1. Single continuous stroke forming a wide smiling U-shape.'
    ],
    markers: [
      { num: 1, x: 26, y: 34, dir: '→' }
    ]
  },
  'ふ': {
    strokes: 4,
    stepsIt: [
      '1. Piccolo tratto in alto al centro.',
      '2. Tratto curvo centrale che scende e uncina a sinistra.',
      '3. Piccolo punto diagonale a sinistra.',
      '4. Piccolo punto diagonale a destra.'
    ],
    stepsEn: [
      '1. Top center short dot.',
      '2. Main center descending hook stroke.',
      '3. Left dot stroke.',
      '4. Right dot stroke.'
    ],
    markers: [
      { num: 1, x: 50, y: 18, dir: '↘' },
      { num: 2, x: 50, y: 36, dir: '↓' },
      { num: 3, x: 26, y: 52, dir: '↙' },
      { num: 4, x: 74, y: 52, dir: '↘' }
    ]
  },
  'へ': {
    strokes: 1,
    stepsIt: [
      '1. Singolo tratto continuo a forma di collina/cappello: sale brevemente a sinistra e scende a destra.'
    ],
    stepsEn: [
      '1. Single mountain stroke: ascending shortly then sloping downward to the right.'
    ],
    markers: [
      { num: 1, x: 26, y: 60, dir: '↗' }
    ]
  },
  'ほ': {
    strokes: 4,
    stepsIt: [
      '1. Tratto verticale a sinistra con uncino.',
      '2. Tratto orizzontale superiore a destra.',
      '3. Tratto orizzontale parallelo inferiore.',
      '4. Tratto verticale che attraversa le due linee e termina con un occhiello.'
    ],
    stepsEn: [
      '1. Left vertical stroke with hook.',
      '2. Upper right horizontal stroke.',
      '3. Lower parallel horizontal stroke.',
      '4. Vertical stroke crossing lines and looping at bottom.'
    ],
    markers: [
      { num: 1, x: 25, y: 22, dir: '↓' },
      { num: 2, x: 46, y: 32, dir: '→' },
      { num: 3, x: 46, y: 48, dir: '→' },
      { num: 4, x: 62, y: 22, dir: '↓' }
    ]
  },
  'ま': {
    strokes: 3,
    stepsIt: [
      '1. Tratto orizzontale superiore lungo.',
      '2. Secondo tratto orizzontale parallelo.',
      '3. Tratto verticale centrale che scende e chiude con un occhiello.'
    ],
    stepsEn: [
      '1. Upper long horizontal stroke.',
      '2. Second parallel horizontal stroke.',
      '3. Center vertical stroke looping at bottom.'
    ],
    markers: [
      { num: 1, x: 24, y: 30, dir: '→' },
      { num: 2, x: 28, y: 46, dir: '→' },
      { num: 3, x: 50, y: 18, dir: '↓' }
    ]
  },
  'み': {
    strokes: 2,
    stepsIt: [
      '1. Tratto che inizia orizzontale, scende, forma un occhiello e si estende a destra.',
      '2. Tratto curvo diagonale che taglia la linea a destra.'
    ],
    stepsEn: [
      '1. Stroke starting right, looping down and stretching across to the right.',
      '2. Diagonal downward stroke crossing on the right.'
    ],
    markers: [
      { num: 1, x: 24, y: 34, dir: '→' },
      { num: 2, x: 66, y: 26, dir: '↙' }
    ]
  },
  'む': {
    strokes: 3,
    stepsIt: [
      '1. Tratto orizzontale corto.',
      '2. Tratto verticale che scende, fa un occhiello e sale verso destra.',
      '3. Piccolo punto d\'accento in alto a destra.'
    ],
    stepsEn: [
      '1. Short horizontal stroke.',
      '2. Vertical stroke looping at bottom and sweeping upward to the right.',
      '3. Top right accent dot.'
    ],
    markers: [
      { num: 1, x: 24, y: 36, dir: '→' },
      { num: 2, x: 44, y: 22, dir: '↓' },
      { num: 3, x: 74, y: 26, dir: '↘' }
    ]
  },
  'め': {
    strokes: 2,
    stepsIt: [
      '1. Tratto diagonale da sinistra verso il centro.',
      '2. Grande curva a spirale che scende e attraversa il primo tratto.'
    ],
    stepsEn: [
      '1. Slanted diagonal stroke from left.',
      '2. Large sweeping curve crossing the first and wrapping around.'
    ],
    markers: [
      { num: 1, x: 38, y: 24, dir: '↘' },
      { num: 2, x: 48, y: 22, dir: '↓' }
    ]
  },
  'も': {
    strokes: 3,
    stepsIt: [
      '1. Tratto centrale a forma di amo da pesca (scende e curva a destra).',
      '2. Primo tratto orizzontale superiore che attraversa l\'asta.',
      '3. Secondo tratto orizzontale parallelo.'
    ],
    stepsEn: [
      '1. Main vertical hook stroke curving up-right.',
      '2. Top crossing horizontal stroke.',
      '3. Bottom parallel crossing horizontal stroke.'
    ],
    markers: [
      { num: 1, x: 48, y: 18, dir: '↓' },
      { num: 2, x: 28, y: 36, dir: '→' },
      { num: 3, x: 28, y: 50, dir: '→' }
    ]
  },
  'や': {
    strokes: 3,
    stepsIt: [
      '1. Tratto curvo a sinistra con uncino superiore.',
      '2. Piccolo trattino diagonale in alto a sinistra.',
      '3. Tratto verticale a destra che scende.'
    ],
    stepsEn: [
      '1. Main left curve with top hook.',
      '2. Small top left accent stroke.',
      '3. Right vertical stroke descending straight.'
    ],
    markers: [
      { num: 1, x: 28, y: 38, dir: '→' },
      { num: 2, x: 40, y: 22, dir: '↘' },
      { num: 3, x: 68, y: 20, dir: '↓' }
    ]
  },
  'ゆ': {
    strokes: 2,
    stepsIt: [
      '1. Tratto che scende, forma un\'ampia curva rotonda a destra.',
      '2. Lungo tratto verticale centrale che taglia la curva.'
    ],
    stepsEn: [
      '1. Vertical stroke curving around into a wide loop.',
      '2. Long vertical stroke cutting down through the middle.'
    ],
    markers: [
      { num: 1, x: 32, y: 28, dir: '↓' },
      { num: 2, x: 60, y: 18, dir: '↓' }
    ]
  },
  'よ': {
    strokes: 2,
    stepsIt: [
      '1. Tratto orizzontale corto in alto.',
      '2. Tratto verticale a destra che scende e forma un occhiello alla base.'
    ],
    stepsEn: [
      '1. Short horizontal stroke on top.',
      '2. Right vertical stroke descending and looping at bottom left.'
    ],
    markers: [
      { num: 1, x: 26, y: 34, dir: '→' },
      { num: 2, x: 62, y: 20, dir: '↓' }
    ]
  },
  'ら': {
    strokes: 2,
    stepsIt: [
      '1. Piccolo tratto diagonale in alto.',
      '2. Tratto curvo a forma di 5 o arco aperto inferiore.'
    ],
    stepsEn: [
      '1. Short top diagonal stroke.',
      '2. Vertical drop curving into an open bottom loop.'
    ],
    markers: [
      { num: 1, x: 42, y: 22, dir: '↘' },
      { num: 2, x: 34, y: 40, dir: '↓' }
    ]
  },
  'り': {
    strokes: 2,
    stepsIt: [
      '1. Tratto verticale sinistro corto con uncino.',
      '2. Lungo tratto verticale destro che scende e curva dolcemente.'
    ],
    stepsEn: [
      '1. Short left vertical stroke with hook.',
      '2. Long right vertical stroke sweeping downward.'
    ],
    markers: [
      { num: 1, x: 32, y: 28, dir: '↓' },
      { num: 2, x: 68, y: 18, dir: '↓' }
    ]
  },
  'る': {
    strokes: 1,
    stepsIt: [
      '1. Singolo tratto continuo: orizzontale, diagonale giù, grande arco che si chiude con un occhiello finale.'
    ],
    stepsEn: [
      '1. Single continuous stroke forming a 3-shape and closing with a small loop at the end.'
    ],
    markers: [
      { num: 1, x: 28, y: 26, dir: '→' }
    ]
  },
  'れ': {
    strokes: 2,
    stepsIt: [
      '1. Tratto verticale a sinistra.',
      '2. Tratto continuo a zig-zag che risale a destra con un\'onda verso l\'esterno.'
    ],
    stepsEn: [
      '1. Left straight vertical stroke.',
      '2. Zig-zag stroke waving upward and out to the right.'
    ],
    markers: [
      { num: 1, x: 28, y: 22, dir: '↓' },
      { num: 2, x: 22, y: 36, dir: '→' }
    ]
  },
  'ろ': {
    strokes: 1,
    stepsIt: [
      '1. Singolo tratto continuo simile al numero 3 (senza occhiello finale).'
    ],
    stepsEn: [
      '1. Single continuous stroke shaped like the number 3.'
    ],
    markers: [
      { num: 1, x: 28, y: 26, dir: '→' }
    ]
  },
  'わ': {
    strokes: 2,
    stepsIt: [
      '1. Tratto verticale dritto a sinistra.',
      '2. Tratto a zig-zag che forma un grande arco rotondo aperto a destra.'
    ],
    stepsEn: [
      '1. Left vertical stroke.',
      '2. Zig-zag stroke curving into a big round open belly on the right.'
    ],
    markers: [
      { num: 1, x: 28, y: 22, dir: '↓' },
      { num: 2, x: 22, y: 36, dir: '→' }
    ]
  },
  'を': {
    strokes: 3,
    stepsIt: [
      '1. Tratto orizzontale corto.',
      '2. Tratto che scende e curva ad angolo retto.',
      '3. Tratto a mezzaluna inferiore che incrocia il secondo.'
    ],
    stepsEn: [
      '1. Short horizontal stroke.',
      '2. Diagonal down stroke turning right.',
      '3. Bottom crescent stroke crossing through.'
    ],
    markers: [
      { num: 1, x: 26, y: 30, dir: '→' },
      { num: 2, x: 44, y: 20, dir: '↓' },
      { num: 3, x: 38, y: 56, dir: '↷' }
    ]
  },
  'ん': {
    strokes: 1,
    stepsIt: [
      '1. Singolo tratto continuo: scende in diagonale, risale e curva a destra con slancio verso l\'alto (simile a una n corsiva).'
    ],
    stepsEn: [
      '1. Single flowing stroke shaped like a cursive lowercase n.'
    ],
    markers: [
      { num: 1, x: 34, y: 26, dir: '↘' }
    ]
  },

  // ==================== KATAKANA ====================
  'ア': {
    strokes: 2,
    stepsIt: [
      '1. Tratto orizzontale che piega ad angolo retto verso il basso a sinistra.',
      '2. Tratto curvo diagonale lungo da destra verso sinistra.'
    ],
    stepsEn: [
      '1. Horizontal stroke bending down-left.',
      '2. Long sweeping diagonal curve from right to bottom-left.'
    ],
    markers: [
      { num: 1, x: 24, y: 28, dir: '→' },
      { num: 2, x: 68, y: 30, dir: '↙' }
    ]
  },
  'イ': {
    strokes: 2,
    stepsIt: [
      '1. Tratto diagonale corto da destra a sinistra.',
      '2. Tratto verticale dritto che scende dal centro del primo.'
    ],
    stepsEn: [
      '1. Short diagonal stroke top-right to bottom-left.',
      '2. Straight vertical stroke down from the middle.'
    ],
    markers: [
      { num: 1, x: 55, y: 22, dir: '↙' },
      { num: 2, x: 44, y: 40, dir: '↓' }
    ]
  },
  'ウ': {
    strokes: 3,
    stepsIt: [
      '1. Piccolo trattino verticale in alto al centro.',
      '2. Tratto verticale corto a sinistra.',
      '3. Tratto orizzontale che piega scendendo a sinistra.'
    ],
    stepsEn: [
      '1. Small top vertical dot.',
      '2. Short left vertical stroke.',
      '3. Horizontal stroke bending sharply down-left.'
    ],
    markers: [
      { num: 1, x: 50, y: 18, dir: '↓' },
      { num: 2, x: 26, y: 36, dir: '↓' },
      { num: 3, x: 26, y: 44, dir: '→' }
    ]
  },
  'エ': {
    strokes: 3,
    stepsIt: [
      '1. Tratto orizzontale superiore.',
      '2. Tratto verticale centrale.',
      '3. Tratto orizzontale inferiore più lungo alla base.'
    ],
    stepsEn: [
      '1. Top horizontal stroke.',
      '2. Center vertical stem.',
      '3. Longer bottom base horizontal stroke.'
    ],
    markers: [
      { num: 1, x: 30, y: 25, dir: '→' },
      { num: 2, x: 50, y: 30, dir: '↓' },
      { num: 3, x: 22, y: 75, dir: '→' }
    ]
  },
  'オ': {
    strokes: 3,
    stepsIt: [
      '1. Tratto orizzontale superiore.',
      '2. Tratto verticale con uncino a sinistra.',
      '3. Tratto diagonale che scende verso destra.'
    ],
    stepsEn: [
      '1. Top horizontal stroke.',
      '2. Vertical stroke with a left hook.',
      '3. Slanted diagonal stroke down to the right.'
    ],
    markers: [
      { num: 1, x: 22, y: 30, dir: '→' },
      { num: 2, x: 48, y: 22, dir: '↓' },
      { num: 3, x: 42, y: 42, dir: '↘' }
    ]
  },
  'カ': {
    strokes: 2,
    stepsIt: [
      '1. Tratto orizzontale con piega e uncino a sinistra.',
      '2. Tratto curvo diagonale che attraversa verso sinistra.'
    ],
    stepsEn: [
      '1. Horizontal stroke turning down with a left hook.',
      '2. Slanted diagonal crossing stroke.'
    ],
    markers: [
      { num: 1, x: 24, y: 30, dir: '→' },
      { num: 2, x: 62, y: 20, dir: '↙' }
    ]
  },
  'キ': {
    strokes: 3,
    stepsIt: [
      '1. Tratto orizzontale superiore.',
      '2. Tratto orizzontale inferiore parallelo.',
      '3. Tratto diagonale che taglia le due linee verso il basso.'
    ],
    stepsEn: [
      '1. Upper horizontal stroke.',
      '2. Lower parallel horizontal stroke.',
      '3. Slanted diagonal stroke cutting through.'
    ],
    markers: [
      { num: 1, x: 28, y: 30, dir: '→' },
      { num: 2, x: 24, y: 48, dir: '→' },
      { num: 3, x: 60, y: 18, dir: '↙' }
    ]
  },
  'ク': {
    strokes: 2,
    stepsIt: [
      '1. Piccolo tratto diagonale a sinistra.',
      '2. Tratto orizzontale che piega curvando ampiamente verso il basso-sinistra.'
    ],
    stepsEn: [
      '1. Short top-left diagonal stroke.',
      '2. Horizontal stroke bending and curving down-left.'
    ],
    markers: [
      { num: 1, x: 48, y: 20, dir: '↙' },
      { num: 2, x: 32, y: 40, dir: '→' }
    ]
  },
  'ケ': {
    strokes: 3,
    stepsIt: [
      '1. Piccolo tratto diagonale in alto a sinistra.',
      '2. Tratto orizzontale lungo a destra.',
      '3. Tratto curvo che taglia verso il basso-sinistra.'
    ],
    stepsEn: [
      '1. Top left short diagonal stroke.',
      '2. Long horizontal stroke.',
      '3. Curved stroke cutting through to the bottom-left.'
    ],
    markers: [
      { num: 1, x: 38, y: 20, dir: '↙' },
      { num: 2, x: 26, y: 44, dir: '→' },
      { num: 3, x: 64, y: 36, dir: '↙' }
    ]
  },
  'コ': {
    strokes: 2,
    stepsIt: [
      '1. Tratto orizzontale che piega ad angolo retto verso il basso.',
      '2. Tratto orizzontale inferiore alla base.'
    ],
    stepsEn: [
      '1. Top horizontal stroke turning 90 degrees downward.',
      '2. Bottom horizontal base stroke.'
    ],
    markers: [
      { num: 1, x: 28, y: 28, dir: '→' },
      { num: 2, x: 28, y: 72, dir: '→' }
    ]
  },
  'サ': {
    strokes: 3,
    stepsIt: [
      '1. Tratto orizzontale lungo.',
      '2. Tratto verticale corto a sinistra.',
      '3. Tratto verticale a destra che curva verso sinistra.'
    ],
    stepsEn: [
      '1. Long horizontal stroke.',
      '2. Left short vertical stroke.',
      '3. Right vertical stroke curving down-left.'
    ],
    markers: [
      { num: 1, x: 22, y: 36, dir: '→' },
      { num: 2, x: 38, y: 22, dir: '↓' },
      { num: 3, x: 64, y: 22, dir: '↓' }
    ]
  },
  'シ': {
    strokes: 3,
    stepsIt: [
      '1. Primo punto in alto a sinistra.',
      '2. Secondo punto parallelo sotto il primo.',
      '3. Lungo tratto che parte dal basso-sinistra e sale con slancio verso l\'alto-destra.'
    ],
    stepsEn: [
      '1. Top left dot.',
      '2. Middle left dot.',
      '3. Long stroke sweeping upward from bottom-left to top-right.'
    ],
    markers: [
      { num: 1, x: 32, y: 28, dir: '↘' },
      { num: 2, x: 26, y: 50, dir: '↘' },
      { num: 3, x: 24, y: 76, dir: '↗' }
    ]
  },
  'ス': {
    strokes: 2,
    stepsIt: [
      '1. Tratto orizzontale che piega in diagonale verso il basso-sinistra.',
      '2. Tratto diagonale che parte dal centro e scende a destra.'
    ],
    stepsEn: [
      '1. Horizontal stroke bending sharply down-left.',
      '2. Diagonal stroke extending down to the right.'
    ],
    markers: [
      { num: 1, x: 26, y: 30, dir: '→' },
      { num: 2, x: 50, y: 48, dir: '↘' }
    ]
  },
  'セ': {
    strokes: 2,
    stepsIt: [
      '1. Tratto orizzontale che piega ad angolo verso il basso.',
      '2. Tratto verticale a sinistra che curva alla base verso destra.'
    ],
    stepsEn: [
      '1. Horizontal stroke bending vertically downward.',
      '2. Left vertical stroke turning right at the bottom.'
    ],
    markers: [
      { num: 1, x: 26, y: 34, dir: '→' },
      { num: 2, x: 40, y: 20, dir: '↓' }
    ]
  },
  'ソ': {
    strokes: 2,
    stepsIt: [
      '1. Piccolo trattino diagonale in alto a sinistra.',
      '2. Tratto diagonale lungo dall\'alto-destra che scende verso il basso-sinistra.'
    ],
    stepsEn: [
      '1. Short diagonal stroke on upper left.',
      '2. Long sweeping stroke from upper right down to bottom-left.'
    ],
    markers: [
      { num: 1, x: 34, y: 28, dir: '↘' },
      { num: 2, x: 68, y: 22, dir: '↙' }
    ]
  },
  'タ': {
    strokes: 3,
    stepsIt: [
      '1. Piccolo tratto diagonale a sinistra.',
      '2. Tratto orizzontale che piega e curva a sinistra.',
      '3. Tratto diagonale interno.'
    ],
    stepsEn: [
      '1. Short left diagonal stroke.',
      '2. Horizontal stroke bending down-left.',
      '3. Inside diagonal crossing stroke.'
    ],
    markers: [
      { num: 1, x: 42, y: 20, dir: '↙' },
      { num: 2, x: 26, y: 40, dir: '→' },
      { num: 3, x: 44, y: 52, dir: '↘' }
    ]
  },
  'チ': {
    strokes: 3,
    stepsIt: [
      '1. Tratto orizzontale corto diagonale in alto.',
      '2. Tratto orizzontale lungo al centro.',
      '3. Tratto curvo che taglia verso il basso-sinistra.'
    ],
    stepsEn: [
      '1. Top short horizontal/diagonal stroke.',
      '2. Long horizontal stroke.',
      '3. Curved vertical stroke slicing through to the bottom-left.'
    ],
    markers: [
      { num: 1, x: 58, y: 20, dir: '↙' },
      { num: 2, x: 24, y: 42, dir: '→' },
      { num: 3, x: 52, y: 32, dir: '↙' }
    ]
  },
  'ツ': {
    strokes: 3,
    stepsIt: [
      '1. Primo punto in alto a sinistra.',
      '2. Secondo punto in alto al centro.',
      '3. Lungo tratto che parte dall\'alto-destra e scende verso il basso-sinistra.'
    ],
    stepsEn: [
      '1. First top-left dot.',
      '2. Second middle dot.',
      '3. Long stroke sweeping downward from top-right to bottom-left.'
    ],
    markers: [
      { num: 1, x: 28, y: 24, dir: '↘' },
      { num: 2, x: 48, y: 32, dir: '↘' },
      { num: 3, x: 74, y: 22, dir: '↙' }
    ]
  },
  'テ': {
    strokes: 3,
    stepsIt: [
      '1. Tratto orizzontale corto in alto.',
      '2. Tratto orizzontale più lungo al centro.',
      '3. Tratto curvo centrale che scende verso sinistra.'
    ],
    stepsEn: [
      '1. Short top horizontal stroke.',
      '2. Longer middle horizontal stroke.',
      '3. Center curve sweeping down-left.'
    ],
    markers: [
      { num: 1, x: 34, y: 24, dir: '→' },
      { num: 2, x: 22, y: 46, dir: '→' },
      { num: 3, x: 50, y: 46, dir: '↙' }
    ]
  },
  'ト': {
    strokes: 2,
    stepsIt: [
      '1. Lungo tratto verticale dritto.',
      '2. Tratto diagonale che si dirama verso il basso a destra.'
    ],
    stepsEn: [
      '1. Long straight vertical stroke.',
      '2. Diagonal branch stroke angling down-right.'
    ],
    markers: [
      { num: 1, x: 42, y: 18, dir: '↓' },
      { num: 2, x: 44, y: 44, dir: '↘' }
    ]
  },
  'ナ': {
    strokes: 2,
    stepsIt: [
      '1. Tratto orizzontale.',
      '2. Tratto curvo che taglia dal centro scendendo a sinistra.'
    ],
    stepsEn: [
      '1. Horizontal stroke.',
      '2. Curved stroke slicing through and down-left.'
    ],
    markers: [
      { num: 1, x: 24, y: 34, dir: '→' },
      { num: 2, x: 52, y: 20, dir: '↙' }
    ]
  },
  'ニ': {
    strokes: 2,
    stepsIt: [
      '1. Tratto orizzontale superiore.',
      '2. Tratto orizzontale inferiore più lungo.'
    ],
    stepsEn: [
      '1. Upper horizontal stroke.',
      '2. Longer lower horizontal stroke.'
    ],
    markers: [
      { num: 1, x: 30, y: 35, dir: '→' },
      { num: 2, x: 22, y: 65, dir: '→' }
    ]
  },
  'ヌ': {
    strokes: 2,
    stepsIt: [
      '1. Tratto orizzontale che piega a sinistra.',
      '2. Tratto diagonale che taglia verso il basso a destra.'
    ],
    stepsEn: [
      '1. Horizontal stroke bending down-left.',
      '2. Slanted diagonal stroke crossing through down-right.'
    ],
    markers: [
      { num: 1, x: 26, y: 34, dir: '→' },
      { num: 2, x: 42, y: 48, dir: '↘' }
    ]
  },
  'ネ': {
    strokes: 4,
    stepsIt: [
      '1. Piccolo punto in alto.',
      '2. Tratto orizzontale che piega in diagonale giù a sinistra.',
      '3. Tratto verticale centrale.',
      '4. Tratto diagonale a destra.'
    ],
    stepsEn: [
      '1. Top accent dot.',
      '2. Horizontal stroke bending down-left.',
      '3. Center vertical stem.',
      '4. Right diagonal dot.'
    ],
    markers: [
      { num: 1, x: 48, y: 18, dir: '↓' },
      { num: 2, x: 26, y: 36, dir: '→' },
      { num: 3, x: 48, y: 40, dir: '↓' },
      { num: 4, x: 68, y: 55, dir: '↘' }
    ]
  },
  'ノ': {
    strokes: 1,
    stepsIt: [
      '1. Singolo tratto curvo diagonale dall\'alto-destra verso il basso-sinistra.'
    ],
    stepsEn: [
      '1. Single diagonal sweeping curve from top-right to bottom-left.'
    ],
    markers: [
      { num: 1, x: 68, y: 22, dir: '↙' }
    ]
  },
  'ハ': {
    strokes: 2,
    stepsIt: [
      '1. Tratto diagonale a sinistra che scende verso sinistra.',
      '2. Tratto diagonale a destra che scende verso destra.'
    ],
    stepsEn: [
      '1. Left diagonal stroke flaring down-left.',
      '2. Right diagonal stroke flaring down-right.'
    ],
    markers: [
      { num: 1, x: 38, y: 28, dir: '↙' },
      { num: 2, x: 62, y: 28, dir: '↘' }
    ]
  },
  'ヒ': {
    strokes: 2,
    stepsIt: [
      '1. Tratto orizzontale corto in alto.',
      '2. Tratto verticale a sinistra che curva alla base e sale dritto a destra.'
    ],
    stepsEn: [
      '1. Short top horizontal stroke.',
      '2. Left vertical stroke turning right at bottom and extending up.'
    ],
    markers: [
      { num: 1, x: 28, y: 28, dir: '→' },
      { num: 2, x: 36, y: 38, dir: '↓' }
    ]
  },
  'フ': {
    strokes: 1,
    stepsIt: [
      '1. Singolo tratto orizzontale che curva verso il basso-sinistra.'
    ],
    stepsEn: [
      '1. Single horizontal stroke curving down-left.'
    ],
    markers: [
      { num: 1, x: 28, y: 30, dir: '→' }
    ]
  },
  'ヘ': {
    strokes: 1,
    stepsIt: [
      '1. Singolo tratto a collina: breve salita e discesa a destra.'
    ],
    stepsEn: [
      '1. Single mountain stroke ascending then sloping right.'
    ],
    markers: [
      { num: 1, x: 26, y: 60, dir: '↗' }
    ]
  },
  'ホ': {
    strokes: 4,
    stepsIt: [
      '1. Tratto orizzontale superiore.',
      '2. Tratto verticale centrale con uncino.',
      '3. Tratto diagonale a sinistra.',
      '4. Tratto diagonale a destra.'
    ],
    stepsEn: [
      '1. Top horizontal stroke.',
      '2. Center vertical stem with hook.',
      '3. Left diagonal stroke.',
      '4. Right diagonal stroke.'
    ],
    markers: [
      { num: 1, x: 24, y: 28, dir: '→' },
      { num: 2, x: 50, y: 18, dir: '↓' },
      { num: 3, x: 34, y: 48, dir: '↙' },
      { num: 4, x: 66, y: 48, dir: '↘' }
    ]
  },
  'マ': {
    strokes: 2,
    stepsIt: [
      '1. Tratto orizzontale che piega in diagonale verso il basso-sinistra.',
      '2. Piccolo tratto diagonale a destra.'
    ],
    stepsEn: [
      '1. Horizontal stroke bending down-left.',
      '2. Short right diagonal stroke.'
    ],
    markers: [
      { num: 1, x: 26, y: 32, dir: '→' },
      { num: 2, x: 56, y: 52, dir: '↘' }
    ]
  },
  'ミ': {
    strokes: 3,
    stepsIt: [
      '1. Primo tratto diagonale in alto.',
      '2. Secondo tratto diagonale parallelo.',
      '3. Terzo tratto diagonale più lungo alla base.'
    ],
    stepsEn: [
      '1. Top slanted diagonal stroke.',
      '2. Middle parallel diagonal stroke.',
      '3. Longer bottom diagonal stroke.'
    ],
    markers: [
      { num: 1, x: 36, y: 26, dir: '↘' },
      { num: 2, x: 32, y: 48, dir: '↘' },
      { num: 3, x: 28, y: 70, dir: '↘' }
    ]
  },
  'ム': {
    strokes: 2,
    stepsIt: [
      '1. Tratto diagonale che piega orizzontalmente a destra.',
      '2. Piccolo punto d\'accento a destra.'
    ],
    stepsEn: [
      '1. Diagonal stroke bending horizontally to the right.',
      '2. Small right accent dot.'
    ],
    markers: [
      { num: 1, x: 48, y: 22, dir: '↙' },
      { num: 2, x: 68, y: 48, dir: '↘' }
    ]
  },
  'メ': {
    strokes: 2,
    stepsIt: [
      '1. Tratto diagonale da destra verso il basso-sinistra.',
      '2. Tratto diagonale da sinistra che attraversa il primo verso il basso-destra.'
    ],
    stepsEn: [
      '1. Diagonal stroke from top-right to bottom-left.',
      '2. Crossing diagonal stroke from top-left to bottom-right.'
    ],
    markers: [
      { num: 1, x: 68, y: 24, dir: '↙' },
      { num: 2, x: 32, y: 30, dir: '↘' }
    ]
  },
  'モ': {
    strokes: 3,
    stepsIt: [
      '1. Tratto orizzontale superiore.',
      '2. Secondo tratto orizzontale parallelo.',
      '3. Tratto verticale centrale che scende e piega ad angolo verso destra.'
    ],
    stepsEn: [
      '1. Top horizontal stroke.',
      '2. Middle parallel horizontal stroke.',
      '3. Vertical stroke cutting down and bending right.'
    ],
    markers: [
      { num: 1, x: 26, y: 28, dir: '→' },
      { num: 2, x: 22, y: 48, dir: '→' },
      { num: 3, x: 48, y: 20, dir: '↓' }
    ]
  },
  'ヤ': {
    strokes: 2,
    stepsIt: [
      '1. Tratto orizzontale che piega in diagonale verso il basso-sinistra.',
      '2. Tratto verticale a destra che scende.'
    ],
    stepsEn: [
      '1. Horizontal stroke bending down-left.',
      '2. Right vertical stroke descending straight.'
    ],
    markers: [
      { num: 1, x: 24, y: 34, dir: '→' },
      { num: 2, x: 62, y: 20, dir: '↓' }
    ]
  },
  'ユ': {
    strokes: 2,
    stepsIt: [
      '1. Tratto orizzontale che piega scendendo e gira orizzontale alla base.',
      '2. Tratto orizzontale inferiore più lungo che incrocia.'
    ],
    stepsEn: [
      '1. Horizontal stroke bending down and turning right.',
      '2. Long horizontal crossing base stroke.'
    ],
    markers: [
      { num: 1, x: 28, y: 28, dir: '→' },
      { num: 2, x: 20, y: 72, dir: '→' }
    ]
  },
  'ヨ': {
    strokes: 3,
    stepsIt: [
      '1. Tratto orizzontale superiore che piega scendendo a destra.',
      '2. Tratto orizzontale centrale.',
      '3. Tratto orizzontale inferiore alla base.'
    ],
    stepsEn: [
      '1. Top horizontal stroke turning downward on the right.',
      '2. Middle horizontal stroke.',
      '3. Bottom horizontal base stroke.'
    ],
    markers: [
      { num: 1, x: 30, y: 26, dir: '→' },
      { num: 2, x: 32, y: 48, dir: '→' },
      { num: 3, x: 30, y: 72, dir: '→' }
    ]
  },
  'ラ': {
    strokes: 2,
    stepsIt: [
      '1. Tratto orizzontale corto in alto.',
      '2. Tratto curvo a cuneo che scende verso sinistra.'
    ],
    stepsEn: [
      '1. Short top horizontal stroke.',
      '2. Horizontal stroke bending and sweeping down-left.'
    ],
    markers: [
      { num: 1, x: 32, y: 24, dir: '→' },
      { num: 2, x: 30, y: 44, dir: '→' }
    ]
  },
  'リ': {
    strokes: 2,
    stepsIt: [
      '1. Tratto verticale sinistro corto.',
      '2. Tratto verticale destro lungo che scende dritto e curva a sinistra.'
    ],
    stepsEn: [
      '1. Short left vertical stroke.',
      '2. Long right vertical stroke curving down-left.'
    ],
    markers: [
      { num: 1, x: 34, y: 26, dir: '↓' },
      { num: 2, x: 68, y: 18, dir: '↓' }
    ]
  },
  'ル': {
    strokes: 2,
    stepsIt: [
      '1. Tratto diagonale a sinistra.',
      '2. Tratto verticale a destra che scende e risale con uncino verso l\'alto.'
    ],
    stepsEn: [
      '1. Left diagonal stroke.',
      '2. Right vertical stroke hooking upward at the bottom.'
    ],
    markers: [
      { num: 1, x: 38, y: 22, dir: '↙' },
      { num: 2, x: 64, y: 22, dir: '↓' }
    ]
  },
  'レ': {
    strokes: 1,
    stepsIt: [
      '1. Singolo tratto: scende in verticale e piega bruscamente verso l\'alto-destra a forma di V spigolosa.'
    ],
    stepsEn: [
      '1. Single stroke: straight down, then angling sharply up to the right.'
    ],
    markers: [
      { num: 1, x: 38, y: 20, dir: '↓' }
    ]
  },
  'ロ': {
    strokes: 3,
    stepsIt: [
      '1. Tratto verticale a sinistra.',
      '2. Tratto orizzontale che piega ad angolo retto verso il basso.',
      '3. Tratto orizzontale che chiude la base del quadrato.'
    ],
    stepsEn: [
      '1. Left vertical stroke.',
      '2. Horizontal stroke bending down on the right.',
      '3. Bottom horizontal closing stroke.'
    ],
    markers: [
      { num: 1, x: 26, y: 26, dir: '↓' },
      { num: 2, x: 28, y: 28, dir: '→' },
      { num: 3, x: 26, y: 74, dir: '→' }
    ]
  },
  'ワ': {
    strokes: 2,
    stepsIt: [
      '1. Piccolo tratto verticale a sinistra.',
      '2. Tratto orizzontale che curva scendendo verso il basso-sinistra.'
    ],
    stepsEn: [
      '1. Short left vertical stroke.',
      '2. Top horizontal stroke bending and sweeping down-left.'
    ],
    markers: [
      { num: 1, x: 26, y: 32, dir: '↓' },
      { num: 2, x: 28, y: 34, dir: '→' }
    ]
  },
  'ヲ': {
    strokes: 3,
    stepsIt: [
      '1. Tratto orizzontale superiore.',
      '2. Secondo tratto orizzontale parallelo.',
      '3. Tratto diagonale che taglia le linee curvando a sinistra.'
    ],
    stepsEn: [
      '1. Top horizontal stroke.',
      '2. Second horizontal stroke.',
      '3. Slanted diagonal stroke curving to the bottom-left.'
    ],
    markers: [
      { num: 1, x: 28, y: 26, dir: '→' },
      { num: 2, x: 30, y: 48, dir: '→' },
      { num: 3, x: 62, y: 26, dir: '↙' }
    ]
  },
  'ン': {
    strokes: 2,
    stepsIt: [
      '1. Piccolo trattino diagonale in alto a sinistra.',
      '2. Lungo tratto che parte dal basso-sinistra e sale verso l\'alto-destra.'
    ],
    stepsEn: [
      '1. Short diagonal stroke on the upper left.',
      '2. Long stroke sweeping upward from bottom-left to top-right.'
    ],
    markers: [
      { num: 1, x: 32, y: 30, dir: '↘' },
      { num: 2, x: 28, y: 72, dir: '↗' }
    ]
  }
};

export function getStrokeOrderData(char) {
  return STROKE_ORDER_DATA[char] || {
    strokes: 2,
    stepsIt: ['1. Segui la guida dei tratti dall\'alto verso il basso.', '2. Completa il carattere da sinistra verso destra.'],
    stepsEn: ['1. Follow the stroke guide top to bottom.', '2. Complete the character left to right.'],
    markers: [{ num: 1, x: 35, y: 25, dir: '↓' }, { num: 2, x: 65, y: 35, dir: '↓' }]
  };
}
