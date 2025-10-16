import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

// Importar traducciones JSON
import translationES from './locales/es/translation.json';
import translationEN from './locales/en/translation.json';
import translationDE from './locales/de/translation.json';
import translationFR from './locales/fr/translation.json';
import translationIT from './locales/it/translation.json';

// Definir recursos para los idiomas
const resources = {
  es: { translation: translationES },
  en: { translation: translationEN },
  de: { translation: translationDE },
  fr: { translation: translationFR },
  it: { translation: translationIT },
};

const language = localStorage.getItem('language') || 'es';

i18n
  .use(Backend) // permite cargar traducciones desde backend/locales si se usa
  .use(LanguageDetector) // detecta idioma automáticamente del navegador/localStorage
  .use(initReactI18next) // conecta react con i18next
  .init({
    resources,
    lng: language,
    fallbackLng: 'es',
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false, // no escapar valores, React ya se encarga
    },
  });

export default i18n;


