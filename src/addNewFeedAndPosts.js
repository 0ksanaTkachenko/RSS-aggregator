import createWatchedState from './view/view.js';

export const addNewFeed = (newFeedsData, postsState) => {
  const postsObservedState = createWatchedState(postsState);
  const existingFeedsArr = Array.from(postsState.feeds.existingFeeds);

  if (existingFeedsArr.length === 0) {
    postsObservedState.feeds.existingFeeds.add(newFeedsData);
    return;
  }

  const isDuplicate = existingFeedsArr.some((feed) => feed.feedTitle === newFeedsData.feedTitle);

  if (!isDuplicate) {
    postsObservedState.feeds.existingFeeds.add(newFeedsData);
  }
};

export const addNewPosts = (newPostsData, postsState) => {
  const postsObservedState = createWatchedState(postsState);

  const filteredNewPosts = newPostsData.filter((newPost) => {
    const { existingPosts } = postsState.posts;
    return !existingPosts.has(newPost.title);
  });

  if (filteredNewPosts.length === 0) {
    return;
  }

  filteredNewPosts.forEach((newPost) => {
    postsObservedState.posts.existingPosts.add(newPost);
  });

  filteredNewPosts.forEach(({ postId }) => {
    const button = document.querySelector(`button[data-id="${postId}"]`);
    button.addEventListener('click', () => {
      postsObservedState.posts.uiState.resentVisitedPost = { postId };
      postsState.posts.uiState.visitedPosts.push({ postId });
    });
  });
};
