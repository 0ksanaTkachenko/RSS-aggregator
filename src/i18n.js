import i18next from 'i18next';
import ruTranslation from './locales/ru/translation.js';

i18next.init({
  resources: {
    ru: { translation: ruTranslation },
  },
  lng: 'ru',
  interpolation: {
    escapeValue: false,
  },
});

const translate = (key) => i18next.t(key);
export default translate;
