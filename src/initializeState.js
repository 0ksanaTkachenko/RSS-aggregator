const initializeState = () => {
  const formValidState = {
    isFormValid: null,
    existingFeeds: [],
    feedbackCode: '',
  };

  const postsState = {
    feeds: {
      existingFeeds: new Set(),
    },
    posts: {
      uiState: {
        resentVisitedPost: {},
        visitedPosts: [],
      },
      existingPosts: new Set(),
    },
  };

  return { formValidState, postsState };
};

export default initializeState;
