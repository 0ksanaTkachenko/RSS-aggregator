import onChange from 'on-change';
import validateUrl from './validate.js';
import dataParse from './parser.js';
import uIrender from './view/view.js';
import enTranslation from './locales/en/translation.js';
import i18nInit from './i18n.js';
import {
  fetchRssFeed,
  addNewFeed,
  addNewPosts,
  generateRssFeed,
  handlePostInteraction,
} from './feedManager.js';

const initializeState = () => {
  const state = {
    uiState: {
      visitedPosts: new Set(),
    },
    formState: {
      status: 'initial',
      validationStatus: 'pending',
    },
    feeds: [],
    posts: [],
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

const app = () => {
  i18nInit().then((i18nextInstance) => {
    const state = initializeState();
    const timeToUpdate = 5000;
    const { form, urlInput } = domElements;

    const observedState = onChange(state, (path, value) => {
      uIrender(path, value, state, i18nextInstance, domElements);
    });

    const updateFormStatus = (newstatus, validationStatus) => {
      observedState.formState.validationStatus = validationStatus;
      observedState.formState.status = newstatus;
    };

    const handleError = (error) => {
      let validationStatus;

      if (enTranslation.validation[error.message]) {
        validationStatus = error.message;
      } else {
        validationStatus = 'unknown_error';
      }

      updateFormStatus('error', validationStatus, observedState);
    };

    const fetchNewPostsFromFeeds = () => {
      state.feeds.map(({ feedUrl }) => {
        const fetchFeed = fetchRssFeed(feedUrl)
          .then((data) => {
            const parsedData = dataParse(data, feedUrl);
            const feedsAndPostsData = generateRssFeed(parsedData);
            addNewPosts(
              feedsAndPostsData.posts,
              feedsAndPostsData.feed,
              state.posts,
              observedState,
            );
            setTimeout(fetchNewPostsFromFeeds, timeToUpdate);
          })
          .catch((error) => {
            handleError(error, observedState);
          });
        return fetchFeed;
      });
    };

    const handleFormSubmit = () => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        updateFormStatus('submitting', 'pending', observedState);
        const urlValue = urlInput.value.trim();

        validateUrl(urlValue, state)
          .then(() => fetchRssFeed(urlValue))
          .then((data) => {
            const parsedData = dataParse(data, urlValue);
            const feedsAndPostsData = generateRssFeed(parsedData);
            addNewFeed(feedsAndPostsData.feed, state.feeds, observedState);
            addNewPosts(
              feedsAndPostsData.posts,
              feedsAndPostsData.feed,
              state.posts,
              observedState,
            );
            updateFormStatus('initial', 'url_valid', observedState);
            handlePostInteraction(observedState);
            fetchNewPostsFromFeeds();
          })
          .catch((error) => {
            handleError(error, observedState);
          });
      });
    };
    handleFormSubmit();
  });
};

export default app;
