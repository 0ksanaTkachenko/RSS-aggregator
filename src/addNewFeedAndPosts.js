import createWatchedState from './view/view.js';

export const addNewFeed = (newFeedsData, postsState) => {
  const postsObservedState = createWatchedState(postsState);
  postsObservedState.feeds.existingFeeds.add(newFeedsData);
};

export const addNewPosts = (newPostsData, postsState) => {
  const postsObservedState = createWatchedState(postsState);

  const filteredNewPosts = newPostsData.filter((newPost) => {
    const { existingPosts } = postsState.posts;
    return !existingPosts.has(newPost.title);
  });

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
