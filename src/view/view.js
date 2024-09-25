import onChange from 'on-change';
import feedbackRender from './feedbackRender.js';
import displayList from './postsAndFeedsRender.js';
import openModalRender from './openModalRender.js';
import updateVisitedPostsUI from './updateVisitedPostsUI.js';

const createWatchedState = (state, elements = []) => {
  const watchedState = onChange(state, (path, value) => {
    if (path === 'feedbackCode') {
      feedbackRender(state, elements);
    }
    if (path === 'feeds.newFeed') {
      displayList(state, 'feeds');
    }
    if (path === 'posts.newPosts') {
      displayList(state, 'posts');
    }
    if (path === 'posts.uiState.resentVisitedPost') {
      updateVisitedPostsUI(value);
      openModalRender(state, value.postId);
    }
  });
  return watchedState;
};

export default createWatchedState;
