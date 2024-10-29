import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

const createProxyUrl = (urlValue) => {
  const proxyUrl = new URL('https://allorigins.hexlet.app/get');
  proxyUrl.searchParams.set('url', urlValue);
  proxyUrl.searchParams.set('disableCache', 'true');
  return proxyUrl.toString();
};

const fetchRssFeed = (urlValue) => {
  const finalUrl = createProxyUrl(urlValue);

  return axios
    .get(finalUrl)
    .then((response) => response.data)
    .catch((error) => {
      if (error.isAxiosError && !error.response) {
        throw new Error('NETWORK_ERROR');
      }
      throw error;
    });
};

const generateRssFeed = (parsedData) => {
  // prettier-ignore
  const {
    feedUrl,
    feedTitle,
    feedDescription,
    posts,
  } = parsedData;

  const structuredPosts = posts.map((post) => ({
    ...post,
    postId: uuidv4(),
  }));

  return {
    feed: {
      feedUrl,
      feedTitle,
      feedDescription,
    },
    posts: structuredPosts,
  };
};

const addNewFeed = (newFeed, feeds, observedState) => {
  const feedsArr = Array.from(feeds);

  if (feedsArr.length === 0) {
    observedState.feeds.push(newFeed);
    return;
  }

  const isDuplicate = feedsArr.some((feed) => feed.feedUrl === newFeed.feedUrl);

  if (!isDuplicate) {
    observedState.feeds.push(newFeed);
  }
};

const addNewPosts = (newPosts, newFeed, posts, observedState) => {
  const postsArr = Array.from(posts);

  const existingPosts = postsArr.filter((existingPost) => {
    const postsInFeed = existingPost.feed === newFeed.feedUrl;
    return postsInFeed;
  });

  const filteredNewPosts = newPosts.filter((newPost) => {
    const isDuplicate = !existingPosts.some(
      (post) => post.link === newPost.link,
    );
    return isDuplicate;
  });

  filteredNewPosts.forEach((newPost) => {
    observedState.posts.push(newPost);
  });
};

const handlePostInteraction = (observedState) => {
  const postsContainer = document.querySelector('.list-group');
  postsContainer.addEventListener('click', ({ target }) => {
    const liElement = target.closest('li');
    const postId = liElement.getAttribute('data-id');
    observedState.uiState.visitedPosts.add(postId);
  });
};

// prettier-ignore
export {
  fetchRssFeed,
  addNewFeed,
  addNewPosts,
  generateRssFeed,
  handlePostInteraction,
};
