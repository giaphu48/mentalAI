'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

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
  const [language, setLanguage] = useState<Lang>('vi');

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
