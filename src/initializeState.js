const initializeState = () => {
  const state = {
    form: {
      isFormValid: null,
      existingLinks: new Set(),
      feedbackCode: '',
    },
    feeds: {
      existingFeeds: new Set(),
    },
    posts: {
      uiState: {
        visitedPosts: new Set(),
      },
      existingPosts: new Set(),
    },
  };

  return state;
};

export default initializeState;
