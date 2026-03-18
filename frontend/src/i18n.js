import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import en from './locales/en/translation.json'
import hi from './locales/hi/translation.json'
import te from './locales/te/translation.json'

const saved = localStorage.getItem('fl_lang')
const fallback = 'en'
const initialLng = saved || (navigator.language || fallback).split('-')[0] || fallback

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      hi: { translation: hi },
      te: { translation: te },
    },
    lng: ['en', 'hi', 'te'].includes(initialLng) ? initialLng : fallback,
    fallbackLng: fallback,
    interpolation: { escapeValue: false },
  })

i18n.on('languageChanged', (lng) => {
  localStorage.setItem('fl_lang', lng)
})

export default i18n

