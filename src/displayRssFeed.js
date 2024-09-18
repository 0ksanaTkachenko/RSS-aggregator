const displayRssFeed = (parsedData) => {
  const items = parsedData.querySelectorAll('item');

  items.forEach((item) => {
    const title = item.querySelector('title')?.textContent || 'No title';
    console.log(title);
  });
};

export default displayRssFeed;
