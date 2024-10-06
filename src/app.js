/* eslint-disable implicit-arrow-linebreak, function-paren-newline */
import onChange from 'on-change';
import validateUrl from './validate.js';
import dataParse from './parser.js';
import fetchRssFeed from './fetchRssFeed.js';
import generateRssFeed from './generateRssFeed.js';
import initializeState from './initializeState.js';
import ruTranslation from './locales/ru/translation.js';
import UIrender from './view/view.js';
import domElements from './domElements.js';

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
    const formValidationStatus = ruTranslation.validation[error.message]
      ? error.message
      : 'UNKNOWN_ERROR';

    updateFormStatus('error', formValidationStatus);
  };

  const addNewFeed = (newFeed, state) => {
    const feedsArr = Array.from(state.feeds);

    if (feedsArr.length === 0) {
      observedState.feeds.add(newFeed);
      return;
    }

    const isDuplicate = feedsArr.some((feed) => feed.feedTitle === newFeed.feedTitle);

    if (!isDuplicate) {
      observedState.feeds.add(newFeed);
    }
  };

  const addNewPosts = (newPosts, state) => {
    const posts = Array.from(state.posts);

    const filteredNewPosts = newPosts.filter((newPost) => {
      const isDuplicate = !posts.some((post) => post.title === newPost.title);
      return isDuplicate;
    });

    filteredNewPosts.forEach((newPost) => {
      observedState.posts.add(newPost);

      const aElem = document.getElementById(newPost.postId);
      const button = document.querySelector(`button[data-id="${newPost.postId}"]`);

      aElem.addEventListener('click', () => {
        observedState.uiState.visitedPosts.add(newPost.postId);
      });

      button.addEventListener('click', () => {
        observedState.uiState.visitedPosts.add(newPost.postId);
      });
    });
  };

  const handleFormSubmit = function handleSubmit() {
    return new Promise((resolve) => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        updateFormStatus('submitting', 'PENDING');
        const urlValue = urlInput.value.trim();

        validateUrl(urlValue, state)
          .then(() => fetchRssFeed(urlValue))
          .then((data) => dataParse(data, urlValue))
          .then((parsedData) => generateRssFeed(parsedData))
          .then((feedsAndPostsData) => {
            addNewFeed(feedsAndPostsData.feed, state);
            addNewPosts(feedsAndPostsData.posts, state);
          })
          .then(() => {
            updateFormStatus('initial', 'URL_VALID');
            resolve();
          })
          .catch((error) => {
            console.log(error);
            handleError(error);
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
          addNewPosts(feedsAndPostsData.posts, state);
        })
        .catch((error) => {
          handleError(error);
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
