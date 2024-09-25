/* eslint-disable implicit-arrow-linebreak, function-paren-newline */

import validateUrl from './validate.js';
import dataParse from './parser.js';
import fetchRssFeed from './fetchRssFeed.js';
import generateRssFeed from './generateRssFeed.js';
import initializeStates from './initializeStates.js';
import updateFormValidity from './updateFormValidity.js';
import ruTranslation from './locales/ru/translation.js';
import { addNewFeed, addNewPosts, updatePostState } from './addNewFeedAndPosts.js';

const app = () => {
  const { formValidState, postsState } = initializeStates();

  const form = document.getElementById('rss-form');
  const urlInput = document.getElementById('url-input');

  const handleError = (error) => {
    const errCode = ruTranslation.validation[error.message] ? error.message : 'UNKNOWN_ERROR';
    updateFormValidity(formValidState, false, errCode);
  };

  const handleFormSubmit = function handleSubmit() {
    return new Promise((resolve) => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const urlValue = urlInput.value.trim();

        validateUrl(urlValue, formValidState.existingFeeds)
          .then(() => fetchRssFeed(urlValue))
          .then((data) => dataParse(data))
          .then((parsedData) => generateRssFeed(parsedData))
          .then((feedsAndPostsData) => {
            addNewFeed(feedsAndPostsData.feed, postsState);
            addNewPosts(feedsAndPostsData.posts, postsState);
            postsState.posts.existingPosts = updatePostState(postsState);
          })
          .then(() => {
            updateFormValidity(formValidState, true, 'URL_VALID');
            formValidState.existingFeeds.push(urlValue);
            resolve();
          })
          .catch((error) => handleError(error));
      });
    });
  };

  const pollRssFeedsForNewPosts = () => {
    const feeds = formValidState.existingFeeds;
    const promises = feeds.map((link) =>
      fetchRssFeed(link)
        .then(dataParse)
        .then(generateRssFeed)
        .then((feedsAndPostsData) => {
          addNewPosts(feedsAndPostsData.posts, postsState);
          postsState.posts.existingPosts = updatePostState(postsState);
        })
        .catch((error) => handleError(error)),
    );

    Promise.all(promises).then(() => {
      setTimeout(pollRssFeedsForNewPosts, 5000);
    });
  };

  handleFormSubmit().then(() => {
    pollRssFeedsForNewPosts();
  });
};

export default app;
