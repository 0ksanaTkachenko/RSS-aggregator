import i18next from 'i18next';
import ruTranslation from './locales/ru/translation.js';

const i18nInit = () => {
  const i18nextInstance = i18next.createInstance();

  return i18nextInstance
    .init({
      resources: {
        ru: { translation: ruTranslation },
      },
      lng: 'ru',
      interpolation: {
        escapeValue: false,
      },
    })
    .then(() => i18nextInstance);
};

export default i18nInit;
