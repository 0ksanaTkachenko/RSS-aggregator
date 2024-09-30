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
    if (path === 'feeds.existingFeeds') {
      const feeds = [...value];
      const newFeed = feeds[feeds.length - 1];
      displayList('feeds', newFeed);
    }
    if (path === 'posts.existingPosts') {
      const posts = [...value];
      const newPost = posts[posts.length - 1];
      displayList('posts', newPost);
    }
    if (path === 'posts.uiState.resentVisitedPost') {
      updateVisitedPostsUI(value);
      openModalRender(state, value.postId);
    }
  });
  return watchedState;
};

export default createWatchedState;
