"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';

type Language = 'ru' | 'kz';

interface LanguageSwitcherProps {
  className?: string;
}

export function LanguageSwitcher({ className = "" }: LanguageSwitcherProps) {
  const [language, setLanguage] = useState<Language>('ru');
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('language') as Language;
    if (saved) setLanguage(saved);
  }, []);

  if (!mounted) {
    return (
      <div className={`${className}`}>
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5">
          <div className="w-5 h-3.5 bg-gray-600 rounded-sm animate-pulse" />
          <span className="text-white text-sm font-medium">RU</span>
        </div>
      </div>
    );
  }

  const handleChange = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
    setIsOpen(false);
  };

  const languages = {
    ru: { label: 'RU', flag: '/russia-flag.svg', name: 'Русский' },
    kz: { label: 'KZ', flag: '/kz-flag.svg', name: 'Қазақша' },
  };

  const current = languages[language];

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
      >
        <Image
          src={current.flag}
          alt={current.label}
          width={20}
          height={14}
          className="rounded-sm"
        />
        <span className="text-white text-sm font-medium">{current.label}</span>
        <svg 
          className={`w-3 h-3 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full right-0 mt-2 bg-[#1a1a1a] border border-white/10 rounded-lg shadow-xl overflow-hidden z-50 min-w-[140px]">
            {Object.entries(languages).map(([key, lang]) => (
              <button
                key={key}
                onClick={() => handleChange(key as Language)}
                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors ${
                  language === key ? 'bg-primary/10' : ''
                }`}
              >
                <Image
                  src={lang.flag}
                  alt={lang.label}
                  width={20}
                  height={14}
                  className="rounded-sm"
                />
                <span className="text-white text-sm">{lang.name}</span>
                {language === key && (
                  <svg className="w-4 h-4 text-primary ml-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

