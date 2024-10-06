import domElements from '../domElements.js';

const openModalRender = (state, clickedPostId) => {
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

export default openModalRender;
