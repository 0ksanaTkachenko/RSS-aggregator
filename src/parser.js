const dataParse = (data) => {
  const parser = new DOMParser();

  const xmlDoc = parser.parseFromString(data.contents, 'text/xml');

  const isRssValid = xmlDoc.querySelector('rss') || xmlDoc.querySelector('feed');
  if (!isRssValid) {
    throw new Error('NOT_CONTAIN_RSS');
  }

  const feedTitle = xmlDoc.querySelector('title').textContent;
  const feedDescription = xmlDoc.querySelector('description').textContent;
  const items = xmlDoc.querySelectorAll('item');

  const posts = Array.from(items).map((item) => ({
    title: item.querySelector('title').textContent,
    description: item.querySelector('description').textContent,
    link: item.querySelector('link').textContent.trim(),
  }));

  return {
    feedTitle,
    feedDescription,
    posts,
  };
};

export default dataParse;
