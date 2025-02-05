import i18next from 'i18next';
import enTranslation from './locales/en/translation.js';

const i18nInit = () => {
  const i18nextInstance = i18next.createInstance();

  return i18nextInstance
    .init({
      resources: {
        en: { translation: enTranslation },
      },
      lng: 'en',
      interpolation: {
        escapeValue: false,
      },
    })
    .then(() => i18nextInstance);
};

export default i18nInit;
