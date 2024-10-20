import displayList from './postsAndFeedsRender.js';
import { feedbackRender, openModalRender, updateVisitedPostsUI, toggleButtonDuringRequest } from './uiHelpers.js';

const getLastItem = (array) => array[array.length - 1];

const uIrender = (path, value, state, i18nextInstance, domElements) => {
  switch (path) {
    case 'uiState.formStatus': {
      const feedbackCode = state.uiState.formValidationStatus;

      toggleButtonDuringRequest(value, domElements);
      feedbackRender(value, feedbackCode, i18nextInstance, domElements);
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
      openModalRender(state, visitedPostID, domElements);
      break;
    }
    default:
      break;
  }
};

export default uIrender;
