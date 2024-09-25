import translate from '../i18n.js';

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
    aElem.id = post.postId;
    aElem.textContent = post.title;

    aElem.classList.add('fw-bold');
    aElem.setAttribute('target', '_blank');
    aElem.setAttribute('rel', 'noopener noreferrer');

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'btn btn-outline-primary btn-sm';
    button.dataset.id = post.postId;
    button.dataset.bsToggle = 'modal';
    button.dataset.bsTarget = '#modal';
    button.textContent = 'Просмотр';

    liElem.appendChild(aElem);
    liElem.appendChild(button);
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

// const displayFeeds = (state) => {
//   const feedsElem = document.getElementById('feeds');
//   let feedslistGroup = feedsElem.querySelector('.list-group');

//   if (!feedslistGroup) {
//     createTitle(translate('titles.FEEDS'), feedsElem);
//     feedslistGroup = createListGroup(feedsElem);
//   }
//   createFeedsListItem(state.feeds.newFeed, feedslistGroup);
// };

// const displayPosts = (state) => {
//   const postsElem = document.getElementById('posts');
//   let postslistGroup = postsElem.querySelector('.list-group');

//   if (!postslistGroup) {
//     createTitle(translate('titles.POSTS'), postsElem);
//     postslistGroup = createListGroup(postsElem);
//   }
//   createListItem(state.posts.newPosts, postslistGroup);
// };

const displayList = (state, type) => {
  console.log(type);
  const elem = document.getElementById(type);
  let listGroup = elem.querySelector('.list-group');

  const titleKey = type === 'feeds' ? 'titles.FEEDS' : 'titles.POSTS';
  const newItems = type === 'feeds' ? state.feeds.newFeed : state.posts.newPosts;

  if (!listGroup) {
    createTitle(translate(titleKey), elem);
    listGroup = createListGroup(elem);
  }

  if (type === 'feeds') {
    createFeedsListItem(newItems, listGroup);
  } else {
    createListItem(newItems, listGroup);
  }
};

// export { displayFeeds, displayPosts };
export default displayList;
