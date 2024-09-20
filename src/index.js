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

const postsState = {
  feeds: {
    existingFeeds: [],
    newFeed: {},
  },
  posts: {
    existingPosts: [],
    postsToRemove: [],
    newPosts: [],
  },
};

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

const addNewFeed = (newFeedsData) => {
  postsObservedState.feeds.newFeed = newFeedsData;
};

const addNewPosts = (newPostsData) => {
  const filteredNewPosts = newPostsData.filter(
    (newPost) => !postsState.posts.existingPosts.some((existingPost) => existingPost.title === newPost.title),
  );

  postsObservedState.posts.newPosts = filteredNewPosts;
  postsState.posts.existingPosts = postsState.posts.existingPosts.concat(filteredNewPosts);
};

const handleFormSubmit = () =>
  new Promise((resolve, reject) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const urlValue = urlInput.value.trim();

      validateUrl(urlValue, formValidState.existingFeeds)
        .then((validateResult) => {
          if (!validateResult.valid) {
            throw new Error(validateResult.message);
          }
        })
        .then(() => fetchRssFeed(urlValue))
        .then((responseData) => {
          console.log(responseData);
          if (!responseData.status.content_type.includes('xml')) {
            throw new Error('NOT_CONTAIN_RSS');
          }

          return responseData;
        })
        .then((data) => dataParse(data))
        .then((parsedData) => generateRssFeed(parsedData))
        .then((feedsAndPostsData) => {
          addNewFeed(feedsAndPostsData.feed);
          addNewPosts(feedsAndPostsData.posts);
        })
        .then(() => {
          updateFormValidity(true, 'URL_VALID');
          formValidState.existingFeeds.push(urlValue);
          resolve();
        })
        .catch((error) => {
          let errCode;
          if (['INVALID_URL', 'NOT_CONTAIN_RSS', 'DUPLICATE_URL'].includes(error.message)) {
            errCode = error.message;
          } else {
            errCode = 'UNKNOWN_ERROR';
          }
          updateFormValidity(false, errCode);
          reject(error);
        });
    });
  });

const pollRssFeedsForNewPosts = () => {
  const feeds = formValidState.existingFeeds;
  const promises = feeds.map(
    (link) =>
      fetchRssFeed(link)
        .then(dataParse)
        .then(generateRssFeed)
        .then((feedsAndPostsData) => {
          addNewPosts(feedsAndPostsData.posts);
        }),

    // .then((newFeedsData) => {

    //   const postsToRemove = existingPosts.filter(
    //     (existingPost) => !newFeedsData.posts.some((newPost) => newPost.title === existingPost.title),
    //   );

    //   console.log({ newPosts, postsToRemove });
    // }),
  );

  Promise.all(promises).then(() => {
    setTimeout(pollRssFeedsForNewPosts, 5000);
  });
};

handleFormSubmit().then(() => {
  pollRssFeedsForNewPosts();
});
