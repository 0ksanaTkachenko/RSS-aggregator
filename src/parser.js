const dataParse = (data) => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(data.contents, 'text/xml');

  const isRssValid = xmlDoc.querySelector('rss') || xmlDoc.querySelector('feed');
  if (!isRssValid) {
    throw new Error('NOT_CONTAIN_RSS');
  }

  return xmlDoc;
};

export default dataParse;
