import onChange from 'on-change';
import translate from './i18n';

const feedbackRender = (state, elements) => {
  const { urlInput, feedbackElem } = elements;

  if (state.isFormValid) {
    urlInput.value = '';
    urlInput.focus();

    urlInput.classList.remove('is-invalid');
    feedbackElem.classList.remove('text-danger');
    feedbackElem.classList.add('text-success');
  } else {
    feedbackElem.classList.remove('text-success');
    feedbackElem.classList.add('text-danger');
    urlInput.classList.add('is-invalid');
  }
  feedbackElem.textContent = translate(`validation.${state.feedbackCode}`);
};

const createWatchedState = (state, elements) => {
  const watchedState = onChange(state, (path) => {
    if (path === 'feedbackCode') {
      feedbackRender(state, elements);
    }
  });
  return watchedState;
};

export default createWatchedState;
