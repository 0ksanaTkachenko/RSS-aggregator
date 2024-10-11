import { v4 as uuidv4 } from 'uuid';

const generateRssFeed = (parsedData) => {
  const { feedUrl } = parsedData;
  const { feedTitle } = parsedData;
  const { feedDescription } = parsedData;
  const { posts } = parsedData;

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
