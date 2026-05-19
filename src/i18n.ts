import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import enCommon from './locales/en/common.json'
import ruCommon from './locales/ru/common.json'
import kkCommon from './locales/kk/common.json'

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'ru',
    supportedLngs: ['kk', 'ru', 'en'],
    defaultNS: 'common',
    resources: {
      en: { common: enCommon },
      ru: { common: ruCommon },
      kk: { common: kkCommon },
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    interpolation: { escapeValue: false },
  })

export default i18n
