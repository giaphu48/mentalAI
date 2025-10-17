'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Lang = 'vi' | 'en';

interface LanguageContextProps {
  language: Lang;
  setLanguage: (lang: Lang) => void;
}

const LanguageContext = createContext<LanguageContextProps>({
  language: 'vi',
  setLanguage: () => {},
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Lang>('vi');

  useEffect(() => {
    const storedLang = localStorage.getItem('lang') as Lang | null;
    if (storedLang) setLanguageState(storedLang);
  }, []);

  const setLanguage = (lang: Lang) => {
    setLanguageState(lang);
    localStorage.setItem('lang', lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
