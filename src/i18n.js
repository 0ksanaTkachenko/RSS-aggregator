import i18next from 'i18next';
import ruTranslation from './locales/ru/translation.js';
import app from './app.js';

const runApp = () => {
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
    .then(() => {
      app(i18nextInstance);
    });
};

export default runApp;
