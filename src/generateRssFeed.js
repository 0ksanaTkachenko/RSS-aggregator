import { v4 as uuidv4 } from 'uuid';

const generateRssFeed = (parsedData) => {
  const items = parsedData.querySelectorAll('item');
  const feedTitle = parsedData.querySelector('title').textContent;
  const feedDescription = parsedData.querySelector('description').textContent;

  const posts = [];
  const feedsData = {
    feed: { feedTitle, feedDescription },
    posts,
  };

  items.forEach((item) => {
    const title = item.querySelector('title').textContent;
    const description = item.querySelector('description').textContent;
    const link = item.querySelector('link').textContent;
    const postId = uuidv4();
    posts.push({
      title,
      description,
      link,
      postId,
    });
  });

  return feedsData;
};

export default generateRssFeed;
