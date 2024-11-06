import displayList from './postsAndFeedsRender.js';
import {
  feedbackRender,
  openModalRender,
  updateVisitedPostsUI,
  toggleButtonDuringRequest,
} from './uiHelpers.js';

const uIrender = (path, value, state, i18nextInstance, domElements) => {
  switch (path) {
    case 'formState.status': {
      const feedbackCode = state.formState.validationStatus;
      toggleButtonDuringRequest(value, domElements);
      feedbackRender(value, feedbackCode, i18nextInstance, domElements);
      break;
    }
    case 'feeds':
    case 'posts': {
      displayList(path, value, i18nextInstance);
      break;
    }
    case 'uiState.visitedPosts': {
      const visitedPostID = value[value.length - 1];
      updateVisitedPostsUI(visitedPostID);
      openModalRender(state, visitedPostID, domElements);
      break;
    }
    default:
      break;
  }
};

export default uIrender;
