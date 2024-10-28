const dataParse = (data, feedUrl) => {
  const parser = new DOMParser();

  const xmlDoc = parser.parseFromString(data.contents, 'text/xml');
  const errorNode = xmlDoc.querySelector('parsererror');

  if (errorNode) {
    const error = new Error('NOT_CONTAIN_RSS');
    error.data = errorNode.textContent;
    throw error;
  }

  const feedTitle = xmlDoc.querySelector('title').textContent;
  const feedDescription = xmlDoc.querySelector('description').textContent;
  const items = xmlDoc.querySelectorAll('item');

  const posts = Array.from(items).map((item) => ({
    title: item.querySelector('title').textContent,
    description: item.querySelector('description').textContent,
    link: item.querySelector('link').textContent.trim(),
    feed: feedUrl,
  }));

  return {
    feedUrl,
    feedTitle,
    feedDescription,
    posts,
  };
};

export default dataParse;
