import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'fr' | 'rw' | 'sw';

interface Translations {
  [key: string]: {
    en: string;
    fr: string;
    rw: string;
    sw: string;
  };
}

const translations: Translations = {
  // Navigation
  'nav.home': {
    en: 'Home',
    fr: 'Accueil',
    rw: 'Ahabanza',
    sw: 'Nyumbani',
  },
  'nav.learn': {
    en: 'AI Tutor',
    fr: 'Tuteur IA',
    rw: 'Umwarimu AI',
    sw: 'Mwalimu AI',
  },
  'nav.quiz': {
    en: 'Quizzes',
    fr: 'Quiz',
    rw: 'Ibizamini',
    sw: 'Majaribio',
  },
  'nav.pricing': {
    en: 'Pricing',
    fr: 'Tarifs',
    rw: 'Ibiciro',
    sw: 'Bei',
  },
  'nav.login': {
    en: 'Log In',
    fr: 'Connexion',
    rw: 'Injira',
    sw: 'Ingia',
  },
  'nav.signup': {
    en: 'Sign Up Free',
    fr: 'Inscription Gratuite',
    rw: 'Iyandikishe',
    sw: 'Jisajili Bure',
  },
  // Hero
  'hero.badge': {
    en: '🎓 Fast AI Learning for Everyone',
    fr: '🎓 Apprentissage IA Rapide pour Tous',
    rw: '🎓 Kwigishwa na AI Byihuse ku Bose',
    sw: '🎓 Kujifunza Haraka kwa AI kwa Wote',
  },
  'hero.title': {
    en: 'Learn Faster with',
    fr: 'Apprenez Plus Vite avec',
    rw: 'Wige Byihuse na',
    sw: 'Jifunze Haraka na',
  },
  'hero.titleAccent': {
    en: 'Smart Mind',
    fr: 'Smart Mind',
    rw: 'Smart Mind',
    sw: 'Smart Mind',
  },
  'hero.subtitle': {
    en: 'Get instant answers for Math, Science, English, and all subjects. Direct explanations, no fluff.',
    fr: 'Obtenez des réponses instantanées pour les maths, sciences, anglais et toutes les matières.',
    rw: 'Bona ibisubizo byihuse mu mibare, ubumenyi, icyongereza, n\'amasomo yose.',
    sw: 'Pata majibu ya haraka kwa Hesabu, Sayansi, Kiingereza, na masomo yote.',
  },
  'hero.cta': {
    en: 'Start Learning',
    fr: 'Commencer',
    rw: 'Tangira',
    sw: 'Anza',
  },
  'hero.ctaSecondary': {
    en: 'Take a Quiz',
    fr: 'Faire un Quiz',
    rw: 'Kora Ikizamini',
    sw: 'Fanya Jaribio',
  },
  // Features
  'features.title': {
    en: 'Why Students Love Smart Mind',
    fr: 'Pourquoi les étudiants adorent Smart Mind',
    rw: 'Impamvu Abanyeshuri Bakunda Smart Mind',
    sw: 'Kwa Nini Wanafunzi Wanapenda Smart Mind',
  },
  'features.ai.title': {
    en: 'AI Tutor',
    fr: 'Tuteur IA',
    rw: 'Umwarimu AI',
    sw: 'Mwalimu AI',
  },
  'features.ai.desc': {
    en: 'Ask anything, get instant direct answers with step-by-step explanations',
    fr: 'Posez n\'importe quoi, obtenez des réponses directes instantanées',
    rw: 'Baza icyo ushaka cyose, ubone ibisubizo byihuse',
    sw: 'Uliza chochote, pata majibu ya moja kwa moja',
  },
  'features.voice.title': {
    en: 'Voice Mode',
    fr: 'Mode Vocal',
    rw: 'Ijwi',
    sw: 'Hali ya Sauti',
  },
  'features.voice.desc': {
    en: 'Talk to Smart Mind using your voice - unlimited access',
    fr: 'Parlez à Smart Mind par la voix - accès illimité',
    rw: 'Vugana na Smart Mind ukoresha ijwi - nta mpaka',
    sw: 'Zungumza na Smart Mind kwa sauti - upatikanaji usio na kikomo',
  },
  'features.quiz.title': {
    en: 'Smart Quizzes',
    fr: 'Quiz Intelligents',
    rw: 'Ibizamini Byiza',
    sw: 'Majaribio ya Akili',
  },
  'features.quiz.desc': {
    en: 'AI-generated quizzes with instant feedback and progress tracking',
    fr: 'Quiz générés par IA avec feedback instantané',
    rw: 'Ibizamini AI yakora hamwe n\'ibisubizo byihuse',
    sw: 'Majaribio ya AI na maoni ya haraka',
  },
  'features.homework.title': {
    en: 'Homework Help',
    fr: 'Aide aux Devoirs',
    rw: 'Ubufasha mu Mirimo',
    sw: 'Msaada wa Kazi',
  },
  'features.homework.desc': {
    en: 'Paste your homework, get explanations not just answers',
    fr: 'Collez vos devoirs, obtenez des explications pas seulement des réponses',
    rw: 'Shyira imirimo yawe, ubone ibisobanuro',
    sw: 'Bandika kazi yako, pata maelezo si majibu tu',
  },
  'features.study.title': {
    en: 'Study Plans',
    fr: 'Plans d\'Étude',
    rw: 'Gahunda yo Kwiga',
    sw: 'Mipango ya Kusoma',
  },
  'features.study.desc': {
    en: 'Daily/weekly study plans based on your level',
    fr: 'Plans d\'étude quotidiens/hebdomadaires selon votre niveau',
    rw: 'Gahunda yo kwiga ya buri munsi/cyumweru',
    sw: 'Mipango ya kusoma ya kila siku/wiki',
  },
  'features.pdf.title': {
    en: 'PDF Notes',
    fr: 'Notes PDF',
    rw: 'Inyandiko PDF',
    sw: 'Maelezo ya PDF',
  },
  'features.pdf.desc': {
    en: 'Download study notes as PDF - unlimited downloads',
    fr: 'Téléchargez les notes en PDF - téléchargements illimités',
    rw: 'Kuramo inyandiko PDF - nta mpaka',
    sw: 'Pakua maelezo kama PDF - upakuaji usio na kikomo',
  },
  // Subjects
  'subjects.title': {
    en: 'All Subjects Covered',
    fr: 'Toutes les Matières',
    rw: 'Amasomo Yose',
    sw: 'Masomo Yote',
  },
  // Chat
  'chat.placeholder': {
    en: 'Ask any question...',
    fr: 'Posez une question...',
    rw: 'Baza ikibazo...',
    sw: 'Uliza swali lolote...',
  },
  'chat.send': {
    en: 'Send',
    fr: 'Envoyer',
    rw: 'Ohereza',
    sw: 'Tuma',
  },
  'chat.welcome': {
    en: 'Hi! I\'m Smart Mind. Ask me anything - Math, Science, History, any subject. I give direct answers fast.',
    fr: 'Salut! Je suis Smart Mind. Demandez-moi n\'importe quoi - je réponds vite et directement.',
    rw: 'Muraho! Ndi Smart Mind. Mbaza icyo ushaka - nsubiza byihuse.',
    sw: 'Habari! Mimi ni Smart Mind. Niulize chochote - najibu haraka na moja kwa moja.',
  },
  'chat.voiceLimit': {
    en: 'Voice mode: {remaining} of 5 free uses left today',
    fr: 'Mode vocal: {remaining} sur 5 utilisations gratuites restantes',
    rw: 'Ijwi: {remaining} kuri 5 bisigaye uyu munsi',
    sw: 'Hali ya sauti: matumizi {remaining} ya 5 bure yaliyobaki leo',
  },
  'chat.pdfLimit': {
    en: 'PDF downloads: {remaining} of 2 free left today',
    fr: 'Téléchargements PDF: {remaining} sur 2 gratuits restants',
    rw: 'PDF: {remaining} kuri 2 bisigaye uyu munsi',
    sw: 'Upakuaji PDF: {remaining} ya 2 bure zilizobaki leo',
  },
  // Pricing
  'pricing.title': {
    en: 'Simple Pricing',
    fr: 'Tarifs Simples',
    rw: 'Ibiciro Byoroshye',
    sw: 'Bei Rahisi',
  },
  'pricing.free': {
    en: 'Free',
    fr: 'Gratuit',
    rw: 'Ubuntu',
    sw: 'Bure',
  },
  'pricing.pro': {
    en: 'Pro',
    fr: 'Pro',
    rw: 'Pro',
    sw: 'Pro',
  },
  'pricing.month': {
    en: '/month',
    fr: '/mois',
    rw: '/ukwezi',
    sw: '/mwezi',
  },
  'pricing.guarantee': {
    en: '2-day money-back guarantee',
    fr: 'Garantie de remboursement de 2 jours',
    rw: 'Garanti yo gusubizwa amafaranga mu minsi 2',
    sw: 'Dhamana ya kurudishiwa pesa siku 2',
  },
  // Quiz Page
  'quiz.title': {
    en: 'Smart Quizzes',
    fr: 'Quiz Intelligents',
    rw: 'Ibizamini Byiza',
    sw: 'Majaribio ya Akili',
  },
  'quiz.subtitle': {
    en: 'Test your knowledge with AI-generated questions',
    fr: 'Testez vos connaissances avec des questions générées par IA',
    rw: 'Gerageza ubumenyi bwawe n\'ibibazo AI yakora',
    sw: 'Jaribu ujuzi wako na maswali ya AI',
  },
  'quiz.chooseSubject': {
    en: 'Choose Subject',
    fr: 'Choisir la Matière',
    rw: 'Hitamo Isomo',
    sw: 'Chagua Somo',
  },
  'quiz.searchSubject': {
    en: 'Search subjects...',
    fr: 'Rechercher les matières...',
    rw: 'Shakisha amasomo...',
    sw: 'Tafuta masomo...',
  },
  'quiz.settings': {
    en: 'Quiz Settings',
    fr: 'Paramètres du Quiz',
    rw: 'Igenamiterere ry\'Ikizamini',
    sw: 'Mipangilio ya Jaribio',
  },
  'quiz.difficulty': {
    en: 'Difficulty',
    fr: 'Difficulté',
    rw: 'Uburemere',
    sw: 'Ugumu',
  },
  'quiz.easy': {
    en: 'Easy',
    fr: 'Facile',
    rw: 'Byoroshye',
    sw: 'Rahisi',
  },
  'quiz.medium': {
    en: 'Medium',
    fr: 'Moyen',
    rw: 'Hagati',
    sw: 'Wastani',
  },
  'quiz.hard': {
    en: 'Hard',
    fr: 'Difficile',
    rw: 'Bigoye',
    sw: 'Ngumu',
  },
  'quiz.numQuestions': {
    en: 'Questions',
    fr: 'Questions',
    rw: 'Ibibazo',
    sw: 'Maswali',
  },
  'quiz.startQuiz': {
    en: 'Start Quiz',
    fr: 'Commencer',
    rw: 'Tangira',
    sw: 'Anza',
  },
  'quiz.quizzesTaken': {
    en: 'Quizzes Taken',
    fr: 'Quiz Effectués',
    rw: 'Ibizamini Wakoze',
    sw: 'Majaribio Uliyofanya',
  },
  'quiz.averageScore': {
    en: 'Average Score',
    fr: 'Score Moyen',
    rw: 'Amanota Agereranijwe',
    sw: 'Alama ya Wastani',
  },
  'quiz.dayStreak': {
    en: 'Day Streak',
    fr: 'Jours Consécutifs',
    rw: 'Iminsi Ikurikirana',
    sw: 'Siku Mfululizo',
  },
  'quiz.back': {
    en: 'Back',
    fr: 'Retour',
    rw: 'Gusubira',
    sw: 'Rudi',
  },
  'quiz.next': {
    en: 'Next',
    fr: 'Suivant',
    rw: 'Ibikurikira',
    sw: 'Ifuatayo',
  },
  'quiz.complete': {
    en: 'Quiz Complete!',
    fr: 'Quiz Terminé!',
    rw: 'Ikizamini Kirangiye!',
    sw: 'Jaribio Limekamilika!',
  },
  'quiz.yourScore': {
    en: 'You scored {score} out of {total}',
    fr: 'Vous avez obtenu {score} sur {total}',
    rw: 'Wabonye {score} kuri {total}',
    sw: 'Umepata {score} kati ya {total}',
  },
  'quiz.tryAgain': {
    en: 'Try Again',
    fr: 'Réessayer',
    rw: 'Ongera Ugerageze',
    sw: 'Jaribu Tena',
  },
  'quiz.explanation': {
    en: 'Explanation',
    fr: 'Explication',
    rw: 'Ibisobanuro',
    sw: 'Maelezo',
  },
  'quiz.topic': {
    en: 'Topic (optional)',
    fr: 'Sujet (optionnel)',
    rw: 'Ingingo (ntibisabwa)',
    sw: 'Mada (si lazima)',
  },
  'quiz.topicPlaceholder': {
    en: 'e.g., Fractions, World War II...',
    fr: 'ex: Fractions, Seconde Guerre mondiale...',
    rw: 'urugero: Ibice, Intambara ya Kabiri...',
    sw: 'mf: Sehemu, Vita vya Pili vya Dunia...',
  },
  // Subjects
  'subject.math': {
    en: 'Mathematics',
    fr: 'Mathématiques',
    rw: 'Imibare',
    sw: 'Hesabu',
  },
  'subject.science': {
    en: 'Science',
    fr: 'Sciences',
    rw: 'Ubumenyi',
    sw: 'Sayansi',
  },
  'subject.english': {
    en: 'English',
    fr: 'Anglais',
    rw: 'Icyongereza',
    sw: 'Kiingereza',
  },
  'subject.geography': {
    en: 'Geography',
    fr: 'Géographie',
    rw: 'Geografiya',
    sw: 'Jiografia',
  },
  'subject.ict': {
    en: 'ICT',
    fr: 'Informatique',
    rw: 'ICT',
    sw: 'TEHAMA',
  },
  'subject.history': {
    en: 'History',
    fr: 'Histoire',
    rw: 'Amateka',
    sw: 'Historia',
  },
  'subject.physics': {
    en: 'Physics',
    fr: 'Physique',
    rw: 'Fiziki',
    sw: 'Fizikia',
  },
  'subject.chemistry': {
    en: 'Chemistry',
    fr: 'Chimie',
    rw: 'Chimie',
    sw: 'Kemia',
  },
  'subject.biology': {
    en: 'Biology',
    fr: 'Biologie',
    rw: 'Biyoloji',
    sw: 'Biolojia',
  },
  'subject.french': {
    en: 'French',
    fr: 'Français',
    rw: 'Igifaransa',
    sw: 'Kifaransa',
  },
  'subject.swahili': {
    en: 'Swahili',
    fr: 'Swahili',
    rw: 'Igiswahili',
    sw: 'Kiswahili',
  },
  'subject.economics': {
    en: 'Economics',
    fr: 'Économie',
    rw: 'Ubukungu',
    sw: 'Uchumi',
  },
  // Common
  'common.loading': {
    en: 'Loading...',
    fr: 'Chargement...',
    rw: 'Gutegereza...',
    sw: 'Inapakia...',
  },
  'common.error': {
    en: 'Something went wrong',
    fr: 'Une erreur s\'est produite',
    rw: 'Habaye ikibazo',
    sw: 'Kuna tatizo',
  },
  'common.retry': {
    en: 'Try Again',
    fr: 'Réessayer',
    rw: 'Ongera Ugerageze',
    sw: 'Jaribu Tena',
  },
  // FAQ
  'faq.comeback': {
    en: 'Want to continue where you left off?',
    fr: 'Voulez-vous reprendre là où vous vous êtes arrêté?',
    rw: 'Urashaka gukomeza aho wahagarikiye?',
    sw: 'Unataka kuendelea ulipoishia?',
  },
  'faq.streakReminder': {
    en: 'Keep your {days}-day streak going! Learn something today.',
    fr: 'Maintenez votre série de {days} jours! Apprenez quelque chose aujourd\'hui.',
    rw: 'Komeza iminsi {days} ikurikirana! Wige ikintu uyu munsi.',
    sw: 'Endelea na mfululizo wako wa siku {days}! Jifunze kitu leo.',
  },
  // Popular Questions
  'popular.title': {
    en: 'Most Asked Questions',
    fr: 'Questions les Plus Posées',
    rw: 'Ibibazo Bibazwa Cyane',
    sw: 'Maswali Yanayoulizwa Zaidi',
  },
  // Contact
  'contact.email': {
    en: 'Contact: mukunzibernard59@gmail.com',
    fr: 'Contact: mukunzibernard59@gmail.com',
    rw: 'Twandikire: mukunzibernard59@gmail.com',
    sw: 'Wasiliana: mukunzibernard59@gmail.com',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string, params?: Record<string, string | number>): string => {
    const translation = translations[key];
    if (!translation) return key;
    let text = translation[language] || translation.en || key;
    
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, String(v));
      });
    }
    
    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const languages = [
  { code: 'en' as Language, name: 'English', flag: '🇬🇧' },
  { code: 'fr' as Language, name: 'Français', flag: '🇫🇷' },
  { code: 'rw' as Language, name: 'Kinyarwanda', flag: '🇷🇼' },
  { code: 'sw' as Language, name: 'Kiswahili', flag: '🇰🇪' },
];
