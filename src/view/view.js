import onChange from 'on-change';
import feedbackRender from './feedbackRender.js';
// import { displayFeeds, displayPosts } from './postsAndFeedsRender.js';
import displayList from './postsAndFeedsRender.js';
import openModalRender from './openModalRender.js';
import updateVisitedPostsUI from './updateVisitedPostsUI.js';

const createWatchedState = (state, elements = []) => {
  const watchedState = onChange(state, (path, value) => {
    if (path === 'feedbackCode') {
      feedbackRender(state, elements);
    }
    if (path === 'feeds.newFeed') {
      // displayFeeds(state, elements.feedsElem);
      displayList(state, 'feeds');
    }
    if (path === 'posts.newPosts') {
      // displayPosts(state, elements.postsElem);
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
