import { v4 as uuidv4 } from 'uuid';

const generateRssFeed = (parsedData) => {
  const { feedTitle, feedDescription, posts } = parsedData;

  const structuredPosts = posts.map((post) => ({
    ...post,
    postId: uuidv4(),
  }));

  return {
    feed: { feedTitle, feedDescription },
    posts: structuredPosts,
  };
};

export default generateRssFeed;
