const initializeState = () => {
  const state = {
    uiState: {
      visitedPosts: new Set(),
      formStatus: 'initial',
      formFeedbackCode: null,
    },
    feeds: new Set(),
    posts: new Set(),
  };

  return state;
};

export default initializeState;
