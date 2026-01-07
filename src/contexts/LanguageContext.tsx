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
    en: 'Learn',
    fr: 'Apprendre',
    rw: 'Kwiga',
    sw: 'Jifunze',
  },
  'nav.quiz': {
    en: 'Quiz',
    fr: 'Quiz',
    rw: 'Ikizamini',
    sw: 'Jaribio',
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
    en: '🎓 AI-Powered Learning for Everyone',
    fr: '🎓 Apprentissage IA pour Tous',
    rw: '🎓 Kwigishwa na AI ku Bose',
    sw: '🎓 Kujifunza kwa AI kwa Wote',
  },
  'hero.title': {
    en: 'Learn Smarter with',
    fr: 'Apprenez mieux avec',
    rw: 'Wige byiza na',
    sw: 'Jifunze vizuri na',
  },
  'hero.titleAccent': {
    en: 'AI Tutoring',
    fr: 'Tutorat IA',
    rw: 'Ubufasha bwa AI',
    sw: 'Mafunzo ya AI',
  },
  'hero.subtitle': {
    en: 'Get instant help with Math, Science, English, and more. Ask questions, practice with quizzes, and learn at your own pace in your language.',
    fr: 'Obtenez une aide instantanée en maths, sciences, anglais et plus. Posez des questions, pratiquez avec des quiz et apprenez à votre rythme.',
    rw: 'Bona ubufasha mu mibare, ubumenyi, icyongereza, n\'ibindi. Baza ibibazo, wigerageze, wige uko ubishaka.',
    sw: 'Pata msaada wa haraka katika Hesabu, Sayansi, Kiingereza, na zaidi. Uliza maswali, fanya mazoezi, na jifunze kwa kasi yako.',
  },
  'hero.cta': {
    en: 'Start Learning Free',
    fr: 'Commencer Gratuitement',
    rw: 'Tangira Kwiga',
    sw: 'Anza Kujifunza',
  },
  'hero.ctaSecondary': {
    en: 'See How It Works',
    fr: 'Comment ça marche',
    rw: 'Reba uko bikora',
    sw: 'Ona jinsi inavyofanya kazi',
  },
  // Features
  'features.title': {
    en: 'Everything You Need to Succeed',
    fr: 'Tout ce dont vous avez besoin',
    rw: 'Ibyo ukeneye byose',
    sw: 'Kila kitu unachohitaji',
  },
  'features.ai.title': {
    en: 'AI Tutor Chat',
    fr: 'Chat Tuteur IA',
    rw: 'Ikiganiro na AI',
    sw: 'Mazungumzo na AI',
  },
  'features.ai.desc': {
    en: 'Ask any question and get step-by-step explanations in simple language',
    fr: 'Posez n\'importe quelle question et obtenez des explications étape par étape',
    rw: 'Baza ikibazo icyo ari cyo cyose ubone ibisubizo byumvikana',
    sw: 'Uliza swali lolote na upate maelezo rahisi hatua kwa hatua',
  },
  'features.voice.title': {
    en: 'Voice Mode',
    fr: 'Mode Vocal',
    rw: 'Ijwi',
    sw: 'Hali ya Sauti',
  },
  'features.voice.desc': {
    en: 'Talk to your AI tutor using voice - perfect for hands-free learning',
    fr: 'Parlez à votre tuteur IA par la voix - parfait pour apprendre sans les mains',
    rw: 'Vugana na AI ufashwe n\'ijwi - byiza ku wiga adafashe',
    sw: 'Zungumza na mwalimu wako wa AI kwa sauti - nzuri kwa kujifunza bila mikono',
  },
  'features.quiz.title': {
    en: 'Smart Quizzes',
    fr: 'Quiz Intelligents',
    rw: 'Ibizamini Byiza',
    sw: 'Majaribio ya Akili',
  },
  'features.quiz.desc': {
    en: 'Practice with AI-generated quizzes and track your progress',
    fr: 'Pratiquez avec des quiz générés par IA et suivez vos progrès',
    rw: 'Wigerageze ku bizamini AI yakora kandi ukurikirane aho ugeze',
    sw: 'Fanya mazoezi na majaribio ya AI na fuatilia maendeleo yako',
  },
  'features.homework.title': {
    en: 'Homework Help',
    fr: 'Aide aux Devoirs',
    rw: 'Ubufasha mu Mirimo',
    sw: 'Msaada wa Kazi za Nyumbani',
  },
  'features.homework.desc': {
    en: 'Get explanations for homework problems, not just answers',
    fr: 'Obtenez des explications pour vos devoirs, pas seulement des réponses',
    rw: 'Bona ibisobanuro ku mirimo, si ibisubizo gusa',
    sw: 'Pata maelezo ya matatizo ya kazi za nyumbani, si majibu tu',
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
    en: 'Ask me anything about your studies...',
    fr: 'Demandez-moi n\'importe quoi sur vos études...',
    rw: 'Mbaza icyo ushaka cyose ku masomo...',
    sw: 'Niulize chochote kuhusu masomo yako...',
  },
  'chat.send': {
    en: 'Send',
    fr: 'Envoyer',
    rw: 'Ohereza',
    sw: 'Tuma',
  },
  'chat.welcome': {
    en: 'Hello! I\'m your AI tutor. Ask me anything about Math, Science, English, or any subject!',
    fr: 'Bonjour! Je suis votre tuteur IA. Demandez-moi n\'importe quoi!',
    rw: 'Muraho! Ndi umwarimu wawe wa AI. Mbaza icyo ushaka!',
    sw: 'Habari! Mimi ni mwalimu wako wa AI. Niulize chochote!',
  },
  // Pricing
  'pricing.title': {
    en: 'Simple, Affordable Pricing',
    fr: 'Tarifs Simples et Abordables',
    rw: 'Ibiciro Byoroshye',
    sw: 'Bei Rahisi na Nafuu',
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
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    const translation = translations[key];
    if (!translation) return key;
    return translation[language] || translation.en || key;
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
