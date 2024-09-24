/* eslint-disable implicit-arrow-linebreak, function-paren-newline */

import validateUrl from './validate';
import dataParse from './parser';
import fetchRssFeed from './fetchRssFeed';
import generateRssFeed from './generateRssFeed';
import initializeStates from './initializeStates';
import updateFormValidity from './updateFormValidity';
import { addNewFeed, addNewPosts, updatePostState } from './addNewFeedAndPosts';

const app = () => {
  const { formValidState, postsState } = initializeStates();

  const form = document.getElementById('rss-form');
  const urlInput = document.getElementById('url-input');

  const handleFormSubmit = function handleSubmit() {
    return new Promise((resolve) => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const urlValue = urlInput.value.trim();

        validateUrl(urlValue, formValidState.existingFeeds)
          .then((validateResult) => {
            if (!validateResult.valid) {
              throw new Error(validateResult.message);
            }
          })
          .then(() => {
            const result = fetchRssFeed(urlValue);
            return result;
          })
          .then((data) => dataParse(data))
          .then((data) => {
            const isRssValid = data.querySelector('rss') || data.querySelector('feed');
            if (!isRssValid) {
              throw new Error('NOT_CONTAIN_RSS');
            }
            return data;
          })
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
          .catch((error) => {
            let errCode;
            if (
              ['NETWORK_ERROR', 'INVALID_URL', 'NOT_CONTAIN_RSS', 'DUPLICATE_URL', 'EMPTY_URL'].includes(error.message)
            ) {
              errCode = error.message;
            } else {
              errCode = 'UNKNOWN_ERROR';
            }
            updateFormValidity(formValidState, false, errCode);
          });
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
        .catch((error) => {
          let errCode;
          console.log(error.message);
          if (
            ['NETWORK_ERROR', 'INVALID_URL', 'NOT_CONTAIN_RSS', 'DUPLICATE_URL', 'EMPTY_URL'].includes(error.message)
          ) {
            errCode = error.message;
          } else {
            errCode = 'UNKNOWN_ERROR';
          }
          updateFormValidity(formValidState, false, errCode);
        }),
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
