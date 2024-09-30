import createWatchedState from './view/view.js';

// export const addNewFeed = (newFeedsData, postsState) => {
//   const postsObservedState = createWatchedState(postsState);
//   const existingFeedsArr = Array.from(postsState.feeds.existingFeeds);

//   console.log(newFeedsData);

//   if (existingFeedsArr.length === 0) {
//     postsObservedState.feeds.existingFeeds.add(newFeedsData);
//     return;
//   }

//   const isDuplicate = existingFeedsArr.some((feed) => feed.feedTitle === newFeedsData.feedTitle);

//   if (!isDuplicate) {
//     postsObservedState.feeds.existingFeeds.add(newFeedsData);
//   }
// };

export const addNewFeed = (newFeedsData, postsState) => {
  const postsObservedState = createWatchedState(postsState);
  const existingFeedsArr = Array.from(postsState.feeds.existingFeeds);

  console.log(newFeedsData);

  if (existingFeedsArr.length === 0) {
    postsObservedState.feeds.existingFeeds.add(newFeedsData);
    return;
  }

  const newFeedTitle = newFeedsData.feedTitle.trim(); // Удаляем пробелы

  const isDuplicate = existingFeedsArr.some((feed) => feed.feedTitle.trim() === newFeedTitle);

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
