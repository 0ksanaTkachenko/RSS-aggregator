/* eslint-disable implicit-arrow-linebreak, function-paren-newline */
import onChange from 'on-change';
import validateUrl from './validate.js';
import dataParse from './parser.js';
import fetchRssFeed from './fetchRssFeed.js';
import generateRssFeed from './generateRssFeed.js';
import initializeState from './initializeState.js';
import UIrender from './view/view.js';
import domElements from './domElements.js';
import ruTranslation from './locales/ru/translation.js';
import { addNewFeed, addNewPosts } from './feedManager.js';

const app = () => {
  const state = initializeState();
  const timeToUpdate = 5000;
  const { form, urlInput } = domElements;

  const observedState = onChange(state, (path, value) => {
    UIrender(path, value, state);
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

  const handleFormSubmit = function handleSubmit() {
    return new Promise((resolve) => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        updateFormStatus('submitting', 'PENDING', observedState);
        const urlValue = urlInput.value.trim();

        validateUrl(urlValue, state)
          .then(() => fetchRssFeed(urlValue))
          .then((data) => dataParse(data, urlValue))
          .then((parsedData) => generateRssFeed(parsedData))
          .then((feedsAndPostsData) => {
            addNewFeed(feedsAndPostsData.feed, state.feeds, observedState);
            addNewPosts(feedsAndPostsData.posts, state.posts, observedState);
          })
          .then(() => {
            updateFormStatus('initial', 'URL_VALID', observedState);
            resolve();
          })
          .catch((error) => {
            handleError(error, observedState);
          });
      });
    });
  };

  const pollRssFeedsForNewPosts = () => {
    const feedsArr = Array.from(state.feeds);
    const promises = feedsArr.map(({ feedUrl }) =>
      fetchRssFeed(feedUrl)
        .then(dataParse)
        .then(generateRssFeed)
        .then((feedsAndPostsData) => {
          addNewPosts(feedsAndPostsData.posts, state.posts, observedState);
        })
        .catch((error) => {
          handleError(error, observedState);
        }),
    );

    Promise.all(promises).then(() => {
      setTimeout(pollRssFeedsForNewPosts, timeToUpdate);
    });
  };

  handleFormSubmit().then(() => {
    pollRssFeedsForNewPosts();
  });
};

export default app;
