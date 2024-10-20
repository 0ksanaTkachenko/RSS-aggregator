const feedbackRender = (value, feedbackCode, i18nextInstance, domElements) => {
  const { urlInput, feedback } = domElements;

  if (value === 'initial') {
    urlInput.value = '';
    urlInput.focus();
    urlInput.classList.remove('is-invalid');
    feedback.classList.remove('text-danger');
    feedback.classList.add('text-success');
  } else if (value === 'error') {
    feedback.classList.remove('text-success');
    feedback.classList.add('text-danger');
    urlInput.classList.add('is-invalid');
  } else {
    return;
  }

  feedback.textContent = i18nextInstance.t(`validation.${feedbackCode}`);
};

const openModalRender = (state, clickedPostId, domElements) => {
  const { modalTitle, modalBody, modalLink } = domElements;

  let foundPost = null;
  state.posts.forEach((post) => {
    if (post.postId === clickedPostId) {
      foundPost = post;
    }
  });

  modalTitle.textContent = foundPost.title;
  modalBody.textContent = foundPost.description;
  modalLink.href = foundPost.link;
};

const updateVisitedPostsUI = (postId) => {
  const aElem = document.getElementById(postId);
  aElem.classList.add('fw-normal');
  aElem.classList.add('link-secondary');
  aElem.classList.remove('fw-bold');
};

const toggleButtonDuringRequest = (formStatus, domElements) => {
  const { submitBtn } = domElements;
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

export { feedbackRender, openModalRender, updateVisitedPostsUI, toggleButtonDuringRequest };
