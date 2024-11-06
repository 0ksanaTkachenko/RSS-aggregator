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

const createListItem = (post, parentElement) => {
  const liElem = document.createElement('li');
  liElem.classList.add(
    'list-group-item',
    'd-flex',
    'justify-content-between',
    'align-items-start',
    'border-0',
    'border-end-0',
  );

  liElem.dataset.id = post.postId;
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
  button.dataset.bsToggle = 'modal';
  button.dataset.bsTarget = '#modal';
  button.textContent = 'Просмотр';

  liElem.appendChild(aElem);
  liElem.appendChild(button);
  parentElement.insertBefore(liElem, parentElement.firstChild);
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

const displayList = (type, value, i18nextInstance) => {
  const elem = document.getElementById(type);
  let listGroup = elem.querySelector('.list-group');
  const titleKey = `titles.${type}`;

  if (!listGroup) {
    createTitle(i18nextInstance.t(titleKey), elem);
    listGroup = createListGroup(elem);
  }

  const handlers = {
    feeds: () => {
      const newFeed = value[value.length - 1];
      createFeedsListItem(newFeed, listGroup);
    },
    posts: () => {
      const renderedPostElementsId = Array.from(
        listGroup.querySelectorAll('.list-group-item'),
        (el) => el.dataset.id,
      );

      value
        .filter((post) => !renderedPostElementsId.includes(post.postId))
        .forEach((post) => createListItem(post, listGroup));
    },
  };

  handlers[type]?.();
};

export default displayList;
