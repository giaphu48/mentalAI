'use client';

import React from "react";
// Update the import path below to the correct relative path if needed
import { useLanguage } from "../context/languageContext";

const TEXT = {
  vi: {
    greeting: "Xin chào thế giới!",
  },
  en: {
    greeting: "Hello world!",
  },
};

export default function HomePage() {
  const { language } = useLanguage();

  return (
    <div className="p-4 text-lg font-semibold">
      {TEXT[language].greeting}
    </div>
  );
}
