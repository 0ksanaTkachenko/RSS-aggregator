import createWatchedState from './view/view.js';

export const addNewFeed = (newFeedsData, state) => {
  const observedState = createWatchedState(state);
  const existingFeedsArr = Array.from(state.feeds.existingFeeds);

  if (existingFeedsArr.length === 0) {
    observedState.feeds.existingFeeds.add(newFeedsData);
    return;
  }

  const isDuplicate = existingFeedsArr.some((feed) => feed.feedTitle === newFeedsData.feedTitle);

  if (!isDuplicate) {
    observedState.feeds.existingFeeds.add(newFeedsData);
  }
};

export const addNewPosts = (newPostsData, state) => {
  const observedState = createWatchedState(state);
  const existingPosts = Array.from(state.posts.existingPosts);

  const filteredNewPosts = newPostsData.filter((newPost) => {
    const isDuplicate = !existingPosts.some((existingPost) => existingPost.title === newPost.title);
    return isDuplicate;
  });

  filteredNewPosts.forEach((newPost) => {
    observedState.posts.existingPosts.add(newPost);
  });

  filteredNewPosts.forEach(({ postId }) => {
    const button = document.querySelector(`button[data-id="${postId}"]`);
    button.addEventListener('click', () => {
      observedState.posts.uiState.visitedPosts.add({ postId });
    });
  });
};
