import { v4 as uuidv4 } from 'uuid';

const generateRssFeed = (parsedData) => {
  const { feedUrl, feedTitle, feedDescription, posts } = parsedData;

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

export default generateRssFeed;
