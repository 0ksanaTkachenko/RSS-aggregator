import onChange from 'on-change';
import feedbackRender from './feedbackRender.js';
import displayList from './postsAndFeedsRender.js';
import openModalRender from './openModalRender.js';
import updateVisitedPostsUI from './updateVisitedPostsUI.js';

const getLastItem = (array) => array[array.length - 1];

const createWatchedState = (state, elements = []) => {
  const watchedState = onChange(state, (path, value) => {
    switch (path) {
      case 'feedbackCode':
        feedbackRender(state, elements);
        break;
      case 'feeds.existingFeeds': {
        const newFeed = getLastItem([...value]);
        displayList('feeds', newFeed);
        break;
      }
      case 'posts.existingPosts': {
        const newPost = getLastItem([...value]);
        displayList('posts', newPost);
        break;
      }
      case 'posts.uiState.visitedPosts': {
        const visitedPost = getLastItem([...value]);
        updateVisitedPostsUI(visitedPost);
        openModalRender(state, visitedPost.postId);
        break;
      }
      default:
        break;
    }
  });

  return watchedState;
};

export default createWatchedState;
