import onChange from 'on-change';
import translate from './i18n';

const feedbackRender = (state, elements) => {
  const { urlInput, feedbackElem } = elements;

  if (state.isFormValid) {
    urlInput.value = '';
    urlInput.focus();

    urlInput.classList.remove('is-invalid');
    feedbackElem.classList.remove('text-danger');
    feedbackElem.classList.add('text-success');
  } else {
    feedbackElem.classList.remove('text-success');
    feedbackElem.classList.add('text-danger');
    urlInput.classList.add('is-invalid');
  }
  feedbackElem.textContent = translate(`validation.${state.feedbackCode}`);
};

// Posts
const createTitle = (titleText, parentElement) => {
  const cardDiv = document.createElement('div');
  const cardBodyDiv = document.createElement('div');
  const cardTitleDiv = document.createElement('div');

  cardDiv.classList.add('card', 'border-0');
  cardBodyDiv.classList.add('card-body');
  cardTitleDiv.classList.add('card-title', 'h4');

  cardTitleDiv.textContent = titleText;

  cardBodyDiv.appendChild(cardTitleDiv);
  cardDiv.appendChild(cardBodyDiv);
  parentElement.appendChild(cardDiv);
};

const createListItem = (postsArr, parentElement) => {
  console.log(postsArr);
  postsArr.forEach((post) => {
    const liElem = document.createElement('li');
    liElem.classList.add(
      'list-group-item',
      'd-flex',
      'justify-content-between',
      'align-items-start',
      'border-0',
      'border-end-0',
    );
    const aElem = document.createElement('a');

    aElem.href = post.link;
    aElem.id = post.id;
    aElem.textContent = post.title;

    aElem.classList.add('fw-bold');
    aElem.setAttribute('target', '_blank');
    aElem.setAttribute('rel', 'noopener noreferrer');

    liElem.appendChild(aElem);
    parentElement.appendChild(liElem);
  });
};

const createFeedsListItem = (feed, parentElement) => {
  const liElem = document.createElement('li');
  liElem.classList.add('list-group-item', 'border-0', 'border-end-0');

  const h3Elem = document.createElement('h3');
  h3Elem.classList.add('h6', 'm-0');
  h3Elem.textContent = feed.feedTitle;

  const pElem = document.createElement('p');
  pElem.classList.add('m-0', 'small', 'text-black-50');
  pElem.textContent = feed.feedDescription;

  liElem.appendChild(h3Elem);
  liElem.appendChild(pElem);

  parentElement.appendChild(liElem);
};

const createListGroup = (parentElement) => {
  const listGroup = document.createElement('ul');
  listGroup.classList.add('list-group', 'border-0', 'rounded-0');
  parentElement.appendChild(listGroup);
  return listGroup;
};

const displayFeeds = (state, feedsElem) => {
  let feedslistGroup = feedsElem.querySelector('.list-group');

  if (!feedslistGroup) {
    createTitle(translate('titles.FEEDS'), feedsElem);
    feedslistGroup = createListGroup(feedsElem);
  }
  createFeedsListItem(state.feeds.newFeed, feedslistGroup);
};

const displayPosts = (state, postsElem) => {
  let postslistGroup = postsElem.querySelector('.list-group');

  if (!postslistGroup) {
    createTitle(translate('titles.POSTS'), postsElem);
    postslistGroup = createListGroup(postsElem);
  }
  createListItem(state.posts.newPosts, postslistGroup);
};

const createWatchedState = (state, elements) => {
  const watchedState = onChange(state, (path) => {
    if (path === 'feedbackCode') {
      feedbackRender(state, elements);
    }
    if (path === 'feeds.newFeed') {
      displayFeeds(state, elements.feedsElem);
    }
    if (path === 'posts.newPosts') {
      displayPosts(state, elements.postsElem);
    }
  });
  return watchedState;
};

export default createWatchedState;
