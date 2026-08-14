// src/i18n/translations.js

export const translations = {
  it: {
    // Navigation & Common
    nav: {
      appName: 'Zen Kana',
      appSubtitle: 'Studio Giapponese Kana',
      dashboard: 'Dashboard',
      dashboardDesc: 'Panoramica & Statistiche di Studio',
      table: 'Tabelle Kana',
      tableShort: 'Tabelle',
      tableDesc: 'Sillabario Interattivo',
      flashcards: 'Flashcards',
      flashcardsShort: 'Flashcards',
      flashcardsDesc: 'Schede di Memoria',
      activeStudy: 'Active Study',
      activeStudyShort: 'Active Study',
      activeStudyDesc: 'Allenamento di Traslitterazione',
      vocabulary: 'Vocabolario',
      vocabularyShort: 'Vocab',
      vocabularyDesc: 'Parole & Pronuncia Giapponese',
      lessons: 'Lezioni',
      lessonsShort: 'Lezioni',
      lessonsDesc: 'Percorso di Studio Guidato',
      writing: 'Scrittura',
      writingShort: 'Scrittura',
      writingDesc: 'Ordine dei Tratti & Canvas',
      listening: 'Ascolto',
      listeningShort: 'Ascolto',
      listeningDesc: 'Riconoscimento Audio',
      quiz: 'Quiz',
      quizShort: 'Quiz',
      quizDesc: 'Verifica delle Conoscenze',
      scriptHiragana: 'Hiragana (あ)',
      scriptKatakana: 'Katakana (ア)',
      scriptHiraganaShort: 'あ Hira',
      scriptKatakanaShort: 'ア Kata',
      writingSystem: 'Sistema di Scrittura',
      studySections: 'Sezioni di Studio',
      themeMode: 'Modalità Tema',
      themeDark: 'Scuro',
      themeLight: 'Chiaro',
      language: 'Lingua',
      langIt: 'Italiano',
      langEn: 'English',
      installApp: 'Installa Zen Kana PWA',
      installModalTitle: 'Installa Zen Kana PWA',
      installModalIosTitle: 'Istruzioni per iOS Safari:',
      installModalIos1: 'Tocca l\'icona Condividi (Share) nella barra del browser.',
      installModalIos2: 'Scorri e tocca "Aggiungi a schermata Home".',
      installModalIos3: 'Conferma toccando Aggiungi in alto a destra.',
      installModalDesktopTitle: 'Browser Desktop / Android:',
      installModalDesktopText: 'Clicca sull\'icona di installazione nella barra degli indirizzi o seleziona "Installa app" dal menu del browser.',
      gotIt: 'Ho capito',
      footerText: 'Zen Kana Studio — Realizzato con React, Vite e Tailwind CSS. Audio giapponese con Web Speech API.'
    },

    // Dashboard
    dashboard: {
      welcome: 'Bentornato nel tuo Dojo di Kana',
      welcomeSubtitle: 'Padroneggia i sillabari giapponesi Hiragana e Katakana con sessioni interattive quotidiane.',
      switchScript: 'Passa a',
      statsOverview: 'Panoramica Statistiche',
      reviewedKana: 'Kana Revisionati',
      accuracy: 'Precisione Globale',
      totalAttempts: 'Tentativi Totali',
      accuracyRate: 'Tasso di Risposte Corrette',
      quickActions: 'Accesso Rapido alle Attività',
      startActiveStudy: 'Avvia Active Study',
      startActiveStudyDesc: 'Metti alla prova la traslitterazione Kana/Romaji a tempo.',
      browseKanaTable: 'Consulta le Tabelle',
      browseKanaTableDesc: 'Esplora i 46 caratteri base, dakuten, combinazioni e audio.',
      practiceWriting: 'Pratica di Scrittura',
      practiceWritingDesc: 'Disegna a mano libera i tratti corretti dei caratteri.',
      listeningTraining: 'Quiz di Ascolto',
      listeningTrainingDesc: 'Allena l\'orecchio riconoscendo i suoni nativi.',
      studyTipsTitle: 'Consiglio Zen del Giorno',
      studyTipText: 'La costanza supera l\'intensità: dedicare 10 minuti ogni giorno all\'ascolto e alla scrittura garantisce una memorizzazione a lungo termine più solida rispetto a lunghe sessioni isolate.',
      resetStats: 'Azzera Statistiche',
      resetConfirm: 'Sei sicuro di voler azzerare le statistiche di studio?'
    },

    // Kana Tables
    table: {
      title: 'Tabella',
      subtitle: 'Tocca qualsiasi scheda per ascoltare la pronuncia autentica in giapponese.',
      tabBasic: 'Base (46)',
      tabDakuten: 'Dakuten (゛/゜)',
      tabCombination: 'Combinazioni (拗音)',
      charDetails: 'Dettagli Carattere',
      exampleWord: 'Parola d\'esempio',
      close: 'Chiudi'
    },

    // Flashcards
    flashcards: {
      title: 'Flashcards Kana',
      subtitle: 'Esercita la memoria visiva e la pronuncia. Clicca sulla carta per scoprire il retro.',
      progress: 'Carta',
      flipHint: 'Tocca per girare la carta',
      knewIt: 'Lo sapevo (+1)',
      forgot: 'Da rivedere (0)',
      resetDeck: 'Ricomincia Mazzo',
      completedTitle: 'Mazzo Completato!',
      completedSubtitle: 'Ottimo lavoro! Hai ripassato tutte le carte di questo gruppo.',
      restart: 'Ricomincia'
    },

    // Active Study
    activeStudy: {
      setupTitle: 'Impostazioni Active Study',
      questionCount: 'Numero di Domande',
      studyMode: 'Modalità di Studio',
      modeReadKana: 'Leggi Kana',
      modeWriteKana: 'Scrivi Kana',
      modeMixed: 'Mista',
      difficulty: 'Difficoltà',
      difficultyEasy: 'Facile',
      difficultyEasyDesc: 'Romaji sempre visibili. Tastiera di consultazione automatica in modalità Leggi Kana.',
      difficultyMedium: 'Media',
      difficultyMediumDesc: 'Toggle Romaji visibile/nascosto. Tastiera di consultazione apribile in modalità Leggi Kana.',
      difficultyHard: 'Difficile',
      difficultyHardDesc: 'Solo caratteri Kana senza Romaji. Nessuna consultazione in modalità Leggi Kana.',
      startSession: 'Inizia Sessione',
      exitSession: 'Esci',
      questionProgress: 'D',
      attemptsRemaining: 'Tentativi rimasti:',
      inputPlaceholderJaToRo: 'Digita il romaji qui...',
      inputPlaceholderRoToJa: 'Usa la tastiera sottostante...',
      submitAnswer: 'Invia Risposta',
      showRefKeyboard: 'Mostra Tastiera di Consultazione',
      hideRefKeyboard: 'Nascondi Tastiera di Consultazione',
      refKeyboardNotice: 'Tastiera di consultazione (Digita la risposta con la tastiera del dispositivo)',
      romajiOn: 'Romaji ON',
      romajiOff: 'Romaji OFF',
      correct: 'Corretto!',
      wrong: 'Sbagliato!',
      solutionTitle: 'Soluzione',
      acceptedVariants: 'Varianti Accettate',
      italianTranslation: 'Italiano',
      englishTranslation: 'Inglese',
      nextQuestion: 'Prossima',
      sessionComplete: 'Sessione Completata!',
      sessionSummaryText: 'Ecco i tuoi risultati:',
      correctCount: 'Corrette',
      failedCount: 'Errate',
      backToSetup: 'Torna alle Impostazioni',
      scriptHint: 'Suggerimento:',
      translateToRomaji: 'Traduci in Romaji',
      writeInJapanese: 'Scrivi in Giapponese (Kana)'
    },

    // Virtual Keyboard
    keyboard: {
      hiragana: 'Hiragana',
      katakana: 'Katakana',
      basic: 'Base',
      dakuten: 'Dakuten (゛)',
      handakuten: 'Handakuten (゜)',
      yoon: 'Yōon / Comb.',
      small: 'Sokuon (っ)',
      del: 'Canc',
      consultationNotice: 'Tastiera di consultazione (Digita la risposta con la tastiera del dispositivo)'
    },

    // Vocabulary
    vocabulary: {
      title: 'Vocabolario',
      subtitle: 'Tocca una scheda per ascoltare la pronuncia giapponese.',
      wordsCount: '100 parole giapponesi',
      searchPlaceholder: 'Cerca per kana, romaji o significato...',
      filterAll: 'Tutti',
      filterHiragana: 'Hiragana',
      filterKatakana: 'Katakana',
      showingWords: 'parole trovate'
    },

    // Structured Lessons
    lessons: {
      title: 'Lezioni Strutturate',
      subtitle: 'Segui il piano di studio giornaliero per padroneggiare tutti i caratteri progressivamente.',
      day: 'Giorno',
      characters: 'Caratteri',
      cumulative: 'Cumulativi',
      startLesson: 'Inizia Lezione',
      reviewLesson: 'Ripassa',
      completed: 'Completata',
      vocabularyFound: 'Vocaboli disponibili per questa lezione'
    },

    // Writing Canvas
    writing: {
      title: 'Canvas di Scrittura',
      subtitle: 'Esercitati a disegnare a mano libera i caratteri rispettando le proporzioni e l\'equilibrio dei tratti.',
      clear: 'Pulisci',
      showGrid: 'Griglia Guida',
      strokeOrder: 'Mostra Tratti',
      currentChar: 'Carattere Attivo',
      prev: 'Precedente',
      next: 'Successivo',
      strokeTips: 'Traccia dall\'alto verso il basso e da sinistra verso destra.'
    },

    // Listening Quiz
    listening: {
      title: 'Quiz di Ascolto',
      subtitle: 'Ascolta il suono pronunciato e seleziona il Kana corrispondente.',
      playAudio: 'Riproduci Audio',
      score: 'Punteggio',
      question: 'Domanda',
      whichKana: 'Quale Kana hai ascoltato?',
      next: 'Prossima Domanda',
      resultsTitle: 'Quiz di Ascolto Completato!',
      tryAgain: 'Riprova'
    },

    // Verification Quiz
    quiz: {
      title: 'Quiz di Verifica',
      subtitle: 'Mettiti alla prova con domande a risposta multipla su entrambi gli alfabeti.',
      question: 'Domanda',
      score: 'Punteggio',
      accuracy: 'Precisione',
      next: 'Successivo',
      finish: 'Concludi Quiz',
      resultsTitle: 'Risultato del Quiz',
      restart: 'Nuovo Quiz'
    }
  },

  en: {
    // Navigation & Common
    nav: {
      appName: 'Zen Kana',
      appSubtitle: 'Japanese Kana Study Studio',
      dashboard: 'Dashboard',
      dashboardDesc: 'Overview & Study Stats',
      table: 'Kana Table',
      tableShort: 'Kana',
      tableDesc: 'Interactive Syllabary',
      flashcards: 'Flashcards',
      flashcardsShort: 'Cards',
      flashcardsDesc: 'Memory Flashcards',
      activeStudy: 'Active Study',
      activeStudyShort: 'Active Study',
      activeStudyDesc: 'Transliteration Training',
      vocabulary: 'Vocabulary',
      vocabularyShort: 'Vocab',
      vocabularyDesc: 'Words & Pronunciation',
      lessons: 'Lessons',
      lessonsShort: 'Lessons',
      lessonsDesc: 'Guided Study Path',
      writing: 'Writing',
      writingShort: 'Writing',
      writingDesc: 'Stroke Order & Canvas',
      listening: 'Listening',
      listeningShort: 'Listening',
      listeningDesc: 'Audio Recognition',
      quiz: 'Quiz',
      quizShort: 'Quiz',
      quizDesc: 'Knowledge Assessment',
      scriptHiragana: 'Hiragana (あ)',
      scriptKatakana: 'Katakana (ア)',
      scriptHiraganaShort: 'あ Hira',
      scriptKatakanaShort: 'ア Kata',
      writingSystem: 'Writing System',
      studySections: 'Study Sections',
      themeMode: 'Theme Mode',
      themeDark: 'Dark',
      themeLight: 'Light',
      language: 'Language',
      langIt: 'Italiano',
      langEn: 'English',
      installApp: 'Install Zen Kana PWA',
      installModalTitle: 'Install Zen Kana PWA',
      installModalIosTitle: 'Instructions for iOS Safari:',
      installModalIos1: 'Tap the Share icon in the browser navigation bar.',
      installModalIos2: 'Scroll down and tap "Add to Home Screen".',
      installModalIos3: 'Confirm by tapping "Add" in the top-right corner.',
      installModalDesktopTitle: 'Desktop / Android Browser:',
      installModalDesktopText: 'Click the install icon in your browser address bar or select "Install app" from the browser menu.',
      gotIt: 'Got it',
      footerText: 'Zen Kana Studio — Built with React, Vite & Tailwind CSS. Japanese Audio powered by Web Speech API.'
    },

    // Dashboard
    dashboard: {
      welcome: 'Welcome to your Kana Dojo',
      welcomeSubtitle: 'Master Hiragana and Katakana Japanese syllabaries through daily interactive sessions.',
      switchScript: 'Switch to',
      statsOverview: 'Stats Overview',
      reviewedKana: 'Kana Reviewed',
      accuracy: 'Overall Accuracy',
      totalAttempts: 'Total Attempts',
      accuracyRate: 'Correct Answer Rate',
      quickActions: 'Quick Activity Access',
      startActiveStudy: 'Start Active Study',
      startActiveStudyDesc: 'Test Kana/Romaji transliteration skills under focused practice.',
      browseKanaTable: 'Browse Kana Table',
      browseKanaTableDesc: 'Explore 46 core characters, dakuten, combinations and audio.',
      practiceWriting: 'Practice Writing',
      practiceWritingDesc: 'Draw strokes on interactive canvas with stroke guidelines.',
      listeningTraining: 'Listening Quiz',
      listeningTrainingDesc: 'Train your ear by recognizing native Japanese sounds.',
      studyTipsTitle: 'Zen Study Tip of the Day',
      studyTipText: 'Consistency beats intensity: dedicating 10 minutes every day to listening and writing yields far better long-term retention than infrequent cramming sessions.',
      resetStats: 'Reset Statistics',
      resetConfirm: 'Are you sure you want to reset all study statistics?'
    },

    // Kana Tables
    table: {
      title: 'Table',
      subtitle: 'Click any character card to hear native Japanese Web Speech audio pronunciation.',
      tabBasic: 'Basic (46)',
      tabDakuten: 'Dakuten (゛/゜)',
      tabCombination: 'Combination (拗音)',
      charDetails: 'Character Details',
      exampleWord: 'Example Word',
      close: 'Close'
    },

    // Flashcards
    flashcards: {
      title: 'Kana Flashcards',
      subtitle: 'Practice visual recall and pronunciation. Tap the card to reveal the back.',
      progress: 'Card',
      flipHint: 'Tap to flip card',
      knewIt: 'Knew it (+1)',
      forgot: 'Need Review (0)',
      resetDeck: 'Restart Deck',
      completedTitle: 'Deck Completed!',
      completedSubtitle: 'Great job! You reviewed all cards in this category.',
      restart: 'Restart'
    },

    // Active Study
    activeStudy: {
      setupTitle: 'Active Study Setup',
      questionCount: 'Number of Questions',
      studyMode: 'Study Mode',
      modeReadKana: 'Read Kana',
      modeWriteKana: 'Write Kana',
      modeMixed: 'Mixed',
      difficulty: 'Difficulty',
      difficultyEasy: 'Easy',
      difficultyEasyDesc: 'Romaji always visible. Consultation keyboard automatically shown in Read Kana mode.',
      difficultyMedium: 'Medium',
      difficultyMediumDesc: 'Toggle Romaji hints ON/OFF. Consultation keyboard toggleable in Read Kana mode.',
      difficultyHard: 'Hard',
      difficultyHardDesc: 'Kana only without Romaji. No consultation keyboard in Read Kana mode.',
      startSession: 'Start Session',
      exitSession: 'Exit',
      questionProgress: 'Q',
      attemptsRemaining: 'Attempts remaining:',
      inputPlaceholderJaToRo: 'Type romaji here...',
      inputPlaceholderRoToJa: 'Use the keyboard below...',
      submitAnswer: 'Submit Answer',
      showRefKeyboard: 'Show Reference Keyboard',
      hideRefKeyboard: 'Hide Reference Keyboard',
      refKeyboardNotice: 'Consultation Keyboard (Type answer with your device keyboard)',
      romajiOn: 'Romaji ON',
      romajiOff: 'Romaji OFF',
      correct: 'Correct!',
      wrong: 'Wrong!',
      solutionTitle: 'Solution',
      acceptedVariants: 'Accepted Variants',
      italianTranslation: 'Italian',
      englishTranslation: 'English',
      nextQuestion: 'Next',
      sessionComplete: 'Session Complete!',
      sessionSummaryText: 'Here is how you did:',
      correctCount: 'Correct',
      failedCount: 'Failed',
      backToSetup: 'Back to Setup',
      scriptHint: 'Hint:',
      translateToRomaji: 'Translate to Romaji',
      writeInJapanese: 'Write in Japanese (Kana)'
    },

    // Virtual Keyboard
    keyboard: {
      hiragana: 'Hiragana',
      katakana: 'Katakana',
      basic: 'Basic',
      dakuten: 'Dakuten (゛)',
      handakuten: 'Handakuten (゜)',
      yoon: 'Yōon / Comb.',
      small: 'Sokuon (っ)',
      del: 'Del',
      consultationNotice: 'Consultation Keyboard (Type answer with your keyboard)'
    },

    // Vocabulary
    vocabulary: {
      title: 'Vocabulary',
      subtitle: 'Tap any card to hear its Japanese pronunciation.',
      wordsCount: '100 Japanese words',
      searchPlaceholder: 'Search kana, romaji or translation...',
      filterAll: 'All',
      filterHiragana: 'Hiragana',
      filterKatakana: 'Katakana',
      showingWords: 'words found'
    },

    // Structured Lessons
    lessons: {
      title: 'Structured Lessons',
      subtitle: 'Follow the daily syllabus to master all characters step by step.',
      day: 'Day',
      characters: 'Characters',
      cumulative: 'Cumulative',
      startLesson: 'Start Lesson',
      reviewLesson: 'Review',
      completed: 'Completed',
      vocabularyFound: 'Available vocabulary for this lesson'
    },

    // Writing Canvas
    writing: {
      title: 'Writing Canvas',
      subtitle: 'Practice drawing characters with correct stroke order and balanced proportions.',
      clear: 'Clear',
      showGrid: 'Guide Grid',
      strokeOrder: 'Show Strokes',
      currentChar: 'Active Character',
      prev: 'Previous',
      next: 'Next',
      strokeTips: 'Draw top-to-bottom and left-to-right.'
    },

    // Listening Quiz
    listening: {
      title: 'Listening Quiz',
      subtitle: 'Listen to the audio pronunciation and select the matching Kana.',
      playAudio: 'Play Audio',
      score: 'Score',
      question: 'Question',
      whichKana: 'Which Kana did you hear?',
      next: 'Next Question',
      resultsTitle: 'Listening Quiz Complete!',
      tryAgain: 'Try Again'
    },

    // Verification Quiz
    quiz: {
      title: 'Verification Quiz',
      subtitle: 'Test your overall mastery with multiple choice questions across both alphabets.',
      question: 'Question',
      score: 'Score',
      accuracy: 'Accuracy',
      next: 'Next',
      finish: 'Finish Quiz',
      resultsTitle: 'Quiz Results',
      restart: 'New Quiz'
    }
  }
};
