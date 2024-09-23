import onChange from 'on-change';
import feedbackRender from './feedbackRender';
import { displayFeeds, displayPosts } from './postsAndFeedsRender';
import openModalRender from './openModalRender';
import updateVisitedPostsUI from './updateVisitedPostsUI';

const createWatchedState = (state, elements = []) => {
  const watchedState = onChange(state, (path, value) => {
    if (path === 'feedbackCode') {
      feedbackRender(state, elements);
    }
    if (path === 'feeds.newFeed') {
      displayFeeds(state, elements.feedsElem);
    }
    if (path === 'posts.newPosts') {
      displayPosts(state, elements.postsElem);
    }
    if (path === 'posts.uiState.resentVisitedPost') {
      updateVisitedPostsUI(value);
      openModalRender(state, value.postId);
    }
  });
  return watchedState;
};

export default createWatchedState;
