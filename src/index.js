import './styles.scss';
import 'bootstrap';
import * as yup from 'yup';

import createWatchedState from './view';

const state = {
  isFormValid: null,
  existingFeeds: [],
  feedbackCode: '',
};

const form = document.getElementById('rss-form');
const urlInput = document.getElementById('url-input');
const feedbackElem = document.getElementById('feedback');

const observedState = createWatchedState(state, { urlInput, feedbackElem });

const isUniqueUrl = (urlValue) => !state.existingFeeds.includes(urlValue);

const linkSchema = yup.object({
  url: yup
    .string()
    .required()
    .url('INVALID_URL')
    .test('is-unique', 'DUPLICATE_URL', (value) => isUniqueUrl(value)),
});

const validateUrl = (urlValue) => {
  const data = { url: urlValue };

  return linkSchema
    .validate(data)
    .then(() => {
      observedState.isFormValid = true;
      observedState.feedbackCode = 'URL_VALID';

      state.existingFeeds.push(urlValue);
      return { valid: true, message: observedState.feedbackCode };
    })
    .catch((err) => {
      observedState.isFormValid = false;
      observedState.feedbackCode = err.message;
      return { valid: false, message: observedState.feedbackCode };
    });
};

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const urlValue = urlInput.value.trim();
  validateUrl(urlValue);
});
