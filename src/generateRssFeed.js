import { v4 as uuidv4 } from 'uuid';

const generateRssFeed = (parsedData) => {
  const { feedUrl, feedTitle, feedDescription, posts } = parsedData;

  const structuredPosts = posts.map((post) => ({
    ...post,
    postId: uuidv4(),
  }));

  const feed = {
    feedUrl,
    feedTitle,
    feedDescription,
  };

  return {
    feed,
    posts: structuredPosts,
  };
};

export default generateRssFeed;
