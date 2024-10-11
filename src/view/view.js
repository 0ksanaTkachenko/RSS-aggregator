import feedbackRender from './feedbackRender.js';
import displayList from './postsAndFeedsRender.js';
import openModalRender from './openModalRender.js';
import updateVisitedPostsUI from './updateVisitedPostsUI.js';
import domElements from '../domElements.js';

const getLastItem = (array) => array[array.length - 1];
const { submitBtn } = domElements;

const toggleButtonDuringRequest = (formStatus) => {
  switch (formStatus) {
    case 'submitting':
      submitBtn.disabled = true;
      break;
    case 'initial':
      submitBtn.disabled = false;
      break;
    case 'error':
      submitBtn.disabled = false;
      break;
    default:
      break;
  }
};

const UIrender = (path, value, state, i18nextInstance) => {
  switch (path) {
    case 'uiState.formStatus': {
      const feedbackCode = state.uiState.formValidationStatus;

      toggleButtonDuringRequest(value);
      feedbackRender(value, feedbackCode, i18nextInstance);
      break;
    }
    case 'feeds': {
      const newFeed = getLastItem([...value]);
      displayList('feeds', newFeed, i18nextInstance);
      break;
    }
    case 'posts': {
      const newPost = getLastItem([...value]);
      displayList('posts', newPost, i18nextInstance);
      break;
    }
    case 'uiState.visitedPosts': {
      const visitedPostID = getLastItem([...value]);
      updateVisitedPostsUI(visitedPostID);
      openModalRender(state, visitedPostID);
      break;
    }
    default:
      break;
  }
};

export default UIrender;
