/* eslint-disable implicit-arrow-linebreak, function-paren-newline */

import validateUrl from './validate.js';
import dataParse from './parser.js';
import fetchRssFeed from './fetchRssFeed.js';
import generateRssFeed from './generateRssFeed.js';
import initializeState from './initializeState.js';
import updateFormValidity from './updateFormValidity.js';
import ruTranslation from './locales/ru/translation.js';
import { addNewFeed, addNewPosts } from './addNewFeedAndPosts.js';

const app = () => {
  const state = initializeState();
  const timeToUpdate = 5000;

  const form = document.getElementById('rss-form');
  const urlInput = document.getElementById('url-input');

  const handleError = (error) => {
    const errCode = ruTranslation.validation[error.message] ? error.message : 'UNKNOWN_ERROR';
    updateFormValidity(state, false, errCode);
  };

  const handleFormSubmit = function handleSubmit() {
    return new Promise((resolve) => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const urlValue = urlInput.value.trim();

        validateUrl(urlValue, state)
          .then(() => fetchRssFeed(urlValue))
          .then((data) => dataParse(data))
          .then((parsedData) => generateRssFeed(parsedData))
          .then((feedsAndPostsData) => {
            addNewFeed(feedsAndPostsData.feed, state);
            addNewPosts(feedsAndPostsData.posts, state);
          })
          .then(() => {
            updateFormValidity(state, true, 'URL_VALID');
            state.form.existingLinks.add(urlValue);
            resolve();
          })
          .catch((error) => handleError(error));
      });
    });
  };

  const pollRssFeedsForNewPosts = () => {
    const feeds = Array.from(state.form.existingLinks);
    const promises = feeds.map((link) =>
      fetchRssFeed(link)
        .then(dataParse)
        .then(generateRssFeed)
        .then((feedsAndPostsData) => {
          addNewPosts(feedsAndPostsData.posts, state);
        })
        .catch((error) => handleError(error)),
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
