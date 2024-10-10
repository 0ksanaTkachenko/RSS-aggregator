const initializeState = () => {
  const state = {
    uiState: {
      visitedPosts: new Set(),
      formStatus: 'initial',
      formValidationStatus: 'PENDING',
    },
    feeds: new Set(),
    posts: new Set(),
  };

  return state;
};

export default initializeState;
