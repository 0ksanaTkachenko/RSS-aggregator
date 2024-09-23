const initializeStates = () => {
  const formValidState = {
    isFormValid: null,
    existingFeeds: [],
    feedbackCode: '',
  };

  const postsState = {
    feeds: {
      existingFeeds: [],
      newFeed: {},
    },
    posts: {
      uiState: {
        resentVisitedPost: {},
        visitedPosts: [],
      },
      existingPosts: [],
      postsToRemove: [],
      newPosts: [],
    },
  };

  return { formValidState, postsState };
};

export default initializeStates;
