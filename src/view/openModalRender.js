const openModalRender = (state, clickedPostId) => {
  const modalTitleElem = document.querySelector('.modal-title');
  const modalBodyElem = document.querySelector('.modal-body');
  const link = document.querySelector('.full-article');

  let foundPost = null;
  state.posts.existingPosts.forEach((post) => {
    if (post.postId === clickedPostId) {
      foundPost = post;
    }
  });

  modalTitleElem.textContent = foundPost.title;
  modalBodyElem.textContent = foundPost.description;
  link.href = foundPost.link;
};

export default openModalRender;
