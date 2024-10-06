const updateVisitedPostsUI = (postId) => {
  const aElem = document.getElementById(postId);
  aElem.classList.add('fw-normal');
  aElem.classList.add('link-secondary');
  aElem.classList.remove('fw-bold');
};

export default updateVisitedPostsUI;
