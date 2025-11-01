import React from 'react';
import { useTranslation } from 'react-i18next';

// ELIMINA: export function LanguageSelector() {
function LanguageSelector() {  // ← SIN 'export' aquí
    const { i18n } = useTranslation();

    const languages = [
        { code: 'es', name: 'Español', flag: '🇪🇸' },
        { code: 'en', name: 'English', flag: '🇺🇸' },
        { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
        { code: 'fr', name: 'Français', flag: '🇫🇷' },
        { code: 'it', name: 'Italiano', flag: '🇮🇹' },
        { code: 'pt', name: 'Português', flag: '🇵🇹' }
    ];

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    return (
        <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-sm">
                <span className="text-lg">🌐</span>
            </div>
            <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-10 w-52 p-2 shadow">
                {languages.map((lang) => (
                    <li key={lang.code}>
                        <button
                            onClick={() => changeLanguage(lang.code)}
                            className={`flex items-center gap-3 ${i18n.language === lang.code ? 'active' : ''}`}
                        >
                            <span className="text-xl">{lang.flag}</span>
                            <span>{lang.name}</span>
                            {i18n.language === lang.code && (
                                <span className="badge badge-primary badge-sm">✓</span>
                            )}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default LanguageSelector; 