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

  validateUrl(urlValue, formValidState.existingFeeds)
    .then((validateResult) => {
      if (!validateResult.valid) {
        throw new Error(validateResult.message);
      }

      formValidState.existingFeeds.push(urlValue);
    })
    .then(() => fetchRssFeed(urlValue))
    .then((responseData) => {
      if (!responseData.status.content_type.includes('xml')) {
        throw new Error('NOT_CONTAIN_RSS');
      }

      return responseData;
    })
    .then((data) => dataParse(data))
    .then((parsedData) => generateRssFeed(parsedData))
    .then((feedsData) => updatePostsData(feedsData))
    .then(() => updateFormValidity(true, 'URL_VALID'))
    .catch((error) => {
      let errCode;
      if (['INVALID_URL', 'NOT_CONTAIN_RSS', 'DUPLICATE_URL'].includes(error.message)) {
        errCode = error.message;
      } else {
        errCode = 'UNKNOWN_ERROR';
      }
      updateFormValidity(false, errCode);
    });
});
