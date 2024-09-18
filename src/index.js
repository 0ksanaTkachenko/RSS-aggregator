import './styles.scss';
import 'bootstrap';
import createWatchedState from './view';
import validateUrl from './validate';
import dataParse from './parser';
import fetchRssFeed from './fetchRssFeed';
import generateRssFeed from './generateRssFeed';

const formValidState = {
  isFormValid: null,
  existingFeeds: [],
  feedbackCode: '',
};

const postsState = { feedsData: {} };

const form = document.getElementById('rss-form');
const urlInput = document.getElementById('url-input');
const feedbackElem = document.getElementById('feedback');

const postsElem = document.getElementById('posts');
const feedsElem = document.getElementById('feeds');

const formValidObservedState = createWatchedState(formValidState, { urlInput, feedbackElem });
const postsObservedState = createWatchedState(postsState, { postsElem, feedsElem });

const updateFormValidity = (isValid, message) => {
  formValidObservedState.isFormValid = isValid;
  formValidObservedState.feedbackCode = message;
};

const updatePostsData = (feedsData) => {
  postsObservedState.feedsData = feedsData;
};

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const urlValue = urlInput.value.trim();
  validateUrl(urlValue)
    .then((validateResult) => {
      if (!validateResult.valid) {
        updateFormValidity(false, validateResult.message);
        return Promise.reject(new Error(validateResult.message));
      }

      updateFormValidity(true, validateResult.message);
      return fetchRssFeed(urlValue);
    })
    .then((data) => dataParse(data))
    .then((parsedData) => generateRssFeed(parsedData))
    .then((feedsData) => updatePostsData(feedsData));
});
