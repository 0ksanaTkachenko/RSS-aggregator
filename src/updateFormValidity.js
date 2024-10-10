import createWatchedState from './view/view.js';

const feedbackElem = document.getElementById('feedback');
const urlInput = document.getElementById('url-input');

const updateFormValidity = (formValidState, isValid, message) => {
  const formValidObservedState = createWatchedState(formValidState, {
    urlInput,
    feedbackElem,
  });
  formValidObservedState.isFormValid = isValid;
  formValidObservedState.feedbackCode = message;
};

export default updateFormValidity;
