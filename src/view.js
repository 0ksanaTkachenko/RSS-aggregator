import onChange from 'on-change';

const feedbackRender = (state, elements) => {
  const { urlInput, feedback } = elements;

  if (state.isFormValid) {
    urlInput.value = '';
    urlInput.focus();

    urlInput.classList.remove('is-invalid');
    feedback.classList.remove('text-danger');
    feedback.classList.add('text-success');
  } else {
    feedback.classList.remove('text-success');
    feedback.classList.add('text-danger');
    urlInput.classList.add('is-invalid');
  }
  feedback.textContent = state.feedbackMessage;
};

const createWatchedState = (state, elements) => {
  const watchedState = onChange(state, (path) => {
    if (path === 'feedbackMessage') {
      feedbackRender(state, elements);
    }
  });
  return watchedState;
};

export default createWatchedState;
