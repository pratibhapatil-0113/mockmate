import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export const LANGUAGES = [
  { code: 'English', name: 'English', flag: '🌐' },
  { code: 'Kannada', name: 'ಕನ್ನಡ (Kannada)', flag: '🌐' },
  { code: 'Hindi', name: 'हिंदी (Hindi)', flag: '🌐' },
  { code: 'Marathi', name: 'मराठी (Marathi)', flag: '🌐' },
  { code: 'Telugu', name: 'తెలుగు (Telugu)', flag: '🌐' },
  { code: 'Tamil', name: 'தமிழ் (Tamil)', flag: '🌐' }
];

export const TRANSLATIONS = {
  English: {
    tagline: 'Practice Smart. Interview Better. Get Hired.',
    dashboard: 'Dashboard',
    mock_interview: 'Mock Interview',
    coding_lab: 'Coding Lab',
    aptitude: 'Aptitude Arena',
    resume_coach: 'Resume Coach',
    gd_arena: 'Group Discussion',
    question_bank: 'Question Bank',
    progress: 'Progress',
    achievements: 'Achievements',
    settings: 'Settings',
    profile: 'Profile',
    readiness: 'Your Interview Readiness',
    start_interview: 'Start Mock Interview',
    explore_features: 'Explore Features',
    ai_insight: 'MockMate AI Insight',
    listening: 'Listening...',
    submit_answer: 'Submit Answer',
    skip: 'Skip',
    hint: 'Hint',
    end_interview: 'End Interview'
  },
  Kannada: {
    tagline: 'ಬುದ್ಧಿವಂತಿಕೆಯಿಂದ ಅಭ್ಯಾಸ ಮಾಡಿ. ಸಂದರ್ಶನವನ್ನು ಗೆಲ್ಲಿರಿ. ಉದ್ಯೋಗ ಪಡೆಯಿರಿ.',
    dashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    mock_interview: 'ಮಾಕ್ ಸಂದರ್ಶನ',
    coding_lab: 'ಕೋಡಿಂಗ್ ಲ್ಯಾಬ್',
    aptitude: 'ಆಪ್ಟಿಟ್ಯೂಡ್ ಅರೆನಾ',
    resume_coach: 'ರೆಸ್ಯೂಮ್ ಕೋಚ್',
    gd_arena: 'ಗುಂಪು ಚರ್ಚೆ',
    question_bank: 'ಪ್ರಶ್ನೆ ಬ್ಯಾಂಕ್',
    progress: 'ಪ್ರಗತಿ',
    achievements: 'ಸಾಧನೆಗಳು',
    settings: 'ಸೇಟಿಂಗ್ಸ್',
    profile: 'ಪ್ರೊಫೈಲ್',
    readiness: 'ಸಂದರ್ಶನದ ಸಿದ್ಧತೆ',
    start_interview: 'ಸಂದರ್ಶನ ಪ್ರಾರಂಭಿಸಿ',
    explore_features: 'ವೈಶಿಷ್ಟ್ಯಗಳನ್ನು ಅನ್ವೇಷಿಸಿ',
    ai_insight: 'ಮಾಕ್‌ಮೇಟ್ ಎಐ ಒಳನೋಟ',
    listening: 'ಆಲಿಸಲಾಗುತ್ತಿದೆ...',
    submit_answer: 'ಉತ್ತರ ಸಲ್ಲಿಸಿ',
    skip: 'ಸ್ಕಿಪ್',
    hint: 'ಸುಳಿವು',
    end_interview: 'ಸಂದರ್ಶನ ಮುಕ್ತಾಯಗೊಳಿಸಿ'
  },
  Hindi: {
    tagline: 'स्मार्ट अभ्यास करें। बेहतर साक्षात्कार दें। जॉब पाएं।',
    dashboard: 'डैशबोर्ड',
    mock_interview: 'मॉक इंटरव्यू',
    coding_lab: 'कोडिंग लैब',
    aptitude: 'एप्टीट्यूड एरिना',
    resume_coach: 'रेज़्यूमे कोच',
    gd_arena: 'ग्रुप डिस्कशन',
    question_bank: 'प्रश्न बैंक',
    progress: 'प्रगति',
    achievements: 'उपलब्धियां',
    settings: 'सेटिंग्स',
    profile: 'प्रोफ़ाइल',
    readiness: 'आपकी इंटरव्यू तैयारी',
    start_interview: 'मॉक इंटरव्यू शुरू करें',
    explore_features: 'फीचर्स देखें',
    ai_insight: 'मॉकमेट एआई इनसाइट',
    listening: 'सुन रहा है...',
    submit_answer: 'उत्तर जमा करें',
    skip: 'छोड़ें',
    hint: 'संकेत',
    end_interview: 'इंटरव्यू समाप्त करें'
  },
  Marathi: {
    tagline: 'स्मार्ट सराव करा. उत्तम मुलाखत द्या. नोकरी मिळवा.',
    dashboard: 'डॅशबोर्ड',
    mock_interview: 'मॉक मुलाखत',
    coding_lab: 'कोडिंग लॅब',
    aptitude: 'अ‍ॅप्टिट्यूड अ‍ॅरिना',
    resume_coach: 'रेझ्युमे कोच',
    gd_arena: 'गट चर्चा (GD)',
    question_bank: 'प्रश्न संच',
    progress: 'प्रगती',
    achievements: 'यश',
    settings: 'सेटिंग्ज',
    profile: 'प्रोफाइल',
    readiness: 'मुलाखत तयारी',
    start_interview: 'मॉक मुलाखत सुरू करा',
    explore_features: 'वैशिष्ट्ये पहा',
    ai_insight: 'मॉकमेट AI इनसाइट',
    listening: 'ऐकत आहे...',
    submit_answer: 'उत्तर सादर करा',
    skip: 'सोडून द्या',
    hint: 'टीप',
    end_interview: 'मुलाखत संपवा'
  },
  Telugu: {
    tagline: 'స్మార్ట్‌గా ప్రాక్టీస్ చేయండి. ఇంటర్వ్యూలో మెప్పించండి. ఉద్యోగం సాధించండి.',
    dashboard: 'డాష్‌బోర్డ్',
    mock_interview: 'మాక్ ఇంటర్వ్యూ',
    coding_lab: 'కోడింగ్ ల్యాబ్',
    aptitude: 'ఆప్టిట్యూడ్ అరేనా',
    resume_coach: 'రెజ్యూమ్ కోచ్',
    gd_arena: 'గ్రూప్ డిస్కషన్',
    question_bank: 'ప్రశ్నల బ్యాంక్',
    progress: 'ప్రగతి',
    achievements: 'సాధనలు',
    settings: 'సెట్టింగ్స్',
    profile: 'ప్రొఫైల్',
    readiness: 'ఇంటర్వ్యూ సిద్ధత',
    start_interview: 'మాక్ ఇంటర్వ్యూ ప్రారంభించు',
    explore_features: 'ఫీచర్లు చూడండి',
    ai_insight: 'మాక్‌మేట్ AI విశేషణ',
    listening: 'వింటోంది...',
    submit_answer: 'సమాధానం పంపండి',
    skip: 'స్కిప్',
    hint: 'హింట్',
    end_interview: 'ఇంటర్వ్యూ ముగించు'
  },
  Tamil: {
    tagline: 'புத்திசாலித்தனமாகப் பயிற்சி செய்யுங்கள். நேர்காணலை வெல்லுங்கள். வேலை பெறுங்கள்.',
    dashboard: 'டாஷ்போர்டு',
    mock_interview: 'மாக் நேர்காணல்',
    coding_lab: 'கோடிங் லேப்',
    aptitude: 'ஆப்டிடியூட் அரங்கம்',
    resume_coach: 'ரெஸ்யூம் கோச்',
    gd_arena: 'குழு விவாதம்',
    question_bank: 'வினா வங்கி',
    progress: 'முன்னேற்றம்',
    achievements: 'சாதனைகள்',
    settings: 'அமைப்புகள்',
    profile: 'சுயவிவரம்',
    readiness: 'நேர்காணல் தயார்நிலை',
    start_interview: 'நேர்காணலைத் தொடங்கு',
    explore_features: 'அம்சங்களை அறிக',
    ai_insight: 'மாக்மேட் AI பார்வை',
    listening: 'கவனிக்கிறது...',
    submit_answer: 'பதில் சமர்ப்பி',
    skip: 'தவிர்',
    hint: 'குறிப்பு',
    end_interview: 'நேர்காணலை முடி'
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('English');

  const t = (key) => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS['English'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, languages: LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
