const addNewFeed = (newFeed, feeds, observedState) => {
  const feedsArr = Array.from(feeds);

  if (feedsArr.length === 0) {
    observedState.feeds.add(newFeed);
    return;
  }

  const isDuplicate = feedsArr.some((feed) => feed.feedTitle === newFeed.feedTitle);

  if (!isDuplicate) {
    observedState.feeds.add(newFeed);
  }
};

const addNewPosts = (newPosts, posts, observedState) => {
  const postsArr = Array.from(posts);
  const filteredNewPosts = newPosts.filter((newPost) => {
    const isDuplicate = !postsArr.some((post) => post.title === newPost.title);
    return isDuplicate;
  });

  filteredNewPosts.forEach((newPost) => {
    observedState.posts.add(newPost);

    const aElem = document.getElementById(newPost.postId);
    const button = document.querySelector(`button[data-id="${newPost.postId}"]`);

    aElem.addEventListener('click', () => {
      observedState.uiState.visitedPosts.add(newPost.postId);
    });

    button.addEventListener('click', () => {
      observedState.uiState.visitedPosts.add(newPost.postId);
    });
  });
};

export { addNewFeed, addNewPosts };
