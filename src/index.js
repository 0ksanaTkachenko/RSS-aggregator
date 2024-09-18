import './styles.scss';
import 'bootstrap';
import createWatchedState from './view';
import validateUrl from './validate';
import dataParse from './parser';
import fetchRssFeed from './fetchRssFeed';
import displayRssFeed from './displayRssFeed';

const state = {
  isFormValid: null,
  existingFeeds: [],
  feedbackCode: '',
};

const form = document.getElementById('rss-form');
const urlInput = document.getElementById('url-input');
const feedbackElem = document.getElementById('feedback');

const observedState = createWatchedState(state, { urlInput, feedbackElem });

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const urlValue = urlInput.value.trim();
  validateUrl(urlValue)
    .then((validateResult) => {
      if (!validateResult.valid) {
        observedState.isFormValid = false;
        observedState.feedbackCode = validateResult.message;
        return null;
      }

      observedState.isFormValid = true;
      observedState.feedbackCode = validateResult.message;
      return fetchRssFeed(urlValue);
    })
    .then((data) => dataParse(data))
    .then((parsedData) => {
      displayRssFeed(parsedData);
    });
});
