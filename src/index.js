import './styles.scss';
import 'bootstrap';
import * as yup from 'yup';
import createWatchedState from './view';

const state = {
  isFormValid: null,
  feedbackMessage: '',
  existingFeeds: [],
};

const form = document.getElementById('rss-form');
const urlInput = document.getElementById('url-input');
const feedback = document.getElementById('feedback');

const observedState = createWatchedState(state, { urlInput, feedback });

const isUniqueUrl = (urlValue) => !state.existingFeeds.includes(urlValue);

const linkSchema = yup.object({
  url: yup
    .string()
    .required()
    .url('Ссылка должна быть валидным URL')
    .test('is-unique', 'RSS уже существует', (value) => isUniqueUrl(value)),
});

const validateUrl = (urlValue) => {
  const data = { url: urlValue };

  return linkSchema
    .validate(data)
    .then(() => {
      observedState.isFormValid = true;
      observedState.feedbackMessage = 'RSS успешно загружен';
      state.existingFeeds.push(urlValue);
      return { valid: true, message: observedState.feedbackMessage };
    })
    .catch((err) => {
      observedState.isFormValid = false;
      observedState.feedbackMessage = err.message;
      return { valid: false, message: observedState.feedbackMessage };
    });
};

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const urlValue = urlInput.value.trim();
  validateUrl(urlValue);
});
