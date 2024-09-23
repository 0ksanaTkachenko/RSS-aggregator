const updateVisitedPostsUI = (value) => {
  const aElem = document.getElementById(value.postId);
  aElem.classList.add('fw-normal');
  aElem.classList.add('link-secondary');
  aElem.classList.remove('fw-bold');
};

export default updateVisitedPostsUI;
