import createWatchedState from './view/view.js';

export const addNewFeed = (newFeedsData, postsState) => {
  const postsObservedState = createWatchedState(postsState);
  postsObservedState.feeds.newFeed = newFeedsData;
};

export const addNewPosts = (newPostsData, postsState) => {
  const postsObservedState = createWatchedState(postsState);

  // const filteredNewPosts = newPostsData.filter(
  //   (newPost) =>
  //     !postsState.posts.existingPosts.some((existingPost) => existingPost.title === newPost.title),
  // );

  const filteredNewPosts = newPostsData.filter((newPost) => {
    const { existingPosts } = postsState.posts;
    const isTitleDuplicate = ({ title }) => title === newPost.title;
    return !existingPosts.some(isTitleDuplicate);
  });

  postsObservedState.posts.newPosts = filteredNewPosts;
  filteredNewPosts.forEach(({ postId }) => {
    const button = document.querySelector(`button[data-id="${postId}"]`);
    button.addEventListener('click', () => {
      postsObservedState.posts.uiState.resentVisitedPost = { postId };
      postsState.posts.uiState.visitedPosts.push({ postId });
    });
  });
};

export const updatePostState = (postsState) => {
  const updatedPosts = postsState.posts.existingPosts.concat(postsState.posts.newPosts);
  return updatedPosts;
};
