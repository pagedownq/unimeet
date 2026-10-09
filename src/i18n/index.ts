import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

import tr from '../locales/tr.json';
import en from '../locales/en.json';

const locales = Localization.getLocales();
const deviceLanguage = locales && locales.length > 0 ? locales[0].languageCode : 'tr';
const initialLang = deviceLanguage === 'tr' ? 'tr' : 'en';

// eslint-disable-next-line import/no-named-as-default-member
i18n.use(initReactI18next).init({
  resources: {
    tr: { translation: tr },
    en: { translation: en },
  },
  lng: initialLang ?? 'tr',
  fallbackLng: 'tr',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
