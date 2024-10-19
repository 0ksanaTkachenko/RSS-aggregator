import onChange from 'on-change';
import validateUrl from './validate.js';
import dataParse from './parser.js';
import uIrender from './view/view.js';
import ruTranslation from './locales/ru/translation.js';
import {
  fetchRssFeed,
  addNewFeed,
  addNewPosts,
  generateRssFeed,
} from './feedManager.js';

const initializeState = () => {
  const state = {
    uiState: {
      visitedPosts: new Set(),
      formStatus: 'initial',
      formValidationStatus: 'PENDING',
    },
    feeds: new Set(),
    posts: new Set(),
  };

  return state;
};

const domElements = {
  form: document.getElementById('rss-form'),
  urlInput: document.getElementById('url-input'),
  feedback: document.getElementById('feedback'),
  submitBtn: document.getElementById('submit-btn'),
  modalTitle: document.querySelector('.modal-title'),
  modalBody: document.querySelector('.modal-body'),
  modalLink: document.querySelector('.full-article'),
};

const app = (i18nextInstance) => {
  const state = initializeState();
  const timeToUpdate = 5000;
  const { form, urlInput } = domElements;

  const observedState = onChange(state, (path, value) => {
    uIrender(path, value, state, i18nextInstance, domElements);
  });

  const updateFormStatus = (newstatus, formValidationStatus) => {
    observedState.uiState.formValidationStatus = formValidationStatus;
    observedState.uiState.formStatus = newstatus;
  };

  const handleError = (error) => {
    let formValidationStatus;

    if (ruTranslation.validation[error.message]) {
      formValidationStatus = error.message;
    } else {
      formValidationStatus = 'UNKNOWN_ERROR';
    }

    updateFormStatus('error', formValidationStatus, observedState);
  };

  const handleFormSubmit = () => {
    return new Promise((resolve) => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        updateFormStatus('submitting', 'PENDING', observedState);
        const urlValue = urlInput.value.trim();

        validateUrl(urlValue, state)
          .then(() => fetchRssFeed(urlValue))
          .then((data) => {
            const parsedData = dataParse(data, urlValue);
            const feedsAndPostsData = generateRssFeed(parsedData);
            addNewFeed(feedsAndPostsData.feed, state.feeds, observedState);
            addNewPosts(feedsAndPostsData.posts, state.posts, observedState);
            updateFormStatus('initial', 'URL_VALID', observedState);
            resolve();
          })
          .catch((error) => {
            console.log(error);
            handleError(error, observedState);
          });
      });
    });
  };

  const pollRssFeedsForNewPosts = () => {
    const feedsArr = Array.from(state.feeds);
    const promises = feedsArr.map(({ feedUrl }) => {
      const fetchFeed = fetchRssFeed(feedUrl)
        .then((data) => {
          const parsedData = dataParse(data, feedUrl);
          const feedsAndPostsData = generateRssFeed(parsedData);
          addNewPosts(feedsAndPostsData.posts, state.posts, observedState);
        })
        .catch((error) => {
          handleError(error, observedState);
        });
      return fetchFeed;
    });

    Promise.all(promises).then(() => {
      setTimeout(pollRssFeedsForNewPosts, timeToUpdate);
    });
  };

  handleFormSubmit().then(() => {
    pollRssFeedsForNewPosts();
  });
};

export default app;
