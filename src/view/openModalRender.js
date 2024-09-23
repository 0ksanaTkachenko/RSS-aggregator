const openModalRender = (state, clickedPostId) => {
  const modalTitleElem = document.querySelector('.modal-title');
  const modalBodyElem = document.querySelector('.modal-body');
  const link = document.querySelector('.full-article');

  const foundPost = state.posts.existingPosts.find((post) => post.postId === clickedPostId);

  modalTitleElem.textContent = foundPost.title;
  modalBodyElem.textContent = foundPost.description;
  link.href = foundPost.link;
};

export default openModalRender;
