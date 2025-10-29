// src/components/LanguageSelector/LanguageSelector.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import './LanguageSelector.css';

export function LanguageSelector() {
    const { i18n } = useTranslation();

    const languages = [
        { code: 'es', name: 'Español', flag: '🇪🇸' },
        { code: 'en', name: 'English', flag: '🇬🇧' },
        { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
        { code: 'fr', name: 'Français', flag: '🇫🇷' },
        { code: 'it', name: 'Italiano', flag: '🇮🇹' },
        { code: 'pt', name: 'Português', flag: '🇵🇹' } // ✅ Añadido
    ];

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        localStorage.setItem('language', lng);
    };

    return (
        <div className="language-selector-container">
            <select 
                value={i18n.language} 
                onChange={(e) => changeLanguage(e.target.value)}
                className="language-selector"
                aria-label="Select language"
            >
                {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                        {lang.flag} {lang.name}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default LanguageSelector;
